# Slidev PPT Agent

本项目是一个基于 [Slidev](https://sli.dev/) 的本地化 PPT 生成工具，支持：

- 基于需求自动生成 `slides.md`
- 组件化排版（业务图表、对比、流程等）
- 一键导出 PDF / PPTX
- 本地 Web Studio 可视化工作流（含日志、配置、预览）

## 功能总览

### 1) CLI 模式
- 适合脚本化、批处理
- 命令入口：`node generate.js`

### 2) Web Studio 模式（推荐）
- 输入需求并触发生成任务
- 实时查看任务步骤与日志（SSE）
- 在线编辑 `slides.md`
- 在线修改 `template.config.json`
- 内置 Slidev 预览（启动/停止/刷新）
- 触发导出任务（PDF / PPTX）

## 环境要求

- Node.js 18+（建议 20+）
- npm 9+
- macOS / Linux / Windows（WSL）均可

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key（生成必需）

```bash
export GEMINI_API_KEY="你的_API_KEY"
```

可选覆盖参数：

```bash
export GEMINI_MODEL="gemini-2.0-flash"
export GEMINI_TIMEOUT_MS="45000"
export GEMINI_MAX_RETRIES="3"
```

### 3. 启动 Web Studio

```bash
npm run web:dev
```

打开：`http://127.0.0.1:3031`

### 4. 使用 CLI 直接生成

```bash
# 生成并自动导出（按 template.config.json 的 exportFormat）
node generate.js "帮我生成一份 AI Agent 技术分享"

# 仅生成，不导出
node generate.js "需求描述" --no-export

# 跳过质量校验（不建议）
node generate.js "需求描述" --skip-qa
```

## 常用命令

```bash
# 本地预览（Slidev 默认模式）
npm run dev

# 构建静态产物
npm run build

# 导出
npm run export:pdf
npm run export:pptx
npm run export:all

# 启动 Web Studio
npm run web:dev
```

## 配置说明（template.config.json）

```json
{
  "brand": "你的品牌名",
  "subtitle": "副标题",
  "footer": "页脚文案",
  "colors": {
    "primary": "red",
    "accent": "rose"
  },
  "font": "Inter",
  "exportFormat": "both",
  "model": "gemini-2.0-flash",
  "requestTimeoutMs": 45000,
  "maxRetries": 3
}
```

字段说明：

- `exportFormat`: `pdf | pptx | both`
- `model`: Gemini 模型名
- `requestTimeoutMs`: 单次请求超时（毫秒）
- `maxRetries`: 重试次数

## Web Studio 端口

- Web 控制台：`127.0.0.1:3031`
- Slidev 预览：`127.0.0.1:3030`

可通过环境变量覆盖：

- `WEB_STUDIO_HOST` / `WEB_STUDIO_PORT`
- `WEB_STUDIO_PREVIEW_HOST` / `WEB_STUDIO_PREVIEW_PORT`

## 目录结构

```text
.
├─ components/           # 业务组件库
├─ layouts/              # Slidev 布局
├─ styles/               # 主题样式
├─ web/                  # Web Studio 前端
├─ generate.js           # CLI 生成主流程
├─ web-server.js         # Web Studio 后端（API + SSE + 队列）
├─ slides.md             # 当前演示文稿
└─ template.config.json  # 模板配置
```

## 注意事项

- 无 `GEMINI_API_KEY` 时，生成任务会失败（编辑/预览/导出仍可用）
- 当前 Web Studio 任务队列为单机单任务串行（MVP 设计）
- 生成内容建议人工复核数据来源与口径
