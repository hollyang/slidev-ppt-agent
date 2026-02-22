---
layout: custom
transition: fade-out
---

<div class="h-full flex flex-col justify-center">
<div class="theme-badge inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 max-w-max">
📢 数据平台战略升级 · 2024
</div>
<h1 class="!text-4xl !mb-3">
TBDS → WeData<br/>
<span class="theme-gradient-text">数据平台迁移宣讲</span>
</h1>
<p class="!text-sm text-slate-500 max-w-2xl leading-relaxed !mb-5">
从腾讯大数据套件 (TBDS) 全面迁移至新一代数据开发治理平台 WeData。<br/>
实现数据资产统一管理、开发效率跨级提升、治理能力从无到有的战略性升级。
</p>
<div class="flex items-center gap-6 text-xs text-slate-400">
<div class="flex items-center gap-1.5"><span class="theme-dot w-1.5 h-1.5 rounded-full"></span>中金财富 · 数据中台团队</div>
<div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>2024 年度专项</div>
<div class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-300"></span>预计工期 10 周</div>
</div>
</div>

---
layout: custom
transition: slide-up
---

# 📋 议程

<p class="text-xs text-slate-500 mb-4">本次宣讲共分 5 个模块，全面覆盖迁移的"为什么、是什么、怎么做"。</p>

<div class="grid grid-cols-5 gap-2">
<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
<div class="theme-number w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm mb-2 font-black">01</div>
<h4 class="!text-[11px] font-bold text-slate-800 !mb-0.5">背景与痛点</h4>
<p class="!text-[10px] text-slate-400">TBDS 现状分析</p>
</div>
<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
<div class="theme-number w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm mb-2 font-black">02</div>
<h4 class="!text-[11px] font-bold text-slate-800 !mb-0.5">WeData 介绍</h4>
<p class="!text-[10px] text-slate-400">能力与优势对比</p>
</div>
<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
<div class="theme-number w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm mb-2 font-black">03</div>
<h4 class="!text-[11px] font-bold text-slate-800 !mb-0.5">迁移方案</h4>
<p class="!text-[10px] text-slate-400">范围、路径与计划</p>
</div>
<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
<div class="theme-number w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm mb-2 font-black">04</div>
<h4 class="!text-[11px] font-bold text-slate-800 !mb-0.5">风险与保障</h4>
<p class="!text-[10px] text-slate-400">回滚、验证与培训</p>
</div>
<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm text-center hover:shadow-md transition-shadow">
<div class="theme-number w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-sm mb-2 font-black">05</div>
<h4 class="!text-[11px] font-bold text-slate-800 !mb-0.5">预期收益</h4>
<p class="!text-[10px] text-slate-400">KPI 与行业案例</p>
</div>
</div>

<div class="mt-4 bg-slate-900 rounded-lg p-3 flex items-center gap-3">
<div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-base shrink-0">⏱️</div>
<div>
<h4 class="!text-xs font-bold text-white !mb-0">预计时长 45 分钟</h4>
<p class="text-slate-400 !text-[11px] !mt-0.5">含 Q&A 环节，请随时提问。</p>
</div>
</div>

---
layout: custom
transition: slide-left
---

# 🔍 TBDS 现状与痛点分析

<p class="text-xs text-slate-500 mb-3">TBDS 在过去 3 年支撑了中金财富数据中台的基础建设，但随着业务深化，瓶颈日益突出。</p>

<div class="grid grid-cols-2 gap-3">
<div>
<div class="grid grid-cols-1 gap-2">
<FeatureItem title="组件版本碎片化" color="red">
<template #icon>🧩</template>
Hadoop/Spark/Hive 各组件版本不统一，升级一个组件可能导致依赖链断裂，运维团队疲于应对兼容性问题。
</FeatureItem>
<FeatureItem v-click title="调度能力薄弱" color="red">
<template #icon>⏰</template>
原生调度器功能简陋，缺少任务依赖可视化、跨工作流编排、失败重试策略等企业级特性。
</FeatureItem>
<FeatureItem v-click title="数据治理几乎空白" color="red">
<template #icon>🕳️</template>
无元数据管理、无血缘追踪、无数据质量监控。2000+ 张表的关系完全是"黑箱"状态。
</FeatureItem>
</div>
</div>
<div>
<div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm h-full">
<h3 class="!text-xs font-bold text-slate-800 !mb-3 flex items-center gap-1">📊 当前资产盘点</h3>
<StatBar label="离线 ETL 任务" :value="100" color="red">共 387 个调度任务，日均运行 1,200+ 次</StatBar>
<StatBar v-click label="实时 Flink 任务" :value="65" color="amber">共 42 个流式任务，覆盖行情/风控</StatBar>
<StatBar v-click label="数据源连接" :value="80" color="purple">MySQL × 12, Oracle × 4, Kafka × 6, HDFS × 3</StatBar>
<StatBar v-click label="日处理数据量" :value="90" color="blue">日均处理约 2.3TB 数据</StatBar>
</div>
</div>
</div>

---
layout: custom
transition: slide-left
---

# ⚠️ 最大风险：TBDS 产品生命周期进入末期

<p class="text-xs text-slate-500 mb-3">腾讯云已明确将战略重心从 TBDS 转移至 WeData，这是推动本次迁移的核心外部因素。</p>

<div class="grid grid-cols-2 gap-4">
<div>
<div class="theme-callout rounded-xl p-4">
<h3 class="!text-xs font-bold theme-text !mb-2">🚨 TBDS 面临的风险</h3>
<div class="space-y-2">
<div class="flex items-start gap-2">
<span class="theme-text text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">新特性开发已停止，仅提供安全补丁级维护</p>
</div>
<div class="flex items-start gap-2">
<span class="theme-text text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">技术支持响应从 4 小时 SLA 降级至 48 小时</p>
</div>
<div class="flex items-start gap-2">
<span class="theme-text text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">社区活跃度下降 70%，遇到问题难以找到解决方案</p>
</div>
<div class="flex items-start gap-2">
<span class="theme-text text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">底层 Hadoop 3.x 生态兼容性更新无官方计划</p>
</div>
</div>
</div>
</div>
<div>
<div class="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
<h3 class="!text-xs font-bold text-emerald-700 !mb-2">✅ WeData 是官方推荐的继任者</h3>
<div class="space-y-2">
<div class="flex items-start gap-2">
<span class="text-emerald-500 text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">腾讯云 2024 年主推数据平台产品，研发投入增加 3 倍</p>
</div>
<div class="flex items-start gap-2">
<span class="text-emerald-500 text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">提供专用 TBDS → WeData 迁移工具包与专家驻场</p>
</div>
<div class="flex items-start gap-2">
<span class="text-emerald-500 text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">100+ 企业已成功迁移，积累了成熟的最佳实践</p>
</div>
<div class="flex items-start gap-2">
<span class="text-emerald-500 text-xs mt-0.5">●</span>
<p class="!text-[11px] text-slate-700">金融行业专属合规方案，满足监管审计要求</p>
</div>
</div>
</div>
</div>
</div>

---
layout: custom
transition: slide-left
---

# 🚀 WeData 平台核心能力总览

<p class="text-xs text-slate-500 mb-3">WeData 是腾讯云新一代一站式数据开发治理平台，覆盖数据全生命周期。</p>

<div class="grid grid-cols-3 gap-2">
<FeatureItem title="数据集成 DataInLong" color="blue">
<template #icon>📥</template>
支持 50+ 数据源，离线全量/增量 + 实时 CDC，可视化配置零代码接入。
</FeatureItem>
<FeatureItem v-click title="数据开发 DataStudio" color="purple">
<template #icon>💻</template>
在线 SQL IDE，支持 Hive/Spark/Presto 多引擎，版本管理与协作开发。
</FeatureItem>
<FeatureItem v-click title="任务调度 Orchestrator" color="amber">
<template #icon>⏰</template>
DAG 可视化编排，跨工作流依赖，灵活重试策略与告警通知。
</FeatureItem>
<FeatureItem v-click title="数据质量 DataQuality" color="emerald">
<template #icon>✅</template>
内置 20+ 质量规则模板，支持自定义 SQL 校验，异常自动阻断下游。
</FeatureItem>
<FeatureItem v-click title="元数据中心 MetaHub" color="red">
<template #icon>🗂️</template>
自动采集表/字段/任务元信息，血缘图谱可视化，影响面一键分析。
</FeatureItem>
<FeatureItem v-click title="数据安全 DataGuard" color="slate">
<template #icon>🔒</template>
列级权限管控、敏感数据识别与脱敏、操作审计日志全量留存。
</FeatureItem>
</div>

---
layout: custom
transition: slide-left
---

# ⚡ 核心能力对比：TBDS vs WeData

<p class="text-xs text-slate-500 mb-3">以下从 6 个维度进行详细对比，直观展示迁移的价值增量。</p>

<CompareTable oldLabel="TBDS (现状)" newLabel="WeData (目标)" dimensionLabel="能力维度" oldColor="red" newColor="emerald">
<CompareRow dimension="数据集成">
<template #old>手动编写 Shell/Python 脚本，配置分散</template>
<template #new>可视化配置 50+ 数据源，支持 CDC 实时同步</template>
</CompareRow>
<CompareRow dimension="任务调度">
<template #old>Azkaban 基础调度，无跨流程依赖</template>
<template #new>DAG 可视化编排，跨工作流依赖，智能重试</template>
</CompareRow>
<CompareRow dimension="数据质量">
<template #old>❌ 无内置能力，全靠人工抽检</template>
<template #new>✅ 20+ 内置规则，异常自动阻断下游</template>
</CompareRow>
<CompareRow dimension="元数据管理">
<template #old>❌ 无，表关系完全是黑箱</template>
<template #new>✅ 自动血缘追踪，影响面分析</template>
</CompareRow>
<CompareRow dimension="权限管控">
<template #old>集群级粗粒度，无列级控制</template>
<template #new>库/表/列三级，敏感字段自动脱敏</template>
</CompareRow>
<CompareRow dimension="运维管理">
<template #old>手动部署，组件版本需自行维护</template>
<template #new>云原生托管，弹性扩缩容，免运维</template>
</CompareRow>
</CompareTable>

---
layout: custom
transition: slide-left
---

# 📦 迁移范围与资产清单

<p class="text-xs text-slate-500 mb-3">本次迁移覆盖中金财富数据中台 TBDS 集群上的全部生产资产。</p>

<div class="grid grid-cols-2 gap-4">
<div>
<div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
<h3 class="!text-xs font-bold text-slate-800 !mb-3">🗃️ 资产明细</h3>
<div class="space-y-1">
<div class="flex justify-between items-center text-[11px] py-1.5 border-b border-slate-50">
<span class="text-slate-600">Hive 数据表</span>
<span class="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">2,147 张</span>
</div>
<div class="flex justify-between items-center text-[11px] py-1.5 border-b border-slate-50">
<span class="text-slate-600">离线 ETL 任务 (Shell/SQL/Spark)</span>
<span class="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">387 个</span>
</div>
<div class="flex justify-between items-center text-[11px] py-1.5 border-b border-slate-50">
<span class="text-slate-600">实时 Flink 流任务</span>
<span class="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">42 个</span>
</div>
<div class="flex justify-between items-center text-[11px] py-1.5 border-b border-slate-50">
<span class="text-slate-600">数据源连接配置</span>
<span class="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">25 个</span>
</div>
<div class="flex justify-between items-center text-[11px] py-1.5 border-b border-slate-50">
<span class="text-slate-600">用户账号 & 权限策略</span>
<span class="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">68 个</span>
</div>
<div class="flex justify-between items-center text-[11px] py-1.5">
<span class="text-slate-600">HDFS 存量数据</span>
<span class="font-bold text-slate-800 bg-slate-50 px-2 py-0.5 rounded">~18 TB</span>
</div>
</div>
</div>
</div>
<div>
<div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
<h3 class="!text-xs font-bold text-slate-800 !mb-3">🎯 迁移策略分级</h3>
<StatBar label="P0 核心生产任务" :value="100" color="red">日报/风控/合规等 56 个任务，优先切换</StatBar>
<StatBar v-click label="P1 重要业务任务" :value="75" color="amber">营销分析/客户画像等 180 个任务</StatBar>
<StatBar v-click label="P2 一般业务任务" :value="50" color="blue">内部分析/临时查询等 151 个任务</StatBar>
<StatBar v-click label="P3 待下线任务" :value="15" color="slate">长期未运行 / 已废弃，归档后不迁移</StatBar>
</div>
</div>
</div>

---
layout: custom
transition: slide-left
---

# 🗺️ 迁移实施路线图（10 周）

<p class="text-xs text-slate-500 mb-3">分 4 个阶段推进，每阶段设置明确的交付门槛和验收标准。</p>

<div class="grid grid-cols-4 gap-2">
<div class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
<div class="flex items-center gap-1.5 mb-2">
<div class="theme-number w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">1</div>
<span class="text-[11px] font-bold text-slate-800">评估准备</span>
</div>
<div class="text-[10px] theme-text font-bold mb-1">第 1-2 周</div>
<div class="space-y-1 text-[10px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>全量资产盘点</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>兼容性评估报告</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>WeData 环境部署</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>网络与权限打通</div>
</div>
</div>
<div v-click class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
<div class="flex items-center gap-1.5 mb-2">
<div class="theme-number w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">2</div>
<span class="text-[11px] font-bold text-slate-800">P0 迁移</span>
</div>
<div class="text-[10px] theme-text font-bold mb-1">第 3-4 周</div>
<div class="space-y-1 text-[10px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>56 个核心任务迁移</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>新旧双跑 3 天</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>数据一致性 diff</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>P0 验收确认</div>
</div>
</div>
<div v-click class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
<div class="flex items-center gap-1.5 mb-2">
<div class="theme-number w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">3</div>
<span class="text-[11px] font-bold text-slate-800">P1/P2 迁移</span>
</div>
<div class="text-[10px] theme-text font-bold mb-1">第 5-8 周</div>
<div class="space-y-1 text-[10px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>331 个任务批量迁移</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>数据源连接切换</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>用户权限迁移</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>分批验收</div>
</div>
</div>
<div v-click class="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
<div class="flex items-center gap-1.5 mb-2">
<div class="theme-number w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">4</div>
<span class="text-[11px] font-bold text-slate-800">切换上线</span>
</div>
<div class="text-[10px] theme-text font-bold mb-1">第 9-10 周</div>
<div class="space-y-1 text-[10px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>全量切换至 WeData</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>TBDS 集群下线</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>监控告警验证</div>
<div class="flex items-start gap-1"><span class="text-slate-400">·</span>项目总结复盘</div>
</div>
</div>
</div>

---
layout: custom
transition: slide-left
---

# 🛡️ 风险控制与保障机制

<p class="text-xs text-slate-500 mb-3">从技术、流程、人员三个维度建立全方位保障体系。</p>

<div class="grid grid-cols-3 gap-3">
<div class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
<div class="text-xl mb-2 text-center">🔄</div>
<h3 class="!text-xs font-bold text-slate-800 text-center !mb-2">双跑验证</h3>
<div class="space-y-1.5 text-[11px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>P0 任务双跑至少 3 个工作日</div>
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>自动化 diff 脚本逐行校验产出</div>
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>差异率 < 0.01% 方可通过</div>
</div>
</div>
<div v-click class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
<div class="text-xl mb-2 text-center">📋</div>
<h3 class="!text-xs font-bold text-slate-800 text-center !mb-2">回滚预案</h3>
<div class="space-y-1.5 text-[11px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>每批次保留 TBDS 全量配置快照</div>
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>异常情况 30 分钟内回退</div>
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>切换后 TBDS 保持 2 周冷备</div>
</div>
</div>
<div v-click class="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
<div class="text-xl mb-2 text-center">👥</div>
<h3 class="!text-xs font-bold text-slate-800 text-center !mb-2">团队保障</h3>
<div class="space-y-1.5 text-[11px] text-slate-600">
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>腾讯 WeData 团队全程驻场</div>
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>7×24 专项值班机制</div>
<div class="flex items-start gap-1"><span class="text-emerald-500">✓</span>每日迁移进度晨会同步</div>
</div>
</div>
</div>

<div v-click class="mt-3 theme-callout rounded-lg p-3 flex items-center gap-3">
<div class="theme-bg-light w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0">📚</div>
<div>
<h4 class="!text-xs font-bold theme-text !mb-0">业务团队培训计划</h4>
<p class="text-slate-600 !text-[11px] !mt-0.5">迁移期间安排 2 场 WeData 操作培训（各 2 小时），SQL 语法 100% 兼容，学习成本极低。</p>
</div>
</div>

---
layout: custom
transition: slide-left
---

# 📈 预期收益与成功标准

<p class="text-xs text-slate-500 mb-3">迁移完成后，中金财富数据中台将在效率、治理、成本三方面获得显著提升。</p>

<div class="grid grid-cols-3 gap-3">
<DataCard title="开发效率" value="提升 50%" :trend="50" colorVariant="emerald">
<template #icon>⚡</template>
可视化开发替代手写脚本，任务上线周期从 3 天缩短至半天。
</DataCard>
<DataCard v-click title="运维成本" value="降低 40%" :trend="40" colorVariant="blue">
<template #icon>💰</template>
云原生免运维，无需维护 Hadoop 组件版本与集群节点。
</DataCard>
<DataCard v-click title="数据治理" value="从 0 到 1" :trend="100" colorVariant="purple">
<template #icon>🏛️</template>
血缘追踪、质量监控、权限管控全面覆盖 2000+ 张表。
</DataCard>
</div>

<div v-click class="mt-3 bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
<h3 class="!text-xs font-bold text-slate-800 !mb-2">🎯 迁移验收 KPI</h3>
<div class="grid grid-cols-4 gap-3">
<div class="text-center">
<div class="text-lg font-black theme-text">99.8%</div>
<div class="text-[10px] text-slate-500">任务迁移成功率</div>
</div>
<div class="text-center">
<div class="text-lg font-black theme-text">0</div>
<div class="text-[10px] text-slate-500">数据丢失事件</div>
</div>
<div class="text-center">
<div class="text-lg font-black theme-text">&lt;30min</div>
<div class="text-[10px] text-slate-500">最大回滚耗时</div>
</div>
<div class="text-center">
<div class="text-lg font-black theme-text">100%</div>
<div class="text-[10px] text-slate-500">培训覆盖率</div>
</div>
</div>
</div>

---
layout: custom
transition: view-transition
---

# 🗣️ 同行业成功案例

<p class="text-xs text-slate-500 mb-3">多家头部金融机构已完成 TBDS/CDH → WeData 的平滑迁移。</p>

<div class="grid grid-cols-3 gap-3 items-start">
<QuoteCard author="某头部券商" role="数据中台负责人">
迁移后调度稳定性提升 40%，数据质量问题较同期下降 60%。从立项到上线仅用了 8 周。
</QuoteCard>
<QuoteCard v-click author="某城商行" role="科技部总经理">
WeData 内置的血缘分析让我们第一次摸清了 2000+ 张表的依赖链路，治理效率质的飞跃。
</QuoteCard>
<QuoteCard v-click author="某基金公司" role="IT 架构师">
云原生架构让我们实现弹性扩缩容，季末批处理高峰算力成本降低了 35%，效果超预期。
</QuoteCard>
</div>

<div v-click class="mt-3 bg-white rounded-lg p-3 shadow-sm border border-slate-100 flex items-center gap-3">
<div class="text-2xl shrink-0">✅</div>
<div>
<h4 class="!text-xs font-bold text-slate-800 !mb-0">腾讯官方数据</h4>
<p class="text-slate-500 !text-[11px] !mt-0.5">截至 2024 上半年，累计协助 120+ 企业完成迁移，金融行业客户占比 35%，任务迁移成功率 99.8%。</p>
</div>
</div>

---
layout: custom
---

<div class="theme-dark-ending absolute inset-0 z-50 flex flex-col items-center justify-center text-center px-10 overflow-hidden">
<div class="relative w-full max-w-3xl mx-auto flex flex-col items-center">
<div class="absolute w-[400px] h-[400px] bg-white rounded-full mix-blend-overlay filter blur-[120px] opacity-10"></div>
<div class="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-5 relative z-10 backdrop-blur-sm border border-white/10">🚀</div>
<h1 class="!text-4xl font-black text-white tracking-tight leading-tight !mb-3 relative z-10">
从 TBDS 到 WeData<br/>
<span class="text-white/60">我们已经准备就绪</span>
</h1>
<p class="!text-sm text-white/60 font-light leading-relaxed max-w-2xl relative z-10 !mb-6">
2024 年，中金财富数据中台将完成全面升级。<br/>
让我们一起拥抱更智能、更高效的数据开发新范式。
</p>
<div class="flex gap-3 relative z-10">
<div class="px-5 py-2 bg-white theme-text font-bold rounded-xl shadow-lg text-sm">
联系数据中台团队
</div>
<div class="px-5 py-2 bg-white/10 text-white font-medium rounded-xl border border-white/20 backdrop-blur-sm text-sm">
查看详细迁移手册
</div>
</div>
</div>
</div>
