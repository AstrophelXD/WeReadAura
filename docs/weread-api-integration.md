# WeRead Skill API 接入说明

本项目通过官方 [微信读书 Skill](https://weread.qq.com/r/weread-skills) 的 Agent Gateway 拉取个人阅读数据。

## 网关

- URL: `POST https://i.weread.qq.com/api/agent/gateway`
- Header: `Authorization: Bearer <WEREAD_API_KEY>`
- Body: JSON，业务参数与 `api_name`、`skill_version` 平铺在同一层

## 已接入接口

| 能力 | api_name |
| --- | --- |
| 书架 | `/shelf/sync` |
| 阅读统计 | `/readdata/detail` |
| 笔记本概览 | `/user/notebooks` |
| 单书划线 | `/book/bookmarklist` |
| 单书想法 | `/review/list/mine` |
| 书籍详情 | `/book/info` |
| 阅读进度 | `/book/getprogress` |
| 书城搜索 | `/store/search` |
| 个性化推荐 | `/book/recommend` |

实现位置：`src/server/adapters/weread/`。

## 鉴权

- 环境变量 `WEREAD_API_KEY`（服务端）
- 或 Settings 页保存到 HTTP-only Cookie `weread_api_key`

密钥不会写入仓库；日志中不输出完整 key。

## 同步流程

`POST /api/sync` 会依次拉取书架、本月/累计统计、笔记本、推荐，并为部分书籍补充进度与最近划线，结果缓存在进程内存中供页面与 API 读取。

## 参考

- 官方 Skill 包：`https://cdn.weread.qq.com/skills/weread-skills.zip`
- 产品需求：[weread-reading-analytics-prd.md](./weread-reading-analytics-prd.md)
- 技术方案：[technical-architecture.md](./technical-architecture.md)
