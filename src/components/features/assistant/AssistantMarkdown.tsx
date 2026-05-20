"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { NeoProse } from "@/components/ui/NeoProse";
import { cn } from "@/lib/cn";

/**
 * Renders assistant Markdown inside neo-prose (see docs/neo-brutalism-markdown-guide.md).
 */
export function AssistantMarkdown({
  content,
  className,
  variant = "page",
  align = "start",
}: {
  content: string;
  className?: string;
  variant?: "page" | "sidebar" | "embedded";
  /** User messages align end; assistant messages align start. */
  align?: "start" | "end";
}) {
  return (
    <NeoProse
      className={cn(
        "neo-prose--assistant font-biao max-w-none",
        align === "end" && "neo-prose--assistant-user",
        variant === "embedded"
          ? "text-[1.0625rem] leading-[1.6]"
          : variant === "sidebar"
            ? "text-[0.875rem]"
            : "text-[0.875rem] sm:text-base",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </NeoProse>
  );
}
