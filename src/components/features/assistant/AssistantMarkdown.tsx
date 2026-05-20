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
}: {
  content: string;
  className?: string;
}) {
  return (
    <NeoProse className={cn("neo-prose--assistant max-w-none text-[0.875rem] sm:text-base", className)}>
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
