import type { HighlightItem } from "@/lib/types";

export type NotesRangeFilter = "all" | "30d";

export interface NotesQuery {
  q?: string;
  bookId?: string;
  range?: NotesRangeFilter;
}

export const NOTES_RANGE_OPTIONS: { value: NotesRangeFilter; label: string }[] = [
  { value: "all", label: "全部时间" },
  { value: "30d", label: "最近 30 天" },
];

function cutoffForRange(range: NotesRangeFilter): number {
  if (range === "30d") {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.getTime();
  }
  return 0;
}

export function applyNotesQuery(items: HighlightItem[], query: NotesQuery): HighlightItem[] {
  const normalized = query.q?.trim().toLowerCase();
  const bookId = query.bookId?.trim();
  const range = query.range ?? "all";
  const cutoff = cutoffForRange(range);

  return items.filter((item) => {
    if (bookId && item.bookId !== bookId) {
      return false;
    }

    if (cutoff > 0) {
      const created = Date.parse(item.createdAt);
      if (!created || created < cutoff) {
        return false;
      }
    }

    if (!normalized) {
      return true;
    }

    return (
      item.bookTitle.toLowerCase().includes(normalized) ||
      item.quote.toLowerCase().includes(normalized) ||
      item.note?.toLowerCase().includes(normalized) ||
      item.chapter.toLowerCase().includes(normalized)
    );
  });
}

export function buildNoteBookOptions(items: HighlightItem[]): { id: string; title: string }[] {
  const map = new Map<string, string>();
  for (const item of items) {
    if (!map.has(item.bookId)) {
      map.set(item.bookId, item.bookTitle);
    }
  }

  return Array.from(map.entries())
    .map(([id, title]) => ({ id, title }))
    .sort((left, right) => left.title.localeCompare(right.title, "zh-CN"));
}

export function parseNotesQuery(params: {
  q?: string;
  bookId?: string;
  range?: string;
}): NotesQuery {
  return {
    q: params.q,
    bookId: params.bookId,
    range: params.range === "30d" ? "30d" : "all",
  };
}
