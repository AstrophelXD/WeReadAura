import type { DataMode } from "@/server/services/reading-data";

export type AssistantRole = "user" | "assistant";

export interface AssistantMessage {
  role: AssistantRole;
  /** UI / 历史展示 */
  content: string;
  /** 发给模型时用；嵌入「问问本书」时引用仅在上方展示，此处带完整上下文 */
  apiContent?: string;
}

export interface QuotedHighlight {
  id: string;
  quote: string;
  note?: string;
  chapter: string;
  createdAt: string;
}

export interface AssistantPageContext {
  pathname: string;
  bookId?: string;
  bookTitle?: string;
  /** 用户在单书页引用的划线/想法（已截断） */
  quotedHighlights?: QuotedHighlight[];
}

export interface AssistantChatRequest {
  message: string;
  history?: AssistantMessage[];
  context?: AssistantPageContext;
}

export interface AssistantDataSourceStatus {
  mode: DataMode;
  source: string;
  lastSyncedAt: string;
  hasApiKey: boolean;
  aiConfigured: boolean;
}

export interface AssistantChatResponse {
  reply: string;
  usedTools: string[];
  dataSource: AssistantDataSourceStatus;
  needsSync: boolean;
  isDemo: boolean;
  error?: string;
}

export const ASSISTANT_QUICK_PROMPTS = [
  { id: "recent", label: "最近读得怎么样", message: "根据当前数据，我最近读得怎么样？" },
  { id: "stats", label: "本月偏好什么", message: "这个月我更偏好什么类型的书？请结合统计数据说明。" },
  { id: "books", label: "哪本书投入最多", message: "最近哪几本书我投入的阅读时间最多？" },
] as const;
