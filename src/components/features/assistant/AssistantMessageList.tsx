"use client";

import { AssistantMarkdown } from "@/components/features/assistant/AssistantMarkdown";
import type { AssistantMessage } from "@/lib/assistant-types";
import { cn } from "@/lib/cn";

export function AssistantMessageList({
  messages,
  loading,
  variant = "page",
}: {
  messages: AssistantMessage[];
  loading: boolean;
  variant?: "page" | "sidebar";
}) {
  if (messages.length === 0 && !loading) {
    return (
      <div className="assistant-thread__empty flex flex-col justify-center gap-4 py-6">
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
    <ul
      className={cn(
        "assistant-thread",
        variant === "sidebar" && "assistant-thread--sidebar",
      )}
      aria-live="polite"
    >
      {messages.map((item, index) => (
        <li
          key={`${item.role}-${index}`}
          className={cn(
            "assistant-thread__message",
            item.role === "user"
              ? "assistant-thread__message--user"
              : "assistant-thread__message--assistant",
          )}
        >
          <div
            className={
              item.role === "user"
                ? "assistant-thread__user-body"
                : "assistant-thread__assistant-body"
            }
          >
            <AssistantMarkdown
              content={item.content}
              variant={variant}
              align={item.role === "user" ? "end" : "start"}
            />
          </div>
        </li>
      ))}
      {loading ? (
        <li className="assistant-thread__loading assistant-thread__message--assistant">
          <p className="type-body text-[var(--ink)]/70">正在读取数据并整理回答…</p>
        </li>
      ) : null}
    </ul>
  );
}
