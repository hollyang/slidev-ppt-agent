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

      // 提取 props
      const propsMatch = content.match(/defineProps\(\{([\s\S]*?)\}\)/);
      let props = '';
      if (propsMatch) {
        props = propsMatch[1]
          .split('\n')
          .map(l => l.trim())
          .filter(l => l && !l.startsWith('//'))
          .join(' ');
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
// 3. 构造 System Prompt
// ────────────────────────────────────────────
function buildSystemPrompt(components) {
  const componentDocs = components.map(c => {
    let doc = `### <${c.name}>`;
    if (c.props) doc += `\nProps: ${c.props}`;
    if (c.slots.length) doc += `\nSlots: ${c.slots.join(', ')}`;
    return doc;
  }).join('\n\n');

  return `你是一个资深的演示文稿设计师。你需要根据用户的需求，生成 **Slidev 格式的 Markdown** 内容。

## 核心规则（必须严格遵守）

1. **每一页用 \`---\` 分隔**，第一行必须是 YAML frontmatter：
\`\`\`
---
layout: custom
transition: slide-left
---
\`\`\`

2. **所有 HTML / Vue 组件标签必须顶格书写**（不能有前导空格或缩进），否则 Slidev 解析器会把它们当成纯文本。

3. **内容量控制（最关键）**：每页可视区域大约 480px 高度。
   - 标题 + 副标题约占 60px
   - 每个组件卡片约占 90-130px
   - 因此每页最多 3 个组件卡片 + 1 个底部提示条
   - 如果内容多就拆成多页，**绝不能让一页内容溢出**

4. **文字精炼但不空洞**：每个卡片的描述文字 15-30 个中文字。要有具体数据和细节。

5. **字号覆盖**：使用 \`!text-xs\`, \`!text-sm\`, \`!text-[11px]\` 等 UnoCSS 优先级标记控制字号。
   - 标题使用默认 h1（已被 layout 限制为 1.4rem）
   - 副标题用 \`<p class="text-xs text-slate-500 mb-3">...\`
   - 卡片内描述用 \`!text-[11px]\`

6. **封面页**可以使用 \`<div class="h-full flex flex-col justify-center">\` 来垂直居中。其他内容页不要居中，让内容从顶部流动。

7. **最后一页**做深色风格结尾页，使用 \`theme-dark-ending\` CSS 类。

8. **v-click 动画**：可以在组件标签上加 \`v-click\` 来实现逐步出现效果。

9. **transition 动画**：在 frontmatter 中使用 \`transition: fade-out | slide-up | slide-left | view-transition\`

10. **页数要求**：一份完整的宣讲至少 10-15 页。要有：封面、议程、现状分析、方案介绍、对比分析、实施计划、风险保障、预期收益、案例参考、结尾页。

11. **信息密度**：每页要充分利用空间，避免大片空白。使用 grid 布局填满页面。

## 品牌色工具类（必须使用，不要硬编码色值）
- \`theme-text\` — 品牌主色文字
- \`theme-badge\` — 品牌色标签（背景+文字+边框一体）
- \`theme-gradient-text\` — 品牌色渐变文字
- \`theme-number\` — 品牌色序号圆圈
- \`theme-callout\` — 品牌色提示框
- \`theme-bg-light\` — 品牌色浅背景
- \`theme-dot\` — 品牌色圆点
- \`theme-dark-ending\` — 深色结尾页背景渐变

## 品牌信息
- 品牌名: ${config.brand}
- 副标题: ${config.subtitle}
- 页脚文字: ${config.footer}

## 可用组件库

以下是你可以直接调用的 Vue 组件：

${componentDocs}

## 组件使用示例

\`\`\`html
<!-- DataCard: 数据指标卡 -->
<div class="grid grid-cols-3 gap-3">
<DataCard title="用户量" value="120万" :trend="18" colorVariant="blue">
<template #icon>👥</template>
极简描述文字，15-30 字，含具体数据。
</DataCard>
</div>

<!-- FeatureItem: 特性条目，适合 2×3 grid -->
<div class="grid grid-cols-3 gap-2">
<FeatureItem title="功能名称" color="blue">
<template #icon>📥</template>
具体功能描述，包含技术细节。
</FeatureItem>
</div>

<!-- CompareTable + CompareRow: 对比表格 -->
<CompareTable oldLabel="旧方案" newLabel="新方案" dimensionLabel="维度" oldColor="red" newColor="emerald">
<CompareRow dimension="维度1">
<template #old>旧方案描述</template>
<template #new>新方案描述</template>
</CompareRow>
</CompareTable>

<!-- StatBar: 进度条，适合资产盘点 -->
<StatBar label="任务名称" :value="85" color="red">辅助说明文字</StatBar>

<!-- TimelineCard: 时间线节点 -->
<TimelineCard date="2024.01" title="里程碑事件">
极简描述文字。
</TimelineCard>

<!-- QuoteCard: 引用评价 -->
<QuoteCard author="张三" role="CEO">
一段精炼的引用评价，包含具体数据支撑。
</QuoteCard>
\`\`\`

## 输出格式

直接输出 Markdown 内容，不要添加任何代码围栏（不要写 \`\`\`markdown）。第一行必须是 \`---\`。`;
}

// ────────────────────────────────────────────
// 4. 调用 Gemini API
// ────────────────────────────────────────────
async function callGemini(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ 请设置环境变量 GEMINI_API_KEY');
    console.error('   export GEMINI_API_KEY="your-api-key-here"');
    process.exit(1);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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
      temperature: 0.7,
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
