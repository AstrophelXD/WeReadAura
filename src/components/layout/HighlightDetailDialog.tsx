"use client";

import { Copy } from "lucide-react";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContentFullscreen,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/Dialog";
import { buildHighlightCopyText, highlightKindLabel } from "@/lib/highlight-content";
import type { HighlightItem } from "@/lib/types";

type HighlightDetailDialogProps = {
  item: HighlightItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HighlightDetailDialog({ item, open, onOpenChange }: HighlightDetailDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!item) {
      return;
    }

    const text = buildHighlightCopyText(item);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [item]);

  if (!item) {
    return null;
  }

  const kind = highlightKindLabel(item);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentFullscreen aria-describedby="highlight-detail-body">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-[var(--ink)] bg-[var(--white)] px-[clamp(1rem,4vw,2rem)] py-5 pr-16">
          <div className="min-w-0 flex-1">
            <DialogTitle className="type-card-title text-left">{item.bookTitle}</DialogTitle>
            <DialogDescription className="type-caption mt-2 text-left">
              {item.chapter} · {item.createdAt}
            </DialogDescription>
            <div className="mt-3">
              <Badge tone="white">{kind}</Badge>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Button type="button" secondary className="min-h-10 px-4 text-sm" onClick={() => void handleCopy()}>
              <Copy className="size-4" aria-hidden />
              {copied ? "已复制" : "复制"}
            </Button>
          </div>
        </header>

        <div
          id="highlight-detail-body"
          className="min-h-0 flex-1 overflow-y-auto bg-[var(--paper)]"
        >
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,5vw,3rem)]">
            <blockquote className="type-quote-display font-quote border-l-4 border-[var(--ink)] pl-6">
              <span aria-hidden>「</span>
              {item.quote}
              <span aria-hidden>」</span>
            </blockquote>
            {item.note ? (
              <div className="type-body-lg mt-10">
                <p className="type-field-label">想法</p>
                <p className="mt-3 leading-relaxed">{item.note}</p>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContentFullscreen>
    </Dialog>
  );
}
