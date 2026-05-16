import type { Book, ReadingStatus } from "@/lib/types";

export type BookshelfSort = "lastRead" | "title" | "progress" | "minutes";
export type BookshelfStatusFilter = ReadingStatus | "all";

export interface BookshelfQuery {
  q?: string;
  status?: BookshelfStatusFilter;
  sort?: BookshelfSort;
}

export const BOOKSHELF_SORT_OPTIONS: { value: BookshelfSort; label: string }[] = [
  { value: "lastRead", label: "最近阅读" },
  { value: "title", label: "书名" },
  { value: "progress", label: "阅读进度" },
  { value: "minutes", label: "阅读时长" },
];

export const BOOKSHELF_STATUS_OPTIONS: { value: BookshelfStatusFilter; label: string }[] = [
  { value: "all", label: "全部状态" },
  { value: "reading", label: "在读" },
  { value: "finished", label: "已读完" },
  { value: "queued", label: "想读" },
];

function parseDate(value: string): number {
  if (!value) {
    return 0;
  }
  return Date.parse(value) || 0;
}

export function applyBookshelfQuery(books: Book[], query: BookshelfQuery): Book[] {
  const normalized = query.q?.trim().toLowerCase();
  const status = query.status ?? "all";
  const sort = query.sort ?? "lastRead";

  let result = books;

  if (normalized) {
    result = result.filter(
      (book) =>
        book.title.toLowerCase().includes(normalized) ||
        book.author.toLowerCase().includes(normalized) ||
        book.category.toLowerCase().includes(normalized),
    );
  }

  if (status !== "all") {
    result = result.filter((book) => book.status === status);
  }

  const sorted = [...result];
  sorted.sort((left, right) => {
    switch (sort) {
      case "title":
        return left.title.localeCompare(right.title, "zh-CN");
      case "progress":
        return right.progress - left.progress;
      case "minutes":
        return right.minutesRead - left.minutesRead;
      case "lastRead":
      default:
        return parseDate(right.lastReadAt) - parseDate(left.lastReadAt);
    }
  });

  return sorted;
}

export function parseBookshelfQuery(params: {
  q?: string;
  status?: string;
  sort?: string;
}): BookshelfQuery {
  const status = params.status as BookshelfStatusFilter | undefined;
  const sort = params.sort as BookshelfSort | undefined;

  return {
    q: params.q,
    status:
      status === "reading" || status === "finished" || status === "queued" ? status : "all",
    sort:
      sort === "title" || sort === "progress" || sort === "minutes" || sort === "lastRead"
        ? sort
        : "lastRead",
  };
}
