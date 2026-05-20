"use client";

import { useState } from "react";

import { ASSISTANT_QUICK_PROMPTS } from "@/lib/assistant-types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const BOOK_QUICK_PROMPTS = [
  {
    id: "book-meaning",
    label: "这本书对我意味着什么",
    message: "结合当前这本书的阅读进度、划线和投入，帮我复盘它对我意味着什么？",
  },
  {
    id: "book-reread",
    label: "是否值得重读",
    message: "基于当前数据，这本书是否值得我重读或继续读完？请给出依据。",
  },
] as const;

export function AssistantComposer({
  disabled,
  onSend,
  variant = "page",
  pathname = "",
}: {
  disabled: boolean;
  onSend: (message: string) => void;
  variant?: "page" | "sidebar";
  pathname?: string;
}) {
  const quickPrompts = pathname.startsWith("/books/")
    ? [...BOOK_QUICK_PROMPTS, ...ASSISTANT_QUICK_PROMPTS.slice(0, 1)]
    : ASSISTANT_QUICK_PROMPTS;
  const [draft, setDraft] = useState("");

  function submit(event?: React.FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || disabled) {
      return;
    }
    onSend(text);
    setDraft("");
  }

  return (
    <div className="border-t-[3px] border-[var(--ink)] bg-[var(--paper)]">
      <div className={variant === "sidebar" ? "px-3 py-3" : "container-shell py-4"}>
        <div className="mb-3 flex flex-wrap gap-2">
          {quickPrompts.map((item) => (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              className="type-caption rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--white)] px-3 py-1.5 font-biao transition-transform hover:-translate-y-px disabled:opacity-50 motion-reduce:transition-none"
              onClick={() => onSend(item.message)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={submit}>
          <label className="flex-1">
            <span className="sr-only">输入问题</span>
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="例如：我最近读得怎么样？"
              disabled={disabled}
            />
          </label>
          <Button type="submit" disabled={disabled || !draft.trim()} className="sm:shrink-0">
            发送
          </Button>
        </form>
      </div>
    </div>
  );
}
