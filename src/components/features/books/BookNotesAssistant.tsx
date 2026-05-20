"use client";

import { MessageSquareQuote, X } from "lucide-react";

import { AssistantChat } from "@/components/features/assistant/AssistantChat";
import { Badge } from "@/components/ui/Badge";
import { MAX_QUOTED_HIGHLIGHTS } from "@/lib/assistant-quote";
import type { QuotedHighlight } from "@/lib/assistant-types";
import { cn } from "@/lib/cn";

export function BookNotesAssistant({
  bookId,
  bookTitle,
  quotedHighlights,
  onRemoveQuote,
}: {
  bookId: string;
  bookTitle: string;
  quotedHighlights: QuotedHighlight[];
  onRemoveQuote: (id: string) => void;
}) {
  return (
    <section
      className="book-notes-assistant mt-10 overflow-hidden border-[3px] border-[var(--ink)] bg-[var(--white)] shadow-[var(--shadow)]"
      aria-label="问问本书"
    >
      <header className="flex flex-wrap items-start justify-between gap-4 border-b-[2px] border-[var(--ink)] bg-[var(--white)] px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          <span
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center border-[2px] border-[var(--ink)] bg-[var(--yellow)]/35"
            aria-hidden
          >
            <MessageSquareQuote className="size-4" strokeWidth={2.25} />
          </span>
          <div className="min-w-0">
            <h2 className="type-section-title">问问本书</h2>
            <p className="type-caption mt-1 text-[var(--ink)]/70">《{bookTitle}》</p>
          </div>
        </div>
        <Badge tone={quotedHighlights.length > 0 ? "green" : "white"}>
          已引用 {quotedHighlights.length}/{MAX_QUOTED_HIGHLIGHTS}
        </Badge>
      </header>

      {quotedHighlights.length > 0 ? (
        <div className="bg-[var(--white)] px-5 py-4">
          <p className="type-caption mb-3 font-biao text-[var(--ink)]/65">引用中的笔记</p>
          <ul className="flex flex-col gap-3">
            {quotedHighlights.map((item, index) => (
              <li
                key={item.id}
                className="book-notes-assistant__quote-card group flex gap-3 p-3"
              >
                <span className="type-caption shrink-0 font-biao tabular-nums text-[var(--ink)]/50">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="type-quote-preview font-quote text-[var(--ink)]">
                    <span aria-hidden>「</span>
                    {item.quote}
                    <span aria-hidden>」</span>
                  </p>
                  {item.note ? (
                    <p className="type-caption mt-1 line-clamp-2 text-[var(--ink)]/70">
                      想法：{item.note}
                    </p>
                  ) : null}
                  <p className="type-caption mt-1 text-[var(--ink)]/50">
                    {item.chapter} · {item.createdAt}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="移除引用"
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center",
                    "border-[2px] border-transparent text-[var(--ink)]/60",
                    "transition-colors hover:border-[var(--ink)] hover:bg-[var(--muted)] hover:text-[var(--ink)]",
                  )}
                  onClick={() => onRemoveQuote(item.id)}
                >
                  <X className="size-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="type-caption bg-[var(--white)] px-5 py-3 text-[var(--ink)]/55">
          在上方笔记卡片点击「引用」，最多 {MAX_QUOTED_HIGHLIGHTS} 条，再向下提问。
        </p>
      )}

      <AssistantChat
        variant="embedded"
        fixedContext={{
          pathname: `/books/${bookId}`,
          bookId,
          bookTitle,
          quotedHighlights,
        }}
        quotedHighlights={quotedHighlights}
      />
    </section>
  );
}
