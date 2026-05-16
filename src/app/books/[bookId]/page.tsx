import { notFound } from "next/navigation";

import { HighlightList } from "@/components/layout/HighlightList";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { formatDurationLabel } from "@/lib/formatters";
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
    <Section title={book.title} eyebrow="书籍详情" description={book.summary}>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={book.coverTone}>{book.category}</Badge>
            <Badge tone="white">{statusLabel(book.status)}</Badge>
          </div>
          <p className="type-card-subtitle mt-5">{book.author}</p>
          <p className="type-metric-lg mt-6">{book.progress}%</p>
          <p className="type-field-label mt-2">当前进度</p>
          <div className="mt-6 h-5 rounded-[999px] border-[2px] border-[var(--ink)] bg-[var(--muted)]">
            <div className="h-full rounded-[999px] bg-[var(--ink)]" style={{ width: `${book.progress}%` }} />
          </div>
        </Card>
        <Card>
          <p className="type-card-title-lg">阅读轨迹</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <p className="type-field-label">开始阅读</p>
              <p className="type-card-title mt-2">{book.startedAt || "—"}</p>
            </div>
            <div>
              <p className="type-field-label">最近阅读</p>
              <p className="type-card-title mt-2">{book.lastReadAt || "—"}</p>
            </div>
            <div>
              <p className="type-field-label">阅读时长</p>
              <p className="type-card-title mt-2">
                {book.minutesRead > 0 ? formatDurationLabel(book.minutesRead * 60) : "—"}
              </p>
            </div>
            <div>
              <p className="type-field-label">想法 / 划线</p>
              <p className="type-card-title mt-2">
                {book.notes} / {book.highlights}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <div className="mt-8">
        <p className="type-caption mb-4">
          共 {bookHighlights.length} 条（{book.notes} 条想法、{book.highlights} 条划线）
        </p>
        <HighlightList items={bookHighlights} />
      </div>
    </Section>
  );
}
