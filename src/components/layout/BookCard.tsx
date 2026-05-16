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
          <h3 className="text-2xl font-black tracking-[-0.05em]">{book.title}</h3>
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
          <p>{book.minutesRead} min read</p>
          <p>{book.highlights} highlights</p>
          <p>{book.notes} notes</p>
          <p>Last: {book.lastReadAt}</p>
        </div>
      </div>
      <Link className="mt-6 inline-flex font-black underline underline-offset-4" href={`/books/${book.id}`}>
        Open book profile
      </Link>
    </Card>
  );
}
