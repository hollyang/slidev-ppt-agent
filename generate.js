/**
 * PPT Agent 生成脚本
 *
 * 用法：
 *   node generate.js "帮我写一份关于新能源汽车行业 2024 年趋势分析的 PPT"
 *   node generate.js --file requirements.txt
 *
 * 支持模型提供方：
 *   - Gemini (默认)
 *   - OpenAI 兼容接口（可配置 baseURL / API Key / Model ID）
 *
 * 工作流：
 *   1. 读取用户需求（命令行参数 或 文件）
 *   2. 读取 template.config.json 获取品牌信息
 *   3. 读取 components/ 目录中的可用组件列表
 *   4. 构造 system prompt，调用 LLM 生成 slides.md
 *   5. 写入 slides.md
 *   6. 调用 slidev export 导出为 PDF / PPTX
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ────────────────────────────────────────────
// 1. 读取配置
// ────────────────────────────────────────────
const CONFIG_PATH = path.join(__dirname, 'template.config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

const VALID_EXPORT_FORMATS = new Set(['pdf', 'pptx', 'both']);
const VALID_LLM_PROVIDERS = new Set(['gemini', 'openai']);
const VALID_OPENAI_WIRE_APIS = new Set(['chat_completions', 'responses']);
const DEFAULT_MODEL = configValue('model', 'gemini-2.0-flash');
const DEFAULT_LLM_PROVIDER = normalizeLlmProvider(configValue('llmProvider', 'gemini'));
const DEFAULT_OPENAI_BASE_URL = nonEmptyString(configValue('llmBaseUrl', ''), 'https://api.openai.com/v1');
const DEFAULT_OPENAI_WIRE_API = normalizeOpenAIWireApi(configValue('llmWireApi', 'chat_completions'));
const DEFAULT_REASONING_EFFORT = String(configValue('llmReasoningEffort', '')).trim();
const DEFAULT_DISABLE_RESPONSE_STORAGE = toBoolean(configValue('disableResponseStorage', false), false);
const DEFAULT_ENABLE_WEB_RESEARCH = toBoolean(configValue('enableWebResearch', true), true);
const DEFAULT_RESEARCH_WINDOW_DAYS = Math.max(1, Number(configValue('researchWindowDays', 7)) || 7);
const DEFAULT_RESEARCH_MAX_ITEMS = Math.max(3, Number(configValue('researchMaxItems', 12)) || 12);
const DEFAULT_RESEARCH_PROVIDERS = String(configValue('researchProviders', 'auto')).trim() || 'auto';
const DEFAULT_TIMEOUT_MS = Number(configValue('requestTimeoutMs', 45000));
const DEFAULT_RETRIES = Number(configValue('maxRetries', 3));
const DEFAULT_TIMEOUT_FLOOR_MS = 90000;
const DEFAULT_MAX_TIMEOUT_MS = Math.max(DEFAULT_TIMEOUT_MS * 3, 180000);
const DEFAULT_RETRY_BASE_MS = 1000;
const DEFAULT_RETRY_MAX_WAIT_MS = 10000;
const VALID_RESEARCH_PROVIDERS = new Set(['arxiv', 'google_news', 'baidu', 'github', 'hn']);

function configValue(key, fallback) {
  return config && config[key] !== undefined ? config[key] : fallback;
}

function normalizeLlmProvider(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'openai' || raw === 'openai-compatible' || raw === 'openai_compatible') return 'openai';
  if (VALID_LLM_PROVIDERS.has(raw)) return raw;
  return 'gemini';
}

function normalizeOpenAIWireApi(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'chat' || raw === 'chat.completions' || raw === 'chat-completions') return 'chat_completions';
  if (raw === 'responses') return 'responses';
  if (VALID_OPENAI_WIRE_APIS.has(raw)) return raw;
  return 'chat_completions';
}

function normalizeResearchProvider(value) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'google' || raw === 'googlenews' || raw === 'google-news') return 'google_news';
  if (raw === 'baidu_search' || raw === 'baidunews') return 'baidu';
  if (raw === 'hackernews' || raw === 'hacker-news') return 'hn';
  if (VALID_RESEARCH_PROVIDERS.has(raw)) return raw;
  return null;
}

function parseResearchProviders(value) {
  const raw = String(value || '').trim();
  if (!raw || raw.toLowerCase() === 'auto') return null;
  const providers = raw
    .split(/[,\s|]+/)
    .map(item => normalizeResearchProvider(item))
    .filter(Boolean);
  const unique = [];
  for (const provider of providers) {
    if (provider === 'auto') continue;
    if (!unique.includes(provider)) unique.push(provider);
  }
  return unique.length ? unique : null;
}

function resolveLlmProvider() {
  return normalizeLlmProvider(process.env.LLM_PROVIDER || DEFAULT_LLM_PROVIDER);
}

function trimTrailingSlashes(text) {
  return String(text || '').replace(/\/+$/g, '');
}

function nonEmptyString(value, fallback) {
  const normalized = String(value || '').trim();
  return normalized || fallback;
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const raw = value.trim().toLowerCase();
    if (raw === '1' || raw === 'true' || raw === 'yes' || raw === 'on') return true;
    if (raw === '0' || raw === 'false' || raw === 'no' || raw === 'off') return false;
  }
  return fallback;
}

function normalizeOpenAIBaseUrl(baseUrl) {
  const raw = trimTrailingSlashes(baseUrl);
  try {
    const parsed = new URL(raw);
    const pathname = trimTrailingSlashes(parsed.pathname || '');
    // 大多数 OpenAI 兼容服务使用 /v1，用户只填域名时自动补齐。
    const normalizedPath = pathname ? pathname : '/v1';
    return `${parsed.origin}${normalizedPath}`;
  } catch {
    return raw;
  }
}

function logFlow(message) {
  console.log(`🧭 [Flow] ${message}`);
}

function logLlm(message) {
  console.log(`🛰️  [LLM] ${message}`);
}

function logResearch(message) {
  console.log(`🌐 [Research] ${message}`);
}

function errorCode(err) {
  return err?.cause?.code || err?.code || '';
}

function isRetryableNetworkError(err) {
  const code = errorCode(err);
  if (!code) return false;
  const retryableCodes = new Set([
    'UND_ERR_CONNECT_TIMEOUT',
    'UND_ERR_HEADERS_TIMEOUT',
    'UND_ERR_SOCKET',
    'UND_ERR_ABORTED',
    'ECONNRESET',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'EAI_AGAIN',
    'ENETUNREACH',
    'ENOTFOUND'
  ]);
  return retryableCodes.has(code);
}

function summarizeError(err) {
  if (!err) return '未知错误';
  const parts = [];
  if (err.message) parts.push(err.message);
  const code = errorCode(err);
  if (code) parts.push(`code=${code}`);
  if (err.status) parts.push(`status=${err.status}`);
  if (err.cause && err.cause.message && err.cause.message !== err.message) {
    parts.push(`cause=${err.cause.message}`);
  }
  return parts.join(' | ') || String(err);
}

function isValidNumber(value, fallback) {
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function stripCodeFences(text) {
  let cleaned = text.replace(/^```markdown\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  cleaned = cleaned.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');
  return cleaned;
}

function normalizeMarkdownIndentation(text) {
  return text.split('\n').map(line => {
    // Only trim deep indentation for lines that look like Vue/HTML component syntax.
    if (/^\s{4,}(<\/?[A-Za-z][\w:-]*|[:@#]|\/?>)/.test(line)) {
      return line.trimStart();
    }
    return line;
  }).join('\n');
}

function validateSlidesContent(text) {
  const errors = [];
  const warnings = [];
  const trimmed = text.trim();

  if (!trimmed.startsWith('---')) {
    errors.push('文档必须以 frontmatter 分隔符 --- 开始。');
  }

  const delimiterCount = (trimmed.match(/^---$/gm) || []).length;
  if (delimiterCount < 2) {
    errors.push('未检测到完整 frontmatter（至少需要一组 --- ... ---）。');
  }
  if (delimiterCount % 2 !== 0) {
    errors.push('检测到未闭合的 frontmatter 分隔符（--- 数量为奇数）。');
  }

  const frontmatterBlocks = [...trimmed.matchAll(/(^|\n)---\n([\s\S]*?)\n---(?=\n|$)/g)];
  if (!frontmatterBlocks.length) {
    errors.push('未解析到任何 frontmatter 块。');
  } else {
    frontmatterBlocks.forEach((m, idx) => {
      const block = m[2];
      if (!/^\s*layout:\s*custom\s*$/m.test(block)) {
        errors.push(`第 ${idx + 1} 页 frontmatter 缺少 layout: custom。`);
      }
      if (!/^\s*transition:\s*/m.test(block)) {
        warnings.push(`第 ${idx + 1} 页 frontmatter 未声明 transition。`);
      }
    });
  }

  const openTags = (trimmed.match(/<[a-zA-Z][^/>]*>/g) || []).length;
  const closeTags = (trimmed.match(/<\/[a-zA-Z]+>/g) || []).length;
  const selfCloseTags = (trimmed.match(/<[^>]+\/>/g) || []).length;
  if (openTags - selfCloseTags > closeTags + 1) {
    errors.push('HTML/Vue 标签疑似未闭合，请检查生成内容。');
  }

  const numericClaimPattern = /(\d+(?:\.\d+)?\s*(%|x|倍|亿|万|万元|亿元|美元|USD|\$))/i;
  const sourceHintPattern = /(来源|source|公开数据|财报|统计局|IDC|Gartner|\[估算\]|假设|\[S\d+\])/i;
  const claimWarnings = [];
  trimmed.split('\n').forEach((line, idx) => {
    if (numericClaimPattern.test(line) && !sourceHintPattern.test(line)) {
      claimWarnings.push(`第 ${idx + 1} 行含数字结论但未标注来源/假设。`);
    }
  });
  warnings.push(...claimWarnings.slice(0, 8));
  if (claimWarnings.length > 8) {
    warnings.push(`另有 ${claimWarnings.length - 8} 行数字结论未标注来源/假设。`);
  }

  return { errors, warnings };
}

// ────────────────────────────────────────────
// 2. 自动扫描可用组件
// ────────────────────────────────────────────
function scanComponents() {
  const componentsDir = path.join(__dirname, 'components');
  if (!fs.existsSync(componentsDir)) return [];
  return fs.readdirSync(componentsDir)
    .filter(f => f.endsWith('.vue'))
    .map(f => {
      const content = fs.readFileSync(path.join(componentsDir, f), 'utf-8');
      const name = f.replace('.vue', '');

      // 提取 props (兼容 JS 和 TS 语法)
      let props = '';
      const propsMatchJS = content.match(/defineProps\(\{([\s\S]*?)\}\)/);
      const propsMatchTS = content.match(/defineProps<\{([\s\S]*?)\}>/);

      if (propsMatchJS) {
        props = propsMatchJS[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).join(' ');
      } else if (propsMatchTS) {
        props = propsMatchTS[1].split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).join(' ');
      }

      // 提取 slots
      const slots = [];
      if (content.includes('<slot name=')) {
        const slotMatches = content.matchAll(/<slot\s+name="([^"]+)"/g);
        for (const m of slotMatches) slots.push(m[1]);
      }
      if (content.includes('<slot></slot>') || content.includes('<slot/>') || content.includes('<slot />')) {
        slots.push('default');
      }

      return { name, props, slots };
    });
}

// ────────────────────────────────────────────
// 3. 构造 System Prompt (专家级内容引擎)
// ────────────────────────────────────────────
function buildSystemPrompt(components) {
  const componentDocs = components.map(c => {
    let doc = `### <${c.name}>`;
    if (c.props) doc += `\nProps (JSON/Attributes): ${c.props}`;
    if (c.slots.length) doc += `\nSlots: ${c.slots.join(', ')}`;
    return doc;
  }).join('\n\n');

  return `你是一位 **资深战略咨询顾问 (MBB 级别)** 兼 **顶级演示文稿内容专家**。
你的任务是根据用户需求，输出一份 **深度极维、信息密度极高、极其详实** 的 Slidev 演示文稿。

## 🎯 核心原则 (必须严格遵守，否则视为不合格)
1. **高信息密度 (硬要求)**：每页 PPT 必须有详尽论述和明确结论。**绝对禁止只写几个标题或干瘪单词**。每页建议 40-120 字高质量说明，重点页可更长。
2. **数据驱动且可追溯**：拒绝空洞，必须包含行业数据、占比、增长率、成本收益等量化指标。若无法确认真实来源，**禁止虚构精确统计**，必须明确标注为 \`[估算]\` 并写出估算假设（例如“按公开财报区间外推”）。
3. **结构化深度逻辑**：遵循 SCQA 框架，但每个环节必须**写透**。例如在说明“挑战”时，要详细指出底层阻力是什么、行业现状如何、带来了什么具体损失。
4. **组件内容饱满**：在使用任何组件（如 CompareTable, DataCard, ProcessStep 等）时，里面的文字描述（description, content）必须非常丰富，不要只是两三个字，要有一句完整且专业的解释。
5. **多页展开**：不要把所有内容挤在 3 页里。默认输出 8-12 页；复杂主题再扩展到 12-15 页，避免单次输出过长导致中断。
6. **Slidev 规范**：所有 HTML/Vue 组件标签必须 **顶格书写**，不要缩进。
7. **单页不溢出 (极其重要！)**：每一页的内容必须能在一个 960x700 像素的视口内完整显示，**绝对不允许内容溢出到屏幕下方被截断**！如果一页内容过多，必须拆分成多页。每页最多放 2-3 个组件 + 1 段简短文字，或 1 个大型组件（如 CompareTable）+ 1 段文字。宁可多拆页，也不要让单页塞太满。

## 🎨 品牌与工具类 (必须优先使用)
不要使用硬编码色值，使用以下工具类保持品牌一致性：
- \`theme-text\` / \`theme-gradient-text\` : 品牌色文字。
- \`theme-badge\` : 品牌色标签。
- \`theme-number\` : 品牌色序号圆圈。
- \`theme-callout\` : 品牌色提示框。
- \`theme-dark-ending\` : 结尾页背景类。
- \`theme-bg-light\` : 浅色品牌背景。

## 🧩 组件库使用指南 (严格遵守 Props 格式)

${componentDocs}

### 重点案例
- **ProsCons**: 必须使用 \`:pros="['A', 'B']"\` 这种 Array Props 形式。不要使用 slots。
- **NodeFlow**: 必须使用 \`:nodes="[{...}]"\` 这种 Object Array 形式。
- **CompareTable**: 使用 slots (\`#old\`, \`#new\`)。

## ✍️ 输出格式
1. 直接输出 Markdown。
2. 每页用 \`---\` 分隔，必须包含 frontmatter：
\`\`\`
---
layout: custom
transition: fade-out
---
\`\`\`
3. 封面使用 \`layout: custom\` 且内容垂直居中。
4. 结尾页使用 \`theme-dark-ending\` 全屏色块。
5. **步进动画 (v-clicks)**：极度推荐！如果你写的是文字列表 (ul/li)，请在外面包裹一层 \\\`<v-clicks>\\\` 标签，让文字能“按键盘后逐条出现”以制造悬念。但千万不要把 \\\`<v-click>\\\` 加到 \\\`NodeFlow\\\` 或其它大型图表上，导致首屏漏白。
6. 涉及关键结论的数字，必须在同一段中标注来源或假设；没有来源时使用 \`[估算]\` 标签，避免误导为真实公开数据。
7. 若输入中存在检索资料编号（例如 \`[S1]\`），请在涉及事实或数据的句末引用对应编号（如“... 该方法将推理成本降低 18% [S1][S4]”）。
8. 禁止输出“正在抓取/正在搜索/执行中”等过程描述。若用户侧已提供联网检索资料，请直接基于该资料输出可交付的完整 Slidev Markdown，并对关键结论标注来源编号。

第一行必须从 \`---\` 开始。不要输出 \`\`\`markdown 围栏。`;
}

function buildRepairPrompt(originalUserPrompt, previousOutput, errors) {
  const outputPreview = String(previousOutput || '').slice(0, 2000);
  const errorLines = (errors || []).map(item => `- ${item}`).join('\n');
  return `你上一次输出未通过格式校验，请严格修复并重新生成完整 Slidev Markdown。

原始需求：
${originalUserPrompt}

校验错误：
${errorLines || '- 未知错误'}

上一次输出（节选）：
${outputPreview}

请严格满足：
1) 第一行必须是 ---
2) 每页必须包含完整 frontmatter:
---
layout: custom
transition: fade-out
---
3) 若输入中存在 [Sx] 引用编号，涉及事实/数据的句子请标注对应 [Sx]。
4) 仅输出最终 Slidev Markdown，不要解释，不要过程日志，不要“正在执行/正在抓取”类文本。`;
}

function resolveResearchOptions() {
  const enabled = toBoolean(
    process.env.LLM_ENABLE_WEB_RESEARCH ?? process.env.ENABLE_WEB_RESEARCH,
    DEFAULT_ENABLE_WEB_RESEARCH
  );
  const windowDays = Math.max(
    1,
    Math.floor(
      isValidNumber(Number(process.env.LLM_RESEARCH_WINDOW_DAYS), DEFAULT_RESEARCH_WINDOW_DAYS)
    )
  );
  const maxItems = Math.max(
    3,
    Math.floor(
      isValidNumber(Number(process.env.LLM_RESEARCH_MAX_ITEMS), DEFAULT_RESEARCH_MAX_ITEMS)
    )
  );
  const timeoutMs = Math.max(
    5000,
    Math.floor(isValidNumber(Number(process.env.LLM_RESEARCH_TIMEOUT_MS), 15000))
  );
  const providers = parseResearchProviders(
    process.env.LLM_RESEARCH_PROVIDERS ??
    process.env.RESEARCH_PROVIDERS ??
    DEFAULT_RESEARCH_PROVIDERS
  );
  return { enabled, windowDays, maxItems, timeoutMs, providers };
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function stripHtmlTags(text) {
  return String(text || '').replace(/<[^>]*>/g, ' ');
}

function decodeXmlEntities(text) {
  return String(text || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function shortText(text, maxLength = 220) {
  const normalized = normalizeWhitespace(stripHtmlTags(decodeXmlEntities(text)));
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maxLength - 1))}…`;
}

async function fetchTextWithTimeout(url, timeoutMs, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${shortText(text, 280)}`);
    }
    return text;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJsonWithTimeout(url, timeoutMs, headers = {}) {
  const raw = await fetchTextWithTimeout(url, timeoutMs, headers);
  return JSON.parse(raw);
}

function extractArxivEntries(xmlText) {
  const entries = [];
  const entryMatches = xmlText.matchAll(/<entry>([\s\S]*?)<\/entry>/g);

  const pickTag = (block, tag) => {
    const matched = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
    return matched ? normalizeWhitespace(matched[1]) : '';
  };

  for (const matched of entryMatches) {
    const block = matched[1];
    const title = shortText(pickTag(block, 'title'), 300);
    const summary = shortText(pickTag(block, 'summary'), 380);
    const id = pickTag(block, 'id');
    const published = pickTag(block, 'published');
    const authorMatches = [...block.matchAll(/<author>\s*<name>([\s\S]*?)<\/name>\s*<\/author>/g)];
    const authors = authorMatches.map(item => normalizeWhitespace(item[1])).filter(Boolean);
    const categories = [...block.matchAll(/<category[^>]*term="([^"]+)"/g)].map(item => item[1]).filter(Boolean);
    if (!title || !id) continue;
    entries.push({
      title,
      summary,
      url: id,
      published,
      authors,
      categories,
      source: 'arXiv'
    });
  }

  return entries;
}

function dateWithinDays(isoText, days) {
  const value = Date.parse(isoText);
  if (!Number.isFinite(value)) return false;
  const windowMs = Math.max(1, days) * 24 * 60 * 60 * 1000;
  return Date.now() - value <= windowMs;
}

function extractKeywordHints(promptText) {
  const source = String(promptText || '').toLowerCase();
  const englishTokens = source.match(/[a-z0-9][a-z0-9-]{2,}/g) || [];
  const stopWords = new Set([
    'recent', 'week', 'latest', 'about', 'ppt', 'slide', 'slides', 'with', 'from',
    'this', 'that', 'have', 'into', 'for', 'the', 'and', 'ai'
  ]);
  const cleaned = englishTokens.filter(item => !stopWords.has(item));
  const unique = [];
  for (const token of cleaned) {
    if (!unique.includes(token)) unique.push(token);
    if (unique.length >= 6) break;
  }
  return unique;
}

async function fetchArxivResearch(promptText, options) {
  const categoryQuery = '(cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV OR cat:stat.ML)';
  const keywordHints = extractKeywordHints(promptText);
  const searchQuery = keywordHints.length
    ? `${categoryQuery} AND all:(${keywordHints.join(' OR ')})`
    : categoryQuery;
  const queryUrl = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(searchQuery)}&sortBy=submittedDate&sortOrder=descending&start=0&max_results=40`;
  logResearch(`arXiv 检索开始 (query=${searchQuery})`);
  const xmlText = await fetchTextWithTimeout(queryUrl, options.timeoutMs, {
    Accept: 'application/atom+xml'
  });
  let entries = extractArxivEntries(xmlText);
  const recent = entries.filter(item => dateWithinDays(item.published, options.windowDays));
  if (recent.length > 0) entries = recent;
  entries = entries
    .sort((a, b) => Date.parse(b.published || 0) - Date.parse(a.published || 0))
    .slice(0, options.maxItems);
  logResearch(`arXiv 检索完成 (items=${entries.length})`);
  entries.slice(0, 5).forEach((item, index) => {
    logResearch(
      `arXiv[${index + 1}] ${item.title} | ${String(item.published || '').slice(0, 10)} | ${item.url}`
    );
  });
  return entries;
}

async function fetchHnResearch(promptText, options) {
  const hints = extractKeywordHints(promptText);
  const query = hints.length ? `ai ${hints.join(' ')}` : 'ai';
  const queryUrl = `https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=40&query=${encodeURIComponent(query)}`;
  logResearch(`HN 检索开始 (query=${query})`);
  const data = await fetchJsonWithTimeout(queryUrl, options.timeoutMs, {
    Accept: 'application/json'
  });
  const hits = Array.isArray(data?.hits) ? data.hits : [];
  const entries = hits
    .filter(item => item && item.title && item.url && dateWithinDays(item.created_at, options.windowDays))
    .slice(0, Math.max(3, Math.min(8, options.maxItems)))
    .map(item => ({
      title: shortText(item.title, 200),
      summary: shortText(item.story_text || '', 260),
      url: item.url,
      published: item.created_at,
      authors: [item.author].filter(Boolean),
      categories: [],
      source: 'HackerNews'
    }));
  logResearch(`HN 检索完成 (items=${entries.length})`);
  return entries;
}

function extractRssItems(xmlText) {
  const items = [];
  const matches = String(xmlText || '').matchAll(/<item>([\s\S]*?)<\/item>/g);
  const pick = (block, tag) => {
    const matched = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return matched ? normalizeWhitespace(matched[1]) : '';
  };
  for (const matched of matches) {
    const block = matched[1];
    const title = shortText(pick(block, 'title'), 260);
    const link = pick(block, 'link');
    const description = shortText(pick(block, 'description'), 320);
    const pubDate = pick(block, 'pubDate');
    if (!title || !link) continue;
    items.push({
      title,
      summary: description,
      url: link,
      published: pubDate,
      authors: [],
      categories: [],
      source: 'RSS'
    });
  }
  return items;
}

async function fetchGoogleNewsResearch(promptText, options) {
  const hints = extractKeywordHints(promptText);
  const query = hints.length ? `${hints.join(' ')} ai` : normalizeWhitespace(promptText || 'ai');
  const timeScoped = `${query} when:${Math.max(1, options.windowDays)}d`;
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(timeScoped)}&hl=zh-CN&gl=CN&ceid=CN:zh-Hans`;
  logResearch(`Google News 检索开始 (query=${timeScoped})`);
  const xmlText = await fetchTextWithTimeout(url, options.timeoutMs, {
    Accept: 'application/rss+xml, application/xml'
  });
  const entries = extractRssItems(xmlText)
    .map(item => ({ ...item, source: 'GoogleNews' }))
    .filter(item => dateWithinDays(item.published, options.windowDays))
    .slice(0, Math.max(3, Math.min(12, options.maxItems)));
  logResearch(`Google News 检索完成 (items=${entries.length})`);
  return entries;
}

async function fetchGithubResearch(promptText, options) {
  const hints = extractKeywordHints(promptText);
  const query = hints.length ? `${hints.join(' ')} ai in:name,description,readme` : 'ai in:name,description,readme';
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&per_page=20`;
  logResearch(`GitHub 检索开始 (query=${query})`);
  const data = await fetchJsonWithTimeout(url, options.timeoutMs, {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'slidev-ppt-agent'
  });
  const items = Array.isArray(data?.items) ? data.items : [];
  const entries = items
    .map(item => ({
      title: shortText(item.full_name || item.name || '', 200),
      summary: shortText(item.description || '', 280),
      url: item.html_url || '',
      published: item.updated_at || item.created_at || '',
      authors: [item.owner?.login].filter(Boolean),
      categories: Array.isArray(item.topics) ? item.topics : [],
      source: 'GitHub'
    }))
    .filter(item => item.title && item.url && dateWithinDays(item.published, Math.max(options.windowDays, 30)))
    .slice(0, Math.max(3, Math.min(10, options.maxItems)));
  logResearch(`GitHub 检索完成 (items=${entries.length})`);
  return entries;
}

async function fetchBaiduResearch(promptText, options) {
  const query = normalizeWhitespace(promptText || 'AI');
  const url = `https://www.baidu.com/s?wd=${encodeURIComponent(query)}&rn=20`;
  logResearch(`Baidu 检索开始 (query=${query})`);
  const htmlText = await fetchTextWithTimeout(url, options.timeoutMs, {
    Accept: 'text/html',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  });

  const entries = [];
  const matches = htmlText.matchAll(/<h3[^>]*>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h3>/gi);
  for (const matched of matches) {
    const link = matched[1];
    const title = shortText(matched[2], 220);
    if (!link || !title) continue;
    entries.push({
      title,
      summary: '',
      url: link,
      published: new Date().toISOString(),
      authors: [],
      categories: [],
      source: 'Baidu'
    });
    if (entries.length >= Math.max(3, Math.min(8, options.maxItems))) break;
  }
  logResearch(`Baidu 检索完成 (items=${entries.length})`);
  return entries;
}

function classifyResearchIntent(promptText) {
  const text = String(promptText || '').toLowerCase();
  if (/(论文|paper|research|arxiv|学术|期刊|会议)/i.test(text)) return 'paper';
  if (/(开源|github|repo|工程|代码|框架|sdk|agent|部署|vibe\s*coding)/i.test(text)) return 'engineering';
  if (/(资讯|新闻|大事记|行业|市场|公司|融资|发布|热点)/i.test(text)) return 'news';
  return 'general';
}

function resolveResearchProviders(promptText, options) {
  if (Array.isArray(options.providers) && options.providers.length) {
    return options.providers;
  }

  const intent = classifyResearchIntent(promptText);
  if (intent === 'paper') return ['arxiv', 'google_news', 'github'];
  if (intent === 'engineering') return ['github', 'google_news', 'hn', 'baidu'];
  if (intent === 'news') return ['google_news', 'baidu', 'hn', 'arxiv'];
  return ['google_news', 'baidu', 'github', 'arxiv', 'hn'];
}

function normalizeUrlForDedup(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl || ''));
    parsed.hash = '';
    const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref', 'source'];
    trackingParams.forEach(key => parsed.searchParams.delete(key));
    parsed.searchParams.sort();
    return `${parsed.origin}${parsed.pathname}${parsed.search ? `?${parsed.searchParams.toString()}` : ''}`;
  } catch {
    return String(rawUrl || '').trim();
  }
}

function scoreSourceTrust(source) {
  const map = {
    arXiv: 1.0,
    OpenReview: 0.95,
    PapersWithCode: 0.9,
    HackerNews: 0.55
  };
  return map[source] || 0.6;
}

function scoreRecency(publishedAt, windowDays) {
  const published = Date.parse(publishedAt || '');
  if (!Number.isFinite(published)) return 0.2;
  const ageMs = Math.max(0, Date.now() - published);
  const windowMs = Math.max(1, windowDays) * 24 * 60 * 60 * 1000;
  const normalized = 1 - Math.min(1, ageMs / windowMs);
  return 0.2 + normalized * 0.8;
}

function scoreKeywordRelevance(promptText, item) {
  const hints = extractKeywordHints(promptText);
  if (!hints.length) return 0.6;
  const haystack = `${item.title || ''} ${item.summary || ''} ${(item.categories || []).join(' ')}`.toLowerCase();
  let hitCount = 0;
  for (const token of hints) {
    if (haystack.includes(token)) hitCount += 1;
  }
  const ratio = hitCount / hints.length;
  return 0.3 + ratio * 0.7;
}

function computeResearchScore(promptText, item, options) {
  const trust = scoreSourceTrust(item.source);
  const recency = scoreRecency(item.published, options.windowDays);
  const relevance = scoreKeywordRelevance(promptText, item);
  const weighted = trust * 0.5 + recency * 0.25 + relevance * 0.25;
  return Math.round(weighted * 1000) / 10;
}

function enrichResearchItems(promptText, items, options) {
  const deduped = [];
  const seen = new Set();
  for (const item of items) {
    const normalizedUrl = normalizeUrlForDedup(item.url);
    const key = `${item.source}|${normalizedUrl}|${shortText(item.title, 180)}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push({
      ...item,
      url: normalizedUrl
    });
  }

  const scored = deduped.map(item => ({
    ...item,
    score: computeResearchScore(promptText, item, options)
  }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return Date.parse(b.published || 0) - Date.parse(a.published || 0);
  });

  return scored.slice(0, options.maxItems).map((item, index) => ({
    ...item,
    refId: `S${index + 1}`
  }));
}

function buildResearchContext(items, options) {
  if (!items.length) return '';
  const lines = [
    `【联网检索资料】`,
    `- 检索时间: ${new Date().toISOString()}`,
    `- 时间窗口: 最近 ${options.windowDays} 天`,
    `- 数据条目: ${items.length}`
  ];
  items.forEach((item, index) => {
    const published = String(item.published || '').slice(0, 10) || '未知日期';
    const authors = item.authors && item.authors.length ? item.authors.slice(0, 3).join(', ') : '未知作者';
    lines.push(`${index + 1}. [${item.refId}] [${item.source}] ${item.title}`);
    lines.push(`   - date: ${published}`);
    lines.push(`   - score: ${item.score}`);
    lines.push(`   - authors: ${authors}`);
    lines.push(`   - url: ${item.url}`);
    if (item.summary) {
      lines.push(`   - summary: ${item.summary}`);
    }
  });
  lines.push('引用规则：涉及事实、数据、结论的句子，句末必须标注来源编号（如 [S1] 或 [S2][S5]）。');
  lines.push('请基于以上资料撰写内容，并在相关页标注来源编号。');
  return lines.join('\n');
}

async function runWebResearch(promptText) {
  const options = resolveResearchOptions();
  if (!options.enabled) {
    logFlow('已禁用联网检索，跳过该阶段');
    return { enabled: false, items: [], context: '' };
  }

  logFlow('进入联网检索阶段');
  const providers = resolveResearchProviders(promptText, options);
  logResearch(`检索路由: ${providers.join(', ')}`);

  const providerFetchers = {
    arxiv: fetchArxivResearch,
    google_news: fetchGoogleNewsResearch,
    baidu: fetchBaiduResearch,
    github: fetchGithubResearch,
    hn: fetchHnResearch
  };
  const providerTasks = providers
    .map(provider => {
      const fn = providerFetchers[provider];
      if (!fn) return null;
      return { provider, promise: fn(promptText, options) };
    })
    .filter(Boolean);

  const settled = await Promise.allSettled(providerTasks.map(item => item.promise));
  const items = [];
  for (let index = 0; index < settled.length; index++) {
    const result = settled[index];
    const provider = providerTasks[index]?.provider || 'unknown';
    if (result.status === 'fulfilled') {
      items.push(...result.value);
      continue;
    }
    logResearch(`检索通道失败(${provider}): ${summarizeError(result.reason)}`);
  }

  const selected = enrichResearchItems(promptText, items, options);
  const context = buildResearchContext(selected, options);
  logFlow(`联网检索完成 (items=${selected.length})`);
  if (!selected.length) {
    logResearch('未命中可用在线资料，将仅基于需求生成。');
  } else {
    selected.slice(0, Math.min(8, selected.length)).forEach((item, index) => {
      logResearch(
        `候选#${index + 1} ${item.refId} score=${item.score} [${item.source}] ${String(item.published || '').slice(0, 10)} ${item.title}`
      );
    });
  }
  return { enabled: true, items: selected, context };
}

function extractUsedReferenceIds(slidesContent) {
  const matched = String(slidesContent || '').match(/\[S\d+\]/g) || [];
  const ordered = [];
  const seen = new Set();
  for (const token of matched) {
    if (seen.has(token)) continue;
    seen.add(token);
    ordered.push(token.replace(/\[|\]/g, ''));
  }
  return ordered;
}

function chunkArray(items, chunkSize) {
  const chunks = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  return chunks;
}

function renderReferenceSlideChunk(items, index, totalChunks) {
  const title = totalChunks > 1 ? `参考资料 (${index + 1}/${totalChunks})` : '参考资料';
  const lines = [
    '---',
    'layout: custom',
    'transition: fade-out',
    '---',
    '',
    `<div class="px-6 py-8 h-full overflow-auto">`,
    `<div class="theme-badge mb-3">${title}</div>`,
    `<h2 class="text-2xl font-bold mb-4 theme-text">Sources & Citations</h2>`,
    '',
    ...items.map(item => {
      const date = String(item.published || '').slice(0, 10) || '未知日期';
      return `- **[${item.refId}]** ${item.title}  \\n  ${item.source} · ${date}  \\n  ${item.url}`;
    }),
    '',
    '</div>'
  ];
  return lines.join('\n');
}

function injectReferenceSlides(slidesContent, researchItems) {
  if (!Array.isArray(researchItems) || researchItems.length === 0) {
    return { content: slidesContent, injected: false, usedCount: 0, refsCount: 0 };
  }
  const usedIds = extractUsedReferenceIds(slidesContent);
  const usedSet = new Set(usedIds);
  const orderedRefs = researchItems.filter(item => usedSet.has(item.refId));
  const fallbackRefs = researchItems.filter(item => !usedSet.has(item.refId));
  const finalRefs = orderedRefs.length ? orderedRefs : researchItems.slice(0, Math.min(8, researchItems.length));
  if (orderedRefs.length < 4) {
    const required = 4 - orderedRefs.length;
    finalRefs.push(...fallbackRefs.slice(0, required));
  }

  const unique = [];
  const seen = new Set();
  for (const item of finalRefs) {
    const key = item.refId;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }

  const chunks = chunkArray(unique, 5);
  if (!chunks.length) {
    return { content: slidesContent, injected: false, usedCount: usedIds.length, refsCount: 0 };
  }
  const renderedSlides = chunks.map((chunk, idx) => renderReferenceSlideChunk(chunk, idx, chunks.length)).join('\n\n');
  const appended = `${String(slidesContent || '').trim()}\n\n${renderedSlides}`;
  return {
    content: appended,
    injected: true,
    usedCount: usedIds.length,
    refsCount: unique.length
  };
}

function resolveApiKey(provider) {
  if (provider === 'openai') {
    return process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY || '';
  }
  return process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || '';
}

function postProcessModelText(text) {
  let output = String(text || '');
  const rawLength = output.length;
  logLlm(`开始后处理模型输出 (rawChars=${rawLength})`);
  output = stripCodeFences(output);
  output = normalizeMarkdownIndentation(output);

  // ── 截断自动修复 ──
  // 检测是否被 token limit 截断（未闭合的 HTML 标签）
  const openTags = (output.match(/<[a-zA-Z][^/>]*>/g) || []).length;
  const closeTags = (output.match(/<\/[a-zA-Z]+>/g) || []).length;
  const selfCloseTags = (output.match(/<[^>]+\/>/g) || []).length;

  if (openTags - selfCloseTags > closeTags + 2) {
    console.warn('⚠️  检测到 AI 输出被截断（未闭合标签），正在自动修复...');
    const slides = output.split(/^---$/m);
    while (slides.length > 2) {
      const lastSlide = slides[slides.length - 1];
      const lastOpen = (lastSlide.match(/<[a-zA-Z][^/>]*>/g) || []).length;
      const lastClose = (lastSlide.match(/<\/[a-zA-Z]+>/g) || []).length;
      const lastSelf = (lastSlide.match(/<[^>]+\/>/g) || []).length;
      if (lastOpen - lastSelf <= lastClose + 1) break;
      slides.pop();
      slides.pop();
    }
    output = slides.join('---');
    output += `\n\n---\nlayout: custom\nclass: theme-dark-ending\n---\n\n<div class="flex flex-col items-center justify-center h-full text-white">\n<h2 class="text-4xl font-bold mb-4 tracking-widest">THANK YOU</h2>\n<div class="w-16 h-1 bg-white opacity-30 mb-6"></div>\n<p class="text-lg opacity-70">感谢观看</p>\n</div>`;
    console.log('✅ 截断修复完成，已保留完整页面并追加结尾页');
  }
  const finalOutput = output.trim();
  logLlm(`后处理完成 (finalChars=${finalOutput.length})`);
  return finalOutput;
}

function retryPolicy() {
  const timeoutMs = isValidNumber(
    Number(process.env.LLM_TIMEOUT_MS),
    isValidNumber(Number(process.env.GEMINI_TIMEOUT_MS), DEFAULT_TIMEOUT_MS)
  );
  const timeoutFloorMs = isValidNumber(
    Number(process.env.LLM_TIMEOUT_FLOOR_MS),
    isValidNumber(Number(process.env.GEMINI_TIMEOUT_FLOOR_MS), DEFAULT_TIMEOUT_FLOOR_MS)
  );
  const effectiveTimeoutMs = Math.max(timeoutMs, timeoutFloorMs);
  const maxTimeoutMs = Math.max(
    effectiveTimeoutMs,
    isValidNumber(
      Number(process.env.LLM_MAX_TIMEOUT_MS),
      isValidNumber(Number(process.env.GEMINI_MAX_TIMEOUT_MS), DEFAULT_MAX_TIMEOUT_MS)
    )
  );
  const maxRetries = Math.max(
    1,
    Math.floor(
      isValidNumber(
        Number(process.env.LLM_MAX_RETRIES),
        isValidNumber(Number(process.env.GEMINI_MAX_RETRIES), DEFAULT_RETRIES)
      )
    )
  );
  const retryBaseMs = isValidNumber(
    Number(process.env.LLM_RETRY_BASE_MS),
    isValidNumber(Number(process.env.GEMINI_RETRY_BASE_MS), DEFAULT_RETRY_BASE_MS)
  );
  const retryMaxWaitMs = isValidNumber(
    Number(process.env.LLM_RETRY_MAX_WAIT_MS),
    isValidNumber(Number(process.env.GEMINI_RETRY_MAX_WAIT_MS), DEFAULT_RETRY_MAX_WAIT_MS)
  );
  return {
    timeoutMs,
    timeoutFloorMs,
    effectiveTimeoutMs,
    maxTimeoutMs,
    maxRetries,
    retryBaseMs,
    retryMaxWaitMs
  };
}

// ────────────────────────────────────────────
// 4. 调用 LLM API
// ────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  const apiKey = resolveApiKey('gemini');
  if (!apiKey) {
    throw new Error('请设置 GEMINI_API_KEY（或 LLM_API_KEY）');
  }

  const model = process.env.GEMINI_MODEL || process.env.LLM_MODEL || DEFAULT_MODEL;
  const { timeoutMs, effectiveTimeoutMs, maxTimeoutMs, maxRetries, retryBaseMs, retryMaxWaitMs } = retryPolicy();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 65536
    }
  };

  console.log(`🤖 正在调用 Gemini 大模型生成内容... (model=${model}, retries=${maxRetries}, timeout=${timeoutMs}ms, effectiveTimeout=${effectiveTimeoutMs}ms)`);
  logLlm(`请求已就绪 (provider=gemini, url=/v1beta/models/${model}:generateContent)`);

  const isRetryableStatus = status => status === 408 || status === 429 || status >= 500;
  let data = null;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const attemptTimeoutMs = Math.min(effectiveTimeoutMs + (attempt - 1) * 30000, maxTimeoutMs);
    const attemptStart = Date.now();
    logLlm(`第 ${attempt}/${maxRetries} 次请求开始 (timeout=${attemptTimeoutMs}ms)`);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), attemptTimeoutMs);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timer);

      const elapsedMs = Date.now() - attemptStart;
      logLlm(`第 ${attempt}/${maxRetries} 次请求收到响应 (status=${response.status}, elapsed=${elapsedMs}ms)`);

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`Gemini API 调用失败 (${response.status}): ${errorText}`);
        err.status = response.status;
        throw err;
      }

      data = await response.json();
      const usage = data.usageMetadata || {};
      if (usage.promptTokenCount || usage.candidatesTokenCount || usage.totalTokenCount) {
        logLlm(
          `Token 用量 prompt=${usage.promptTokenCount || 0}, completion=${usage.candidatesTokenCount || 0}, total=${usage.totalTokenCount || 0}`
        );
      }
      logLlm(`第 ${attempt}/${maxRetries} 次请求成功，进入结果解析`);
      break;
    } catch (err) {
      clearTimeout(timer);
      const timeoutError = err.name === 'AbortError';
      const networkRetryable = isRetryableNetworkError(err);
      const retryable = timeoutError || isRetryableStatus(err.status) || networkRetryable;
      lastError = err;
      const elapsedMs = Date.now() - attemptStart;

      if (attempt < maxRetries && retryable) {
        const waitMs = Math.min(retryBaseMs * (2 ** (attempt - 1)), retryMaxWaitMs);
        const reason = timeoutError
          ? `请求超时(${attemptTimeoutMs}ms)`
          : `${err.message}${errorCode(err) ? ` [${errorCode(err)}]` : ''}`;
        logLlm(`第 ${attempt}/${maxRetries} 次请求失败 (elapsed=${elapsedMs}ms, retryable=true)`);
        console.warn(`⚠️  第 ${attempt} 次请求失败，${waitMs}ms 后重试: ${reason}`);
        await sleep(waitMs);
        continue;
      }

      logLlm(`第 ${attempt}/${maxRetries} 次请求失败且不再重试 (elapsed=${elapsedMs}ms)`);
      if (timeoutError) {
        throw new Error(`Gemini API 请求超时（${attemptTimeoutMs}ms）。可提高 LLM_TIMEOUT_MS 或减少单次输出量。`);
      }
      throw err;
    }
  }

  if (!data) {
    if (lastError && lastError.name === 'AbortError') {
      throw new Error(`Gemini API 请求超时，已重试 ${maxRetries} 次（timeout=${timeoutMs}ms, effectiveTimeout=${effectiveTimeoutMs}ms, maxTimeout=${maxTimeoutMs}ms）。`);
    }
    throw lastError || new Error('Gemini API 返回为空');
  }

  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) {
    throw new Error('Gemini API 未返回可用文本内容');
  }
  logLlm(`已提取模型文本 (chars=${text.length})`);

  return postProcessModelText(text);
}

function extractOpenAIText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map(item => {
        if (typeof item === 'string') return item;
        if (item && typeof item.text === 'string') return item.text;
        return '';
      })
      .join('');
  }
  return '';
}

function extractResponsesText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text;
  }

  const parts = [];
  const outputs = Array.isArray(data?.output) ? data.output : [];
  for (const item of outputs) {
    if (!item || !Array.isArray(item.content)) continue;
    for (const block of item.content) {
      if (!block) continue;
      if (typeof block.text === 'string') {
        parts.push(block.text);
        continue;
      }
      if (typeof block.text?.value === 'string') {
        parts.push(block.text.value);
        continue;
      }
      if (typeof block.output_text === 'string') {
        parts.push(block.output_text);
      }
    }
  }

  return parts.join('\n').trim();
}

function parseSseJsonEvents(rawBody) {
  const events = [];
  const lines = String(rawBody || '').split(/\r?\n/);
  let dataLines = [];

  function flushEvent() {
    if (!dataLines.length) return;
    const payloadText = dataLines.join('\n').trim();
    dataLines = [];
    if (!payloadText || payloadText === '[DONE]') return;
    try {
      events.push(JSON.parse(payloadText));
    } catch {
      // 忽略非 JSON 事件片段，后续会根据结果判断是否可用
    }
  }

  for (const line of lines) {
    if (!line.trim()) {
      flushEvent();
      continue;
    }
    const normalizedLine = line.trimStart();
    if (normalizedLine.startsWith('data:')) {
      dataLines.push(normalizedLine.slice(5).trim());
    }
  }
  flushEvent();

  return events;
}

function decodeResponsesEventStream(rawBody) {
  const events = parseSseJsonEvents(rawBody);
  let finalText = '';
  let completedResponse = null;
  let streamError = null;

  for (const event of events) {
    if (!event || typeof event !== 'object') continue;
    if (event.type === 'error' && event.error && typeof event.error === 'object') {
      streamError = event.error;
      continue;
    }
    if (!streamError && event.error && typeof event.error === 'object') {
      streamError = event.error;
    }
    if (event.type === 'response.output_text.delta' && typeof event.delta === 'string') {
      finalText += event.delta;
      continue;
    }
    if (event.type === 'response.output_text.done' && typeof event.text === 'string' && event.text) {
      finalText = event.text;
      continue;
    }
    if (event.type === 'response.completed' && event.response && typeof event.response === 'object') {
      completedResponse = event.response;
    }
  }

  const data = completedResponse || {};
  if (!data.output_text && finalText) {
    data.output_text = finalText;
  }

  return { events, data, streamError };
}

async function readOpenAIResponseBody(response, contentType, onSseEvent) {
  const isSse = String(contentType || '').toLowerCase().includes('text/event-stream');
  if (!isSse || !response.body || typeof response.body.getReader !== 'function') {
    return { rawBody: await response.text(), sseEventCount: 0 };
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let rawBody = '';
  let buffer = '';
  let eventDataLines = [];
  let completionSeen = false;
  let sseEventCount = 0;

  const emitEvent = payloadText => {
    if (!payloadText || payloadText === '[DONE]') {
      completionSeen = true;
      return;
    }
    try {
      const event = JSON.parse(payloadText);
      sseEventCount += 1;
      if (onSseEvent) onSseEvent(event);
      if (event?.type === 'response.completed' || event?.type === 'error') {
        completionSeen = true;
      }
    } catch {
      // 忽略无法解析的事件片段
    }
  };

  const consumeLine = line => {
    if (!line.trim()) {
      if (!eventDataLines.length) return;
      const payloadText = eventDataLines.join('\n').trim();
      eventDataLines = [];
      emitEvent(payloadText);
      return;
    }
    const normalizedLine = line.trimStart();
    if (normalizedLine.startsWith('data:')) {
      eventDataLines.push(normalizedLine.slice(5).trim());
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    rawBody += chunk;
    buffer += chunk;
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() || '';
    for (const line of lines) {
      consumeLine(line);
      if (completionSeen) break;
    }
    if (completionSeen) {
      try {
        await reader.cancel();
      } catch {
        // 忽略 reader.cancel 的异常
      }
      break;
    }
  }

  const tail = decoder.decode();
  if (tail) {
    rawBody += tail;
    buffer += tail;
  }
  if (buffer) {
    buffer.split(/\r?\n/).forEach(consumeLine);
  }
  if (eventDataLines.length) {
    emitEvent(eventDataLines.join('\n').trim());
    eventDataLines = [];
  }

  return { rawBody, sseEventCount };
}

function extractUsage(data) {
  if (!data || typeof data !== 'object') return {};
  if (data.usage && typeof data.usage === 'object') return data.usage;
  if (data.response && typeof data.response.usage === 'object') return data.response.usage;
  return {};
}

function normalizeUsageMetrics(usage) {
  if (!usage || typeof usage !== 'object') return null;
  const promptTokens = Number(
    usage.prompt_tokens ?? usage.input_tokens ?? usage.promptTokens ?? usage.inputTokens ?? 0
  ) || 0;
  const completionTokens = Number(
    usage.completion_tokens ?? usage.output_tokens ?? usage.completionTokens ?? usage.outputTokens ?? 0
  ) || 0;
  const totalTokens = Number(
    usage.total_tokens ?? usage.totalTokens ?? (promptTokens + completionTokens)
  ) || 0;
  if (!promptTokens && !completionTokens && !totalTokens) return null;
  return { promptTokens, completionTokens, totalTokens };
}

function sanitizeLogChunk(text) {
  return String(text || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function sanitizeStreamChunk(text) {
  return String(text || '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function logLargePayload(label, rawText, chunkSize = 1400) {
  const text = sanitizeLogChunk(rawText);
  const totalChars = text.length;
  const totalChunks = Math.max(1, Math.ceil(totalChars / chunkSize));
  logLlm(`${label} 开始 (chars=${totalChars}, chunks=${totalChunks})`);
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const chunk = text.slice(start, start + chunkSize);
    logLlm(`${label}[${i + 1}/${totalChunks}] ${chunk}`);
  }
  logLlm(`${label} 结束`);
}

function tuneReasoningEffortForAttempt(effort, attempt) {
  const raw = String(effort || '').trim().toLowerCase();
  if (!raw || attempt <= 1) return raw;
  if (raw === 'xhigh') {
    if (attempt === 2) return 'high';
    return 'medium';
  }
  if (raw === 'high' && attempt >= 3) return 'medium';
  return raw;
}

function resolveOpenAIOptions() {
  const wireApi = normalizeOpenAIWireApi(
    process.env.OPENAI_WIRE_API || process.env.LLM_WIRE_API || DEFAULT_OPENAI_WIRE_API
  );
  const reasoningEffort = String(
    process.env.OPENAI_REASONING_EFFORT || process.env.LLM_REASONING_EFFORT || DEFAULT_REASONING_EFFORT || ''
  ).trim();
  const disableResponseStorage = toBoolean(
    process.env.OPENAI_DISABLE_RESPONSE_STORAGE ?? process.env.LLM_DISABLE_RESPONSE_STORAGE,
    DEFAULT_DISABLE_RESPONSE_STORAGE
  );

  return {
    wireApi,
    reasoningEffort,
    disableResponseStorage
  };
}

async function callOpenAICompatible(systemPrompt, userPrompt) {
  const apiKey = resolveApiKey('openai');
  if (!apiKey) {
    throw new Error('请设置 OPENAI_API_KEY（或 LLM_API_KEY）');
  }

  const model = process.env.OPENAI_MODEL || process.env.LLM_MODEL || DEFAULT_MODEL;
  const baseUrlInput = process.env.OPENAI_BASE_URL || process.env.LLM_BASE_URL || DEFAULT_OPENAI_BASE_URL;
  const baseUrl = normalizeOpenAIBaseUrl(baseUrlInput || 'https://api.openai.com/v1');
  if (!baseUrl) {
    throw new Error('OpenAI baseURL 为空，请设置 OPENAI_BASE_URL（或 LLM_BASE_URL）');
  }
  const options = resolveOpenAIOptions();
  const url = options.wireApi === 'responses'
    ? `${baseUrl}/responses`
    : `${baseUrl}/chat/completions`;
  const { timeoutMs, effectiveTimeoutMs, maxTimeoutMs, maxRetries, retryBaseMs, retryMaxWaitMs } = retryPolicy();

  const body = options.wireApi === 'responses'
    ? {
        model,
        instructions: systemPrompt,
        input: [{ role: 'user', content: [{ type: 'input_text', text: userPrompt }] }],
        temperature: 0.6,
        max_output_tokens: 4096
      }
    : {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.6,
        max_tokens: 4096
      };

  if (options.reasoningEffort) {
    if (options.wireApi === 'responses') {
      body.reasoning = { effort: options.reasoningEffort };
    } else {
      body.reasoning_effort = options.reasoningEffort;
    }
  }

  if (options.disableResponseStorage) {
    body.store = false;
  }

  console.log(`🤖 正在调用 OpenAI 兼容接口生成内容... (model=${model}, baseURL=${baseUrl}, wireApi=${options.wireApi}, retries=${maxRetries}, timeout=${timeoutMs}ms, effectiveTimeout=${effectiveTimeoutMs}ms)`);
  logLlm(`请求已就绪 (provider=openai, endpoint=${url})`);
  if (options.reasoningEffort) {
    logLlm(`推理强度: ${options.reasoningEffort}`);
  }
  if (options.disableResponseStorage) {
    logLlm('响应存储: disabled(store=false)');
  }

  const isRetryableStatus = status => status === 408 || status === 429 || status >= 500;
  let data = null;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const attemptTimeoutMs = Math.min(effectiveTimeoutMs + (attempt - 1) * 30000, maxTimeoutMs);
    const attemptStart = Date.now();
    logLlm(`第 ${attempt}/${maxRetries} 次请求开始 (timeout=${attemptTimeoutMs}ms)`);
    const attemptBody = JSON.parse(JSON.stringify(body));
    if (options.wireApi === 'responses' && attemptBody.reasoning && typeof attemptBody.reasoning === 'object') {
      const nextEffort = tuneReasoningEffortForAttempt(attemptBody.reasoning.effort, attempt);
      if (nextEffort && nextEffort !== attemptBody.reasoning.effort) {
        attemptBody.reasoning.effort = nextEffort;
        logLlm(`第 ${attempt}/${maxRetries} 次请求自动降级推理强度为 ${nextEffort}（减少超时风险）`);
      }
    }
    if (options.wireApi !== 'responses' && typeof attemptBody.reasoning_effort === 'string') {
      const nextEffort = tuneReasoningEffortForAttempt(attemptBody.reasoning_effort, attempt);
      if (nextEffort && nextEffort !== attemptBody.reasoning_effort) {
        attemptBody.reasoning_effort = nextEffort;
        logLlm(`第 ${attempt}/${maxRetries} 次请求自动降级推理强度为 ${nextEffort}（减少超时风险）`);
      }
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), attemptTimeoutMs);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(attemptBody),
        signal: controller.signal
      });

      const elapsedMs = Date.now() - attemptStart;
      logLlm(`第 ${attempt}/${maxRetries} 次请求收到响应 (status=${response.status}, elapsed=${elapsedMs}ms)`);

      const contentType = response.headers.get('content-type') || '';
      logLlm(`响应头 content-type=${contentType || 'unknown'}`);
      const sseEventTypes = new Map();
      let streamedTextChars = 0;
      let streamedPreview = '';
      let nextProgressLogAt = 400;
      let streamLogBuffer = '';
      const STREAM_LOG_CHUNK_SIZE = 180;
      const flushStreamLog = force => {
        while (streamLogBuffer.length >= STREAM_LOG_CHUNK_SIZE || (force && streamLogBuffer.length > 0)) {
          const piece = streamLogBuffer.slice(0, STREAM_LOG_CHUNK_SIZE);
          streamLogBuffer = streamLogBuffer.slice(STREAM_LOG_CHUNK_SIZE);
          const printable = sanitizeStreamChunk(piece);
          if (printable) {
            logLlm(`SSE 文本流片段: ${printable}`);
          }
        }
      };
      const readStart = Date.now();
      const waitTimer = setInterval(() => {
        logLlm(`等待模型流式内容... elapsed=${Date.now() - readStart}ms`);
      }, 15000);
      let rawBody = '';
      let sseEventCount = 0;
      try {
        ({ rawBody, sseEventCount } = await readOpenAIResponseBody(response, contentType, event => {
          const type = String(event?.type || 'unknown');
          sseEventTypes.set(type, (sseEventTypes.get(type) || 0) + 1);
          if (type === 'response.output_text.delta' && typeof event.delta === 'string') {
            streamedTextChars += event.delta.length;
            if (streamedPreview.length < 240) {
              streamedPreview += event.delta;
            }
            streamLogBuffer += event.delta;
            flushStreamLog(false);
            if (streamedTextChars >= nextProgressLogAt) {
              logLlm(`SSE 文本流进度 chars=${streamedTextChars}`);
              nextProgressLogAt += 400;
            }
            return;
          }
          if (type === 'response.output_text.done' && typeof event.text === 'string') {
            logLlm(`SSE 返回完整文本片段 (chars=${event.text.length})`);
            if (streamedTextChars === 0) {
              streamLogBuffer += event.text;
            }
            flushStreamLog(true);
            return;
          }
          if (type === 'response.completed') {
            logLlm(`SSE completed(status=${event?.response?.status || 'unknown'})`);
            flushStreamLog(true);
            return;
          }
          if (type === 'error' && event?.error && typeof event.error === 'object') {
            const code = event.error.code || 'unknown';
            const message = event.error.message || 'unknown';
            const errType = event.error.type || 'unknown';
            logLlm(`SSE error(code=${code}, type=${errType}, message=${message})`);
            flushStreamLog(true);
          }
        }));
      } finally {
        clearInterval(waitTimer);
        flushStreamLog(true);
      }
      clearTimeout(timer);
      logLargePayload('AI 原始响应', rawBody);

      if (!response.ok) {
        const errorText = rawBody;
        const snippet = String(errorText).slice(0, 280).replace(/\s+/g, ' ');
        logLlm(`错误响应片段: ${snippet}`);
        const err = new Error(`OpenAI 接口调用失败 (${response.status}): ${errorText}`);
        err.status = response.status;
        throw err;
      }

      const isSse = contentType.toLowerCase().includes('text/event-stream');
      if (isSse) {
        const decoded = decodeResponsesEventStream(rawBody);
        data = decoded.data;
        logLlm(`已解析 Responses SSE 事件 (events=${decoded.events.length})`);
        if (decoded.streamError) {
          const errCode = decoded.streamError.code || 'unknown';
          const errType = decoded.streamError.type || 'unknown';
          const errMessage = decoded.streamError.message || 'unknown';
          const err = new Error(`OpenAI SSE 流返回错误事件: ${errCode}/${errType} ${errMessage}`);
          err.status = errType === 'upstream_error' ? 502 : 500;
          throw err;
        }
        if (sseEventCount) {
          const detail = [...sseEventTypes.entries()]
            .map(([type, count]) => `${type}=${count}`)
            .join(', ');
          if (detail) logLlm(`SSE 事件明细: ${detail}`);
        }
        if (streamedPreview.trim()) {
          const preview = streamedPreview.slice(0, 200).replace(/\s+/g, ' ');
          logLlm(`SSE 文本预览: ${preview}`);
        }
        logLargePayload('AI 解析结果(JSON)', JSON.stringify(data, null, 2));
      } else {
        try {
          data = JSON.parse(rawBody);
          const snippet = rawBody.slice(0, 200).replace(/\s+/g, ' ');
          logLlm(`JSON 响应预览: ${snippet}`);
          logLargePayload('AI 解析结果(JSON)', JSON.stringify(data, null, 2));
        } catch {
          const snippet = rawBody.slice(0, 120).replace(/\s+/g, ' ');
          throw new Error(`OpenAI 接口返回非 JSON（status=${response.status}, content-type=${contentType || 'unknown'}）。请检查 baseURL（通常应包含 /v1）。响应片段: ${snippet}`);
        }
      }

      const usage = normalizeUsageMetrics(extractUsage(data));
      if (usage) {
        logLlm(
          `Token 用量 prompt=${usage.promptTokens}, completion=${usage.completionTokens}, total=${usage.totalTokens}`
        );
      }
      logLlm(`第 ${attempt}/${maxRetries} 次请求成功，进入结果解析`);
      break;
    } catch (err) {
      clearTimeout(timer);
      const timeoutError = err.name === 'AbortError';
      const networkRetryable = isRetryableNetworkError(err);
      const retryable = timeoutError || isRetryableStatus(err.status) || networkRetryable;
      lastError = err;
      const elapsedMs = Date.now() - attemptStart;

      if (attempt < maxRetries && retryable) {
        const waitMs = Math.min(retryBaseMs * (2 ** (attempt - 1)), retryMaxWaitMs);
        const reason = timeoutError
          ? `请求超时(${attemptTimeoutMs}ms)`
          : `${err.message}${errorCode(err) ? ` [${errorCode(err)}]` : ''}`;
        logLlm(`第 ${attempt}/${maxRetries} 次请求失败 (elapsed=${elapsedMs}ms, retryable=true)`);
        console.warn(`⚠️  第 ${attempt} 次请求失败，${waitMs}ms 后重试: ${reason}`);
        await sleep(waitMs);
        continue;
      }

      logLlm(`第 ${attempt}/${maxRetries} 次请求失败且不再重试 (elapsed=${elapsedMs}ms)`);
      if (timeoutError) {
        throw new Error(`OpenAI 接口请求超时（${attemptTimeoutMs}ms）。可提高 LLM_TIMEOUT_MS 或减少单次输出量。`);
      }
      throw err;
    }
  }

  if (!data) {
    if (lastError && lastError.name === 'AbortError') {
      throw new Error(`OpenAI 接口请求超时，已重试 ${maxRetries} 次（timeout=${timeoutMs}ms, effectiveTimeout=${effectiveTimeoutMs}ms, maxTimeout=${maxTimeoutMs}ms）。`);
    }
    throw lastError || new Error('OpenAI 接口返回为空');
  }

  const rawText = options.wireApi === 'responses'
    ? extractResponsesText(data)
    : extractOpenAIText(data.choices?.[0]?.message?.content);
  if (!rawText) {
    throw new Error(`OpenAI ${options.wireApi} 接口未返回可用文本内容`);
  }
  logLlm(`已提取模型文本 (chars=${rawText.length})`);

  return postProcessModelText(rawText);
}

async function callLLM(systemPrompt, userPrompt) {
  const provider = resolveLlmProvider();
  if (provider === 'openai') {
    return callOpenAICompatible(systemPrompt, userPrompt);
  }
  return callGemini(systemPrompt, userPrompt);
}

// ────────────────────────────────────────────
// 5. 导出 PPT
// ────────────────────────────────────────────
function exportSlides(format) {
  const fmt = (format || config.exportFormat || 'pdf').toLowerCase();
  if (!VALID_EXPORT_FORMATS.has(fmt)) {
    throw new Error(`不支持的导出格式: ${fmt}，仅支持 pdf | pptx | both`);
  }
  console.log(`📦 正在导出为 ${fmt.toUpperCase()} 文件...`);

  try {
    if (fmt === 'pdf' || fmt === 'both') {
      execSync('npx slidev export --timeout 60000', { cwd: __dirname, stdio: 'inherit' });
      console.log('✅ PDF 导出成功: slides-export.pdf');
    }
    if (fmt === 'pptx' || fmt === 'both') {
      execSync('npx slidev export --format pptx --timeout 60000', { cwd: __dirname, stdio: 'inherit' });
      console.log('✅ PPTX 导出成功: slides-export.pptx');
    }
  } catch (err) {
    throw new Error(`导出失败: ${err.message}`);
  }
}

// ────────────────────────────────────────────
// 6. 主流程
// ────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);

  // 解析参数
  let userPrompt = '';
  let exportFormat = config.exportFormat;
  let skipExport = false;
  let skipQa = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      userPrompt = fs.readFileSync(args[i + 1], 'utf-8').trim();
      i++;
    } else if (args[i] === '--format' && args[i + 1]) {
      exportFormat = args[i + 1];
      i++;
    } else if (args[i] === '--no-export') {
      skipExport = true;
    } else if (args[i] === '--skip-qa') {
      skipQa = true;
    } else if (args[i] === '--help') {
      console.log(`
PPT Agent 生成脚本
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

用法:
  node generate.js "你的需求描述"
  node generate.js --file requirements.txt
  node generate.js "需求" --format both
  node generate.js "需求" --no-export
  node generate.js "需求" --skip-qa

参数:
  --file <path>     从文件读取需求
  --format <fmt>    导出格式: pdf | pptx | both (默认: ${config.exportFormat})
  --no-export       仅生成 slides.md，不自动导出
  --skip-qa         跳过生成后质量校验（不建议）
  --help            显示帮助

环境变量:
  LLM_PROVIDER      模型提供方: gemini | openai (默认: ${DEFAULT_LLM_PROVIDER})
  LLM_API_KEY       通用 API Key（推荐）
  LLM_MODEL         通用模型 ID（可选）
  LLM_BASE_URL      OpenAI 兼容接口 baseURL（可选）
  GEMINI_API_KEY    Gemini API Key（与 LLM_API_KEY 二选一）
  GEMINI_MODEL      Gemini 模型名 (可选，默认: ${DEFAULT_MODEL})
  OPENAI_API_KEY    OpenAI 兼容接口 API Key（与 LLM_API_KEY 二选一）
  OPENAI_MODEL      OpenAI 兼容接口模型 ID（可选）
  OPENAI_BASE_URL   OpenAI 兼容接口 baseURL (可选，默认: ${DEFAULT_OPENAI_BASE_URL})
  OPENAI_WIRE_API   OpenAI 兼容协议: chat_completions | responses (可选，默认: ${DEFAULT_OPENAI_WIRE_API})
  OPENAI_REASONING_EFFORT 推理强度: low | medium | high | xhigh (可选，默认: ${DEFAULT_REASONING_EFFORT || '未设置'})
  OPENAI_DISABLE_RESPONSE_STORAGE 关闭响应存储 (可选，默认: ${DEFAULT_DISABLE_RESPONSE_STORAGE})
  LLM_WIRE_API      通用协议开关（同 OPENAI_WIRE_API）
  LLM_REASONING_EFFORT 通用推理强度（同 OPENAI_REASONING_EFFORT）
  LLM_DISABLE_RESPONSE_STORAGE 通用关闭响应存储（同 OPENAI_DISABLE_RESPONSE_STORAGE）
  LLM_ENABLE_WEB_RESEARCH 是否启用联网检索 (可选，默认: ${DEFAULT_ENABLE_WEB_RESEARCH})
  LLM_RESEARCH_PROVIDERS 联网检索来源 (可选，auto 或 arxiv,google_news,baidu,github,hn；默认: ${DEFAULT_RESEARCH_PROVIDERS})
  LLM_RESEARCH_WINDOW_DAYS 联网检索时间窗口天数 (可选，默认: ${DEFAULT_RESEARCH_WINDOW_DAYS})
  LLM_RESEARCH_MAX_ITEMS 联网检索最大条目数 (可选，默认: ${DEFAULT_RESEARCH_MAX_ITEMS})
  LLM_RESEARCH_TIMEOUT_MS 联网检索请求超时毫秒 (可选，默认: 15000)
  LLM_TIMEOUT_MS    通用请求超时毫秒 (可选，默认: ${DEFAULT_TIMEOUT_MS})
  LLM_TIMEOUT_FLOOR_MS 通用超时兜底毫秒 (可选，默认: ${DEFAULT_TIMEOUT_FLOOR_MS})
  LLM_MAX_TIMEOUT_MS 通用单次重试最大超时毫秒 (可选，默认: ${DEFAULT_MAX_TIMEOUT_MS})
  LLM_MAX_RETRIES   通用请求重试次数 (可选，默认: ${DEFAULT_RETRIES})
  LLM_RETRY_BASE_MS 通用重试间隔基数毫秒 (可选，默认: ${DEFAULT_RETRY_BASE_MS})
  LLM_RETRY_MAX_WAIT_MS 通用重试间隔最大毫秒 (可选，默认: ${DEFAULT_RETRY_MAX_WAIT_MS})
  GEMINI_TIMEOUT_MS 请求超时毫秒 (可选，默认: ${DEFAULT_TIMEOUT_MS})
  GEMINI_TIMEOUT_FLOOR_MS 超时兜底毫秒 (可选，默认: ${DEFAULT_TIMEOUT_FLOOR_MS})
  GEMINI_MAX_TIMEOUT_MS 单次重试最大超时毫秒 (可选，默认: ${DEFAULT_MAX_TIMEOUT_MS})
  GEMINI_MAX_RETRIES 请求重试次数 (可选，默认: ${DEFAULT_RETRIES})
  GEMINI_RETRY_BASE_MS 重试间隔基数毫秒 (可选，默认: ${DEFAULT_RETRY_BASE_MS})
  GEMINI_RETRY_MAX_WAIT_MS 重试间隔最大毫秒 (可选，默认: ${DEFAULT_RETRY_MAX_WAIT_MS})
      `);
      process.exit(0);
    } else {
      userPrompt = args[i];
    }
  }

  if (!userPrompt) {
    console.error('❌ 请提供需求描述');
    console.error('   node generate.js "帮我写一份关于 AI 发展趋势的 PPT"');
    process.exit(1);
  }
  logFlow(`收到需求输入 (chars=${userPrompt.length})`);

  // 扫描组件
  logFlow('开始扫描组件库');
  const components = scanComponents();
  console.log(`📋 已发现 ${components.length} 个可用组件: ${components.map(c => c.name).join(', ')}`);

  // 联网检索
  const researchResult = await runWebResearch(userPrompt);
  let effectivePrompt = userPrompt;
  if (researchResult.context) {
    effectivePrompt = `${userPrompt}\n\n${researchResult.context}`;
    logResearch(`联网资料已注入生成上下文 (chars=${researchResult.context.length})`);
  }

  // 构造 prompt
  logFlow('开始构造系统提示词');
  const systemPrompt = buildSystemPrompt(components);
  logFlow(`系统提示词构造完成 (chars=${systemPrompt.length})`);

  // 调用大模型
  const provider = resolveLlmProvider();
  console.log(`🧠 当前 LLM 提供方: ${provider}`);
  logFlow('进入 LLM 生成阶段');
  let slidesContent = await callLLM(systemPrompt, effectivePrompt);
  logFlow(`LLM 生成完成 (chars=${slidesContent.length})`);

  // 自动注入引用页（基于检索结果与正文引用标记）
  if (researchResult.items && researchResult.items.length) {
    const injection = injectReferenceSlides(slidesContent, researchResult.items);
    slidesContent = injection.content;
    if (injection.injected) {
      logFlow(`引用页注入完成 (refs=${injection.refsCount}, usedMarkers=${injection.usedCount})`);
    } else {
      logFlow('未注入引用页（未检测到可用引用条目）');
    }
  }

  // 质量校验
  logFlow('进入质量校验阶段');
  if (!skipQa) {
    let qaResult = validateSlidesContent(slidesContent);
    logFlow(`质量校验结果: errors=${qaResult.errors.length}, warnings=${qaResult.warnings.length}`);
    qaResult.warnings.forEach(w => console.warn(`⚠️  质量提示: ${w}`));

    // 首轮不合格时，自动触发一次“格式修复重试”，提升稳定性。
    if (qaResult.errors.length) {
      console.warn('⚠️  首轮输出未通过校验，正在触发一次格式修复重试...');
      logFlow('触发格式修复重试 (2/2)');
      const repairPrompt = buildRepairPrompt(effectivePrompt, slidesContent, qaResult.errors);
      slidesContent = await callLLM(systemPrompt, repairPrompt);
      if (researchResult.items && researchResult.items.length) {
        const retryInjection = injectReferenceSlides(slidesContent, researchResult.items);
        slidesContent = retryInjection.content;
      }
      logFlow(`格式修复重试完成 (chars=${slidesContent.length})`);
      qaResult = validateSlidesContent(slidesContent);
      logFlow(`重试后质量校验结果: errors=${qaResult.errors.length}, warnings=${qaResult.warnings.length}`);
      qaResult.warnings.forEach(w => console.warn(`⚠️  质量提示: ${w}`));
    }

    if (qaResult.errors.length) {
      throw new Error(`生成结果未通过质量校验:\n- ${qaResult.errors.join('\n- ')}`);
    }
    console.log('✅ 质量校验通过');
  } else {
    console.log('⏭️  已跳过质量校验。');
  }

  // 写入 slides.md
  logFlow('开始写入 slides.md');
  const slidesPath = path.join(__dirname, 'slides.md');
  fs.writeFileSync(slidesPath, slidesContent + '\n', 'utf-8');
  const actualSlideCount = Math.floor((slidesContent.split(/^---$/m).length - 1) / 2) + 1;
  console.log(`✅ slides.md 已生成 (约 ${actualSlideCount} 页)`);

  // 导出
  logFlow('进入导出阶段');
  if (!skipExport) {
    exportSlides(exportFormat);
  } else {
    console.log('⏭️  已跳过导出。运行 npm run dev 可预览效果。');
  }

  console.log('\n🎉 完成！');
}

main().catch(err => {
  console.error(`❌ 运行出错: ${summarizeError(err)}`);
  if (process.env.DEBUG_STACK === '1' && err && err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});
