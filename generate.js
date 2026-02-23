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

  return `你是一位 **资深战略咨询顾问 (MBB 级别)** 兼 **顶级演示文稿设计师**。
你的任务是根据用户需求，输出一份 **深度、结构化、视觉专业** 的 Slidev 演示文稿。

## 🎯 核心原则
1. **数据驱动**：拒绝空洞，使用量化指标 (如: ⬇️90% 成本, ⬆️3.5x 效率)。若无数据，请根据行业常识合理模拟。
2. **结构化思维**：遵循 SCQA (现状-挑战-方案-价值) 逻辑流。
3. **视觉平衡**：每页内容不宜过多。标题 + 副标题 + (1-2个复杂组件 或 3个简单组件) + 底部结论。
4. **Slidev 规范**：所有 HTML/Vue 组件标签必须 **顶格书写**，不要缩进。

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
5. 适当使用 \`v-click\` 增强动态效果。

第一行必须从 \`---\` 开始。不要输出 \`\`\`markdown 围栏。`;
}

// ────────────────────────────────────────────
// 4. 调用 Gemini API
// ────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ 请设置环境变量 GEMINI_API_KEY');
    console.error('   用法: export GEMINI_API_KEY="你的秘钥"');
    process.exit(1);
  }

  // 尝试使用 Gemini 3 Flash Preview，通常 Flash 模型的免费额度会更高一些
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

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
      maxOutputTokens: 8192
    }
  };

  console.log('🤖 正在调用 Gemini 大模型生成内容...');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Gemini API 调用失败 (${response.status}):`, errorText);
    process.exit(1);
  }

  const data = await response.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // 清理可能的代码围栏
  text = text.replace(/^```markdown\s*\n?/i, '').replace(/\n?```\s*$/i, '');
  text = text.replace(/^```\s*\n?/, '').replace(/\n?```\s*$/, '');

  return text.trim();
}

// ────────────────────────────────────────────
// 5. 导出 PPT
// ────────────────────────────────────────────
function exportSlides(format) {
  const fmt = format || config.exportFormat || 'pdf';
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
    console.error('❌ 导出失败:', err.message);
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

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) {
      userPrompt = fs.readFileSync(args[i + 1], 'utf-8').trim();
      i++;
    } else if (args[i] === '--format' && args[i + 1]) {
      exportFormat = args[i + 1];
      i++;
    } else if (args[i] === '--no-export') {
      skipExport = true;
    } else if (args[i] === '--help') {
      console.log(`
PPT Agent 生成脚本
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

用法:
  node generate.js "你的需求描述"
  node generate.js --file requirements.txt
  node generate.js "需求" --format both
  node generate.js "需求" --no-export

参数:
  --file <path>     从文件读取需求
  --format <fmt>    导出格式: pdf | pptx | both (默认: ${config.exportFormat})
  --no-export       仅生成 slides.md，不自动导出
  --help            显示帮助

环境变量:
  GEMINI_API_KEY    Google Gemini API Key (必填)
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

  // 写入 slides.md
  const slidesPath = path.join(__dirname, 'slides.md');
  fs.writeFileSync(slidesPath, slidesContent + '\n', 'utf-8');
  console.log(`✅ slides.md 已生成 (${slidesContent.split('---').length - 1} 页)`);

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
