# 🤖 Slidev PPT Agent: 企业级幻灯片自动化引擎

本项目是一个基于 [Slidev](https://sli.dev/) 和 Google Gemini 大模型的智能幻灯片生成系统。它不仅能帮你排版，还能像高级战略顾问一样，为你产出具备深度洞察、量化数据和严密逻辑的演示文稿。

## 🌟 核心特性

- **专家级内容引擎**：内置“咨询顾问”思维，强制 AI 输出量化数据（ROI）和真实业务场景，拒绝空洞废话。
- **丰富的组件库**：包含 `NodeFlow` (链路图), `CompareTable` (对比表), `ProcessStep` (流程条), `TechStack` (技术栈) 等 10+ 个专业业务组件。
- **品牌化定制**：通过 `template.config.json` 一键切换品牌颜色、Logo 和页脚。
- **自动化闭环**：一句话需求 -> AI 思考与排版 -> 自动生成 Markdown -> 自动导出 PDF/PPTX。

## 🛠️ 组件库预览

| 组件 | 场景 |
| :--- | :--- |
| `NodeFlow.vue` | 业务流向、Agent 决策链路可视化 |
| `CompareTable.vue` | 方案优劣对比、新旧架构分析 |
| `DataCard.vue` | KPI 达成、ROI 量化收益展示 |
| `TechStack.vue` | 架构选型、技术栈组合展示 |
| `ProcessStep.vue` | 项目里程碑、实施路径规划 |
| `ProsCons.vue` | 风险挑战与核心优势评估 |

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
在使用 AI 生成功能前，请获取 [Gemini API Key](https://aistudio.google.com/app/apikey)。
```bash
export GEMINI_API_KEY="你的_API_KEY"
# 可选：覆盖默认模型与请求策略
export GEMINI_MODEL="gemini-2.0-flash"
export GEMINI_TIMEOUT_MS="45000"
export GEMINI_MAX_RETRIES="3"
```

### 3. 一键生成幻灯片
```bash
# 示例：生成一份 Agent 入门分享
node generate.js "帮我写一份关于 AI Agent 的深度技术分享，包含架构拆解和金融落地案例"
# 仅生成并跳过导出
node generate.js "需求描述" --no-export
# 如需临时跳过质量校验（不建议）
node generate.js "需求描述" --skip-qa
```

### 4. 预览与导出
```bash
# 启动实时预览
npm run dev

# 导出为 PDF
npm run export:pdf

# 导出为 PPTX
npm run export:pptx
```

### 5. 本地 Web Studio（可视化流程）
```bash
npm run web:dev
# 打开 http://localhost:3031
```

Web Studio 支持：
- 需求输入并排队执行生成任务
- 实时查看流程步骤与日志（SSE）
- 在线修改 `template.config.json`
- 在线编辑并保存 `slides.md`
- 内置 Slidev 预览窗口（支持启动/停止/刷新）
- 一键触发 PDF / PPTX 导出任务

## ⚙️ 进阶配置

修改 `template.config.json` 即可自定义你的品牌风格：

```json
{
    "brand": "你的品牌名",
    "subtitle": "副标题内容",
    "colors": {
        "primary": "red",
        "accent": "rose"
    },
    "font": "Inter",
    "model": "gemini-2.0-flash",
    "requestTimeoutMs": 45000,
    "maxRetries": 3
}
```

## 📈 开发逻辑

1. **Research**: `generate.js` 自动扫描 `components/` 目录，获取所有可用组件的定义。
2. **Strategy**: 构造 System Prompt，注入 SCQA 逻辑与行业洞察。
3. **Execution**: 调用 Gemini 模型生成符合 Slidev 语法的 Markdown。
4. **Validation**: 自动通过 Slidev 编译器进行语法校验并导出。
5. **Quality Gate**: 生成后自动执行结构与内容校验（frontmatter、标签闭合、数字结论来源提示）。

---
Made with ❤️ by Slidev PPT Agent
