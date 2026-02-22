# 🎯 PPT Agent — 基于 Slidev + LLM 的智能演示文稿生成器

> 输入一句话需求，自动生成**网页级美观**的 PPT。

## 📁 项目结构

```
slidev-demo/
├── slides.md              ← 幻灯片内容（由 LLM 自动生成）
├── generate.js            ← 🤖 Agent 核心生成脚本
├── template.config.json   ← 品牌文字配置（公司名/副标题/页脚）
├── styles/
│   └── theme.css          ← 🎨 品牌色配置（改这里换全局颜色）
├── layouts/
│   └── custom.vue         ← 页面骨架（自动读取配置，无需改动）
├── components/
│   ├── DataCard.vue       ← 数据指标卡片
│   ├── TimelineCard.vue   ← 时间线节点
│   ├── QuoteCard.vue      ← 人物引用评价
│   ├── FeatureItem.vue    ← 特性/能力条目
│   ├── CompareTable.vue   ← 对比表格（表头）
│   ├── CompareRow.vue     ← 对比表格（行）
│   └── StatBar.vue        ← 进度条/数据条
├── package.json
├── slides-export.pdf      ← 导出的 PDF
└── slides-export.pptx     ← 导出的 PPTX
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 一键生成 PPT（需要 Gemini API Key）

```bash
# 设置 API Key
export GEMINI_API_KEY="your-api-key-here"

# 输入需求，自动生成并导出
node generate.js "帮我写一份关于新能源汽车行业 2024 年趋势分析的 PPT"

# 或者从文件读取需求
node generate.js --file requirements.txt

# 仅生成 slides.md，不自动导出（方便预览调整）
node generate.js "需求描述" --no-export

# 指定导出格式
node generate.js "需求描述" --format both    # pdf + pptx
node generate.js "需求描述" --format pptx    # 仅 pptx
```

### 3. 本地预览

```bash
npm run dev
```

### 4. 手动导出

```bash
npm run export:pdf
npm run export:pptx
npm run export:all
```

---

## 🎨 换品牌——只需改 2 个文件

### 第一步：改文字 — `template.config.json`

```json
{
  "brand": "你的公司名",
  "subtitle": "演示副标题",
  "footer": "公司名 · 内部资料",
  "exportFormat": "both"
}
```

### 第二步：改颜色 — `styles/theme.css`

```css
:root {
  /* 换成你的品牌色即可，全局生效 */
  --theme-primary-hex: #2563EB;        /* 蓝色示例 */
  --theme-primary-dark-hex: #1D4ED8;
  --theme-primary-light-hex: #3B82F6;

  --theme-primary-bg: #EFF6FF;
  --theme-primary-bg-subtle: #F5F9FF;
  --theme-primary-border: rgba(37, 99, 235, 0.15);
  --theme-primary-border-light: rgba(37, 99, 235, 0.06);
}
```

**就这两步，全部完成。** Layout、组件、slides.md 中的所有品牌色都会自动跟随。

### 预设色板参考

| 品牌 | primary-hex | primary-dark-hex | primary-light-hex |
|------|------------|------------------|-------------------|
| 中金财富红 | `#C41230` | `#8B0A1E` | `#E8364F` |
| 科技蓝 | `#2563EB` | `#1D4ED8` | `#3B82F6` |
| 翠绿 | `#10B981` | `#059669` | `#34D399` |
| 深紫 | `#7C3AED` | `#6D28D9` | `#8B5CF6` |
| 琥珀橙 | `#F59E0B` | `#D97706` | `#FBBF24` |

---

## 🧩 添加新组件

1. 在 `components/` 目录创建 `.vue` 文件
2. 使用 `defineProps` 声明 props，使用 `<slot>` 声明插槽
3. `generate.js` 会自动扫描并告知 LLM 可以使用新组件
4. 无需修改任何其他文件

---

## 🎨 主题工具类速查

在 `slides.md` 中使用以下 CSS 类即可引用品牌色，**不要硬编码 hex 值**：

| 类名 | 用途 |
|------|------|
| `theme-text` | 品牌色文字 |
| `theme-badge` | 品牌色标签（背景+文字+边框） |
| `theme-gradient-text` | 品牌色渐变文字 |
| `theme-number` | 品牌色序号圆圈 |
| `theme-callout` | 品牌色提示框 |
| `theme-bg-light` | 品牌色浅背景 |
| `theme-bg-solid` | 品牌色实底背景 |
| `theme-dot` | 品牌色圆点 |
| `theme-dark-ending` | 深色结尾页渐变 |

---

## ⚠️ Slidev Markdown 写作注意事项

这些是坑，必须知道：

1. **Vue 组件必须顶格写**，不能有缩进，否则被当纯文本
   ```markdown
   <!-- ✅ 正确 -->
   <DataCard title="标题">内容</DataCard>

   <!-- ❌ 错误（有缩进）-->
     <DataCard title="标题">内容</DataCard>
   ```

2. **不要在 `<template #slot>` 标签里嵌套 Markdown 语法**

3. **每页用 `---` 分隔**，第一行必须是 frontmatter

4. **控制每页内容量**，可视区只有约 480px 高度

---

## 🔄 复用流程一览

```
                 ┌─────────────────────┐
                 │  1. 改 config.json  │ ← 品牌名/副标题
                 │  2. 改 theme.css    │ ← 品牌色（3 个 hex）
                 └────────┬────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  node generate.js     │
              │  "你的 PPT 需求描述"  │
              └────────┬──────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     slides.md    export.pdf   export.pptx
```

**换公司：2 分钟。换主题：30 秒。生成新 PPT：1 条命令。**
