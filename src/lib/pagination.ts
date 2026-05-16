export const BOOKSHELF_PAGE_SIZE = 12;
export const NOTES_PAGE_SIZE = 9;
export const DISCOVER_SEARCH_PAGE_SIZE = 8;
export const BOOK_HIGHLIGHTS_PAGE_SIZE = 6;

export function parsePageParam(value: string | null | undefined): number {
  const parsed = Number.parseInt(value ?? "1", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return parsed;
}

export function getPageCount(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) {
    return 1;
  }
  return Math.ceil(totalItems / pageSize);
}

export function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(1, page), Math.max(1, pageCount));
}

export function paginateSlice<T>(items: T[], page: number, pageSize: number) {
  const pageCount = getPageCount(items.length, pageSize);
  const safePage = clampPage(page, pageCount);
  const start = (safePage - 1) * pageSize;
  return {
    slice: items.slice(start, start + pageSize),
    page: safePage,
    pageCount,
  };
}

export function pageRangeLabel(page: number, pageSize: number, totalItems: number): string {
  if (totalItems === 0) {
    return "0 条";
  }
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  return `${start}–${end}`;
}

export type PageToken = number | "ellipsis";

/** Page numbers to render, with ellipsis when the range is large. */
export function buildPageRange(current: number, total: number): PageToken[] {
  if (total <= 1) {
    return total === 1 ? [1] : [];
  }
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result: PageToken[] = [];
  for (let index = 0; index < sorted.length; index += 1) {
    const page = sorted[index];
    const previous = sorted[index - 1];
    if (previous !== undefined && page - previous > 1) {
      result.push("ellipsis");
    }
    result.push(page);
  }
  return result;
}
