import type { HighlightItem } from "@/lib/types";

export type HighlightSortMode = "chapter" | "time";

/** 想法、无章节等排在目录章节之后 */
export const HIGHLIGHT_CHAPTER_ORDER_END = 10_000_000;

export const HIGHLIGHT_SORT_OPTIONS: { value: HighlightSortMode; label: string }[] = [
  { value: "chapter", label: "按章节" },
  { value: "time", label: "按时间" },
];

export function highlightCreatedAtTime(item: HighlightItem): number {
  if (item.createdAtTime && item.createdAtTime > 0) {
    return item.createdAtTime;
  }
  const parsed = Date.parse(item.createdAt);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return Math.floor(parsed / 1000);
}

export function buildChapterOrderMap(
  chapters: Array<{ chapterUid: number; chapterIdx?: number }>,
): Map<number, number> {
  const sorted = [...chapters].sort((left, right) => {
    if (left.chapterIdx !== undefined && right.chapterIdx !== undefined) {
      return left.chapterIdx - right.chapterIdx;
    }
    return left.chapterUid - right.chapterUid;
  });
  return new Map(sorted.map((chapter, index) => [chapter.chapterUid, index]));
}

export function buildChapterTitleOrderMap(
  chapters: Array<{ chapterUid: number; title: string; chapterIdx?: number }>,
): Map<string, number> {
  const uidOrder = buildChapterOrderMap(chapters);
  return new Map(chapters.map((chapter) => [chapter.title, uidOrder.get(chapter.chapterUid) ?? 9999]));
}

export function inferChapterOrderFromTitle(chapter: string): number {
  const trimmed = chapter.trim();
  if (!trimmed || trimmed === "想法" || trimmed === "划线") {
    return HIGHLIGHT_CHAPTER_ORDER_END;
  }
  const match = trimmed.match(/(\d+)/);
  if (match) {
    return Number.parseInt(match[1], 10);
  }
  return HIGHLIGHT_CHAPTER_ORDER_END - 1;
}

export function resolveHighlightChapterOrder(item: HighlightItem): number {
  if (item.chapterOrder !== undefined) {
    return item.chapterOrder;
  }
  return inferChapterOrderFromTitle(item.chapter);
}

export function compareHighlightsByChapter(left: HighlightItem, right: HighlightItem): number {
  const chapterDiff = resolveHighlightChapterOrder(left) - resolveHighlightChapterOrder(right);
  if (chapterDiff !== 0) {
    return chapterDiff;
  }
  return highlightCreatedAtTime(left) - highlightCreatedAtTime(right);
}

export function compareHighlightsByTimeDesc(left: HighlightItem, right: HighlightItem): number {
  return highlightCreatedAtTime(right) - highlightCreatedAtTime(left);
}

export function sortHighlights(items: HighlightItem[], mode: HighlightSortMode): HighlightItem[] {
  const copy = [...items];
  copy.sort(mode === "chapter" ? compareHighlightsByChapter : compareHighlightsByTimeDesc);
  return copy;
}

export function groupHighlightsByChapter(items: HighlightItem[]): Array<{
  chapter: string;
  items: HighlightItem[];
}> {
  const sorted = sortHighlights(items, "chapter");
  const groups: Array<{ chapter: string; items: HighlightItem[] }> = [];

  for (const item of sorted) {
    const last = groups[groups.length - 1];
    if (last?.chapter === item.chapter) {
      last.items.push(item);
    } else {
      groups.push({ chapter: item.chapter, items: [item] });
    }
  }

  return groups;
}

export function enrichHighlightSortFields(
  items: HighlightItem[],
  chapters?: Array<{ chapterUid: number; title: string; chapterIdx?: number }>,
): HighlightItem[] {
  const uidOrder = chapters?.length ? buildChapterOrderMap(chapters) : undefined;
  const titleOrder = chapters?.length ? buildChapterTitleOrderMap(chapters) : undefined;

  return items.map((item) => {
    let chapterOrder = item.chapterOrder;
    if (chapterOrder === undefined && item.chapterUid !== undefined && uidOrder) {
      chapterOrder = uidOrder.get(item.chapterUid);
    }
    if (chapterOrder === undefined && titleOrder) {
      chapterOrder = titleOrder.get(item.chapter);
    }
    if (chapterOrder === undefined) {
      chapterOrder = inferChapterOrderFromTitle(item.chapter);
    }

    return {
      ...item,
      chapterOrder,
      createdAtTime: highlightCreatedAtTime(item),
    };
  });
}
