"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { AssistantComposer } from "@/components/features/assistant/AssistantComposer";
import { AssistantMessageList } from "@/components/features/assistant/AssistantMessageList";
import type { AssistantChatResponse, AssistantMessage } from "@/lib/assistant-types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DataSourceInfo } from "@/server/services/reading-data";

function statusBadgeTone(dataSource: DataSourceInfo): "green" | "yellow" | "white" {
  if (dataSource.mode === "live") {
    return "green";
  }
  if (dataSource.hasApiKey) {
    return "yellow";
  }
  return "white";
}

function statusBadgeLabel(dataSource: DataSourceInfo, aiConfigured: boolean): string {
  if (dataSource.mode === "live") {
    return aiConfigured ? "已同步 · AI" : "已同步 · 摘要模式";
  }
  if (dataSource.hasApiKey) {
    return "待同步";
  }
  return "演示数据";
}

export function AssistantPanel({
  onClose,
  dataSource,
  aiConfigured,
}: {
  onClose: () => void;
  dataSource: DataSourceInfo;
  aiConfigured: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<AssistantMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLElement>(null);

  const bookIdFromPath = pathname.startsWith("/books/")
    ? pathname.split("/")[2]
    : undefined;
  const bookId = searchParams.get("bookId") ?? bookIdFromPath ?? undefined;

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) {
        return;
      }

      setError("");
      const nextUser: AssistantMessage = { role: "user", content: trimmed };
      const history = [...messages, nextUser];
      setMessages(history);
      setLoading(true);

      try {
        const response = await fetch("/api/assistant/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            history: messages,
            context: {
              pathname,
              bookId,
            },
          }),
        });

        const payload = (await response.json()) as AssistantChatResponse & { error?: string };

        if (!response.ok) {
          setError(payload.reply ?? "请求失败，请稍后重试。");
          setMessages((prev) => prev.slice(0, -1));
          return;
        }

        setMessages([
          ...history,
          { role: "assistant", content: payload.reply },
        ]);
      } catch {
        setError("网络错误，请检查连接后重试。");
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setLoading(false);
      }
    },
    [bookId, loading, messages, pathname],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <aside
      id="assistant-panel"
      ref={panelRef}
      tabIndex={-1}
      role="complementary"
      aria-labelledby="assistant-panel-title"
      className="app-shell__assistant flex min-h-0 flex-col bg-[var(--paper)]"
    >
      <header className="neo-nav shrink-0">
        <div className="flex min-h-[72px] items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <h2 id="assistant-panel-title" className="type-nav-brand truncate">
              阅读助手
            </h2>
            <p className="type-caption mt-1 truncate text-[var(--ink)]/75">
              {dataSource.mode === "live"
                ? `快照 ${dataSource.lastSyncedAt}`
                : dataSource.hasApiKey
                  ? "请先同步数据"
                  : "演示数据"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone={statusBadgeTone(dataSource)}>
              {statusBadgeLabel(dataSource, aiConfigured)}
            </Badge>
            <Button type="button" plain onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </header>

      <div className="assistant-scroll scrollbar scrollbar--edge-right min-h-0 flex-1 overflow-y-auto">
        <div className="assistant-scroll__body flex min-h-min flex-col px-4 pt-4">
          {error ? (
            <p className="type-caption mb-3 rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--pink)]/30 px-3 py-2">
              {error}
            </p>
          ) : null}
          <AssistantMessageList messages={messages} loading={loading} />
        </div>
      </div>

      <div className="shrink-0">
        <AssistantComposer disabled={loading} onSend={sendMessage} />
      </div>
    </aside>
  );
}
