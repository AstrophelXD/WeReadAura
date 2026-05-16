import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Book } from "@/lib/types";
import { statusLabel } from "@/lib/utils";

export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="h-full">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="type-card-title-lg">{book.title}</h3>
          <p className="type-card-subtitle mt-1">{book.author}</p>
        </div>
        <Badge tone={book.coverTone}>{book.category}</Badge>
      </div>
      <p className="type-caption">{book.summary}</p>
      <div className="mt-5 space-y-3">
        <div className="type-caption flex items-center justify-between">
          <span>{statusLabel(book.status)}</span>
          <span>{book.progress}%</span>
        </div>
        <div className="h-4 rounded-[999px] border-[2px] border-[var(--ink)] bg-[var(--muted)]">
          <div
            className="h-full rounded-[999px] bg-[var(--ink)]"
            style={{ width: `${book.progress}%` }}
          />
        </div>
        <div className="type-caption grid grid-cols-2 gap-3">
          <p>已读 {book.minutesRead} 分钟</p>
          <p>{book.highlights} 条划线</p>
          <p>{book.notes} 条想法</p>
          <p>最近：{book.lastReadAt || "—"}</p>
        </div>
      </div>
      <Link className="type-link mt-6 inline-flex" href={`/books/${book.id}`}>
        查看书籍详情
      </Link>
    </Card>
  );
}
