"use client";

import { useCallback, useState } from "react";

import { HighlightDetailDialog } from "@/components/layout/HighlightDetailDialog";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { highlightKindLabel } from "@/lib/highlight-content";
import type { HighlightItem } from "@/lib/types";

export function HighlightList({ items }: { items: HighlightItem[] }) {
  const [activeItem, setActiveItem] = useState<HighlightItem | null>(null);

  const openItem = useCallback((item: HighlightItem) => {
    setActiveItem(item);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setActiveItem(null);
    }
  }, []);

  if (items.length === 0) {
    return (
      <Card>
        <p className="type-empty">暂无划线或笔记。同步微信读书数据后，这里会展示最近内容。</p>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <Card
            key={item.id}
            pressOnHover
            className="text-left"
            onClick={() => openItem(item)}
            aria-label={`查看${highlightKindLabel(item)}：${item.bookTitle}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="type-label">{item.bookTitle}</p>
              <Badge tone="white">{highlightKindLabel(item)}</Badge>
            </div>
            <p className="type-quote-preview font-quote mt-4 line-clamp-4">
              <span aria-hidden>「</span>
              {item.quote}
              <span aria-hidden>」</span>
            </p>
            {item.note ? <p className="type-caption mt-4 line-clamp-2">想法：{item.note}</p> : null}
            <p className="type-caption mt-4 font-heading">
              {item.chapter} · {item.createdAt}
            </p>
            <p className="type-caption-muted mt-3">点击查看全文</p>
          </Card>
        ))}
      </div>

      <HighlightDetailDialog
        item={activeItem}
        open={activeItem !== null}
        onOpenChange={handleOpenChange}
      />
    </>
  );
}
