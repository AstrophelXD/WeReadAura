"use client";

import { useState } from "react";

import { ASSISTANT_QUICK_PROMPTS } from "@/lib/assistant-types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AssistantComposer({
  disabled,
  onSend,
}: {
  disabled: boolean;
  onSend: (message: string) => void;
}) {
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
    <div className="border-t-[3px] border-[var(--ink)] bg-[var(--paper)] p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {ASSISTANT_QUICK_PROMPTS.map((item) => (
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
  );
}
