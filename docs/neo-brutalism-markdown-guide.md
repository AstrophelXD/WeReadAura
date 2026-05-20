# WeReadAura Neo-Brutalism Markdown 规范（适配版）

## 1. 文档信息

- 项目名称：`WeReadAura`
- 文档版本：`v1.0`
- 编写日期：`2026-05-20`
- 上游参考：[ekmas/neobrutalism-components](https://github.com/ekmas/neobrutalism-components) 文档站 MDX / `prose-*` 约定
- 关联文档：
  - [frontend-visual-style-guide.md](./frontend-visual-style-guide.md)
  - [field-typography-guide.md](./field-typography-guide.md)
  - 实现：`src/styles/neo-prose.css`、`src/components/ui/NeoProse.tsx`

## 2. 适用范围

本规范约束两类 Markdown：

| 类型 | 场景 | 渲染方式 |
| --- | --- | --- |
| **导出 Markdown** | 书籍划线/笔记导出 `.md` | 纯文本文件，读者自备渲染器；结构须自洽 |
| **应用内 Markdown** | 未来报告、助手富文本、静态说明 | 包在 `NeoProse` 容器内，走 `neo-prose` 样式 |

**字体单独处理**：除字体族与引用类排版外，其余结构、间距、边框、代码块、链接、列表等均对齐 neo-brutalism 文档站习惯。

## 3. 字体适配（WeReadAura 专有）

与 [neobrutalism-components 文档站](https://neobrutalism.dev/docs) 不同，**不**使用 Public Sans / DM Sans 等组件库推荐字体。

| 语义 | neo-brutalism 默认 | WeReadAura 适配 |
| --- | --- | --- |
| 页面 / 标题字重 | `font-heading`（700） | 同字重；`font-family` 走 `--font-serif`（Source Serif 4 + 方正雅宋） |
| 正文 / 列表字重 | `font-base`（500） | 同字重；同上字体栈 |
| 眉标 / 辅助 | — | `font-biao`（`--biao-font-weight`）对应 `type-caption` / `type-field-label` |
| 划线 / 引用原文 | — | `font-quote`（方正聚珍新仿）对应 `type-quote-preview` |

应用内渲染时，`.neo-prose` 通过 **字重** 对齐 neo-brutalism，**不**覆盖 `globals.css` 的 `font-family`。

## 4. 文档结构（MDX / 长文）

### 4.1 Frontmatter（仅 MDX 文档）

若将来在仓库内写 MDX 说明，沿用 neo-brutalism Velite 约定：

```yaml
---
title: 标题（≤50 字）
description: 简述（≤100 字）
shadcnDocsLink: https://...  # 可选
---
```

### 4.2 页面级标题区（应用内）

与 neo 文档页一致：**页面 H1 与正文 prose 分离**。

```text
[页面 H1]              ← 对应 section-title / type-section-title，非 .neo-prose 内 h1
[描述段，可选]          ← type-section-copy，加 not-prose
[正文 .neo-prose]       ← MD 渲染结果
```

导出 Markdown 无 UI 壳层时，用单个 `#` 作为文档 H1 即可。

### 4.3 标题层级（正文内）

| Markdown | neo-brutalism 间距/字号习惯 | WeReadAura `neo-prose` 映射 |
| --- | --- | --- |
| `#` | `text-2xl` → `sm:text-3xl`，`mb-4`，`font-heading` | `type-section-title`，`scroll-margin-top: 8rem` |
| `##` | `mt-10 mb-6`，`text-xl` → `sm:text-2xl` | `type-card-title-lg` |
| `###` | `mt-8 mb-6`，`text-lg` → `sm:text-xl` | `type-card-title` |
| `####`+ | `lg:text-xl` 等 | `type-field-label` + 加粗 |

规则：

- 正文内 **不要跳级**（例如 `##` 后直接 `####`）。
- 同一文档仅一个 `#`（导出场景为书名；应用内页面 H1 已在壳层）。

### 4.4 段落与行距

- 段后间距：`mt-6`（首段除外）→ `.neo-prose p + p`
- 行高：`leading-7`（约 1.75）→ `line-height: 1.75`
- 字号：`text-sm` → `sm:text-base` → 默认 `type-body`，sm 断点略放大

### 4.5 列表

- 无序列表：`list-disc`，`pl-5`（1.25rem）
- 列表项：`font-base`，`mt-2`，`text-sm` → `sm:text-base`
- 有序列表：同样左边距，`list-decimal`

### 4.6 链接

- 必须带下划线：`text-decoration: underline`
- 字重：标题级字重（700）→ 与 neo `prose-a:font-heading` 一致
- 使用 `type-link` 色：`var(--ink)`，`underline-offset: 4px`
- 外链建议完整 URL；应用内用相对路径

### 4.7 行内代码

对齐 neo 文档 `prose-code:*`：

| 属性 | 值 |
| --- | --- |
| 背景 | `var(--ink)` |
| 文字 | `var(--paper)` |
| 边框 | `2px solid var(--ink)` |
| 圆角 | `var(--radius-sm)` |
| 字号 | `0.875rem` |
| 字重 | 700 |
| 内边距 | `3px 5px` |
| 外边距 | `0 0.125rem` |

禁止用大段行内代码承载正文；仅用于 API 名、字段名、短命令。

### 4.8 代码块（围栏 ```）

对齐 neo `Pre` 组件：

| 属性 | 值 |
| --- | --- |
| 背景 | `var(--ink)` |
| 文字 | `var(--paper)` |
| 边框 | `2px solid var(--ink)` |
| 阴影 | `var(--shadow)`（硬阴影） |
| 字号 | `0.875rem` |
| 内边距 | `1rem` |
| 最大高度 | `300px`，超出滚动 |
| 容器 | 包在 `not-prose` 逻辑块（避免继承段落间距） |

导出 Markdown 中围栏代码块保持 GFM 标准即可；应用内渲染再加样式。

### 4.9 引用块（`>`）

**阅读摘录**（WeReadAura 核心场景）：

- 导出：GFM `>` 续行（见第 6 节）
- 应用内：左边框 `3px solid var(--ink)`，白底，硬阴影可选；正文用 `type-quote-preview` + `font-quote`

**一般说明性引用**（非摘录）：

- 纸底色 `color-mix(paper 88%, white)`
- 同样粗左边框，不用斜体堆砌

### 4.10 强调与粗体

- `**粗体**`：字重 700，不改变字号
- `_斜体_`：尽量少用；阅读分析文案优先粗体 + 结构，不用斜体表达层级

### 4.11 分隔线

- 使用 `---`（前后各空一行）
- 应用内：`border-top: 3px solid var(--ink)`，`margin: 2rem 0`
- 用于章节之间，**不要**连续多条 `---`

### 4.12 表格（GFM）

应用内表格对齐 neo shadcn `Table` 外观：

- `border-collapse: collapse`
- 单元格：`border: 2px solid var(--ink)`
- 表头：白底 + `font-heading` 字重
- 表体：纸底

### 4.13 图片

- 必须写 `alt` 文本
- 应用内：外层 `border: 2px solid var(--ink)`，`box-shadow: var(--shadow)`

### 4.14 自定义 MDX 块（仅应用 / 文档站）

neo-brutalism 文档使用的 JSX 块，WeReadAura **不强制**在导出 MD 中出现，但应用内可选用：

| 块 | 用途 |
| --- | --- |
| `<Warning description="..." />` | 纸底 Alert，粗边框 |
| `<ComponentPreview>` | 组件示例（仅内部文档） |
| shadcn `Table` | 属性表 |

阅读业务导出 **禁止** 嵌入 JSX。

## 5. 应用内容器

### 5.1 用法

```tsx
import { NeoProse } from "@/components/ui/NeoProse";

<NeoProse>
  {/* 渲染后的 <h2> <p> <blockquote> 等 */}
</NeoProse>
```

### 5.2 与页面组件关系

| 场景 | 容器 | 说明 |
| --- | --- | --- |
| 页面 Hero / Section 标题 | `Section` / `section-title` | **outside** `NeoProse` |
| 卡片内短说明 | `type-body` | 不必包 prose |
| 长文 / 导出预览 / 助手富文本 | `NeoProse` | 完整规范 |

### 5.3 `not-prose` 例外

下列内容 **不要** 放在 `neo-prose` 语义样式下（与 neo 文档一致）：

- 页面描述段（`not-prose` + `type-section-copy`）
- 代码块外层工具栏（复制按钮）
- 徽章、按钮、图表卡片
- 目录 TOC 侧栏

## 6. 导出 Markdown（划线 / 笔记）

实现见 `src/lib/highlight-markdown.ts`。与 neo 结构对齐的约定：

### 6.1 文档头（H1 + 元数据）

```markdown
# 书名

**作者：** 作者名  
**导出时间：** 2026年5月20日 15:00  
**条数：** 12（划线与想法）

---
```

- 元数据行用 `**标签：** 值` + 行尾两空格（硬换行）
- 元数据与正文之间 **一条** `---`

### 6.2 章节（H2）

按书籍章节分组：

```markdown
## 第 3 章 标题

```

### 6.3 单条摘录（H3）

**划线**（blockquote + 可选想法）：

```markdown
### 2026-05-15 · 划线

> 引用正文第一行
> 续行仍用 > 前缀

**想法：** 用户笔记内容

```

**想法**（整段想法，无 `>`）：

```markdown
### 想法 · 2026-05-14 · 想法

整段想法正文

```

### 6.4 层级对照

| 导出 MD | 对应 UI 语义 |
| --- | --- |
| `#` 书名 | `section-title` 级 |
| `##` 章节 | `type-card-title-lg` |
| `###` 时间 · 类型 | `type-field-label` + 元信息 |
| `>` 引用 | `type-quote-preview` / `font-quote` |
| `**想法：**` | `type-field-label` + `type-body` |

### 6.5 禁止项（导出）

- 不用 HTML 标签
- 不用 JSX / 组件短代码
- 不用嵌套过深标题（`####` 及以下）
- 不在 `>` 内再嵌套列表（除非确有必要）

## 7. AI 助手输出（已落地）

阅读助手（`POST /api/assistant/chat`）要求模型与降级逻辑均输出 **Neo-brutalism 适配 Markdown**。

| 环节 | 实现 |
| --- | --- |
| 提示词规则 | `src/server/services/assistant/assistant-markdown-rules.ts` |
| 注入系统提示 | `assistant-prompts.ts` |
| 无模型降级 | `assistant-fallback.ts`（JSON 用 ` ```json ` 块） |
| 界面渲染 | `AssistantMarkdown` → `NeoProse` + `react-markdown` + `remark-gfm` |
| 工程规则 | `AGENTS.md` §11.1 |

### 7.1 助手专用约定（在通用规范上的收紧）

- **不用 `#`**：避免在窄侧栏里出现页面级 H1；从 `##` 起笔。
- **数据脚注**：同步状态由服务端在文末追加（`— 基于同步快照…`），模型不必重复。
- **用户消息**：仍为纯文本，不要求用户写 Markdown。

### 7.2 渲染注意

1. 助手气泡内包 `NeoProse`，遵守第 4 节边框/阴影/代码块规则。
2. 摘录类段落优先 `blockquote`（`font-quote`），不用缩进模拟引用。
3. 页内洞察卡片、导出 MD 仍分别见第 5、6 节；勿与助手气泡混用 `section-title`。

## 8. 检查清单

发布前自检：

- [ ] 字体：未引入 neo 文档站推荐字体；引用使用 `font-quote`
- [ ] 标题：层级连续，页面 H1 与正文分离（应用内）
- [ ] 链接：有下划线，色不为浅灰无声对比
- [ ] 行内代码：黑底白字 + 粗边框，非灰底 SaaS 风
- [ ] 代码块：黑底、硬阴影、`max-height` 可滚动
- [ ] 引用：粗左边框；摘录用聚珍体（应用内）
- [ ] 分隔线：`3px` 墨线，非浅灰 `hr`
- [ ] 导出：无 JSX；章节 `##` + 条目 `###` + 划线 `>`

## 9. 变更记录

| 版本 | 日期 | 说明 |
| --- | --- | --- |
| v1.0 | 2026-05-20 | 初版：对齐 neo-brutalism docs `prose-*`，字体适配 WeReadAura |

---

*若与 [frontend-visual-style-guide.md](./frontend-visual-style-guide.md) 冲突，以视觉规范为准；字体与字段排版以 [field-typography-guide.md](./field-typography-guide.md) 为准。*
