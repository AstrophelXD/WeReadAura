import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import type { StoreSearchHit } from "@/lib/types";

export function StoreSearchHitCard({ hit }: { hit: StoreSearchHit }) {
  const { book, onShelf } = hit;

  return (
    <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xl font-bold tracking-[-0.03em]">{book.title}</p>
          <p className="mt-1 font-semibold">{book.author}</p>
          <p className="mt-2 text-sm font-medium">{book.category}</p>
        </div>
        <Badge tone={onShelf ? "green" : "white"}>{onShelf ? "已在书架" : "未加入"}</Badge>
      </div>
      <p className="mt-3 text-sm font-medium leading-6">{book.summary}</p>
      {onShelf ? (
        <Link className="mt-4 inline-flex font-semibold underline underline-offset-4" href={`/books/${book.id}`}>
          查看我的阅读进度
        </Link>
      ) : null}
    </div>
  );
}
