import type { AssistantPageContext } from "@/lib/assistant-types";
import { ASSISTANT_MARKDOWN_OUTPUT_RULES } from "@/server/services/assistant/assistant-markdown-rules";
import type { DataSourceInfo } from "@/server/services/reading-data";

export function buildAssistantSystemPrompt(
  dataSource: DataSourceInfo,
  pageContext?: AssistantPageContext,
): string {
  const dataLines = [
    `数据来源：${dataSource.source}`,
    `同步状态：${dataSource.mode === "live" ? "已同步快照" : dataSource.hasApiKey ? "已配置密钥但未同步" : "演示数据"}`,
    `上次同步：${dataSource.lastSyncedAt}`,
  ];

  const contextLines: string[] = [];
  if (pageContext?.pathname) {
    contextLines.push(`当前页面路径：${pageContext.pathname}`);
  }
  if (pageContext?.bookId) {
    contextLines.push(
      `当前书籍：${pageContext.bookTitle ?? "未知书名"}（ID: ${pageContext.bookId}）`,
    );
  }

  return [
    "你是 WeReadAura 的个人阅读分析助手，只回答与微信读书阅读数据相关的问题。",
    "你必须通过工具获取事实，禁止编造书名、时长、进度、推荐原因或统计趋势。",
    "回答使用简体中文，语气直接、克制，像耐心的阅读教练。",
    "所有时长必须带单位；说明时间范围（本周/本月/本年/累计/最近 30 天等）。",
    dataSource.mode !== "live"
      ? "当前不是真实同步数据：必须在回答开头或结尾明确标注「当前为演示数据」或提示用户去设置页连接并同步。"
      : "当前基于用户最近一次同步快照回答，不要声称数据实时更新。",
    "不要输出心理诊断式结论；用「基于当前数据，你更接近…」这类表述。",
    "若工具返回空或缺失字段，明确说「当前没有该项数据」。",
    ASSISTANT_MARKDOWN_OUTPUT_RULES,
    "数据上下文：",
    ...dataLines.map((line) => `- ${line}`),
    contextLines.length > 0 ? "页面上下文：" : "",
    ...contextLines.map((line) => `- ${line}`),
  ]
    .filter(Boolean)
    .join("\n");
}
