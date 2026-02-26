const fs = require('fs');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

const ROOT_DIR = __dirname;
const WEB_DIR = path.join(ROOT_DIR, 'web');
const CONFIG_PATH = path.join(ROOT_DIR, 'template.config.json');
const SLIDES_PATH = path.join(ROOT_DIR, 'slides.md');
const PORT = Number(process.env.WEB_STUDIO_PORT || 3031);
const HOST = process.env.WEB_STUDIO_HOST || '127.0.0.1';
const PREVIEW_HOST = process.env.WEB_STUDIO_PREVIEW_HOST || '127.0.0.1';
const PREVIEW_PORT = Number(process.env.WEB_STUDIO_PREVIEW_PORT || 3030);
const PREVIEW_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;

const VALID_EXPORT_FORMATS = new Set(['pdf', 'pptx', 'both']);
const MAX_LOGS = 400;

let taskIdSeed = 0;
let logIdSeed = 0;
let sessionApiKey = process.env.GEMINI_API_KEY || '';

const queue = [];
let activeTask = null;
let lastTask = null;
const logs = [];
const sseClients = new Set();
let previewProcess = null;
const previewState = {
  status: 'stopped',
  url: PREVIEW_URL,
  pid: null,
  startedAt: null,
  lastError: null
};

function nowIso() {
  return new Date().toISOString();
}

function readTextFile(filePath, fallback = '') {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return fallback;
  }
}

function writeTextFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

function readConfig() {
  const raw = readTextFile(CONFIG_PATH, '{}');
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeConfig(config) {
  writeTextFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}

function normalizeExportFormat(format) {
  const value = String(format || '').trim().toLowerCase();
  return VALID_EXPORT_FORMATS.has(value) ? value : null;
}

function clampPositiveInteger(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
}

function mergeConfig(current, patch) {
  const next = { ...current };

  if (typeof patch.brand === 'string') next.brand = patch.brand.trim();
  if (typeof patch.subtitle === 'string') next.subtitle = patch.subtitle.trim();
  if (typeof patch.footer === 'string') next.footer = patch.footer.trim();
  if (typeof patch.font === 'string') next.font = patch.font.trim();
  if (typeof patch.model === 'string') next.model = patch.model.trim();

  if (patch.requestTimeoutMs !== undefined) {
    next.requestTimeoutMs = clampPositiveInteger(patch.requestTimeoutMs, Number(current.requestTimeoutMs) || 45000);
  }
  if (patch.maxRetries !== undefined) {
    next.maxRetries = clampPositiveInteger(patch.maxRetries, Number(current.maxRetries) || 3);
  }

  if (patch.exportFormat !== undefined) {
    const exportFormat = normalizeExportFormat(patch.exportFormat);
    if (!exportFormat) {
      throw new Error('exportFormat 仅支持 pdf | pptx | both');
    }
    next.exportFormat = exportFormat;
  }

  if (patch.colors && typeof patch.colors === 'object') {
    next.colors = {
      ...(current.colors || {}),
      ...(patch.colors || {})
    };
  }

  return next;
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendText(res, statusCode, body) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    req.on('data', chunk => {
      buffer += chunk;
      if (buffer.length > 1024 * 1024) {
        reject(new Error('请求体过大（超过 1MB）'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!buffer.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(buffer));
      } catch {
        reject(new Error('JSON 解析失败'));
      }
    });
    req.on('error', reject);
  });
}

function createSteps(type) {
  if (type === 'export') {
    return [
      { id: 'queued', label: '排队中', status: 'pending' },
      { id: 'export', label: '导出文件', status: 'pending' },
      { id: 'done', label: '完成', status: 'pending' }
    ];
  }

  return [
    { id: 'queued', label: '排队中', status: 'pending' },
    { id: 'scan', label: '扫描组件', status: 'pending' },
    { id: 'model', label: '调用模型', status: 'pending' },
    { id: 'qa', label: '质量校验', status: 'pending' },
    { id: 'write', label: '写入 slides.md', status: 'pending' },
    { id: 'done', label: '完成', status: 'pending' }
  ];
}

function publicTask(task) {
  if (!task) return null;
  return {
    id: task.id,
    type: task.type,
    status: task.status,
    createdAt: task.createdAt,
    startedAt: task.startedAt,
    finishedAt: task.finishedAt,
    error: task.error,
    promptPreview: task.payload.prompt ? String(task.payload.prompt).slice(0, 120) : '',
    format: task.payload.format || null,
    steps: task.steps.map(step => ({ ...step }))
  };
}

function previewSnapshot() {
  return {
    status: previewState.status,
    url: previewState.url,
    pid: previewState.pid,
    startedAt: previewState.startedAt,
    lastError: previewState.lastError
  };
}

function runtimeSnapshot() {
  return {
    serverTime: nowIso(),
    status: activeTask ? 'running' : 'idle',
    queueLength: queue.length,
    hasApiKey: Boolean(sessionApiKey || process.env.GEMINI_API_KEY),
    currentTask: publicTask(activeTask),
    lastTask: publicTask(lastTask),
    logs: logs.slice(-200),
    preview: previewSnapshot()
  };
}

function sendEvent(client, type, payload) {
  client.write(`data: ${JSON.stringify({ type, payload, timestamp: nowIso() })}\n\n`);
}

function pushEvent(type, payload) {
  for (const client of sseClients) {
    try {
      sendEvent(client, type, payload);
    } catch {
      sseClients.delete(client);
    }
  }
}

function broadcastState() {
  pushEvent('state', runtimeSnapshot());
}

function addLog(level, message, taskId = null) {
  const log = {
    id: ++logIdSeed,
    level,
    message,
    taskId,
    time: nowIso()
  };
  logs.push(log);
  if (logs.length > MAX_LOGS) logs.shift();
  pushEvent('log', log);
}

function updatePreviewState(next) {
  Object.assign(previewState, next);
  pushEvent('preview', previewSnapshot());
  broadcastState();
}

function startPreview() {
  if (previewProcess) {
    return previewSnapshot();
  }

  updatePreviewState({
    status: 'starting',
    url: PREVIEW_URL,
    pid: null,
    startedAt: nowIso(),
    lastError: null
  });
  addLog('info', `正在启动预览服务: ${PREVIEW_URL}`);

  const previewArgs = ['slidev', '--port', String(PREVIEW_PORT), '--log', 'info'];
  if (PREVIEW_HOST && PREVIEW_HOST !== '127.0.0.1' && PREVIEW_HOST !== 'localhost') {
    previewArgs.push('--remote', PREVIEW_HOST);
  }

  const child = spawn('npx', previewArgs, {
    cwd: ROOT_DIR,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  previewProcess = child;
  previewState.pid = child.pid || null;

  const markRunning = () => {
    if (previewState.status === 'running') return;
    updatePreviewState({
      status: 'running',
      pid: child.pid || null,
      lastError: null
    });
    addLog('info', `预览服务已就绪: ${PREVIEW_URL}`);
  };

  const handlePreviewLog = (line, level) => {
    const text = String(line || '').trim();
    if (!text) return;
    addLog(level, `[preview] ${text}`);

    if (/Local:|localhost:|127\.0\.0\.1:/.test(text)) {
      markRunning();
    }
  };

  streamLines(child.stdout, line => handlePreviewLog(line, 'info'));
  streamLines(child.stderr, line => handlePreviewLog(line, 'error'));

  const startupGuard = setTimeout(() => {
    if (previewProcess === child && previewState.status === 'starting') {
      markRunning();
    }
  }, 2000);

  child.on('error', error => {
    clearTimeout(startupGuard);
    if (previewProcess === child) {
      previewProcess = null;
    }
    updatePreviewState({
      status: 'error',
      pid: null,
      lastError: error.message
    });
    addLog('error', `预览服务启动失败: ${error.message}`);
  });

  child.on('close', code => {
    clearTimeout(startupGuard);
    const current = previewProcess === child;
    if (current) {
      previewProcess = null;
    }

    if (previewState.status === 'stopping' || previewState.status === 'stopped') {
      updatePreviewState({
        status: 'stopped',
        pid: null,
        lastError: null
      });
      addLog('info', '预览服务已停止');
      return;
    }

    if (code === 0) {
      updatePreviewState({
        status: 'stopped',
        pid: null,
        lastError: null
      });
      addLog('info', '预览服务已退出');
      return;
    }

    updatePreviewState({
      status: 'error',
      pid: null,
      lastError: `预览进程异常退出（code=${code}）`
    });
    addLog('error', `预览进程异常退出（code=${code}）`);
  });

  return previewSnapshot();
}

function stopPreview() {
  if (!previewProcess) {
    updatePreviewState({
      status: 'stopped',
      pid: null,
      lastError: null
    });
    return previewSnapshot();
  }

  addLog('info', '正在停止预览服务...');
  updatePreviewState({
    status: 'stopping',
    pid: previewState.pid
  });

  const processRef = previewProcess;
  try {
    processRef.kill('SIGTERM');
  } catch (error) {
    updatePreviewState({
      status: 'error',
      lastError: error.message
    });
  }

  setTimeout(() => {
    if (previewProcess === processRef) {
      try {
        processRef.kill('SIGKILL');
      } catch {
        // ignore
      }
    }
  }, 3000);

  return previewSnapshot();
}

function updateStep(task, stepId, status) {
  const step = task.steps.find(item => item.id === stepId);
  if (!step || step.status === status) return;
  step.status = status;
  pushEvent('task', publicTask(task));
  broadcastState();
}

function finalizeTaskSuccess(task) {
  for (const step of task.steps) {
    if (step.status === 'pending') {
      step.status = step.id === 'qa' ? 'skipped' : 'done';
    } else if (step.status === 'running') {
      step.status = 'done';
    }
  }
  const doneStep = task.steps.find(step => step.id === 'done');
  if (doneStep) doneStep.status = 'done';
}

function finalizeTaskError(task) {
  const runningStep = task.steps.find(step => step.status === 'running');
  if (runningStep) runningStep.status = 'error';
  const doneStep = task.steps.find(step => step.id === 'done');
  if (doneStep && doneStep.status !== 'done') doneStep.status = 'error';
}

function enqueueTask(type, payload) {
  const task = {
    id: ++taskIdSeed,
    type,
    payload,
    status: 'queued',
    createdAt: nowIso(),
    startedAt: null,
    finishedAt: null,
    error: null,
    steps: createSteps(type)
  };
  queue.push(task);
  addLog('info', `任务 #${task.id} 已加入队列（${type}）`, task.id);
  broadcastState();
  runNextTask();
  return task;
}

function handleGenerateOutput(task, line, level) {
  const text = String(line || '').trim();
  if (!text) return;

  addLog(level, text, task.id);

  if (text.includes('已发现') && text.includes('可用组件')) {
    updateStep(task, 'scan', 'done');
    updateStep(task, 'model', 'running');
    return;
  }

  if (text.includes('正在调用 Gemini')) {
    updateStep(task, 'model', 'running');
    return;
  }

  if (text.includes('质量校验通过') || text.includes('已跳过质量校验')) {
    updateStep(task, 'model', 'done');
    updateStep(task, 'qa', 'done');
    updateStep(task, 'write', 'running');
    return;
  }

  if (text.includes('slides.md 已生成')) {
    if (task.steps.find(step => step.id === 'model')?.status === 'running') {
      updateStep(task, 'model', 'done');
    }
    if (task.steps.find(step => step.id === 'qa')?.status === 'pending') {
      updateStep(task, 'qa', 'skipped');
    }
    updateStep(task, 'write', 'done');
    updateStep(task, 'done', 'running');
    return;
  }

  if (text.includes('完成')) {
    updateStep(task, 'done', 'done');
  }
}

function streamLines(stream, onLine) {
  let buffer = '';
  stream.on('data', chunk => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';
    lines.forEach(onLine);
  });
  stream.on('end', () => {
    if (buffer.trim()) onLine(buffer);
  });
}

function runCommand(command, args, options = {}) {
  const { cwd = ROOT_DIR, env = process.env, onStdout, onStderr } = options;
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    streamLines(child.stdout, line => onStdout && onStdout(line));
    streamLines(child.stderr, line => onStderr && onStderr(line));

    child.on('error', reject);
    child.on('close', code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} 退出码 ${code}`));
    });
  });
}

async function runGenerateTask(task) {
  if (typeof task.payload.apiKey === 'string' && task.payload.apiKey.trim()) {
    sessionApiKey = task.payload.apiKey.trim();
  }

  const apiKey = sessionApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('未检测到 Gemini API Key，请先在页面输入 Key。');
  }

  const args = ['generate.js', task.payload.prompt, '--no-export'];
  if (task.payload.skipQa) args.push('--skip-qa');

  const env = { ...process.env, GEMINI_API_KEY: apiKey };

  updateStep(task, 'queued', 'done');
  updateStep(task, 'scan', 'running');

  await runCommand('node', args, {
    cwd: ROOT_DIR,
    env,
    onStdout: line => handleGenerateOutput(task, line, 'info'),
    onStderr: line => handleGenerateOutput(task, line, 'error')
  });
}

async function runExportTask(task) {
  const config = readConfig();
  const format = normalizeExportFormat(task.payload.format || config.exportFormat || 'pdf');
  if (!format) {
    throw new Error('导出格式无效，仅支持 pdf | pptx | both');
  }

  updateStep(task, 'queued', 'done');
  updateStep(task, 'export', 'running');

  if (format === 'pdf' || format === 'both') {
    addLog('info', '开始导出 PDF', task.id);
    await runCommand('npx', ['slidev', 'export', '--timeout', '60000'], {
      cwd: ROOT_DIR,
      onStdout: line => addLog('info', line, task.id),
      onStderr: line => addLog('error', line, task.id)
    });
  }

  if (format === 'pptx' || format === 'both') {
    addLog('info', '开始导出 PPTX', task.id);
    await runCommand('npx', ['slidev', 'export', '--format', 'pptx', '--timeout', '60000'], {
      cwd: ROOT_DIR,
      onStdout: line => addLog('info', line, task.id),
      onStderr: line => addLog('error', line, task.id)
    });
  }

  updateStep(task, 'export', 'done');
  updateStep(task, 'done', 'done');
}

async function runNextTask() {
  if (activeTask || queue.length === 0) return;

  const task = queue.shift();
  activeTask = task;
  task.status = 'running';
  task.startedAt = nowIso();
  addLog('info', `任务 #${task.id} 开始执行`, task.id);
  broadcastState();

  try {
    if (task.type === 'generate') {
      await runGenerateTask(task);
    } else if (task.type === 'export') {
      await runExportTask(task);
    } else {
      throw new Error(`未知任务类型: ${task.type}`);
    }

    finalizeTaskSuccess(task);
    task.status = 'success';
    addLog('info', `任务 #${task.id} 执行完成`, task.id);
  } catch (error) {
    finalizeTaskError(task);
    task.status = 'failed';
    task.error = error.message;
    addLog('error', `任务 #${task.id} 失败: ${error.message}`, task.id);
  } finally {
    task.finishedAt = nowIso();
    lastTask = task;
    activeTask = null;
    pushEvent('task', publicTask(task));
    broadcastState();
    setImmediate(runNextTask);
  }
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js') return 'application/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  return 'text/plain; charset=utf-8';
}

function sendStaticFile(reqPath, res) {
  const safePath = reqPath === '/' ? '/index.html' : reqPath;
  const absolutePath = path.resolve(WEB_DIR, `.${safePath}`);
  if (!absolutePath.startsWith(WEB_DIR)) {
    sendText(res, 403, 'Forbidden');
    return;
  }
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).isDirectory()) {
    sendText(res, 404, 'Not Found');
    return;
  }
  const content = fs.readFileSync(absolutePath);
  res.writeHead(200, {
    'Content-Type': contentTypeFor(absolutePath),
    'Content-Length': content.length,
    'Cache-Control': 'no-store'
  });
  res.end(content);
}

async function handleApiRequest(req, res, pathname) {
  if (req.method === 'GET' && pathname === '/api/state') {
    const config = readConfig();
    const slides = readTextFile(SLIDES_PATH, '');
    sendJson(res, 200, {
      config,
      slides,
      runtime: runtimeSnapshot()
    });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/preview/state') {
    sendJson(res, 200, { ok: true, preview: previewSnapshot() });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/preview/start') {
    try {
      const preview = startPreview();
      sendJson(res, 202, { ok: true, preview });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/preview/stop') {
    try {
      const preview = stopPreview();
      sendJson(res, 200, { ok: true, preview });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === 'GET' && pathname === '/api/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive'
    });
    res.write(': connected\n\n');
    sseClients.add(res);
    sendEvent(res, 'state', runtimeSnapshot());

    const heartbeat = setInterval(() => {
      try {
        res.write(': ping\n\n');
      } catch {
        clearInterval(heartbeat);
        sseClients.delete(res);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(heartbeat);
      sseClients.delete(res);
    });
    return;
  }

  if (req.method === 'POST' && pathname === '/api/config') {
    try {
      const body = await readJsonBody(req);
      const patch = body.config && typeof body.config === 'object' ? body.config : body;
      const current = readConfig();
      const next = mergeConfig(current, patch);
      writeConfig(next);
      addLog('info', 'template.config.json 已更新');
      broadcastState();
      sendJson(res, 200, { ok: true, config: next });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/slides') {
    try {
      const body = await readJsonBody(req);
      if (typeof body.content !== 'string') {
        throw new Error('content 必须是字符串');
      }
      writeTextFile(SLIDES_PATH, body.content.endsWith('\n') ? body.content : `${body.content}\n`);
      addLog('info', 'slides.md 已保存');
      sendJson(res, 200, { ok: true, length: body.content.length });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/generate') {
    try {
      const body = await readJsonBody(req);
      const prompt = String(body.prompt || '').trim();
      if (!prompt) {
        throw new Error('prompt 不能为空');
      }
      const task = enqueueTask('generate', {
        prompt,
        skipQa: Boolean(body.skipQa),
        apiKey: typeof body.apiKey === 'string' ? body.apiKey : ''
      });
      sendJson(res, 202, {
        ok: true,
        task: publicTask(task),
        queueLength: queue.length
      });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/export') {
    try {
      const body = await readJsonBody(req);
      const formatInput = body.format || readConfig().exportFormat || 'pdf';
      const format = normalizeExportFormat(formatInput);
      if (!format) {
        throw new Error('format 仅支持 pdf | pptx | both');
      }

      const task = enqueueTask('export', { format });
      sendJson(res, 202, {
        ok: true,
        task: publicTask(task),
        queueLength: queue.length
      });
    } catch (error) {
      sendJson(res, 400, { ok: false, error: error.message });
    }
    return;
  }

  sendJson(res, 404, { ok: false, error: 'API Not Found' });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    if (pathname.startsWith('/api/')) {
      await handleApiRequest(req, res, pathname);
      return;
    }
    sendStaticFile(pathname, res);
  } catch (error) {
    sendJson(res, 500, { ok: false, error: error.message });
  }
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Web Studio 已启动: http://${HOST}:${PORT}`);
});

server.on('error', error => {
  // eslint-disable-next-line no-console
  console.error(`Web Studio 启动失败: ${error.message}`);
  process.exit(1);
});

function gracefulShutdown() {
  if (previewProcess) {
    try {
      previewProcess.kill('SIGTERM');
    } catch {
      // ignore
    }
  }
  process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
