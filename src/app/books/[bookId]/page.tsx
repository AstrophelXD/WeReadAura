import { notFound } from "next/navigation";

import { HighlightList } from "@/components/layout/HighlightList";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { statusLabel } from "@/lib/utils";
import { getBookDetail } from "@/server/services/reading-data";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const detail = await getBookDetail(bookId);

  if (!detail) {
    notFound();
  }

  const { book, highlights: bookHighlights } = detail;

  return (
    <Section
      title={book.title}
      eyebrow="Book profile"
      description={book.summary}
    >
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={book.coverTone}>{book.category}</Badge>
            <Badge tone="white">{statusLabel(book.status)}</Badge>
          </div>
          <p className="mt-5 text-lg font-semibold">{book.author}</p>
          <p className="mt-6 text-6xl font-bold tracking-[-0.04em]">{book.progress}%</p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.04em] tracking-[0.08em]">Current progress</p>
          <div className="mt-6 h-5 rounded-[999px] border-[2px] border-[var(--ink)] bg-[var(--muted)]">
            <div className="h-full rounded-[999px] bg-[var(--ink)]" style={{ width: `${book.progress}%` }} />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.04em] tracking-[0.08em]">Reading trail</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.04em]">Started</p>
              <p className="mt-2 text-xl font-bold">{book.startedAt}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.04em]">Last read</p>
              <p className="mt-2 text-xl font-bold">{book.lastReadAt}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.04em]">Minutes read</p>
              <p className="mt-2 text-xl font-bold">{book.minutesRead}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.04em]">Notes / highlights</p>
              <p className="mt-2 text-xl font-bold">
                {book.notes} / {book.highlights}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-8">
        <HighlightList items={bookHighlights} />
      </div>
    </Section>
  );
}
