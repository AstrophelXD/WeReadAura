import type { AssistantChatRequest, AssistantMessage } from "@/lib/assistant-types";
import type { DataSourceInfo } from "@/server/services/reading-data";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 8;

export function sanitizeUserMessage(raw: string): string {
  return raw.trim().slice(0, MAX_MESSAGE_LENGTH);
}

export function sanitizeHistory(history: AssistantMessage[] | undefined): AssistantMessage[] {
  if (!history?.length) {
    return [];
  }

  return history
    .filter((item) => item.role === "user" || item.role === "assistant")
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_HISTORY_TURNS * 2);
}

export function validateChatRequest(body: AssistantChatRequest): string | null {
  const message = sanitizeUserMessage(body.message ?? "");
  if (!message) {
    return "请输入问题。";
  }
  return null;
}

export function buildDataStatusNotice(dataSource: DataSourceInfo): string {
  if (dataSource.mode === "live") {
    return `基于同步快照（${dataSource.lastSyncedAt}）`;
  }
  if (dataSource.hasApiKey) {
    return "已配置微信读书，但尚未同步；回答可能不完整";
  }
  return "当前为演示数据";
}

export function needsSyncHint(dataSource: DataSourceInfo): boolean {
  return dataSource.hasApiKey && dataSource.mode !== "live";
}

export function isDemoData(dataSource: DataSourceInfo): boolean {
  return dataSource.mode !== "live";
}
