"use client";

import { useCallback, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { AssistantComposer } from "@/components/features/assistant/AssistantComposer";
import { AssistantMessageList } from "@/components/features/assistant/AssistantMessageList";
import { buildAssistantUserMessage, toAssistantApiMessages } from "@/lib/assistant-quote";
import { cn } from "@/lib/cn";
import type {
  AssistantChatResponse,
  AssistantMessage,
  AssistantPageContext,
  QuotedHighlight,
} from "@/lib/assistant-types";
import type { AssistantStreamEvent } from "@/lib/insight-types";
import type { DataSourceInfo } from "@/server/services/reading-data";

async function consumeAssistantStream(
  response: Response,
  onEvent: (event: AssistantStreamEvent) => void,
): Promise<void> {
  if (!response.body) {
    throw new Error("无流式响应体");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      for (const line of chunk.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          continue;
        }
        const payload = trimmed.slice(5).trim();
        if (payload === "[DONE]") {
          return;
        }
        onEvent(JSON.parse(payload) as AssistantStreamEvent);
      }
    }
  }
}

export function AssistantChat({
  variant = "page",
  scrollClassName,
  bodyClassName,
  fixedContext,
  quotedHighlights = [],
}: {
  variant?: "page" | "sidebar" | "embedded";
  scrollClassName?: string;
  bodyClassName?: string;
  /** 嵌入单书页等场景：固定路由上下文 */
  fixedContext?: AssistantPageContext;
  quotedHighlights?: QuotedHighlight[];
}) {
  const resolvedScrollClassName =
    scrollClassName ??
    (variant === "embedded"
      ? "scrollbar max-h-[min(28rem,45vh)] overflow-y-auto"
      : variant === "sidebar"
        ? "scrollbar scrollbar--edge-right min-h-0 flex-1 overflow-y-auto"
        : "scrollbar scrollbar--page-gutter min-h-0 flex-1 overflow-y-auto");
  const resolvedBodyClassName =
    bodyClassName ??
    (variant === "embedded"
      ? "flex min-h-min flex-col px-5 py-4"
      : variant === "sidebar"
        ? "flex min-h-min flex-col px-3 py-3"
        : "container-shell flex min-h-min flex-col py-4");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [lastUsedTools, setLastUsedTools] = useState<string[]>([]);

  const bookIdFromPath = pathname.startsWith("/books/")
    ? pathname.split("/")[2]
    : undefined;
  const bookId =
    fixedContext?.bookId ?? searchParams.get("bookId") ?? bookIdFromPath ?? undefined;

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) {
        return;
      }

      setError("");
      setLastUsedTools([]);
      const { display, message } = buildAssistantUserMessage(trimmed, quotedHighlights, {
        showQuotesInDisplay: variant !== "embedded",
      });
      const nextUser: AssistantMessage = {
        role: "user",
        content: display,
        ...(variant === "embedded" && message !== display ? { apiContent: message } : {}),
      };
      const apiHistory = toAssistantApiMessages([...messages, nextUser]);
      const history = [...messages, nextUser];
      setMessages([...history, { role: "assistant", content: "" }]);
      setLoading(true);
      setStreaming(true);

      const context: AssistantPageContext = {
        pathname: fixedContext?.pathname ?? pathname,
        bookId,
        bookTitle: fixedContext?.bookTitle,
        quotedHighlights:
          quotedHighlights.length > 0 ? quotedHighlights : undefined,
      };

      try {
        const streamResponse = await fetch("/api/assistant/chat/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: apiHistory,
            context,
          }),
        });

        if (streamResponse.ok && streamResponse.headers.get("content-type")?.includes("text/event-stream")) {
          let assistantText = "";
          await consumeAssistantStream(streamResponse, (event) => {
            if (event.type === "delta") {
              assistantText += event.text;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: assistantText };
                return next;
              });
            }
            if (event.type === "done") {
              setLastUsedTools(event.usedTools);
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = { role: "assistant", content: event.reply };
                return next;
              });
            }
            if (event.type === "error") {
              throw new Error(event.message);
            }
          });
          return;
        }

        const response = await fetch("/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            history: apiHistory,
            context,
          }),
        });

        const payload = (await response.json()) as AssistantChatResponse & { error?: string };

        if (!response.ok) {
          setError(payload.reply ?? "请求失败，请稍后重试。");
          setMessages(history);
          return;
        }

        setLastUsedTools(payload.usedTools);
        setMessages([...history, { role: "assistant", content: payload.reply }]);
      } catch {
        setError("网络错误，请检查连接后重试。");
        setMessages(history);
      } finally {
        setLoading(false);
        setStreaming(false);
      }
    },
    [bookId, fixedContext?.bookTitle, fixedContext?.pathname, loading, messages, pathname, quotedHighlights],
  );

  const composerPathname = fixedContext?.pathname ?? pathname;

  const showThread = messages.length > 0 || loading || streaming || Boolean(error);

  return (
    <div
      className={
        variant === "embedded" ? "flex flex-col" : "flex min-h-0 flex-1 flex-col"
      }
    >
      {showThread ? (
        <div className={resolvedScrollClassName}>
          <div className={resolvedBodyClassName}>
            {error ? (
              <p
                className={cn(
                  "type-caption mb-3 border-[2px] border-[var(--ink)] bg-[var(--pink)]/30 px-3 py-2",
                  variant === "embedded" ? "" : "rounded-[var(--radius-sm)]",
                )}
              >
                {error}
              </p>
            ) : null}
            <AssistantMessageList
              messages={messages}
              loading={loading && !streaming}
              variant={variant}
            />
            {lastUsedTools.length > 0 ? (
              <p className="type-caption mt-4 text-[var(--ink)]/55">
                读取：{lastUsedTools.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      <div className="shrink-0">
        <AssistantComposer
          disabled={loading}
          onSend={sendMessage}
          variant={variant}
          pathname={composerPathname}
          placeholder={
            variant === "embedded"
              ? quotedHighlights.length > 0
                ? "结合已引用的笔记提问…"
                : "可先在上方笔记卡片点「引用」，或直接提问本书…"
              : undefined
          }
          quickPromptsOverride={
            variant === "embedded"
              ? [
                  {
                    id: "themes",
                    label: "引用在讲什么",
                    message:
                      quotedHighlights.length > 0
                        ? "请解读我引用的这些笔记，它们主要在讨论什么？"
                        : "这本书里我的划线和想法主要在关注什么？",
                  },
                  {
                    id: "best",
                    label: "哪条最值得回顾",
                    message: "哪一条划线或想法最值得我回顾？请说明理由。",
                  },
                ]
              : undefined
          }
        />
      </div>
    </div>
  );
}

export function assistantStatusBadgeTone(
  dataSource: DataSourceInfo,
): "green" | "yellow" | "white" {
  if (dataSource.mode === "live") {
    return "green";
  }
  if (dataSource.hasApiKey) {
    return "yellow";
  }
  return "white";
}

export function assistantStatusBadgeLabel(
  dataSource: DataSourceInfo,
  aiConfigured: boolean,
): string {
  if (dataSource.mode === "live") {
    return aiConfigured ? "已同步 · AI" : "已同步 · 摘要模式";
  }
  if (dataSource.hasApiKey) {
    return "待同步";
  }
  return "演示数据";
}

export function assistantStatusCaption(dataSource: DataSourceInfo): string {
  if (dataSource.mode === "live") {
    return `快照 ${dataSource.lastSyncedAt}`;
  }
  if (dataSource.hasApiKey) {
    return "请先同步数据";
  }
  return "演示数据";
}
