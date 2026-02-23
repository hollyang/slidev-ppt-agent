---
layout: custom
transition: fade-out
---

<div class="flex flex-col items-center justify-center h-full text-center">
<div class="theme-badge mb-4">Strategic Insight 2024</div>
<h1 class="text-6xl font-bold theme-gradient-text mb-6">智能手机：从“通讯工具”到“数字器官”的进化范式</h1>
<p class="text-2xl text-slate-500 max-w-3xl leading-relaxed">
深度剖析全球移动终端市场的技术迭代、商业逻辑演进及生成式 AI 驱动下的第二增长曲线
</p>
<div class="mt-12 flex items-center gap-8">
<div class="flex flex-col items-start">
<span class="text-sm opacity-50 uppercase tracking-widest">Presented by</span>
<span class="font-bold text-lg">MBB 战略咨询团队</span>
</div>
<div class="w-px h-10 bg-slate-300"></div>
<div class="flex flex-col items-start">
<span class="text-sm opacity-50 uppercase tracking-widest">Date</span>
<span class="font-bold text-lg">October 2024</span>
</div>
</div>
</div>

---
layout: custom
---

<SectionTitle number="01" title="执行摘要：行业全景与核心洞察" subtitle="Executive Summary: The State of Mobile Industry" />

<div class="grid grid-cols-2 gap-8 mt-8">
<div class="space-y-6">
<p class="text-lg leading-relaxed">
智能手机行业已进入**高度成熟期（Late Maturity）**。全球出货量在 2017 年达到 15.6 亿部的峰值后，目前稳定在 11-12 亿部左右。然而，行业价值链正在发生深刻重构：硬件利润向头部溢价品牌集中，而增长引擎已从“连接性”转向“算力与 AI”。
</p>

<v-clicks>
<div class="theme-callout">
<strong>核心发现 1：</strong> 换机周期已从 24 个月延长至 40 个月以上，倒逼厂商从“参数驱动”转向“体验驱动”。
</div>
<div class="theme-callout">
<strong>核心发现 2：</strong> 苹果（Apple）凭借 20% 的市场份额攫取了行业 85% 的利润，体现了生态闭环的极高护城河。
</div>
<div class="theme-callout">
<strong>核心发现 3：</strong> On-Device AI（端侧 AI）将成为 2024-2030 年唯一的颠覆性变量，预计 2027 年 AI 手机渗透率将达 45%。
</div>
</v-clicks>
</div>

<div class="grid grid-cols-2 gap-4">
<DataCard title="全球年出货量" value="1.16B" :trend="-3.2" colorVariant="blue">
<template #icon><div class="i-carbon-delivery-truck" /></template>
2023年数据，市场呈现弱复苏态势，高端化趋势明显。
</DataCard>
<DataCard title="平均售价 (ASP)" value="$425" :trend="8.5" colorVariant="emerald">
<template #icon><div class="i-carbon-currency-dollar" /></template>
消费者倾向于购买更耐用的旗舰机型，单机价值量持续提升。
</DataCard>
<DataCard title="AI 手机预期增长" value="350%" :trend="100" colorVariant="purple">
<template #icon><div class="i-carbon-chart-line-smooth" /></template>
未来三年内支持端侧大模型的终端将迎来爆发式增长。
</DataCard>
<DataCard title="服务收入占比" value="22%" :trend="12" colorVariant="orange">
<template #icon><div class="i-carbon-cloud-service-management" /></template>
软件服务、订阅与云空间成为厂商利润的核心护城河。
</DataCard>
</div>
</div>

---
layout: custom
---

<SectionTitle number="02" title="历史回望：三个时代的范式迁移" subtitle="History: From Feature Phones to Smart Hubs" />

<div class="mt-8">
<ProcessStep :steps="[
{ title: '工具时代 (1990-2006)', desc: '以 Nokia, Motorola 为代表，核心功能是语音通讯与短信，硬件差异化在于工业设计。', icon: 'i-carbon-phone', status: 'done' },
{ title: '生态时代 (2007-2022)', desc: '由 iPhone 开启，App Store 定义了移动互联网。多点触控、4G/5G、社交媒体成为核心。', icon: 'i-carbon-application', status: 'done' },
{ title: '智能体时代 (2023-Present)', desc: 'AI 手机（AI Phone）阶段。手机不再是工具，而是具备主动感知与决策能力的数字助理。', icon: 'i-carbon-brain', status: 'active' }
]" />
</div>

<div class="grid grid-cols-3 gap-6 mt-12">
<div class="p-6 border border-slate-200 rounded-xl bg-slate-50">
<h4 class="font-bold text-xl mb-3 flex items-center gap-2">
<span class="theme-number text-sm">1</span> 硬件为王
</h4>
<p class="text-sm text-slate-600 leading-relaxed">
在 2000 年代，手机的竞争是天线信号、电池续航和物理键盘的竞争。Nokia 的统治力源于其极高的供应链规模效应和硬件耐用性。当时的市场是碎片化的，缺乏统一的操作系统标准。
</p>
</div>
<div class="p-6 border border-slate-200 rounded-xl bg-slate-50">
<h4 class="font-bold text-xl mb-3 flex items-center gap-2">
<span class="theme-number text-sm">2</span> 软件定义
</h4>
<p class="text-sm text-slate-600 leading-relaxed">
2007 年后，竞争升维至“操作系统+开发者生态”。iOS 与 Android 的双寡头格局形成。手机变成了移动支付、短视频、手游的载体。硬件开始同质化，竞争焦点转向屏幕刷新率、摄像头像素和充电速度。
</p>
</div>
<div class="p-6 border border-slate-200 rounded-xl bg-slate-50">
<h4 class="font-bold text-xl mb-3 flex items-center gap-2">
<span class="theme-number text-sm">3</span> 智能驱动
</h4>
<p class="text-sm text-slate-600 leading-relaxed">
当前，硬件参数触及物理极限。SoC 的竞争从 CPU/GPU 转向 NPU。手机开始集成百亿级参数的大模型，实现实时翻译、语义搜索、图像自动生成。手机正在进化为用户的“第二大脑”。
</p>
</div>
</div>

---
layout: custom
---

<SectionTitle number="03" title="市场格局：存量博弈下的高端化战略" subtitle="Market Dynamics: Premiumization in a Saturated Market" />

<div class="grid grid-cols-2 gap-12 mt-8">
<div>
<h3 class="text-2xl font-bold mb-6">全球出货量与增长率趋势</h3>
<div class="space-y-4">
<StatBar label="Apple (高端市场统治者)" :value="85" color="blue">
占据 $800 以上价位段 75% 的份额。
</StatBar>
<StatBar label="Samsung (全产品线覆盖)" :value="65" color="slate">
在折叠屏领域保持领先，但在中端市场面临激烈竞争。
</StatBar>
<StatBar label="Xiaomi/OPPO/Vivo (性价比与影像)" :value="50" color="orange">
通过自研影像芯片和快充技术试图冲击高端。
</StatBar>
<StatBar label="Huawei (技术回归)" :value="40" color="red">
凭借麒麟芯片回归和 HarmonyOS 生态，在中国市场迅速收复失地。
</StatBar>
</div>

<div class="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
<p class="text-sm italic text-blue-800">
"当前智能手机市场已呈现 'K型' 增长：低端走量机型利润微薄，而 $600 以上的高端机型贡献了全行业 90% 的利润增长。换机动力的缺乏使得厂商必须通过 '奢侈品化' 或 '技术突破' 来维持毛利。"
</p>
</div>
</div>

<div class="space-y-6">
<h3 class="text-2xl font-bold">核心挑战与阻力</h3>
<v-clicks>
<div class="flex gap-4">
<div class="i-carbon-warning-alt text-3xl text-red-500" />
<div>
<h4 class="font-bold">物理极限的瓶颈</h4>
<p class="text-sm text-slate-600">3nm 工艺后的摩尔定律放缓，散热与功耗成为移动端算力提升的最大掣肘。电池技术（硅碳负极等）虽有进步，但仍无法满足高性能 AI 的长效需求。</p>
</div>
</div>
<div class="flex gap-4">
<div class="i-carbon-recycle text-3xl text-emerald-500" />
<div>
<h4 class="font-bold">ESG 与可持续性压力</h4>
<p class="text-sm text-slate-600">欧盟法规（如可更换电池指令）和碳中和目标要求厂商延长产品生命周期，这与传统的“计划报废”商业模式产生冲突。</p>
</div>
</div>
<div class="flex gap-4">
<div class="i-carbon-security text-3xl text-purple-500" />
<div>
<h4 class="font-bold">地缘政治与供应链韧性</h4>
<p class="text-sm text-slate-600">“中国+1”策略成为跨国巨头的标配。印度、越南供应链的崛起正在重塑全球制造版图，但也带来了成本上升与效率折损。</p>
</div>
</div>
</v-clicks>
</div>
</div>

---
layout: custom
---

<SectionTitle number="04" title="技术底座：SoC 算力与异构计算的演进" subtitle="Technology: The Evolution of Silicon" />

<div class="mt-8">
<CompareTable oldLabel="传统 SoC 架构" newLabel="AI 时代异构架构" dimensionLabel="核心维度">
<CompareRow dimension="核心组件">
<template #old>以 CPU/GPU 为核心，追求单核主频与浮点运算能力。</template>
<template #new>以 NPU (神经网络单元) 为核心，强调每瓦特算力 (TOPS/W)。</template>
</CompareRow>
<CompareRow dimension="内存架构">
<template #old>LPDDR4/5，带宽满足多任务处理即可。</template>
<template #new>LPDDR5x/6，超大带宽以支持大模型在端侧的实时推理。</template>
</CompareRow>
<CompareRow dimension="制程工艺">
<template #old>7nm/5nm，追求集成度与性能增益。</template>
<template #new>3nm/2nm + 先进封装 (Chiplet)，解决散热与功耗瓶颈。</template>
</CompareRow>
<CompareRow dimension="软件协同">
<template #old>通用指令集，依赖操作系统调度。</template>
<template #new>软硬一体化，模型针对特定硬件进行量化与剪枝优化。</template>
</CompareRow>
</CompareTable>
</div>

<div class="grid grid-cols-2 gap-8 mt-10">
<div class="theme-callout">
<h4 class="font-bold mb-2">案例分析：Apple A18 Pro vs. Snapdragon 8 Gen 4</h4>
<p class="text-sm">
2024 年的旗舰芯片竞争点已从“跑分”转向“本地 AI 吞吐量”。Apple 通过自研架构实现了端侧 30B 参数模型的流畅运行，而高通则通过 Oryon CPU 架构试图在安卓阵营建立性能绝对优势。
</p>
</div>
<div class="theme-callout">
<h4 class="font-bold mb-2">数据支撑：算力需求爆发</h4>
<p class="text-sm">
预计到 2026 年，顶级智能手机的端侧 AI 算力需求将达到 100 TOPS 以上。这意味着 SoC 的 40% 面积将被专门用于 AI 运算，而非传统的图形渲染。
</p>
</div>
</div>

---
layout: custom
---

<SectionTitle number="05" title="影像系统：从“光学竞赛”到“计算摄影”" subtitle="Imaging: The Death of the DSLR?" />

<div class="grid grid-cols-2 gap-12 mt-8">
<div class="space-y-6">
<p class="leading-relaxed">
手机摄影的进化经历了从“堆像素”到“堆底（大尺寸传感器）”再到“堆算力”的三个阶段。目前，物理空间的限制使得手机镜头难以在光学层面超越单反，但**计算摄影（Computational Photography）**正在通过算法弥补物理缺陷。
</p>

<v-clicks>
<FeatureItem title="一英寸大底 (1-inch Sensor)" color="blue">
<template #icon><div class="i-carbon-camera" /></template>
IMX989 等传感器的应用，标志着手机在暗光与虚化表现上达到了物理极限的边缘。
</FeatureItem>
<FeatureItem title="潜望式长焦 (Periscope Lens)" color="emerald">
<template #icon><div class="i-carbon-zoom-in" /></template>
通过光路折射解决厚度问题，实现 5x-10x 的光学变焦，覆盖更多拍摄场景。
</FeatureItem>
<FeatureItem title="语义分割与增强 (Semantic Segmentation)" color="purple">
<template #icon><div class="i-carbon-layers" /></template>
AI 实时识别天空、人脸、草地并分别优化色彩与锐度，实现“所见即所得”的超越。
</FeatureItem>
</v-clicks>
</div>

<div class="bg-slate-900 text-white p-8 rounded-2xl">
<h4 class="text-xl font-bold mb-6 text-emerald-400">影像价值链分析</h4>
<div class="space-y-4">
<div class="flex justify-between items-center border-b border-slate-700 pb-2">
<span>传感器 (Sony/Samsung)</span>
<span class="font-mono">35% 成本占比</span>
</div>
<div class="flex justify-between items-center border-b border-slate-700 pb-2">
<span>光学镜头 (大立光/舜宇)</span>
<span class="font-mono">20% 成本占比</span>
</div>
<div class="flex justify-between items-center border-b border-slate-700 pb-2">
<span>ISP 算法 (厂商自研)</span>
<span class="font-mono">核心差异化来源</span>
</div>
<div class="flex justify-between items-center border-b border-slate-700 pb-2">
<span>马达与模组组装</span>
<span class="font-mono">15% 成本占比</span>
</div>
</div>
<p class="mt-8 text-sm opacity-70 italic">
未来趋势：AIGC 介入影像处理。例如，AI 自动补全照片边缘、一键移除路人、甚至通过文字描述改变照片的光影氛围。
</p>
</div>
</div>

---
layout: custom
---

<SectionTitle number="06" title="形态革命：折叠屏与未来形态" subtitle="Form Factors: Beyond the Slab" />

<div class="mt-8">
<NodeFlow :nodes="[
{ title: '直板机 (Standard Slab)', type: 'input', icon: 'i-carbon-mobile' },
{ title: '横向折叠 (Foldable)', type: 'process', icon: 'i-carbon-screen' },
{ title: '纵向折叠 (Flip)', type: 'process', icon: 'i-carbon-mobile-add' },
{ title: '卷轴屏 (Rollable)', type: 'output', icon: 'i-carbon-flow-data' },
{ title: 'AR 增强形态', type: 'output', icon: 'i-carbon-view' }
]" />
</div>

<div class="grid grid-cols-2 gap-8 mt-12">
<div class="p-6 bg-emerald-50 rounded-xl border border-emerald-100">
<h4 class="font-bold text-emerald-900 mb-4 flex items-center gap-2">
<div class="i-carbon-increase-level" /> 折叠屏的商业逻辑
</h4>
<ul class="space-y-2 text-sm text-emerald-800">
<li><strong>1. 突破价格天花板：</strong> 折叠屏将手机价位拉升至 $1500-$2000 区间，有效提升利润。</li>
<li><strong>2. 生产力工具属性：</strong> 通过大屏实现多任务并行，试图蚕食平板电脑市场。</li>
<li><strong>3. 品牌溢价：</strong> 拥有成熟折叠屏技术是厂商研发实力的最直接证明。</li>
</ul>
</div>

<div class="p-6 bg-slate-50 rounded-xl border border-slate-200">
<h4 class="font-bold text-slate-900 mb-4 flex items-center gap-2">
<div class="i-carbon-tool-kit" /> 待解决的技术痛点
</h4>
<ProsCons 
prosTitle="优势" 
consTitle="瓶颈"
:pros="['更大的显示面积', '独特的交互体验', '高端商务心智']" 
:cons="['折痕疲劳寿命', '机身重量与厚度', '应用生态适配成本']" 
/>
</div>
</div>

---
layout: custom
---

<SectionTitle number="07" title="AI Phone：从“智能手机”到“个人智能体”" subtitle="The AI Pivot: Generative AI on Device" />

<div class="theme-callout mt-8">
<p class="text-lg">
<strong>定义：</strong> AI 手机是指原生集成大语言模型（LLM）和扩散模型（Diffusion Model），能够实现端侧推理、主动感知用户意图并跨应用执行任务的下一代移动终端。
</p>
</div>

<div class="grid grid-cols-3 gap-6 mt-8">
<div class="p-6 border border-purple-200 rounded-xl bg-purple-50">
<div class="i-carbon-chat text-4xl text-purple-600 mb-4" />
<h4 class="font-bold text-lg mb-2">自然交互 (Natural UI)</h4>
<p class="text-sm text-slate-600">
告别复杂的菜单点击。用户通过自然语言指令（如“帮我订一张去上海最便宜的机票，并同步到日历”）即可完成操作。
</p>
</div>
<div class="p-6 border border-purple-200 rounded-xl bg-purple-50">
<div class="i-carbon-security text-4xl text-purple-600 mb-4" />
<h4 class="font-bold text-lg mb-2">端侧隐私 (Edge Privacy)</h4>
<p class="text-sm text-slate-600">
核心个人数据（聊天记录、健康数据）在本地进行 AI 处理，无需上传云端，解决了大模型时代的隐私焦虑。
</p>
</div>
<div class="p-6 border border-purple-200 rounded-xl bg-purple-50">
<div class="i-carbon-connect text-4xl text-purple-600 mb-4" />
<h4 class="font-bold text-lg mb-2">意图预测 (Proactive AI)</h4>
<p class="text-sm text-slate-600">
基于位置、时间、习惯，手机主动推送信息。例如：在会议开始前自动静音并准备好相关的会议资料。
</p>
</div>
</div>

<div class="mt-8">
<h4 class="font-bold mb-4">AI 手机的技术栈要求：</h4>
<TechStack title="AI Hardware & Software Stack" :items="[
{ name: 'NPU 40+ TOPS', icon: 'i-carbon-chip' },
{ name: '7B-10B LLM', icon: 'i-carbon-data-base' },
{ name: 'Unified Memory', icon: 'i-carbon-memory' },
{ name: 'Contextual OS', icon: 'i-carbon-settings' }
]" />
</div>

---
layout: custom
---

<SectionTitle number="08" title="生态系统：软件服务与闭环价值" subtitle="Ecosystem: Services as the New Growth Engine" />

<div class="grid grid-cols-2 gap-12 mt-8">
<div class="space-y-6">
<QuoteCard author="Tim Cook" role="CEO of Apple">
"我们的目标是提供无缝的硬件、软件和服务体验。一旦用户进入我们的生态，他们就不再仅仅是买了一个产品，而是选择了我们的生活方式。"
</QuoteCard>

<p class="text-sm leading-relaxed">
<strong>生态粘性（Lock-in Effect）</strong> 是手机厂商最核心的资产。苹果的 iMessage、iCloud、Apple Watch 联动形成的“围墙花园”让其换机留存率高达 92%。
</p>

<v-clicks>
<div class="theme-callout">
<strong>数据洞察：</strong> 苹果服务业务毛利率高达 70% 以上，远超硬件的 35%。这解释了为何硬件创新放缓，但公司估值持续走高。
</div>
</v-clicks>
</div>

<div>
<h4 class="font-bold mb-4">不同厂商的生态策略对比</h4>
<CompareTable oldLabel="Android 厂商 (Open)" newLabel="Apple (Closed)" dimensionLabel="策略维度">
<CompareRow dimension="核心盈利点">
<template #old>硬件销售 + 广告 + 应用商店抽成</template>
<template #new>硬件溢价 + 订阅服务 + 闭环支付</template>
</CompareRow>
<CompareRow dimension="用户画像">
<template #old>价格敏感型、极客、大众市场</template>
<template #new>高净值人群、创意工作者、家庭用户</template>
</CompareRow>
<CompareRow dimension="多端联动">
<template #old>跨品牌协同差，依赖第三方协议</template>
<template #new>Handoff, AirDrop 等原生无缝体验</template>
</CompareRow>
</CompareTable>
</div>
</div>

---
layout: custom
---

<SectionTitle number="09" title="供应链：全球化退潮下的韧性重构" subtitle="Supply Chain: Resilience in a Volatile World" />

<div class="mt-8 grid grid-cols-2 gap-8">
<div class="space-y-6">
<p class="text-sm leading-relaxed">
智能手机是人类历史上最复杂的工业品之一，涉及超过 1500 个零部件。过去 20 年，中国凭借完善的产业集群成为了全球制造中心。但现在，**“去风险化（De-risking）”** 正在重塑版图。
</p>

<div class="p-6 bg-slate-50 border border-slate-200 rounded-xl">
<h4 class="font-bold mb-4">供应链转移趋势 (2020-2030)</h4>
<div class="space-y-3">
<div class="flex items-center gap-4">
<span class="w-20 text-xs font-bold">中国</span>
<div class="flex-1 h-4 bg-blue-500 rounded-full" style="width: 70%"></div>
<span class="text-xs">从制造向研发转型</span>
</div>
<div class="flex items-center gap-4">
<span class="w-20 text-xs font-bold">印度</span>
<div class="flex-1 h-4 bg-orange-400 rounded-full" style="width: 20%"></div>
<span class="text-xs">组装中心崛起</span>
</div>
<div class="flex items-center gap-4">
<span class="w-20 text-xs font-bold">越南/东南亚</span>
<div class="flex-1 h-4 bg-emerald-400 rounded-full" style="width: 10%"></div>
<span class="text-xs">核心零部件配套</span>
</div>
</div>
</div>
</div>

<div class="space-y-4">
<div class="theme-callout">
<h4 class="font-bold">核心瓶颈：先进制程芯片</h4>
<p class="text-xs">ASML 光刻机、TSMC 产能成为地缘政治博弈的核心。厂商必须通过“自研芯片”和“多元化代工”来对冲政治风险。</p>
</div>
<div class="theme-callout">
<h4 class="font-bold">关键原材料：稀土与锂</h4>
<p class="text-xs">随着电池和高性能磁材需求增加，上游矿产资源的控制权成为手机厂商间接竞争的战场。</p>
</div>
<div class="theme-callout">
<h4 class="font-bold">ESG 合规成本</h4>
<p class="text-xs">回收金、再生铝的使用比例已成为旗舰机的标配，供应链透明度要求达到前所未有的高度。</p>
</div>
</div>
</div>

---
layout: custom
---

<SectionTitle number="10" title="用户行为：数字时代的“成瘾”与“反思”" subtitle="User Behavior: The Digital Limb" />

<div class="grid grid-cols-2 gap-12 mt-8">
<div>
<h4 class="font-bold mb-6">用户画像与时长分析</h4>
<div class="space-y-4">
<DataCard title="日均使用时长" value="4.8 Hours" :trend="5" colorVariant="blue">
全球平均水平，Z 世代甚至超过 7 小时。
</DataCard>
<DataCard title="日均解锁次数" value="150 Times" :trend="2" colorVariant="orange">
手机已成为潜意识的条件反射。
</DataCard>
</div>

<div class="mt-8 p-6 border-l-4 border-blue-500 bg-blue-50">
<p class="text-sm italic">
"手机已经从 '身外之物' 变成了 '数字器官'。它存储了我们的记忆、处理我们的财务、维系我们的社交。这种极度依赖性带来了巨大的商业价值，但也引发了心理健康与隐私保护的社会讨论。"
</p>
</div>
</div>

<div class="space-y-6">
<h4 class="font-bold">新兴趋势：数字排毒 (Digital Detox)</h4>
<v-clicks>
<div class="flex gap-4 items-start">
<div class="theme-number text-xs">1</div>
<div>
<h5 class="font-bold">屏幕时间管理</h5>
<p class="text-xs text-slate-600">iOS Screen Time 与 Android Digital Wellbeing 成为核心系统功能，用户开始主动限制短视频成瘾。</p>
</div>
</div>
<div class="flex gap-4 items-start">
<div class="theme-number text-xs">2</div>
<div>
<h5 class="font-bold">极简主义回归</h5>
<p class="text-xs text-slate-600">“哑机（Dumbphone）”在欧美年轻人中意外流行，反映了对过度连接的审美疲劳。</p>
</div>
</div>
<div class="flex gap-4 items-start">
<div class="theme-number text-xs">3</div>
<div>
<h5 class="font-bold">隐私意识觉醒</h5>
<p class="text-xs text-slate-600">从“不介意数据换便利”转向“要求透明的追踪权限”，苹果的 ATT 框架重创了基于定向广告的移动营销生态。</p>
</div>
</div>
</v-clicks>
</div>
</div>

---
layout: custom
---

<SectionTitle number="11" title="未来展望：2030 年的移动终端" subtitle="Future Outlook: The Post-Smartphone Era" />

<div class="mt-8">
<TimelineCard date="2024-2025" title="AI 手机爆发年">
端侧 10B 模型成为旗舰标配，AI 消除、实时翻译、自动摘要成为基础功能，换机潮由 AI 驱动。
</TimelineCard>
<TimelineCard date="2026-2027" title="多模态交互成熟">
手机不再依赖屏幕作为唯一交互口，语音、眼神追踪、手势操作深度融合。折叠屏成本降至 $500 以下。
</TimelineCard>
<TimelineCard date="2028-2030" title="形态解构与泛在计算">
AR 眼镜开始分担手机功能。手机可能演变为一个纯粹的“计算核心（Compute Puck）”，显示功能由眼镜或周围环境屏承担。
</TimelineCard>
</div>

<div class="grid grid-cols-2 gap-8 mt-12">
<div class="theme-callout">
<h4 class="font-bold mb-2">核心结论 1</h4>
<p class="text-sm text-slate-700">
智能手机不会消失，但其作为“交互中心”的地位将被挑战。它将更多地扮演个人私有云和 AI 算力中心的角色。
</p>
</div>
<div class="theme-callout" style="border-left-color: #f59e0b; background: #fffcf0;">
<h4 class="font-bold mb-2">核心结论 2</h4>
<p class="text-sm text-slate-700">
下一个“计算平台”必然具备佩戴无感、全天候运作、主动服务等特征，极大概率是轻量级 AR + 端侧大模型。
</p>
</div>
</div>

---
layout: custom
class: theme-dark-ending
---

<div class="flex flex-col items-center justify-center h-full text-white">
  <h2 class="text-5xl font-bold mb-6 tracking-widest">智能无界 · 连接你我</h2>
  <div class="w-16 h-1 bg-white opacity-30 mb-8"></div>
  <p class="text-xl opacity-80 mb-12">感谢观看，期待见证下一个十年技术变革</p>
  
  <div class="flex space-x-4">
    <div class="px-6 py-2 border border-white/30 rounded-full text-sm">TECHNOLOGY</div>
    <div class="px-6 py-2 border border-white/30 rounded-full text-sm">INNOVATION</div>
    <div class="px-6 py-2 border border-white/30 rounded-full text-sm">FUTURE</div>
  </div>
  
  <p class="mt-20 text-xs opacity-40">© 2026 Strategy Consulting Group. All Rights Reserved.</p>
</div>
