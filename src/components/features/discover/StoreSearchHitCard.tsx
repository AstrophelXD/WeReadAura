import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { StoreSearchHit } from "@/lib/types";

export function StoreSearchHitCard({ hit }: { hit: StoreSearchHit }) {
  const { book, onShelf } = hit;

  return (
    <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="type-card-title">{book.title}</p>
          <p className="type-card-subtitle mt-1">{book.author}</p>
          <p className="type-caption mt-2">{book.category}</p>
        </div>
        <Badge tone={onShelf ? "green" : "white"}>{onShelf ? "已在书架" : "未加入"}</Badge>
      </div>
      <p className="type-caption mt-3">{book.summary}</p>
      {onShelf ? (
        <Link className="type-link mt-4 inline-flex" href={`/books/${book.id}`}>
          查看我的阅读进度
        </Link>
      ) : null}
    </div>
  );
}
