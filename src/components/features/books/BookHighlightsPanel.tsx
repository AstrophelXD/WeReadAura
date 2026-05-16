"use client";

import { Download } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { HighlightList } from "@/components/layout/HighlightList";
import { ListPagination } from "@/components/layout/ListPagination";
import { Button } from "@/components/ui/Button";
import { downloadTextFile, sanitizeFilenameSegment } from "@/lib/download-text";
import { buildBookHighlightsMarkdown } from "@/lib/highlight-markdown";
import { BOOK_HIGHLIGHTS_PAGE_SIZE, paginateSlice } from "@/lib/pagination";
import type { HighlightItem } from "@/lib/types";

type BookHighlightsPanelProps = {
  bookTitle: string;
  bookAuthor: string;
  items: HighlightItem[];
  noteCount: number;
  highlightCount: number;
};

export function BookHighlightsPanel({
  bookTitle,
  bookAuthor,
  items,
  noteCount,
  highlightCount,
}: BookHighlightsPanelProps) {
  const [page, setPage] = useState(1);

  const handleExportMarkdown = useCallback(() => {
    const markdown = buildBookHighlightsMarkdown({ title: bookTitle, author: bookAuthor }, items);
    const filename = `${sanitizeFilenameSegment(bookTitle)}-划线与想法.md`;
    downloadTextFile(filename, markdown);
  }, [bookAuthor, bookTitle, items]);

  const { slice, page: safePage, pageCount } = useMemo(
    () => paginateSlice(items, page, BOOK_HIGHLIGHTS_PAGE_SIZE),
    [items, page],
  );

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="type-caption">
          共 {items.length} 条（{noteCount} 条想法、{highlightCount} 条划线）
        </p>
        <Button
          type="button"
          secondary
          className="min-h-10 w-auto px-4 text-sm"
          disabled={items.length === 0}
          onClick={handleExportMarkdown}
        >
          <Download className="size-4" aria-hidden />
          导出 Markdown
        </Button>
      </div>
      <HighlightList items={slice} variant="book" />
      <ListPagination currentPage={safePage} pageCount={pageCount} onPageChange={setPage} />
    </>
  );
}
