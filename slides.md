---
layout: custom
transition: slide-up
---

<div class="h-full flex flex-col justify-center">
<div class="theme-badge inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 max-w-max">
🛡️ 2024 战略技术内参 · 深度版
</div>
<h1 class="!text-5xl !mb-4 leading-tight">
<span class="theme-gradient-text">AI Agent 深度解析</span><br/>
从底层原理到企业级架构实战
</h1>
<p class="!text-sm text-slate-500 max-w-2xl leading-relaxed !mb-8">
<b>核心目标：</b> 透视 Agent 如何重塑软件开发范式，<br/>
构建具备「自主决策」与「工程化落地」能力的智能体系统。
</p>
<div class="flex items-center gap-6 text-xs text-slate-400">
<div class="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
  <span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
  中金财富 · 数字化转型办公室
</div>
</div>
</div>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">范式演进 · EVOLUTION</p>
<h1 class="!mb-6">AI 能力演进的三大阶段</h1>

<div class="grid grid-cols-3 gap-4">
<FeatureItem title="1. 工具时代 (Tool)" color="slate">
<template #icon>🛠️</template>
<b>关键词：</b>被动执行。<br/>
如：Excel 宏、传统 RPA。需人工编写每一行逻辑，无法处理模糊性。
</FeatureItem>

<FeatureItem title="2. 协作时代 (Copilot)" color="blue">
<template #icon>🧑‍💻</template>
<b>关键词：</b>副驾驶。<br/>
如：GitHub Copilot。AI 提供建议，人做决策并执行，属于「人机循环」。
</FeatureItem>

<FeatureItem title="3. 智能体时代 (Agent)" color="emerald">
<template #icon>🤖</template>
<b>关键词：</b>自主闭环。<br/>
<b>Agent = LLM + Planning + Memory + Tools。</b> 具备自主设定目标并修正的能力。
</FeatureItem>
</div>

<div class="mt-6">
<Callout type="info">
<b>本质区别：</b>从「你教我怎么做 (How)」到「我帮你达成目标 (What)」。
</Callout>
</div>

---
layout: custom
---

<SectionTitle number="01" title="底层架构拆解" subtitle="深度解析智能体运作的四个核心组件" />

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">大脑：规划与推理 · PLANNING</p>
<h1 class="!mb-6">规划能力：让 AI 具备逻辑链条</h1>

<div class="grid grid-cols-2 gap-8">
<div>
  <p class="text-[11px] text-slate-600 mb-4">
    Agent 的核心是解决「幻觉」并确保执行路径正确。目前主流的三种推理模式：
  </p>
  <ul class="space-y-4">
    <li v-click class="flex gap-3">
      <div class="theme-number w-5 h-5 flex-shrink-0 text-[10px]">1</div>
      <div>
        <b class="text-xs">CoT (思维链)</b>
        <p class="text-[10px] text-slate-400">Step-by-step 线性推理，解决复杂逻辑问题的基石。</p>
      </div>
    </li>
    <li v-click class="flex gap-3">
      <div class="theme-number w-5 h-5 flex-shrink-0 text-[10px]">2</div>
      <div>
        <b class="text-xs">ToT (思维树)</b>
        <p class="text-[10px] text-slate-400">多路径探索+剪枝，像下围棋一样寻找最优解。</p>
      </div>
    </li>
    <li v-click class="flex gap-3">
      <div class="theme-number w-5 h-5 flex-shrink-0 text-[10px]">3</div>
      <div>
        <b class="text-xs">ReAct (推理与行动)</b>
        <p class="text-[10px] text-slate-400">将内心独白与外部操作交织，实现闭环反馈。</p>
      </div>
    </li>
  </ul>
</div>

<div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
  <p class="text-[10px] font-bold text-blue-600 mb-2 uppercase tracking-wider">ReAct 运行实例：</p>
  <div class="font-mono text-[9px] space-y-2">
    <div class="text-slate-500">[User] 查询中金财富最近三年的净利润趋势。</div>
    <div class="text-blue-500">Thought: 数据库无实时数据，需调用搜索引擎。</div>
    <div class="text-emerald-500">Action: Search(中金财富 2021-2023 年报)</div>
    <div class="text-amber-600">Observation: 2021(¥xx亿), 2022(¥xx亿)...</div>
    <div class="text-blue-500">Thought: 数据已获取，计算年复合增长率。</div>
    <div class="text-emerald-500">Action: Python_Runner(CAGR_calc.py)</div>
  </div>
</div>
</div>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">心脏：记忆系统 · MEMORY</p>
<h1 class="!mb-6">记忆系统：解决「转头就忘」的问题</h1>

<div class="grid grid-cols-2 gap-6">
<div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
  <h4 class="text-xs font-bold text-blue-800 mb-2">短期记忆 (Context)</h4>
  <p class="text-[10px] text-slate-600 leading-relaxed">
    基于 Transformer 的 Attention 机制。记录当前对话的上下文。
    <br/><br/>
    <b>限制：</b>受限于 Token 窗口（如 128k），一旦超限会导致逻辑崩塌。
  </p>
</div>
<div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
  <h4 class="text-xs font-bold text-emerald-800 mb-2">长期记忆 (RAG)</h4>
  <p class="text-[10px] text-slate-600 leading-relaxed">
    基于向量数据库 (Vector DB)。
    <br/><br/>
    <b>原理：</b>将企业私有文档切片、向量化并检索。让 Agent 具备「查字典」的能力。
  </p>
</div>
</div>

<div class="mt-6">
<NodeFlow :nodes="[
  { title: '用户 Query', type: 'input', icon: '❓' },
  { title: '语义检索', type: 'process', icon: '🔎' },
  { title: 'Top-K 召回', type: 'process', icon: '📄' },
  { title: '增强生成', type: 'output', icon: '✨' }
]" />
</div>

---
layout: custom
---

<SectionTitle number="02" title="多智能体系统 (MAS)" subtitle="从「单兵作战」到「组织化协作」" />

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">群体智能 · COLLABORATION</p>
<h1 class="!mb-6">Multi-Agent：数字工厂的诞生</h1>

<div class="grid grid-cols-2 gap-4">
<div class="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
  <div>
    <h4 class="text-sm font-bold mb-2">为什么需要多智能体？</h4>
    <p class="text-[10px] text-slate-500 leading-relaxed">
      单模型处理复杂长链路任务时，准确率会随步数增加呈指数级下降。
      <br/><br/>
      <b>解决方案：</b>让 Agent 具备角色（Role-play），通过 SOP (标准作业程序) 进行分工。
    </p>
  </div>
  <Callout type="tip" class="!my-0">
    核心思想：<b>复杂问题解构为专业 Agent 之间的对话。</b>
  </Callout>
</div>

<div class="space-y-3">
  <div v-click class="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
    <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">PM</div>
    <div class="text-[10px]"><b>Manager Agent：</b>负责任务分配与质量门禁</div>
  </div>
  <div v-click class="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm ml-4">
    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">C</div>
    <div class="text-[10px]"><b>Coder Agent：</b>负责代码实现与本地调试</div>
  </div>
  <div v-click class="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-100 shadow-sm ml-8">
    <div class="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">V</div>
    <div class="text-[10px]"><b>Reviewer Agent：</b>负责代码审查与安全扫描</div>
  </div>
</div>
</div>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">主流框架 · FRAMEWORKS</p>
<h1 class="!mb-6">开源生态：谁在引领 Agent 革命？</h1>

<div class="grid grid-cols-2 gap-6">
<div class="space-y-4">
  <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
    <b class="text-xs block mb-1">LangGraph (LangChain 家族)</b>
    <p class="text-[9px] text-slate-500">主打「有状态的多步迭代」，支持循环逻辑。适合构建极其复杂的工业级工作流。</p>
  </div>
  <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
    <b class="text-xs block mb-1">CrewAI</b>
    <p class="text-[9px] text-slate-500">主打「角色驱动」，让 Agent 像团队成员一样协作。代码极简，上手快。</p>
  </div>
</div>
<div class="space-y-4">
  <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
    <b class="text-xs block mb-1">MetaGPT</b>
    <p class="text-[9px] text-slate-500">主打「软件工程化」，将 SOP 注入 Agent。适合一次性生成整个软件项目。</p>
  </div>
  <div class="p-3 bg-slate-50 rounded-lg border border-slate-200">
    <b class="text-xs block mb-1">AutoGen (Microsoft)</b>
    <p class="text-[9px] text-slate-500">主打「可对话性」，让 Agent 能够互相讨论、互相纠错。</p>
  </div>
</div>
</div>

---
layout: custom
---

<SectionTitle number="03" title="落地实战与 ROI" subtitle="从技术玩具到生产力利器的关键一步" />

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">实战场景：金融审计 · CASE STUDY</p>
<h1 class="!mb-6">Agent 如何重塑企业财务审计流程？</h1>

<ProcessStep :steps="[
  { title: '数据抽取', desc: 'Agent 自动接入 ERP 系统，抓取 5000+ 条流水', status: 'done', icon: '📥' },
  { title: '合规校验', desc: '根据最新会计准则，逐条检索异常科目', status: 'active', icon: '🔍' },
  { title: '风险评级', desc: '多因子评估风险等级，标记高危交易', status: 'pending', icon: '⚠️' },
  { title: '报告生成', desc: '自动生成 50 页审计初稿并附带底稿链接', status: 'pending', icon: '📄' }
]" />

<div class="mt-8 grid grid-cols-3 gap-3">
<DataCard title="效率增幅" value="18 倍" :trend="85" colorVariant="emerald">
<template #icon>📈</template>
处理 1 万条数据从 2 天缩短至 1.5 小时。
</DataCard>
<DataCard title="覆盖广度" value="100%" :trend="50" colorVariant="blue">
<template #icon>🎯</template>
从人工「抽样检查」进化为「全量自动化扫描」。
</DataCard>
<DataCard title="单位成本" value="¥ 0.2 /单" :trend="-90" colorVariant="slate">
<template #icon>💰</template>
Token 费用远低于专业审计员的人工时费。
</DataCard>
</div>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">行业图谱 · INDUSTRY LANDSCAPE</p>
<h1 class="!mb-6">全行业 Agent 应用机会图谱</h1>

<div class="grid grid-cols-3 gap-3">
<div class="p-3 bg-red-50 rounded-xl border border-red-100">
  <b class="text-[11px] text-red-800 block mb-2 font-bold uppercase">🏦 金融与风控</b>
  <p class="text-[9px] text-red-600/80 leading-relaxed">
    • 智能投研：Agent 自动聚合财报<br/>
    • 欺诈识别：实时分析异常链路<br/>
    • 自动化合规：准则自动对标
  </p>
</div>
<div class="p-3 bg-blue-50 rounded-xl border border-blue-100">
  <b class="text-[11px] text-blue-800 block mb-2 font-bold uppercase">💻 IT 与开发</b>
  <p class="text-[9px] text-blue-600/80 leading-relaxed">
    • 自主修复：Agent 监控日志并修补<br/>
    • 自动化测试：模拟真实用户点击<br/>
    • 遗留代码迁移：Cobol 转 Java
  </p>
</div>
<div class="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
  <b class="text-[11px] text-emerald-800 block mb-2 font-bold uppercase">🛒 零售与营销</b>
  <p class="text-[9px] text-emerald-600/80 leading-relaxed">
    • 虚拟导购：基于用户画像导流<br/>
    • 库存优化：Agent 预测需求并补货<br/>
    • 自动化宣发：生成多模态素材
  </p>
</div>
</div>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">方法论：落地路径 · IMPLEMENTATION</p>
<h1 class="!mb-6">企业级 Agent 平台落地路线图</h1>

<div class="space-y-4">
<div v-click class="flex gap-4 items-center">
  <div class="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-bold">P1</div>
  <div class="flex-1 border-b border-slate-100 pb-2">
    <b class="text-xs text-slate-800">基础设施建设：</b> 搭建企业级大模型网关、向量数据库及工具 API 市场。
  </div>
</div>
<div v-click class="flex gap-4 items-center">
  <div class="w-10 h-10 bg-red-500 text-white rounded-lg flex items-center justify-center font-bold">P2</div>
  <div class="flex-1 border-b border-slate-100 pb-2">
    <b class="text-xs text-slate-800">高价值场景 Pilot：</b> 选择「重复性高、容错率适中、数据丰富」的场景进行试点（如 IT 运维）。
  </div>
</div>
<div v-click class="flex gap-4 items-center">
  <div class="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">P3</div>
  <div class="flex-1 border-b border-slate-100 pb-2">
    <b class="text-xs text-slate-800">多智能体组织化：</b> 实现跨部门 Agent 协作，构建企业内部的「数字员工矩阵」。
  </div>
</div>
</div>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">冷静观察 · CHALLENGES</p>
<h1 class="!mb-6">避坑指南：Agent 落地的三大红线</h1>

<ProsCons 
  prosTitle="你应该关注什么？"
  consTitle="你应该警惕什么？"
  :pros="['Human-in-the-loop：关键环节必须有人工确认。', '可追踪性：记录 Agent 每一环节的推理日志。', '工具隔离：必须在沙箱环境中运行执行脚本。']" 
  :cons="['盲目追求全自动：目前 Agent 步数越多，失败率越高。', 'Token 恐怖主义：由于循环导致的 Token 费用暴涨。', '权限失控：防止 Agent 误删生产环境数据库。']" 
/>

---
layout: custom
---

<p class="text-xs text-slate-500 mb-3">总结与展望 · CONCLUSION</p>
<h1 class="!mb-6">总结：智能体是 AI 的「终极形态」</h1>

<div class="grid grid-cols-2 gap-8">
<div>
  <p class="text-[11px] text-slate-500 leading-relaxed mb-6">
    如果说 2023 年是模型的竞赛，那么 2024 年就是 **Agent 的应用元年**。
  </p>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-red-500"></div>
      <p class="text-xs font-bold">从「聊天」到「干活」</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-blue-500"></div>
      <p class="text-xs font-bold">从「单兵」到「军团」</p>
    </div>
    <div class="flex items-center gap-3">
      <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
      <p class="text-xs font-bold">从「工具」到「员工」</p>
    </div>
  </div>
</div>
<div class="flex items-center justify-center">
  <div class="relative">
    <div class="w-32 h-32 rounded-full bg-red-500/10 flex items-center justify-center animate-ping absolute"></div>
    <div class="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center relative z-10 shadow-xl">
      <span class="text-white font-bold text-center leading-tight">THE<br/>FUTURE<br/>IS NOW</span>
    </div>
  </div>
</div>
</div>

---
layout: custom
class: theme-dark-ending
---

<div class="h-full flex flex-col justify-center items-center text-white text-center px-10">
  <div v-motion :initial="{opacity:0, scale:0.8}" :enter="{opacity:1, scale:1}">
    <h1 class="!text-6xl !mb-4">NEXT IS AGENT</h1>
    <p class="text-white/60 tracking-[0.4em] uppercase text-xs mb-12">智能体是数字化转型的最后一块拼图</p>
  </div>
  
  <div class="grid grid-cols-4 gap-8 mb-12">
    <div class="text-center">
      <div class="text-xl font-bold mb-1">200+</div>
      <div class="text-[9px] text-white/40 uppercase">可用工具 API</div>
    </div>
    <div class="text-center border-l border-white/10">
      <div class="text-xl font-bold mb-1">92%</div>
      <div class="text-[9px] text-white/40 uppercase">意图识别准确率</div>
    </div>
    <div class="text-center border-l border-white/10">
      <div class="text-xl font-bold mb-1">¥ 0.05</div>
      <div class="text-[9px] text-white/40 uppercase">平均单次任务成本</div>
    </div>
    <div class="text-center border-l border-white/10">
      <div class="text-xl font-bold mb-1">24/7</div>
      <div class="text-[9px] text-white/40 uppercase">无间断自动化执行</div>
    </div>
  </div>

  <div class="flex items-center gap-6 text-[10px] text-white/30 border-t border-white/5 pt-8 w-full justify-center">
    <span>中金财富 · 数字化转型系列课</span>
    <span>版权所有 © 2024</span>
  </div>
</div>
