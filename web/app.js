const state = {
  runtime: null,
  logs: [],
  connected: false
};

const elements = {
  promptInput: document.getElementById('promptInput'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  skipQaInput: document.getElementById('skipQaInput'),
  generateBtn: document.getElementById('generateBtn'),
  refreshBtn: document.getElementById('refreshBtn'),
  runtimeHint: document.getElementById('runtimeHint'),
  configForm: document.getElementById('configForm'),
  brandInput: document.getElementById('brandInput'),
  subtitleInput: document.getElementById('subtitleInput'),
  footerInput: document.getElementById('footerInput'),
  primaryColorInput: document.getElementById('primaryColorInput'),
  accentColorInput: document.getElementById('accentColorInput'),
  fontInput: document.getElementById('fontInput'),
  modelInput: document.getElementById('modelInput'),
  timeoutInput: document.getElementById('timeoutInput'),
  retryInput: document.getElementById('retryInput'),
  formatInput: document.getElementById('formatInput'),
  stepView: document.getElementById('stepView'),
  logView: document.getElementById('logView'),
  previewHint: document.getElementById('previewHint'),
  previewFrame: document.getElementById('previewFrame'),
  startPreviewBtn: document.getElementById('startPreviewBtn'),
  stopPreviewBtn: document.getElementById('stopPreviewBtn'),
  reloadPreviewBtn: document.getElementById('reloadPreviewBtn'),
  openPreviewBtn: document.getElementById('openPreviewBtn'),
  slidesInput: document.getElementById('slidesInput'),
  saveSlidesBtn: document.getElementById('saveSlidesBtn')
};

function setHint(text) {
  elements.runtimeHint.textContent = text;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  const data = await response.json();
  if (!response.ok || data.ok === false) {
    throw new Error(data.error || `请求失败: ${response.status}`);
  }
  return data;
}

function fillConfig(config = {}) {
  elements.brandInput.value = config.brand || '';
  elements.subtitleInput.value = config.subtitle || '';
  elements.footerInput.value = config.footer || '';
  elements.primaryColorInput.value = config.colors?.primary || '';
  elements.accentColorInput.value = config.colors?.accent || '';
  elements.fontInput.value = config.font || '';
  elements.modelInput.value = config.model || '';
  elements.timeoutInput.value = String(config.requestTimeoutMs || 45000);
  elements.retryInput.value = String(config.maxRetries || 3);
  elements.formatInput.value = config.exportFormat || 'pdf';
}

function collectConfig() {
  return {
    brand: elements.brandInput.value,
    subtitle: elements.subtitleInput.value,
    footer: elements.footerInput.value,
    font: elements.fontInput.value,
    model: elements.modelInput.value,
    requestTimeoutMs: Number(elements.timeoutInput.value || 45000),
    maxRetries: Number(elements.retryInput.value || 3),
    exportFormat: elements.formatInput.value,
    colors: {
      primary: elements.primaryColorInput.value,
      accent: elements.accentColorInput.value
    }
  };
}

function renderRuntime(runtime) {
  state.runtime = runtime;
  const status = runtime.status === 'running' ? '运行中' : '空闲';
  const queueText = runtime.queueLength > 0 ? `, 队列 ${runtime.queueLength}` : '';
  const taskText = runtime.currentTask ? `, 当前任务 #${runtime.currentTask.id} (${runtime.currentTask.type})` : '';
  const keyText = runtime.hasApiKey ? '已检测到 API Key' : '未检测到 API Key';
  setHint(`状态：${status}${queueText}${taskText}，${keyText}`);

  const taskForSteps = runtime.currentTask || runtime.lastTask;
  renderSteps(taskForSteps ? taskForSteps.steps : []);

  if (Array.isArray(runtime.logs)) {
    state.logs = runtime.logs.slice(-200);
    renderLogs();
  }

  renderPreview(runtime.preview || null);
}

function renderSteps(steps) {
  elements.stepView.innerHTML = '';
  if (!steps || steps.length === 0) {
    const placeholder = document.createElement('span');
    placeholder.className = 'step pending';
    placeholder.textContent = '暂无任务';
    elements.stepView.appendChild(placeholder);
    return;
  }

  for (const step of steps) {
    const item = document.createElement('span');
    item.className = `step ${step.status || 'pending'}`;
    item.textContent = `${step.label} · ${step.status || 'pending'}`;
    elements.stepView.appendChild(item);
  }
}

function renderLogs() {
  const lines = state.logs.slice(-180).map(entry => {
    const stamp = entry.time ? entry.time.slice(11, 19) : '--:--:--';
    return `[${stamp}] ${entry.level || 'info'} ${entry.message || ''}`;
  });
  elements.logView.textContent = lines.join('\n');
  elements.logView.scrollTop = elements.logView.scrollHeight;
}

function appendLog(log) {
  state.logs.push(log);
  if (state.logs.length > 250) state.logs.shift();
  renderLogs();
}

function renderPreview(preview) {
  const next = preview || {
    status: 'stopped',
    url: '',
    lastError: null
  };

  const statusTextMap = {
    stopped: '未启动',
    starting: '启动中',
    running: '运行中',
    stopping: '停止中',
    error: '异常'
  };
  const statusText = statusTextMap[next.status] || next.status || '未知';
  const errorText = next.lastError ? `，错误：${next.lastError}` : '';
  elements.previewHint.textContent = `预览服务状态：${statusText}${errorText}`;

  const running = next.status === 'running' || next.status === 'starting';
  elements.startPreviewBtn.disabled = running;
  elements.stopPreviewBtn.disabled = !running;
  elements.reloadPreviewBtn.disabled = !running;
  elements.openPreviewBtn.disabled = !running || !next.url;

  if (running && next.url) {
    if (!elements.previewFrame.src || !elements.previewFrame.src.startsWith(next.url)) {
      elements.previewFrame.src = next.url;
    }
    return;
  }

  if (!running) {
    elements.previewFrame.srcdoc = '<div style="height:100%;display:flex;align-items:center;justify-content:center;color:#6b7280;font-family:Inter,sans-serif;">预览未启动，点击“启动预览”后可在此实时查看 Slidev 页面。</div>';
  }
}

async function loadState() {
  const data = await requestJson('/api/state', { method: 'GET' });
  fillConfig(data.config || {});
  elements.slidesInput.value = data.slides || '';
  renderRuntime(data.runtime || {});
}

function bindActions() {
  elements.generateBtn.addEventListener('click', async () => {
    const prompt = elements.promptInput.value.trim();
    if (!prompt) {
      alert('请先输入需求描述');
      return;
    }
    try {
      elements.generateBtn.disabled = true;
      await requestJson('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          apiKey: elements.apiKeyInput.value.trim(),
          skipQa: elements.skipQaInput.checked
        })
      });
      setHint('任务已提交，等待执行...');
    } catch (error) {
      alert(error.message);
    } finally {
      elements.generateBtn.disabled = false;
    }
  });

  elements.refreshBtn.addEventListener('click', async () => {
    try {
      await loadState();
    } catch (error) {
      alert(error.message);
    }
  });

  elements.configForm.addEventListener('submit', async event => {
    event.preventDefault();
    try {
      const data = await requestJson('/api/config', {
        method: 'POST',
        body: JSON.stringify({ config: collectConfig() })
      });
      fillConfig(data.config || {});
      alert('配置已保存');
    } catch (error) {
      alert(error.message);
    }
  });

  elements.saveSlidesBtn.addEventListener('click', async () => {
    try {
      await requestJson('/api/slides', {
        method: 'POST',
        body: JSON.stringify({ content: elements.slidesInput.value })
      });
      alert('slides.md 已保存');
    } catch (error) {
      alert(error.message);
    }
  });

  document.querySelectorAll('[data-export]').forEach(button => {
    button.addEventListener('click', async () => {
      const format = button.getAttribute('data-export');
      try {
        await requestJson('/api/export', {
          method: 'POST',
          body: JSON.stringify({ format })
        });
        setHint(`导出任务(${format})已提交`);
      } catch (error) {
        alert(error.message);
      }
    });
  });

  elements.startPreviewBtn.addEventListener('click', async () => {
    try {
      await requestJson('/api/preview/start', {
        method: 'POST',
        body: JSON.stringify({})
      });
      setHint('预览服务启动中...');
    } catch (error) {
      alert(error.message);
    }
  });

  elements.stopPreviewBtn.addEventListener('click', async () => {
    try {
      await requestJson('/api/preview/stop', {
        method: 'POST',
        body: JSON.stringify({})
      });
    } catch (error) {
      alert(error.message);
    }
  });

  elements.reloadPreviewBtn.addEventListener('click', () => {
    if (!elements.previewFrame.src) return;
    elements.previewFrame.src = `${elements.previewFrame.src.split('?')[0]}?t=${Date.now()}`;
  });

  elements.openPreviewBtn.addEventListener('click', () => {
    const runtime = state.runtime || {};
    const url = runtime.preview?.url;
    if (url) window.open(url, '_blank');
  });
}

function bindEvents() {
  const source = new EventSource('/api/events');

  source.onopen = () => {
    state.connected = true;
  };

  source.onerror = () => {
    state.connected = false;
    setHint('事件流已断开，自动重连中...');
  };

  source.onmessage = event => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === 'log') {
        appendLog(payload.payload);
        return;
      }
      if (payload.type === 'state') {
        renderRuntime(payload.payload || {});
        return;
      }
      if (payload.type === 'task') {
        const runtime = state.runtime || {};
        runtime.lastTask = payload.payload;
        renderRuntime(runtime);
        return;
      }
      if (payload.type === 'preview') {
        const runtime = state.runtime || {};
        runtime.preview = payload.payload;
        renderRuntime(runtime);
      }
    } catch {
      // ignore invalid event
    }
  };
}

async function bootstrap() {
  bindActions();
  bindEvents();
  try {
    await loadState();
  } catch (error) {
    setHint(`初始化失败：${error.message}`);
  }
}

bootstrap();
