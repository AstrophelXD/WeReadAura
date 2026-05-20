import type { AssistantMessage, QuotedHighlight } from "@/lib/assistant-types";
import type { HighlightItem } from "@/lib/types";

const MAX_QUOTED = 5;
const QUOTE_EXCERPT = 280;

function truncate(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max)}…`;
}

export function highlightToQuoted(item: HighlightItem): QuotedHighlight {
  return {
    id: item.id,
    quote: truncate(item.quote, QUOTE_EXCERPT),
    note: item.note ? truncate(item.note, 160) : undefined,
    chapter: item.chapter,
    createdAt: item.createdAt,
  };
}

export function formatQuotedHighlightMarkdown(item: QuotedHighlight): string {
  const lines = [`> 「${item.quote}」`, `> — ${item.chapter} · ${item.createdAt}`];
  if (item.note) {
    lines.push(`> 想法：${item.note}`);
  }
  return lines.join("\n");
}

export function formatQuotedHighlightsBlock(items: QuotedHighlight[]): string {
  if (items.length === 0) {
    return "";
  }
  return ["**引用的笔记**", "", ...items.map(formatQuotedHighlightMarkdown), ""].join("\n\n");
}

/** User-visible message and API payload (same content for history consistency). */
export function buildAssistantUserMessage(
  question: string,
  quoted: QuotedHighlight[],
  options?: { showQuotesInDisplay?: boolean },
): { display: string; message: string } {
  const trimmed = question.trim();
  const block = formatQuotedHighlightsBlock(quoted);
  if (!block) {
    return { display: trimmed, message: trimmed };
  }
  const combined = `${block}\n**问题**\n\n${trimmed}`;
  const showQuotesInDisplay = options?.showQuotesInDisplay ?? true;
  return {
    display: showQuotesInDisplay ? combined : trimmed,
    message: combined,
  };
}

export function toAssistantApiMessages(messages: AssistantMessage[]): AssistantMessage[] {
  return messages.map((item) =>
    item.role === "user" && item.apiContent
      ? { role: item.role, content: item.apiContent }
      : item,
  );
}

const QUOTES_DISPLAY_HEADER = "**引用的笔记**";
const QUESTION_DISPLAY_HEADER = "**问题**";

/** 问问本书：引用已在卡片区展示，对话里只保留用户问题。 */
export function embeddedUserDisplayContent(content: string): string {
  const trimmed = content.trim();
  if (!trimmed.includes(QUOTES_DISPLAY_HEADER)) {
    return trimmed;
  }
  const questionIdx = trimmed.indexOf(QUESTION_DISPLAY_HEADER);
  if (questionIdx >= 0) {
    return trimmed.slice(questionIdx + QUESTION_DISPLAY_HEADER.length).trim();
  }
  const headerIdx = trimmed.indexOf(QUOTES_DISPLAY_HEADER);
  return trimmed.slice(0, headerIdx).trim();
}

export function toggleQuotedHighlight(
  current: QuotedHighlight[],
  item: HighlightItem,
): QuotedHighlight[] {
  const exists = current.some((entry) => entry.id === item.id);
  if (exists) {
    return current.filter((entry) => entry.id !== item.id);
  }
  if (current.length >= MAX_QUOTED) {
    return [...current.slice(1), highlightToQuoted(item)];
  }
  return [...current, highlightToQuoted(item)];
}

export function isHighlightQuoted(current: QuotedHighlight[], id: string): boolean {
  return current.some((entry) => entry.id === id);
}

export const MAX_QUOTED_HIGHLIGHTS = MAX_QUOTED;
