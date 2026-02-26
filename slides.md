---
layout: custom
transition: fade-out
---

<div class="flex flex-col items-center justify-center h-full text-center">
<div class="theme-badge mb-4">AI Paper Weekly</div>
<h1 class="text-5xl font-black mb-5 theme-gradient-text tracking-tight">
AI 新论文周报（最近一周）
</h1>
<p class="text-lg text-slate-500 max-w-3xl leading-relaxed">
时间窗：2026-02-18 至 2026-02-25（按公开页面抓取）<br>
覆盖方向：多模态、Agent、推理增强、训练/推理效率
</p>
<div class="mt-10 grid grid-cols-2 gap-4 text-left">
<div class="px-4 py-2 border-l-4 theme-border bg-white/70">
<div class="text-sm font-bold">用途</div>
<div class="text-xs text-slate-500">本周技术雷达 + 立项输入</div>
</div>
<div class="px-4 py-2 border-l-4 theme-border bg-white/70">
<div class="text-sm font-bold">更新日期</div>
<div class="text-xs text-slate-500">2026-02-25</div>
</div>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="01" title="口径与方法" subtitle="Scope & Method" />

<div class="grid grid-cols-2 gap-6 mt-6">
<div class="space-y-3 text-sm leading-relaxed">
<Callout type="info" title="统计口径">
样本窗口固定为 <b>2026-02-18 ~ 2026-02-25</b>；以公开可检索页面中标注的 <b>Submitted on</b> 日期为准。
</Callout>
<Callout type="success" title="主数据源">
1) arXiv 各子域 recent 列表（cs.AI/cs.CL/cs.LG/cs.CV）<br>
2) arXiv 可访问的 abs 页面原文摘要
</Callout>
<Callout type="warning" title="说明">
部分论文页面受抓取通道限制，仅获取到元数据或二级镜像摘要；此类条目已在文中标注“待复核”。
</Callout>
</div>

<div class="space-y-4">
<ProcessStep
:steps="[
{ title: '收集', desc: '锁定一周时间窗并拉取 recent 列表', status: 'done', icon: 'ph:database' },
{ title: '筛选', desc: '按多模态 / Agent / 推理 / 效率四类聚合', status: 'done', icon: 'ph:funnel' },
{ title: '深读', desc: '优先解析可访问摘要并抽取关键指标', status: 'active', icon: 'ph:book-open' },
{ title: '行动', desc: '转化为下周跟踪与实验清单', status: 'pending', icon: 'ph:rocket-launch' }
]"
/>

<div class="theme-callout text-xs">
<b>可复用输出：</b>方向排序、代表论文卡片、基线对比、落地建议、风险清单。
</div>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="02" title="本周观察结论" subtitle="Weekly Takeaways" />

<div class="grid grid-cols-3 gap-4 mt-6">
<DataCard title="效率主线" value="显著加速" :trend="4.56" colorVariant="blue">
<template #icon><div class="i-ph-gauge-fill" /></template>
CHESS 在长上下文推理中报告最高 4.56x 吞吐增益，并强调系统协同优化（来源：arXiv:2602.20732 摘要）。
</DataCard>

<DataCard title="可解释监控" value="35 points" :trend="5.0" colorVariant="emerald">
<template #icon><div class="i-ph-brain-fill" /></template>
CST 在 cue-based monitor accuracy 上提升 35 points（来源：arXiv:2602.20710 摘要）。
</DataCard>

<DataCard title="Agent安全" value="攻防并进" :trend="50.0" colorVariant="rose">
<template #icon><div class="i-ph-shield-check-fill" /></template>
ICON 报告攻击成功率降至 0.4%，并给出超过 50% 任务效用提升（来源：arXiv:2602.20708 摘要）。
</DataCard>
</div>

<div class="mt-6 text-sm leading-relaxed">
<v-clicks>
<ul>
<li><b>多模态方向</b>从“端到端堆数据”转向“低数据 + 强策略”：NoRD 在无推理标注前提下仍维持竞争力。</li>
<li><b>Agent方向</b>进入“能力与可控性并行”阶段：一边推进自治研究 Agent（Aletheia, arXiv:2602.21201），一边补齐注入攻击防线（ICON）。</li>
<li><b>推理方向</b>开始关注“可解释可信度”而非只看最终正确率：CST 直接优化 CoT faithful 性。</li>
<li><b>效率方向</b>从算法论文走向系统化工程：KV 缓存、批选择、历史难样本回放成为核心抓手。</li>
</ul>
</v-clicks>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="03" title="深读一：NoRD（多模态 + 数据效率）" subtitle="arXiv:2602.21172, submitted 2026-02-24" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="space-y-3 text-sm leading-relaxed">
<p>
NoRD 面向自动驾驶 VLA（Vision-Language-Action）建模，核心主张是：不依赖密集 reasoning annotation，也能保持端到端性能竞争力。
</p>
<Callout type="info" title="关键结果（摘要原文）">
使用 <b>&lt;60%</b> 训练数据、<b>3x 更少 token</b>，在 Waymo / NAVSIM 报告 competitive performance（来源：arXiv:2602.21172 摘要）。
</Callout>
<Callout type="success" title="方法要点">
在 reasoning-free 小数据设置下，指出传统 GRPO 易受 difficulty bias 影响，改用 Dr.GRPO 缓解高方差样本惩罚。
</Callout>
</div>

<div>
<CompareTable oldLabel="传统 VLA 训练" newLabel="NoRD 路线" dimensionLabel="对比维度">
<CompareRow dimension="监督需求">
<template #old>依赖大规模数据 + 密集 reasoning 标注</template>
<template #new>无需 reasoning 标注，降低数据门槛</template>
</CompareRow>
<CompareRow dimension="训练成本">
<template #old>token 消耗高，迭代慢</template>
<template #new>3x token 压缩（来源：arXiv:2602.21172 摘要）</template>
</CompareRow>
<CompareRow dimension="部署价值">
<template #old>性能可观但成本重</template>
<template #new>更利于资源受限场景快速试错</template>
</CompareRow>
</CompareTable>

<div class="theme-callout text-xs mt-3">
<b>落地判断：</b>适合“数据采集贵、标注慢”的车端或工业端多模态策略学习。
</div>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="04" title="深读二：CHESS（长上下文推理效率）" subtitle="arXiv:2602.20732, submitted 2026-02-24" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="space-y-3 text-sm leading-relaxed">
<p>
CHESS 聚焦长上下文推理瓶颈，认为关键不在“继续提模型参数”，而在 KV cache 选择策略与系统开销协同。
</p>
<Callout type="success" title="关键结果（摘要原文）">
在仅用 <b>1%</b> KV cache 条件下，报告超过 Full-KV 质量，并实现最高 <b>4.56x</b> 吞吐（来源：arXiv:2602.20732 摘要）。
</Callout>
<Callout type="info" title="工程意义">
强调 coarse-grained 选择减少数据搬移，把“理论稀疏性”转成“真实 wall-clock 加速”。
</Callout>
</div>

<div class="space-y-3">
<TimelineCard date="问题" title="长上下文下 KV 成本主导">
传统 pruning 忽略 step-wise relevance，且访存不规则，导致质量和速度两头损失。
</TimelineCard>
<TimelineCard date="方案" title="算法-系统协同设计">
层级语义选择 + 上下文重构，兼顾推理连贯性与执行效率。
</TimelineCard>
<TimelineCard date="价值" title="低延迟稳定推理">
适用于检索增强、长文档问答、代码审计等高上下文任务。
</TimelineCard>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="05" title="深读三：CST（推理可信度）" subtitle="arXiv:2602.20710, submitted 2026-02-24" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="space-y-3 text-sm leading-relaxed">
<p>
CST（Counterfactual Simulation Training）针对 CoT 可解释性失真问题，不只优化“答对”，而是优化“推理链是否真参与决策”。
</p>
<Callout type="warning" title="关键结果（摘要原文）">
在最高 235B 参数模型实验中：cue-based monitor accuracy 提升 <b>35 points</b>，generic counterfactual simulatability 提升 <b>2 points</b>（来源：arXiv:2602.20710 摘要）。
</Callout>
<Callout type="success" title="效率信号">
“先重写不忠实 CoT 再训练”相比纯 RL 报告 <b>5x</b> 效率提升（来源：arXiv:2602.20710 摘要）。
</Callout>
</div>

<div>
<ProsCons
prosTitle="可直接收益"
consTitle="已知边界"
:pros="[
'把 CoT 从“展示文本”转为“可验证行为信号”，利于审计与风控上线。',
'可用于识别迎合型回答、奖励黑客等隐蔽问题。',
'对大模型增益更明显，适配后训练优化链路。'
]"
:cons="[
'对 dissuading cues 的泛化仍弱，鲁棒性并非一次到位。',
'需要构造反事实样本与模拟器，前期数据工程成本不低。',
'faithfulness 指标提升不等价于所有业务指标同步提升。'
]"
/>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="06" title="深读四：ICON（Agent 安全）" subtitle="arXiv:2602.20708, submitted 2026-02-24" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="space-y-3 text-sm leading-relaxed">
<p>
ICON 针对 Indirect Prompt Injection（IPI）攻击，反对“简单拒绝一切”的防守策略，主张在推理时进行定点校正，兼顾可用性。
</p>
<Callout type="success" title="关键结果（摘要原文）">
多骨干评估中报告 <b>0.4% ASR</b>，并获得 <b>&gt;50%</b> task utility gain；同时宣称具备 OOD 泛化与多模态 Agent 扩展性（来源：arXiv:2602.20708 摘要）。
</Callout>
<Callout type="info" title="方法结构">
Latent Space Trace Prober 先检测异常聚焦，再由 Mitigating Rectifier 进行注意力路径修正。
</Callout>
</div>

<div class="space-y-3">
<FeatureItem title="为什么重要" color="amber">
<template #icon><div class="i-ph-warning-octagon" /></template>
企业 Agent 一旦接入检索、邮件、工单系统，IPI 已是高概率风险面。
</FeatureItem>
<FeatureItem title="对我们的启示" color="blue">
<template #icon><div class="i-ph-cpu" /></template>
安全策略要从“拒绝优先”升级到“纠偏优先”，否则流程连续性会显著下降。
</FeatureItem>
<FeatureItem title="上线建议" color="emerald">
<template #icon><div class="i-ph-shield-check" /></template>
优先部署在高权限工具链路：外部网页检索、自动执行脚本、邮件发送等。
</FeatureItem>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="07" title="深读五：Buffer Matters（训练效率）" subtitle="arXiv:2602.20722, submitted 2026-02-24" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="space-y-3 text-sm leading-relaxed">
<p>
Buffer Matters 题目即强调“Buffer Matters”，并指向用 off-policy 思路增强 LLM reasoning 的训练效率上限（来源：arXiv:2602.20722 标题与 cs.AI recent 列表）。
</p>
<Callout type="warning" title="可得信息边界">
当前抓取通道未稳定返回该条目 abs 正文；本页先基于 arXiv 标题与时间窗做方向判断，关键数值待后续复核补录。
</Callout>
<Callout type="info" title="技术含义">
该方向与我们现有训练痛点（样本复用率低、难样本学习断层）高度匹配，值得在下周做 PoC。
</Callout>
</div>

<div class="space-y-3">
<StatBar label="训练时长缩短潜力" :value="20" color="emerald">[估算] 需以同算力同数据的 A/B 训练复核</StatBar>
<StatBar label="难样本覆盖提升潜力" :value="30" color="blue">[估算] 依赖历史轨迹质量与回放策略</StatBar>
<StatBar label="工程改造成本" :value="60" color="purple">[估算] 涉及 trainer 与 replay 数据管道改造</StatBar>
<div class="theme-callout text-xs">
<b>适配场景：</b>有历史推理轨迹沉淀、可定义 verifiable reward 的后训练体系。
</div>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="08" title="Agent 方向补充：Aletheia" subtitle="arXiv:2602.21201, submitted 2026-02-24" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div class="space-y-3 text-sm leading-relaxed">
<p>
Aletheia 聚焦“自主 Agent 做定理证明研究”，强调通过训练与部署闭环推进 Open Deep Research（来源：arXiv:2602.21201 标题与 cs.AI recent 列表）。
</p>
<Callout type="warning" title="可得信息边界">
本轮抓取中该条目的 arXiv abs 正文未稳定返回；本页仅保留一手来源可确认的信息，不再使用聚合站转引数字。
</Callout>
<Callout type="info" title="方法价值">
强调“研究流程自动化 + 可复盘”，对高门槛知识任务的 Agent 评测体系有方法论价值。
</Callout>
</div>

<div>
<QuoteCard author="Aletheia Paper" role="arXiv 2602.21201">
在企业落地里，这类工作最可复用的是“研究过程日志化与可复盘评估”，而不是单一榜单分数。
</QuoteCard>
<div class="theme-callout text-xs mt-3">
<b>备注：</b>后续待补：直接抓取 arXiv 摘要与正文后，补齐定量指标和对比基线。
</div>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="09" title="横向对比：我们该优先跟什么" subtitle="Priority Matrix" />

<div class="mt-4">
<CompareTable oldLabel="研究亮点" newLabel="落地优先级" dimensionLabel="论文">
<CompareRow dimension="NoRD (2602.21172)">
<template #old>低数据 + 无推理标注 + 自动驾驶 VLA</template>
<template #new>P1：适合低标注预算的多模态策略任务</template>
</CompareRow>
<CompareRow dimension="CHESS (2602.20732)">
<template #old>1% KV + 4.56x 吞吐（来源：arXiv:2602.20732 摘要）</template>
<template #new>P0：可直接进入长上下文服务压测</template>
</CompareRow>
<CompareRow dimension="CST (2602.20710)">
<template #old>CoT faithful 性显著提升（35pt / 5x，来源：arXiv:2602.20710 摘要）</template>
<template #new>P1：适合高风险问答审计链路</template>
</CompareRow>
<CompareRow dimension="ICON (2602.20708)">
<template #old>0.4% ASR + >50% utility gain（来源：arXiv:2602.20708 摘要）</template>
<template #new>P0：Agent 安全必跟，优先防 IPI</template>
</CompareRow>
<CompareRow dimension="Buffer Matters (2602.20722)">
<template #old>off-policy RLVR（来源：arXiv:2602.20722 标题）</template>
<template #new>P1：有历史轨迹的后训练团队优先</template>
</CompareRow>
</CompareTable>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="10" title="下周执行清单" subtitle="Action Plan for 2026-02-26 ~ 2026-03-04" />

<div class="grid grid-cols-2 gap-6 mt-5">
<div>
<TechStack
title="建议实验栈"
:items="[
{ name: 'Long-Context Serving', icon: 'i-ph-database' },
{ name: 'KV Cache Profiler', icon: 'i-ph-chart-line' },
{ name: 'RLVR Trainer', icon: 'i-ph-brain' },
{ name: 'Agent Guardrail', icon: 'i-ph-shield-check' },
{ name: 'Trace Logger', icon: 'i-ph-file-text' },
{ name: 'Prompt Risk Scanner', icon: 'i-ph-warning' },
{ name: 'Eval Harness', icon: 'i-ph-flask' },
{ name: 'A/B Pipeline', icon: 'i-ph-git-branch' }
]"
/>
</div>

<div class="space-y-3 text-sm leading-relaxed">
<Callout type="success" title="P0（本周必须完成）">
1) CHESS 类思路做一次 128k+ 长上下文压测；<br>
2) ICON 思路接入 IPI 攻防集，验证“安全-可用性”平衡。
</Callout>
<Callout type="info" title="P1（并行推进）">
1) 用 CST 思路构建反事实监控集；<br>
2) 在现有 GRPO 线上分支试 off-policy 式难样本回放。
</Callout>
<Callout type="warning" title="评估口径">
统一记录：质量、时延、token 成本、安全攻击成功率、任务完成率五个指标，避免单指标优化。
</Callout>
</div>
</div>

---
layout: custom
transition: fade-out
---

<SectionTitle number="11" title="来源索引" subtitle="Primary Sources & Metadata Pages" />

<div class="grid grid-cols-2 gap-4 text-xs leading-relaxed mt-3">
<div class="space-y-1">
<p><b>时间窗入口</b></p>
<p>1) https://arxiv.org/list/cs.AI/recent</p>
<p>2) https://arxiv.org/list/cs.CL/recent</p>
<p>3) https://arxiv.org/list/cs.LG/recent</p>
<p>4) https://arxiv.org/list/cs.CV/recent</p>
</div>
<div class="space-y-1">
<p><b>本报告主引用</b></p>
<p>5) NoRD: https://arxiv.org/abs/2602.21172</p>
<p>6) CHESS: https://arxiv.org/abs/2602.20732</p>
<p>7) CST: https://arxiv.org/abs/2602.20710</p>
<p>8) ICON: https://arxiv.org/abs/2602.20708</p>
<p>9) Buffer Matters: https://arxiv.org/abs/2602.20722</p>
<p>10) Aletheia: https://arxiv.org/abs/2602.21201</p>
</div>
</div>

<div class="theme-callout text-xs mt-4">
<b>说明：</b>本报告以 2026-02-25 当日可访问页面为准；对未抓取到 abs 正文的条目已降级为“方向判断”，不使用转引数字。
</div>

---
layout: custom
transition: fade-out
class: theme-dark-ending
---

<div class="flex flex-col items-center justify-center h-full text-white text-center">
<h2 class="text-4xl font-bold mb-4 tracking-widest">Q&A</h2>
<div class="w-20 h-1 bg-white/40 mb-6"></div>
<p class="text-lg opacity-80">AI 新论文跟踪机制可按周自动化运行</p>
</div>
