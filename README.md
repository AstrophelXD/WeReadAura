# WeReadAura 📚✨

> **你的微信读书个人阅读驾驶舱** —— 把书架、时长、划线与推荐，收成一张能复盘、能扫读的 plain neo-brutalism 仪表盘。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](#版权与鸣谢)
[![Vibe Coding](https://img.shields.io/badge/构建方式-Vibe%20Coding-ff6b9d?style=flat-square)](https://github.com/search?q=vibe+coding&type=repositories)

---

## 这是什么？

**WeReadAura** 是一款面向**单个微信读书用户**的阅读分析工具：不替代官方客户端，也不做社交或写回，只做**只读聚合、可视化与复盘**。

你可以用它回答：

- 📖 我最近读了什么、读得怎么样？
- ✍️ 我留下了哪些划线与笔记？
- 📈 阅读节奏与兴趣结构有什么变化？
- 🔍 推荐和我的真实偏好有多贴近？

数据能力基于官方 [微信读书 Skills](https://weread.qq.com/r/weread-skills) 网关；未配置密钥时，项目会用 **Mock 数据** 保持页面可开发、可演示。

---

## ✨ 为什么是 Vibe Coding 项目？

本项目从需求文档到可运行 MVP，走的是典型的 **Vibe Coding** 路径：

| 阶段 | 做法 |
| --- | --- |
| 🧭 先定边界 | PRD、技术方案、视觉规范写在 `docs/`，再写代码 |
| 🤖 人机协作 | 用 AI 辅助迭代页面、适配层与文档，人负责口径与审美拍板 |
| 🎨 感觉优先 | Plain neo-brutalism：粗边框、硬阴影、大标题——**先能读清，再谈炫技** |
| 🔁 小步可回滚 | Mock 先行 → 接 WeRead API → 再接持久化，每一步都能跑起来 |

> **Vibe Coding** 在这里不是「随便写写」，而是：**文档对齐 vibe、实现跟手感走、数据口径必须严肃。**  
> 欢迎 fork、魔改、接自己的 Skills；也欢迎带着你的阅读复盘需求来提 issue。

---

## 当前进度

### ✅ 已具备

- Next.js App Router 全栈骨架
- 总览、书架、统计、划线笔记、发现、书籍详情、设置等页面
- WeRead Skill 同步适配（内存缓存，可回退 Mock）
- 基于 [neobrutalism-components](https://github.com/ekmas/neobrutalism-components) 的 UI 包装层
- 内部 Route Handlers：`/api/dashboard`、`/api/bookshelf`、`/api/stats` 等

### 🚧 规划中

- PostgreSQL 持久化与同步快照
- 核心聚合逻辑的自动化测试
- 导出 / 周报月报等复盘能力

---

## 技术栈

| 层级 | 选型 |
| --- | --- |
| 框架 | Next.js 16 · App Router |
| UI | React 19 · TypeScript |
| 样式 | Tailwind CSS v4 · CSS Variables |
| 图表 | Recharts |
| 组件基座 | Radix UI · neobrutalism-components（本地克隆） |
| 测试 | Vitest（已配置，用例持续补充） |

架构细节见 [docs/technical-architecture.md](docs/technical-architecture.md)。

---

## 快速开始

### 环境要求

- **Node.js** `24+`
- **npm** `11+`
- 能访问 GitHub（`postinstall` 会浅克隆 UI 组件库）

### 安装与启动

```bash
git clone <你的仓库地址>
cd WeReadAura
npm install          # 同时拉取 neobrutalism-components-local/
cp .env.example .env.local
npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。

若 UI 库目录缺失，可手动执行：

```bash
npm run setup:neobrutalism
```

### 接入微信读书数据

1. 登录 [微信读书 Skills](https://weread.qq.com/r/weread-skills)，复制 API Key（`wrk-...`）。
2. 写入 `.env.local` 的 `WEREAD_API_KEY`，或在应用内 **设置** 页保存。
3. 点击 **立即同步**，拉取书架、统计、划线与推荐。

未配置密钥时，全站使用 `src/lib/mock-data.ts` 中的示例数据。

### 常用命令

```bash
npm run lint      # ESLint
npm run build     # 生产构建
npm run start     # 生产启动
npm run test      # Vitest 单次运行
```

---

## 项目结构

```text
WeReadAura/
├── docs/                              # 产品、视觉、架构文档
├── neobrutalism-components-local/     # UI 库本地克隆（gitignore，不入库）
├── scripts/setup-neobrutalism.mjs     # 安装时克隆 neobrutalism-components
├── src/
│   ├── app/                           # 页面与 API Routes
│   ├── components/                    # UI 包装、布局、业务组件
│   ├── lib/                           # 类型、Mock、工具函数
│   ├── server/                        # WeRead 适配、同步、数据服务
│   └── styles/                        # 主题 token、排版
├── AGENTS.md                          # 工程协作规则（给人和 AI 看）
└── README.md                          # 你正在看的文件
```

---

## 文档索引

| 文档 | 说明 |
| --- | --- |
| [weread-reading-analytics-prd.md](docs/weread-reading-analytics-prd.md) | 产品需求与范围 |
| [technical-architecture.md](docs/technical-architecture.md) | 技术方案与分层 |
| [frontend-visual-style-guide.md](docs/frontend-visual-style-guide.md) | Plain neo-brutalism 视觉规范 |
| [field-typography-guide.md](docs/field-typography-guide.md) | 字段排版与 `type-*` 用法 |
| [weread-api-integration.md](docs/weread-api-integration.md) | WeRead 接入说明 |
| [AGENTS.md](AGENTS.md) | 编码、数据口径与安全约定 |

---

## 设计说明

界面方向：**朴素、直接、像印刷品** —— 受 Gumroad 首页式 plain neo-brutalism 启发，但色板、字体与业务组件（`MetricCard`、`BookCard` 等）均为 WeReadAura 自有 token。

- 纸张感浅底 · 黑色描边 · 无 blur 硬阴影  
- 字体栈以 `layout.tsx` / `globals.css` 为准（非组件库默认字体）  
- 禁止 glassmorphism、模板化 SaaS 渐变与「为炫而炫」的 landing 堆砌  

---

## 隐私与安全

- 阅读数据视为**敏感个人信息**；请勿将 API Key 提交到公开仓库。  
- 日志中避免输出完整笔记正文或令牌。  
- 本项目**非腾讯/微信读书官方产品**，与微信读书品牌无隶属关系。

---

## 版权与鸣谢

### 本项目

- 仓库代码默认采用 **MIT License**（见 `package.json`；正式分发建议补全根目录 `LICENSE` 文件）。  
- **WeReadAura** 名称与业务逻辑归本仓库维护者；使用微信读书数据须遵守腾讯相关服务条款。

### 第三方与灵感来源

| 对象 | 说明 | 许可 / 关系 |
| --- | --- | --- |
| [neobrutalism-components](https://github.com/ekmas/neobrutalism-components) | **ekmas** 出品的 neo-brutalism 基础组件；本项目通过 `neobrutalism-components-local/` 浅克隆，经 `src/components/ui/` 二次包装使用 | [MIT](https://github.com/ekmas/neobrutalism-components/blob/main/LICENSE) |
| [Radix UI](https://www.radix-ui.com/) | Dialog、Slot 等无障碍原语 | MIT |
| [Recharts](https://recharts.org/) | 图表渲染 | MIT |
| [Lucide](https://lucide.dev/) | 图标 | ISC |
| [Tailwind CSS](https://tailwindcss.com/) | 样式工具链 | MIT |
| [Next.js](https://nextjs.org/) / [React](https://react.dev/) | 应用框架 | MIT |
| **微信读书 / WeRead** | Skills API 与阅读数据来源 | 版权归腾讯所有；本项目为独立第三方工具 |
| **Gumroad** | 首页式 plain、功能优先的版式气质参考 | 设计灵感，无代码拷贝关系 |

安装 `npm install` 时执行的 `scripts/setup-neobrutalism.mjs` 会从 GitHub 拉取 **ekmas/neobrutalism-components**；感谢作者开源维护。

如对某一依赖的署名或许可有疑问，欢迎提 issue 指正。

---

## 参与与反馈

- 先读 [AGENTS.md](AGENTS.md) 与 `docs/`，再动刀，保持数据口径一致。  
- Bug、想法、复盘场景欢迎开 Issue / PR。  
- **Vibe 可以松，统计不能糊。**

---

<p align="center">
  <sub>Made with 📖 and good vibes · 非官方 · 仅供个人阅读分析</sub>
</p>
