/**
 * PPT Agent 生成脚本
 *
 * 用法：
 *   node generate.js "帮我写一份关于新能源汽车行业 2024 年趋势分析的 PPT"
 *   node generate.js --file requirements.txt
 *
 * 环境变量：
 *   GEMINI_API_KEY  - Google Gemini API Key（必填）
 *
 * 工作流：
 *   1. 读取用户需求（命令行参数 或 文件）
 *   2. 读取 template.config.json 获取品牌信息
 *   3. 读取 components/ 目录中的可用组件列表
 *   4. 构造 system prompt，调用 Gemini 大模型生成 slides.md
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
const DEFAULT_MODEL = configValue('model', 'gemini-2.0-flash');
const DEFAULT_TIMEOUT_MS = Number(configValue('requestTimeoutMs', 45000));
const DEFAULT_RETRIES = Number(configValue('maxRetries', 3));

function configValue(key, fallback) {
  return config && config[key] !== undefined ? config[key] : fallback;
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
  const sourceHintPattern = /(来源|source|公开数据|财报|统计局|IDC|Gartner|\[估算\]|假设)/i;
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
1. **高信息密度 (硬要求)**：每页 PPT 必须有详尽的论述、深刻的见解和充分的文字展开。**绝对禁止只写几个标题或干瘪的单词**！每页至少包含 100-200 字的高质量文本论述。
2. **数据驱动且可追溯**：拒绝空洞，必须包含行业数据、占比、增长率、成本收益等量化指标。若无法确认真实来源，**禁止虚构精确统计**，必须明确标注为 \`[估算]\` 并写出估算假设（例如“按公开财报区间外推”）。
3. **结构化深度逻辑**：遵循 SCQA 框架，但每个环节必须**写透**。例如在说明“挑战”时，要详细指出底层阻力是什么、行业现状如何、带来了什么具体损失。
4. **组件内容饱满**：在使用任何组件（如 CompareTable, DataCard, ProcessStep 等）时，里面的文字描述（description, content）必须非常丰富，不要只是两三个字，要有一句完整且专业的解释。
5. **多页展开**：不要把所有内容挤在 3 页里！遇到大话题，必须拆分成至少 15-20 页以上的深度剖析。
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

第一行必须从 \`---\` 开始。不要输出 \`\`\`markdown 围栏。`;
}

// ────────────────────────────────────────────
// 4. 调用 Gemini API
// ────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('请设置环境变量 GEMINI_API_KEY，例如: export GEMINI_API_KEY="你的秘钥"');
  }

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const timeoutMs = isValidNumber(Number(process.env.GEMINI_TIMEOUT_MS), DEFAULT_TIMEOUT_MS);
  const maxRetries = Math.max(1, Math.floor(isValidNumber(Number(process.env.GEMINI_MAX_RETRIES), DEFAULT_RETRIES)));
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

  console.log(`🤖 正在调用 Gemini 大模型生成内容... (model=${model}, retries=${maxRetries})`);

  const isRetryableStatus = status => status === 408 || status === 429 || status >= 500;
  let data = null;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timer);

      if (!response.ok) {
        const errorText = await response.text();
        const err = new Error(`Gemini API 调用失败 (${response.status}): ${errorText}`);
        err.status = response.status;
        throw err;
      }

      data = await response.json();
      break;
    } catch (err) {
      clearTimeout(timer);
      const timeoutError = err.name === 'AbortError';
      const retryable = timeoutError || isRetryableStatus(err.status);
      lastError = err;

      if (attempt < maxRetries && retryable) {
        const waitMs = 1000 * attempt;
        console.warn(`⚠️  第 ${attempt} 次请求失败，${waitMs}ms 后重试: ${err.message}`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }

  if (!data) {
    throw lastError || new Error('Gemini API 返回为空');
  }

  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (!text) {
    throw new Error('Gemini API 未返回可用文本内容');
  }

  text = stripCodeFences(text);
  text = normalizeMarkdownIndentation(text);

  // ── 截断自动修复 ──
  // 检测是否被 token limit 截断（未闭合的 HTML 标签）
  const openTags = (text.match(/<[a-zA-Z][^/>]*>/g) || []).length;
  const closeTags = (text.match(/<\/[a-zA-Z]+>/g) || []).length;
  const selfCloseTags = (text.match(/<[^>]+\/>/g) || []).length;

  if (openTags - selfCloseTags > closeTags + 2) {
    console.warn('⚠️  检测到 AI 输出被截断（未闭合标签），正在自动修复...');
    // 从末尾向前找到最后一个完整的 slide 分隔符 ---
    const slides = text.split(/^---$/m);
    // 去掉被截断的最后一段（不完整的那页）
    while (slides.length > 2) {
      const lastSlide = slides[slides.length - 1];
      const lastOpen = (lastSlide.match(/<[a-zA-Z][^/>]*>/g) || []).length;
      const lastClose = (lastSlide.match(/<\/[a-zA-Z]+>/g) || []).length;
      const lastSelf = (lastSlide.match(/<[^>]+\/>/g) || []).length;
      if (lastOpen - lastSelf <= lastClose + 1) break; // 这页是完整的
      slides.pop(); // 丢弃不完整的页
      slides.pop(); // 丢弃它的 frontmatter
    }
    text = slides.join('---');

    // 追加结尾页
    text += `\n\n---\nlayout: custom\nclass: theme-dark-ending\n---\n\n<div class="flex flex-col items-center justify-center h-full text-white">\n<h2 class="text-4xl font-bold mb-4 tracking-widest">THANK YOU</h2>\n<div class="w-16 h-1 bg-white opacity-30 mb-6"></div>\n<p class="text-lg opacity-70">感谢观看</p>\n</div>`;
    console.log('✅ 截断修复完成，已保留完整页面并追加结尾页');
  }

  return text.trim();
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
  GEMINI_API_KEY    Google Gemini API Key (必填)
  GEMINI_MODEL      模型名 (可选，默认: ${DEFAULT_MODEL})
  GEMINI_TIMEOUT_MS 请求超时毫秒 (可选，默认: ${DEFAULT_TIMEOUT_MS})
  GEMINI_MAX_RETRIES 请求重试次数 (可选，默认: ${DEFAULT_RETRIES})
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

  // 扫描组件
  const components = scanComponents();
  console.log(`📋 已发现 ${components.length} 个可用组件: ${components.map(c => c.name).join(', ')}`);

  // 构造 prompt
  const systemPrompt = buildSystemPrompt(components);

  // 调用大模型
  const slidesContent = await callGemini(systemPrompt, userPrompt);

  // 质量校验
  if (!skipQa) {
    const qaResult = validateSlidesContent(slidesContent);
    qaResult.warnings.forEach(w => console.warn(`⚠️  质量提示: ${w}`));
    if (qaResult.errors.length) {
      throw new Error(`生成结果未通过质量校验:\n- ${qaResult.errors.join('\n- ')}`);
    }
    console.log('✅ 质量校验通过');
  } else {
    console.log('⏭️  已跳过质量校验。');
  }

  // 写入 slides.md
  const slidesPath = path.join(__dirname, 'slides.md');
  fs.writeFileSync(slidesPath, slidesContent + '\n', 'utf-8');
  const actualSlideCount = Math.floor((slidesContent.split(/^---$/m).length - 1) / 2) + 1;
  console.log(`✅ slides.md 已生成 (约 ${actualSlideCount} 页)`);

  // 导出
  if (!skipExport) {
    exportSlides(exportFormat);
  } else {
    console.log('⏭️  已跳过导出。运行 npm run dev 可预览效果。');
  }

  console.log('\n🎉 完成！');
}

main().catch(err => {
  console.error('❌ 运行出错:', err);
  process.exit(1);
});
