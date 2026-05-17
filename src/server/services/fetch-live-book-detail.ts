import { shouldFetchPopularForBookPage } from "@/lib/discover-preview-rules";
import { buildChapterTitleOrderMap, enrichHighlightSortFields } from "@/lib/highlight-sort";
import { parseWeReadRecommend } from "@/lib/weread-recommend";
import type { Book, HighlightItem, PopularHighlight } from "@/lib/types";
import { formatDurationMinutes, formatUnixDate } from "@/lib/formatters";
import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
import type { ExternalShelfBook } from "@/server/adapters/weread/types";
import {
  resolveBookProgress,
  resolveLastReadAt,
  resolveReadingSeconds,
  resolveReadingStatus,
  resolveStartedAt,
  type NotebookBookMeta,
} from "@/server/services/weread-progress";
import { fetchPopularHighlightsForBook } from "@/server/services/fetch-popular-highlights";
import { fetchAllMyReviewsForBook } from "@/server/services/weread-reviews";
import { transformHighlightsFromBookmarkList, transformShelfBook } from "@/server/services/weread-transform";

function bookToShelfItem(book: Book): ExternalShelfBook {
  return {
    bookId: book.id,
    title: book.title,
    author: book.author,
    category: book.category,
    finishReading: book.status === "finished" ? 1 : 0,
    readUpdateTime: book.lastReadAt ? Math.floor(Date.parse(book.lastReadAt) / 1000) : undefined,
    updateTime: book.startedAt ? Math.floor(Date.parse(book.startedAt) / 1000) : undefined,
  };
}

export async function fetchLiveBookDetail(
  gateway: WeReadGateway,
  context: GatewayContext,
  bookId: string,
  cachedBook?: Book,
): Promise<{ book: Book; highlights: HighlightItem[]; popularHighlights: PopularHighlight[] }> {
  const bookTitleEarly = cachedBook?.title ?? "";
  const [info, progress, bookmarkList] = await Promise.all([
    gateway.getBookInfo(context, bookId),
    gateway.getBookProgress(context, bookId),
    gateway.getBookmarkList(context, bookId),
  ]);
  const chapterTitleOrderMap = buildChapterTitleOrderMap(bookmarkList.chapters ?? []);
  const reviewHighlights = await fetchAllMyReviewsForBook(
    gateway,
    context,
    bookId,
    info.title || bookTitleEarly || "",
    chapterTitleOrderMap,
  );

  const bookTitle = info.title || cachedBook?.title || "微信读书书籍";
  const bookmarkHighlights = transformHighlightsFromBookmarkList({
    ...bookmarkList,
    book: bookmarkList.book ?? { title: bookTitle, author: info.author ?? "" },
  });
  const bookmarkCreateTimes = (bookmarkList.updated ?? [])
    .map((bookmark) => bookmark.createTime)
    .filter((time) => time > 0);
  const earliestHighlightTime =
    bookmarkCreateTimes.length > 0 ? Math.min(...bookmarkCreateTimes) : undefined;

  const highlights = [...bookmarkHighlights, ...reviewHighlights];
  const uniqueHighlights = enrichHighlightSortFields(
    Array.from(new Map(highlights.map((item) => [item.id, item])).values()),
    bookmarkList.chapters,
  );

  const notebookMeta: NotebookBookMeta = {
    highlights: Math.max(cachedBook?.highlights ?? 0, bookmarkHighlights.length),
    notes: Math.max(cachedBook?.notes ?? 0, reviewHighlights.length),
    readingProgress: cachedBook?.progress,
    markedStatus: cachedBook?.status === "finished" ? 1 : 0,
  };

  const shelfItem: ExternalShelfBook = cachedBook
    ? {
        ...bookToShelfItem(cachedBook),
        title: bookTitle,
        author: info.author || cachedBook.author,
        category: info.category || cachedBook.category,
        finishReading:
          cachedBook.status === "finished" || progress.book?.progress === 100 ? 1 : 0,
      }
    : {
        bookId: info.bookId,
        title: bookTitle,
        author: info.author,
        category: info.category,
        finishReading: progress.book?.progress === 100 ? 1 : 0,
      };

  const book = transformShelfBook(shelfItem, progress, notebookMeta);
  book.summary = info.intro?.trim() || book.summary;
  Object.assign(book, parseWeReadRecommend(info));

  const progressPercent = resolveBookProgress({
    finishReading: shelfItem.finishReading,
    apiProgress: progress.book?.progress,
    notebookProgress: notebookMeta.readingProgress,
    notebookMarkedFinished: notebookMeta.markedStatus,
  });

  const minutesRead = formatDurationMinutes(resolveReadingSeconds(progress.book));
  book.progress = progressPercent;
  book.minutesRead = minutesRead > 0 ? minutesRead : book.minutesRead;
  book.lastReadAt =
    resolveLastReadAt(progress.book?.updateTime, shelfItem.readUpdateTime) || book.lastReadAt;
  book.startedAt = resolveStartedAt(progress.book, earliestHighlightTime) || book.startedAt;
  book.highlights = bookmarkHighlights.length;
  book.notes = reviewHighlights.length;
  book.status = resolveReadingStatus({
    finishReading: shelfItem.finishReading,
    progress: progressPercent,
    isStartReading: progress.book?.isStartReading,
    lastReadAt: book.lastReadAt,
    highlightCount: book.highlights,
    noteCount: book.notes,
  });

  if (book.status === "finished" && !book.finishedAt) {
    book.finishedAt = formatUnixDate(progress.book?.finishTime) || book.lastReadAt;
  }

  let popularHighlights: PopularHighlight[] = [];
  if (shouldFetchPopularForBookPage(book, uniqueHighlights.length)) {
    try {
      popularHighlights = await fetchPopularHighlightsForBook(gateway, context, bookId);
    } catch {
      popularHighlights = [];
    }
  }

  return { book, highlights: uniqueHighlights, popularHighlights };
}
