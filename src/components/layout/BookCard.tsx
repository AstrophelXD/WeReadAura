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
          <h3 className="text-2xl font-bold tracking-[-0.03em]">{book.title}</h3>
          <p className="mt-1 font-semibold">{book.author}</p>
        </div>
        <Badge tone={book.coverTone}>{book.category}</Badge>
      </div>
      <p className="text-sm font-medium leading-6">{book.summary}</p>
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-sm font-bold">
          <span>{statusLabel(book.status)}</span>
          <span>{book.progress}%</span>
        </div>
        <div className="h-4 rounded-[999px] border-[2px] border-[var(--ink)] bg-[var(--muted)]">
          <div
            className="h-full rounded-[999px] bg-[var(--ink)]"
            style={{ width: `${book.progress}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-semibold">
          <p>已读 {book.minutesRead} 分钟</p>
          <p>{book.highlights} 条划线</p>
          <p>{book.notes} 条想法</p>
          <p>最近：{book.lastReadAt || "—"}</p>
        </div>
      </div>
      <Link className="mt-6 inline-flex font-semibold underline underline-offset-4" href={`/books/${book.id}`}>
        查看书籍详情
      </Link>
    </Card>
  );
}
