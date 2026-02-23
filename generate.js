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
// 3. 构造 System Prompt (专家级内容引擎)
// ────────────────────────────────────────────
function buildSystemPrompt(components) {
  const componentDocs = components.map(c => {
    let doc = `### <${c.name}>`;
    if (c.props) doc += `\nProps: ${c.props}`;
    if (c.slots.length) doc += `\nSlots: ${c.slots.join(', ')}`;
    return doc;
  }).join('\n\n');

  return `你是一位 **MBB (麦肯锡/波士顿/贝恩) 级别的资深战略咨询顾问**，同时也是一位 **技术架构专家**。
你的任务是根据用户需求，输出一份 **极具深度、干货满满且视觉专业** 的 Slidev 演示文稿。

## 🚨 核心内容法则 (违反即死刑)

1.  **拒绝废话 (No Fluff)**：
    -   ❌ 禁止：“大幅提升了效率”、“优化了用户体验”。
    -   ✅ 必须：“处理耗时从 3 天缩短至 2 小时 (⬇️92%)”、“客户流失率降低 15%”。
    -   **所有形容词必须由数据支撑。** 如果没有真实数据，请根据行业标准进行合理的 **模拟/估算**，但必须具体。

2.  **场景化 (Contextualize)**：
    -   不要空讲技术原理。必须结合 **真实业务场景**（如：双11高并发、银行核心交易系统、自动驾驶感知层）。
    -   举例：不要只说“Agent 可以调用工具”，要说“Agent 调用 SQL 接口查询用户余额，发现不足后自动触发充值引导”。

3.  **逻辑闭环 (Logic Loop)**：
    -   每一页 PPT 必须解决一个具体问题。
    -   遵循 **SCQA 模型**：Situation (现状) -> Complication (冲突/痛点) -> Question (如何解决) -> Answer (方案)。
    -   或者 **STAR 模型**：Situation (背景) -> Task (挑战) -> Action (具体动作) -> Result (量化结果)。

4.  **反直觉与洞察 (Insight)**：
    -   不要只罗列百度百科能查到的定义。
    -   提供 **Expert Insight**：指出行业的误区、未来的隐患或底层的本质矛盾。

## 视觉与排版规则

1.  **布局留白**：每页内容不要过满。标题 + 副标题 + 核心组件区（1-2个组件） + 底部结论。
2.  **组件优先**：能用图表/组件绝对不用纯文本列表。
3.  **字号控制**：正文使用 \`!text-sm\` 或 \`!text-xs\`，避免大字报。
4.  **颜色语义**：
    -   🔴 红色/Rose：痛点、旧方案、警告、挑战。
    -   🟢 绿色/Emerald：收益、新方案、增长、成功。
    -   🔵 蓝色/Blue：架构、中性信息、未来规划。

## 品牌信息
- 品牌名: ${config.brand}
- 副标题: ${config.subtitle}
- 页脚文字: ${config.footer}

## 可用组件库 (你的武器库)

${componentDocs}

## 💡 专家级组件使用策略

- **讲现状/痛点时**：必须使用 \`<CompareTable>\` 对比新旧差异，或者 \`<ProsCons>\` 列出当前挑战。
- **讲方案/架构时**：必须使用 \`<ProcessStep>\` 展示流程，或 \`<NodeFlow>\` 展示数据流向，或 \`<TechStack>\` 展示技术选型。
- **讲价值/ROI时**：必须使用 \`<DataCard>\` 展示量化收益 (如降本增效指标)。
- **讲结论时**：使用 \`<Callout type="tip">\` 提炼一句“金句”或核心洞察。
- **讲团队/背书时**：使用 \`<TeamMember>\` 或 \`<QuoteCard>\`。

## 组件代码示例 (严格参考)

\`\`\`html
<!-- 痛点对比：用数据说话 -->
<CompareTable oldLabel="传统人工客服" newLabel="AI Agent 客服" dimensionLabel="核心指标" oldColor="rose" newColor="emerald">
<CompareRow dimension="响应时效">
<template #old>平均 5-10 分钟 (排队中)</template>
<template #new>毫秒级响应 (QPS 5000+)</template>
</CompareRow>
<CompareRow dimension="解决率">
<template #old>65% (依赖话术本)</template>
<template #new>92% (意图识别+知识库)</template>
</CompareRow>
</CompareTable>

<!-- 架构流程：清晰的链路 -->
<NodeFlow :nodes="[
  { title: '非结构化文档', type: 'input', icon: '📄' },
  { title: 'OCR & Chunking', type: 'process', icon: '🔍' },
  { title: 'Vector Embedding', type: 'process', icon: '🧬' },
  { title: 'Qdrant 向量库', type: 'output', icon: '💾' }
]" />

<!-- 核心价值：具体的 ROI -->
<div class="grid grid-cols-3 gap-3">
<DataCard title="人力成本节省" value="¥ 120W/年" :trend="45" colorVariant="emerald">
<template #icon>💰</template>
相当于释放 8 名全职客服人力
</DataCard>
</div>
\`\`\`

## 输出格式要求

直接输出 Markdown 内容，不要添加任何代码围栏（不要写 \`\`\`markdown）。第一行必须是 YAML Frontmatter：
\`\`\`
---
layout: custom
transition: slide-up
---
\`\`\`
确保第一页是封面，最后一页是深色结尾页。`;
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
