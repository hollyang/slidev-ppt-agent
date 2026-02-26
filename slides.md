---
layout: custom
transition: fade-out
---

<div class="flex flex-col items-center justify-center h-full text-center">
  <div class="theme-badge mb-4">深度企业研究报告 2024</div>
  <h1 class="text-6xl font-black mb-4 theme-gradient-text">宇树科技 (Unitree Robotics)</h1>
  <h2 class="text-2xl font-light text-gray-500 mb-8">全球四足机器人领军者与通用人形机器人先锋：从实验室走向万家灯火</h2>
  <div class="w-24 h-1 bg-blue-500 mb-8"></div>
  <div class="flex gap-4">
<span class="px-3 py-1 bg-slate-100 rounded text-sm text-slate-600">战略咨询：MBB 级别研究</span>
<span class="px-3 py-1 bg-slate-100 rounded text-sm text-slate-600">行业：具身智能 / 机器人</span>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="01" title="执行摘要：全球格局中的宇树" subtitle="Executive Summary" />

<div class="grid grid-cols-2 gap-8 mt-8">
  <div class="space-y-4">
<p class="text-lg leading-relaxed">
      宇树科技（Unitree）成立于2016年，是全球极少数实现<b>高性能四足机器人</b>大规模量产并销往全球的企业。在具身智能（Embodied AI）浪潮下，宇树正迅速从四足机器人向<b>通用人形机器人</b>赛道跨越。
</p>
<div class="theme-callout">
<p class="font-bold">核心地位：</p>
      宇树不仅是波士顿动力的强力竞争者，更是全球机器人“平民化”的推动者，其产品在动力性能、感知能力与成本控制间达到了极佳平衡。
</div>
  </div>
  <div class="grid grid-cols-2 gap-4">
<DataCard title="全球销量占比" value=">60%" :trend="15" colorVariant="blue">
<template #icon><div class="i-carbon-chart-area" /></template>
      全球高性能四足机器人市场估算份额
</DataCard>
<DataCard title="专利储备" value="180+" :trend="25" colorVariant="emerald">
<template #icon><div class="i-carbon-certificate" /></template>
      涵盖电机、减速器、控制算法等核心领域
</DataCard>
<DataCard title="融资估值" value="70亿+" :trend="40" colorVariant="orange">
<template #icon><div class="i-carbon-money" /></template>
      [估算] B2轮融资后估值（人民币）
</DataCard>
<DataCard title="出口国家" value="几十个" :trend="5" colorVariant="purple">
<template #icon><div class="i-carbon-earth-filled" /></template>
      覆盖北美、欧洲、东亚等主流科研与工业市场
</DataCard>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="02" title="行业背景：具身智能的“黄金时代”" subtitle="Market Context & Opportunities" />

<div class="mt-4 space-y-6">
  <p class="text-gray-600">
    机器人行业正经历从“固定式自动化”向“移动式智能化”的范式转移。宇树科技正处于这一变革的中心。
  </p>

  <div class="grid grid-cols-3 gap-6">
<div class="p-4 border-l-4 border-blue-500 bg-slate-50">
<h4 class="font-bold text-blue-700 mb-2">1. 硬件红利期</h4>
<p class="text-sm">高功率密度电机与轻量化材料的成熟，使得足式机器人从实验室昂贵玩具变为可商用的工具。宇树自研的 M107 等系列电机，将成本降低了 80% 以上。</p>
</div>
<div class="p-4 border-l-4 border-emerald-500 bg-slate-50">
<h4 class="font-bold text-emerald-700 mb-2">2. AI 大模型赋能</h4>
<p class="text-sm">Transformer 架构与强化学习（RL）的结合，解决了足式机器人在复杂地形下的运动控制难题，实现了从“规则驱动”向“学习驱动”的跨越。</p>
</div>
<div class="p-4 border-l-4 border-purple-500 bg-slate-50">
<h4 class="font-bold text-purple-700 mb-2">3. 劳动力结构性短缺</h4>
<p class="text-sm">全球老龄化背景下，巡检、物流、陪护等领域对非结构化环境下的移动机器人需求激增，市场规模预计在2030年突破千亿美元。</p>
</div>
  </div>

  <div class="mt-6">
<StatBar label="全球人形机器人潜在市场规模 (2035E)" :value="95" color="blue">
      预计市场规模将达到 1540 亿美元 [高盛预测数据参考]
</StatBar>
<StatBar label="足式机器人复合增长率 (CAGR)" :value="35" color="emerald">
      2023-2028 预测区间
</StatBar>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="03" title="核心技术护城河：全栈自研体系" subtitle="Core Technology & R&D" />

<div class="grid grid-cols-2 gap-8 mt-4">
  <div class="space-y-4">
<h3 class="text-xl font-bold theme-text">1. 动力系统：自研高性能电机</h3>
<p class="text-sm leading-relaxed text-gray-600">
      宇树不依赖外部供应商，自研了从微型到工业级的全系列关节电机。其最新的 M107 系列电机，峰值扭矩可达 360N.m 以上，同时保持了极高的功率密度，这是实现机器人高动态动作（如后空翻）的基础。
</p>
<v-clicks>
<ul class="text-sm space-y-2">
<li><span class="font-bold">高集成度：</span>集成减速器、驱动器、编码器于一体。</li>
<li><span class="font-bold">散热效率：</span>采用先进的热仿真设计，支持长时间高负荷运行。</li>
<li><span class="font-bold">成本控制：</span>通过规模化生产，将原本数万元的关节成本降至数千元。</li>
</ul>
</v-clicks>
  </div>
  <div class="space-y-4">
<h3 class="text-xl font-bold theme-text">2. 感知与算法：具身智能大脑</h3>
<p class="text-sm leading-relaxed text-gray-600">
      宇树在感知层融合了 3D LiDAR、深度相机与超声波雷达，构建了全场景自主导航与避障系统。
</p>
<div class="bg-slate-900 p-4 rounded-lg text-white text-xs font-mono">
<div class="text-emerald-400">// 强化学习运动控制逻辑</div>
<div>Input: Joint_State, IMU_Data, Vision_Map</div>
<div>Policy: Deep_Reinforcement_Learning_Network</div>
<div>Output: Target_Torque_Commands</div>
<div class="mt-2 text-gray-400">>> 实现了在冰面、碎石、草地等极端地形的稳定行走</div>
</div>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="04" title="产品矩阵：从四足到人形的全覆盖" subtitle="Product Portfolio" />

<div class="mt-4">
  <CompareTable oldLabel="四足机器人 (Quadruped)" newLabel="人形机器人 (Humanoid)" dimensionLabel="对比维度">
<template #old>
<div class="p-2">
<div class="font-bold text-blue-600 mb-2">成熟的商业化基石</div>
<p class="text-xs mb-2">代表产品：Go2 (消费级), B2 (工业级), Aliengo (科研级)</p>
<ul class="text-xs space-y-1 opacity-80">
<li>• 稳定性极高，重心低</li>
<li>• 适用于复杂地形巡检、测绘</li>
<li>• 价格区间：$1,600 - $50,000+</li>
</ul>
</div>
</template>
<template #new>
<div class="p-2">
<div class="font-bold text-emerald-600 mb-2">未来的通用终端</div>
<p class="text-xs mb-2">代表产品：H1 (全尺寸), G1 (量产进化版)</p>
<ul class="text-xs space-y-1 opacity-80">
<li>• 极高自由度 (DOF)，类人交互</li>
<li>• 目标进入家庭、工厂替代人工</li>
<li>• 价格突破：G1 起售价仅 $16,000</li>
</ul>
</div>
</template>
  </CompareTable>
</div>

<div class="mt-6 grid grid-cols-3 gap-4">
  <FeatureItem title="Go2: 消费级标杆" color="blue">
<template #icon><div class="i-carbon-home" /></template>
    首款搭载 GPT 联动的消费级四足机器人，支持超广角 4D 激光雷达。
  </FeatureItem>
  <FeatureItem title="B2: 工业级猛兽" color="orange">
<template #icon><div class="i-carbon-industry" /></template>
    负载能力高达 40kg-80kg，支持防尘防水，专为电力、应急救援设计。
  </FeatureItem>
  <FeatureItem title="G1: 人形新纪元" color="emerald">
<template #icon><div class="i-carbon-user-avatar" /></template>
    支持 23-43 个自由度，具备极强的柔性控制能力，价格极具破坏力。
  </FeatureItem>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="05" title="明星产品深度剖析：Unitree G1" subtitle="The Game Changer: G1 Humanoid" />

<div class="grid grid-cols-2 gap-8 mt-4">
  <div>
<h3 class="text-lg font-bold mb-4 flex items-center">
<span class="theme-number mr-2">1</span> 性能参数
</h3>
<div class="space-y-2">
<div class="flex justify-between border-b pb-1">
<span class="text-gray-500">身高 / 重量</span>
<span class="font-bold">约 127cm / 35kg</span>
</div>
<div class="flex justify-between border-b pb-1">
<span class="text-gray-500">自由度 (DOF)</span>
<span class="font-bold">最高 43 个 (含灵巧手)</span>
</div>
<div class="flex justify-between border-b pb-1">
<span class="text-gray-500">关节峰值扭矩</span>
<span class="font-bold">120N.m (大腿部)</span>
</div>
<div class="flex justify-between border-b pb-1">
<span class="text-gray-500">运动速度</span>
<span class="font-bold">2m/s 奔跑能力</span>
</div>
<div class="flex justify-between border-b pb-1">
<span class="text-gray-500">感知硬件</span>
<span class="font-bold">3D LiDAR + 深度相机</span>
</div>
</div>
<div class="mt-6 theme-callout">
<p class="text-sm italic">"G1 的发布标志着人形机器人从‘百万美元实验室设备’转向‘数万美元量产商品’的转折点。"</p>
</div>
  </div>
  <div>
<h3 class="text-lg font-bold mb-4 flex items-center">
<span class="theme-number mr-2">2</span> 核心优势
</h3>
<v-clicks>
<div class="space-y-4">
<div class="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
<div class="font-bold text-emerald-800">极高的柔性与抗冲击性</div>
<p class="text-xs text-emerald-700">采用力位混合控制，被踢踹或碰撞后能迅速恢复平衡，动作极其丝滑。</p>
</div>
<div class="p-3 bg-blue-50 rounded-lg border border-blue-100">
<div class="font-bold text-blue-800">强大的灵巧手 (Dexterous Hand)</div>
<p class="text-xs text-blue-700">支持多种抓取姿态，可进行焊接、开瓶盖、拿取易碎品等精细操作。</p>
</div>
<div class="p-3 bg-purple-50 rounded-lg border border-purple-100">
<div class="font-bold text-purple-800">大模型端到端训练</div>
<p class="text-xs text-purple-700">支持仿真环境下的强化学习，能够快速学习新的技能和动作序列。</p>
</div>
</div>
</v-clicks>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="06" title="商业模式：如何打破“实验室魔咒”" subtitle="Commercial Strategy & Ecosystem" />

<div class="grid grid-cols-2 gap-8 mt-6">
  <div class="space-y-6">
<p class="text-sm leading-relaxed">
      宇树科技成功的核心在于其<b>“极致性价比 + 快速迭代”</b>的互联网式打法，彻底改变了波士顿动力时代昂贵且难以获取的局面。
</p>
<NodeFlow :nodes="[
      { title: '自研核心零部件', type: 'input', icon: 'settings' },
      { title: '规模化量产降本', type: 'process', icon: 'factory' },
      { title: '全球化分销网络', type: 'process', icon: 'earth' },
      { title: '开发者生态构建', type: 'output', icon: 'code' }
    ]" />
  </div>
  <div class="space-y-4">
<h4 class="font-bold text-gray-700">多元化营收结构 [估算]</h4>
<div class="space-y-3">
<div class="flex items-center gap-2">
<div class="w-24 text-xs">科研教育</div>
<div class="flex-1 bg-blue-200 h-4 rounded-full overflow-hidden">
<div class="bg-blue-600 h-full" style="width: 45%"></div>
</div>
<div class="text-xs font-bold">45%</div>
</div>
<div class="flex items-center gap-2">
<div class="w-24 text-xs">工业巡检</div>
<div class="flex-1 bg-orange-200 h-4 rounded-full overflow-hidden">
<div class="bg-orange-600 h-full" style="width: 30%"></div>
</div>
<div class="text-xs font-bold">30%</div>
</div>
<div class="flex items-center gap-2">
<div class="w-24 text-xs">消费级市场</div>
<div class="flex-1 bg-emerald-200 h-4 rounded-full overflow-hidden">
<div class="bg-emerald-600 h-full" style="width: 15%"></div>
</div>
<div class="text-xs font-bold">15%</div>
</div>
<div class="flex items-center gap-2">
<div class="w-24 text-xs">政府/应急</div>
<div class="flex-1 bg-slate-200 h-4 rounded-full overflow-hidden">
<div class="bg-slate-600 h-full" style="width: 10%"></div>
</div>
<div class="text-xs font-bold">10%</div>
</div>
</div>
<p class="text-[10px] text-gray-400 mt-2 italic">注：数据基于行业公开访谈与招投标信息外推，非官方财报数据。</p>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="07" title="竞争分析：宇树 vs. 全球对手" subtitle="Competitive Landscape" />

<div class="mt-4">
  <CompareTable oldLabel="传统巨头 (如 Boston Dynamics)" newLabel="宇树科技 (Unitree)" dimensionLabel="维度" oldColor="slate" newColor="blue">
<template #old>
<div class="text-xs space-y-2">
<p><b>价格：</b>极高 ($75,000+)</p>
<p><b>策略：</b>顶级性能，封闭系统，定制化生产</p>
<p><b>劣势：</b>更新周期慢，难以进入大众市场</p>
</div>
</template>
<template #new>
<div class="text-xs space-y-2">
<p><b>价格：</b>极具竞争力 ($1,600 - $16,000)</p>
<p><b>策略：</b>全栈自研，开源生态，快速迭代</p>
<p><b>优势：</b>供应链优势，极高的性能功耗比</p>
</div>
</template>
  </CompareTable>
</div>

<div class="grid grid-cols-2 gap-6 mt-6">
  <div class="p-4 bg-slate-50 rounded border">
<h4 class="font-bold text-sm mb-2">VS 跨界巨头 (如 Tesla Optimus)</h4>
<p class="text-xs text-gray-600">
      特斯拉拥有极强的 AI 算力与车载供应链，但宇树在<b>运动控制算法</b>和<b>足式机器人构型</b>上拥有更深厚的工程积淀和更早的量产落地经验。
</p>
  </div>
  <div class="p-4 bg-slate-50 rounded border">
<h4 class="font-bold text-sm mb-2">VS 国内初创 (如 逐际动力)</h4>
<p class="text-xs text-gray-600">
      宇树的优势在于<b>品牌全球化</b>与<b>量产规模</b>。通过数万台四足机器人的出货，宇树积累了真实世界的海量数据，这是训练具身智能模型最核心的壁垒。
</p>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="08" title="工业应用场景：从“玩具”到“生产力”" subtitle="Industrial Applications" />

<div class="grid grid-cols-2 gap-8 mt-4">
  <div class="space-y-4">
<div class="flex items-start gap-3">
<div class="theme-number">1</div>
<div>
<h4 class="font-bold">电力与能源巡检</h4>
<p class="text-xs text-gray-600">在变电站、化工厂等危险环境中，B2 机器人可搭载红外热成像仪、气体传感器，实现 24 小时无人值守巡检，识别漏油、异温等隐患。</p>
</div>
</div>
<div class="flex items-start gap-3">
<div class="theme-number">2</div>
<div>
<h4 class="font-bold">消防与应急救援</h4>
<p class="text-xs text-gray-600">进入火灾现场、地震废墟等人类难以进入的区域，进行环境侦测与生命迹象搜索，支持复杂地形下的物资运送。</p>
</div>
</div>
  </div>
  <div class="space-y-4">
<div class="flex items-start gap-3">
<div class="theme-number">3</div>
<div>
<h4 class="font-bold">测绘与勘探</h4>
<p class="text-xs text-gray-600">搭载高精度 3D 激光雷达（LiDAR），在地下矿井、森林、古建筑等区域进行高精度三维建模，效率比人工提升 5-10 倍。</p>
</div>
</div>
<div class="flex items-start gap-3">
<div class="theme-number">4</div>
<div>
<h4 class="font-bold">高校与科研院所</h4>
<p class="text-xs text-gray-600">作为全球最主流的足式机器人开发平台，清华、北大、MIT、CMU 等顶级学府均采用宇树产品进行 AI 与控制算法研究。</p>
</div>
</div>
  </div>
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="09" title="SWOT 战略分析" subtitle="Strategic Assessment" />

<div class="mt-8">
  <ProsCons 
    prosTitle="竞争优势 (Strengths & Opportunities)" 
    consTitle="挑战与风险 (Weaknesses & Threats)"
:pros="[
      '全栈自研能力：电机、减速器、控制器、感知算法全自研，成本极低',
      '量产经验：全球最大的足式机器人出货量，具备成熟的供应链管理',
      '品牌溢价：在科研与极客圈拥有极高的品牌认知度',
      '具身智能浪潮：AI 大模型的发展为人形机器人提供了‘灵魂’，市场空间巨大'
    ]"
:cons="[
      '人形机器人商业化路径尚不清晰：目前多为科研采购，缺乏杀手级C端应用',
      '续航瓶颈：高动态人形机器人的电池续航普遍在 2-4 小时，限制了作业半径',
      '全球地缘政治风险：作为出海企业，可能面临数据安全与贸易限制的挑战',
      '巨头入场：特斯拉、波士顿动力（现代背后）的资源投入可能改变竞争格局'
    ]"
  />
</div>

---
layout: custom
transition: slide-left
---

<SectionTitle number="10" title="未来展望：迈向具身智能的终极形态" subtitle="Future Roadmap" />

<div class="mt-6 space-y-8">
  <ProcessStep :steps="[
    { title: '阶段一：工具化 (2016-2023)', desc: '实现四足机器人的稳定行走与工业巡检落地，确立全球市场领先地位。', status: 'done', icon: 'settings' },
    { title: '阶段二：通用化 (2024-2026)', desc: '人形机器人 G1/H1 的大规模量产，通过端到端 AI 训练实现复杂任务处理。', status: 'active', icon: 'user' },
    { title: '阶段三：生态化 (2027+)', desc: '机器人进入家庭与服务业，构建类似智能手机的 App 生态，实现万物智能交互。', status: 'pending', icon: 'earth' }
  ]" />

  <div class="theme-callout mt-8">
<h4 class="font-bold mb-2">核心愿景：</h4>
<p class="text-sm">
      宇树科技的目标不仅仅是制造“机器狗”或“机器人”，而是要打造<b>“通用的具身智能终端”</b>。未来，机器人将像智能手机一样普及，成为人类在物理世界中最重要的数字化代理。
</p>
  </div>
</div>

---
layout: custom
class: theme-dark-ending
---

<div class="flex flex-col items-center justify-center h-full text-white">
  <h1 class="text-5xl font-black mb-4">感谢观看</h1>
  <p class="text-xl opacity-80 mb-12">宇树科技：用机器人技术重塑物理世界的未来</p>
  
  <div class="grid grid-cols-3 gap-12 text-center">
<div>
<div class="text-3xl font-bold mb-2">Innovation</div>
<div class="text-sm opacity-60">持续创新</div>
</div>
<div>
<div class="text-3xl font-bold mb-2">Scale</div>
<div class="text-sm opacity-60">规模效应</div>
</div>
<div>
<div class="text-3xl font-bold mb-2">Intelligence</div>
<div class="text-sm opacity-60">具身智能</div>
</div>
  </div>
  
  <div class="mt-16 text-xs opacity-40">
    © 2024 宇树科技战略研究报告 | 内部参考
  </div>
</div>
