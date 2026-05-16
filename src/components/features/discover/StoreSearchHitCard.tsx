"use client";

import { BookRecommendValue } from "@/components/features/books/BookRecommendValue";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Book, StoreSearchHit } from "@/lib/types";

type StoreSearchHitCardProps = {
  hit: StoreSearchHit;
  onViewDetails: (book: Book) => void;
};

export function StoreSearchHitCard({ hit, onViewDetails }: StoreSearchHitCardProps) {
  const { book, onShelf } = hit;

  return (
    <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="type-card-title">{book.title}</p>
          <p className="type-card-subtitle mt-1">{book.author}</p>
          <p className="type-caption mt-2">{book.category}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge tone={onShelf ? "green" : "white"}>{onShelf ? "已在书架" : "未加入"}</Badge>
          <BookRecommendValue book={book} align="end" showLabel={false} />
        </div>
      </div>
      <p className="type-caption mt-3 line-clamp-2">{book.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" className="min-h-10 w-auto px-4 text-sm" onClick={() => onViewDetails(book)}>
          查看详情
        </Button>
        {onShelf ? (
          <Button href={`/books/${book.id}`} secondary className="min-h-10 w-auto px-4 text-sm">
            我的阅读
          </Button>
        ) : null}
      </div>
    </div>
  );
}
