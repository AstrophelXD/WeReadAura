"use client";

import { AssistantMarkdown } from "@/components/features/assistant/AssistantMarkdown";
import type { AssistantMessage } from "@/lib/assistant-types";
import { cn } from "@/lib/cn";

export function AssistantMessageList({
  messages,
  loading,
}: {
  messages: AssistantMessage[];
  loading: boolean;
}) {
  if (messages.length === 0 && !loading) {
    return (
      <div className="flex flex-1 flex-col justify-center gap-4 px-1 py-6">
        <p className="type-body text-[var(--ink)]/80">
          可以问阅读总览、统计偏好、书架、笔记或单书复盘。回答基于当前同步快照，不会写回微信读书。
        </p>
        <ul className="type-caption grid gap-2 text-[var(--ink)]/70">
          <li>· 未配置 DeepSeek 时，会返回结构化数据摘要</li>
          <li>· 配置 DEEPSEEK_API_KEY 后可获得自然语言解读</li>
        </ul>
      </div>
    );
  }

  return (
    <ul className="flex flex-1 flex-col gap-4 px-1 py-2" aria-live="polite">
      {messages.map((item, index) => (
        <li
          key={`${item.role}-${index}`}
          className={cn(
            "max-w-[92%] rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] px-4 py-3",
            item.role === "user"
              ? "ml-auto bg-[var(--yellow)]"
              : "mr-auto bg-[var(--white)]",
          )}
        >
          <p className="type-caption mb-1 font-biao opacity-70">
            {item.role === "user" ? "你" : "助手"}
          </p>
          {item.role === "assistant" ? (
            <AssistantMarkdown content={item.content} />
          ) : (
            <p className="type-body whitespace-pre-wrap">{item.content}</p>
          )}
        </li>
      ))}
      {loading ? (
        <li className="mr-auto max-w-[92%] rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] px-4 py-3">
          <p className="type-caption font-biao opacity-70">助手</p>
          <p className="type-body">正在读取数据并整理回答…</p>
        </li>
      ) : null}
    </ul>
  );
}
