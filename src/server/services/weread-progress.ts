import type { ReadingStatus } from "@/lib/types";
import { formatUnixDate } from "@/lib/formatters";
import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
import type {
  ExternalBookProgress,
  ExternalNotebookBook,
  ExternalReadDataDetail,
} from "@/server/adapters/weread/types";

type ProgressBookFields = NonNullable<ExternalBookProgress["book"]>;

/** Prefer official recordReadingTime; fall back to readingTime or readdata readLongest. */
export function resolveReadingSeconds(
  book?: ProgressBookFields,
  fallbackSeconds?: number,
): number {
  if (book?.recordReadingTime && book.recordReadingTime > 0) {
    return book.recordReadingTime;
  }
  if (book?.readingTime && book.readingTime > 0) {
    return book.readingTime;
  }
  return fallbackSeconds && fallbackSeconds > 0 ? fallbackSeconds : 0;
}

export function resolveStartedAt(
  book?: ProgressBookFields,
  earliestHighlightTime?: number,
): string {
  if (book?.startReadingTime && book.startReadingTime > 0) {
    return formatUnixDate(book.startReadingTime);
  }
  if (book?.isStartReading === 1 && earliestHighlightTime && earliestHighlightTime > 0) {
    return formatUnixDate(earliestHighlightTime);
  }
  return "";
}

export function resolveLastReadAt(progressUpdate?: number, shelfReadUpdate?: number): string {
  return formatUnixDate(progressUpdate ?? shelfReadUpdate);
}

export function buildReadLongestMap(
  readLongest?: ExternalReadDataDetail["readLongest"],
): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of readLongest ?? []) {
    const bookId = entry.book?.bookId;
    if (bookId && entry.readTime && entry.readTime > 0) {
      map.set(bookId, entry.readTime);
    }
  }
  return map;
}

/** WeRead `/book/getprogress` progress is 0–100 (1 means 1%, not 100%). */
export function normalizePercentValue(value?: number | null): number | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }

  if (value > 0 && value < 1) {
    return Math.round(value * 100);
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function resolveBookProgress(input: {
  finishReading?: number;
  apiProgress?: number;
  notebookProgress?: number;
  notebookMarkedFinished?: number;
}): number {
  if (input.finishReading === 1 || input.notebookMarkedFinished === 1) {
    return 100;
  }

  const fromApi = normalizePercentValue(input.apiProgress);
  if (fromApi !== undefined) {
    return fromApi;
  }

  const fromNotebook = normalizePercentValue(input.notebookProgress);
  if (fromNotebook !== undefined) {
    return fromNotebook;
  }

  return 0;
}

export function resolveReadingStatus(input: {
  finishReading?: number;
  progress: number;
  isStartReading?: number;
  lastReadAt?: string;
  highlightCount?: number;
  noteCount?: number;
}): ReadingStatus {
  if (input.finishReading === 1 || input.progress === 100) {
    return "finished";
  }
  if (input.progress > 0 || input.isStartReading === 1) {
    return "reading";
  }
  if (input.lastReadAt) {
    return "reading";
  }
  if ((input.highlightCount ?? 0) > 0 || (input.noteCount ?? 0) > 0) {
    return "reading";
  }
  return "queued";
}

export interface NotebookBookMeta {
  highlights: number;
  notes: number;
  readingProgress?: number;
  markedStatus?: number;
}

export async function fetchAllNotebookBooks(
  gateway: WeReadGateway,
  context: GatewayContext,
): Promise<ExternalNotebookBook[]> {
  const collected: ExternalNotebookBook[] = [];
  let lastSort: number | undefined;

  for (let page = 0; page < 50; page += 1) {
    const response = await gateway.getNotebooks(context, 50, lastSort);
    const batch = response.books ?? [];
    collected.push(...batch);

    if (response.hasMore !== 1 || batch.length === 0) {
      break;
    }

    const tail = batch[batch.length - 1];
    if (tail.sort === undefined || tail.sort === lastSort) {
      break;
    }
    lastSort = tail.sort;
  }

  return collected;
}

export function buildNotebookMetaMap(
  notebookBooks: ExternalNotebookBook[],
): Map<string, NotebookBookMeta> {
  return new Map(
    notebookBooks.map((item) => [
      item.bookId,
      {
        highlights: item.noteCount ?? 0,
        notes: item.reviewCount ?? 0,
        readingProgress: item.readingProgress,
        markedStatus: item.markedStatus,
      },
    ]),
  );
}

const DEFAULT_PROGRESS_CONCURRENCY = 16;

export async function fetchBookProgressMap(
  gateway: WeReadGateway,
  context: GatewayContext,
  bookIds: string[],
  concurrency = DEFAULT_PROGRESS_CONCURRENCY,
): Promise<Map<string, ExternalBookProgress>> {
  const progressMap = new Map<string, ExternalBookProgress>();
  const queue = [...bookIds];

  async function worker() {
    while (queue.length > 0) {
      const bookId = queue.shift();
      if (!bookId) {
        return;
      }
      try {
        progressMap.set(bookId, await gateway.getBookProgress(context, bookId));
      } catch {
        progressMap.set(bookId, { bookId });
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, queue.length || 1) }, () => worker());
  await Promise.all(workers);

  return progressMap;
}

export function pickBooksNeedingProgressFetch(
  shelfBooks: Array<{ bookId: string; finishReading?: number; readUpdateTime?: number }>,
  notebookMeta: Map<string, NotebookBookMeta>,
): string[] {
  return shelfBooks
    .filter((book) => {
      if (book.finishReading === 1) {
        return false;
      }
      if (book.readUpdateTime && book.readUpdateTime > 0) {
        return true;
      }
      const meta = notebookMeta.get(book.bookId);
      if ((meta?.readingProgress ?? 0) > 0) {
        return true;
      }
      if ((meta?.highlights ?? 0) > 0 || (meta?.notes ?? 0) > 0) {
        return true;
      }
      return false;
    })
    .map((book) => book.bookId);
}
