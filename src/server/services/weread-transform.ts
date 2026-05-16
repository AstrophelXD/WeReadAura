import type { ReadingStatus } from "@/lib/types";
import type {
  Book,
  DashboardData,
  DistributionPoint,
  HighlightItem,
  Metric,
  RecommendationItem,
  TrendPoint,
} from "@/lib/types";
import {
  formatDurationLabel,
  formatDurationMinutes,
  formatPercentChange,
  formatUnixDate,
  pickCoverTone,
} from "@/lib/formatters";
import type {
  ExternalBookProgress,
  ExternalBookmark,
  ExternalBookmarkListResponse,
  ExternalNotebookBook,
  ExternalReadDataDetail,
  ExternalRecommendBook,
  ExternalReviewItem,
  ExternalSearchBook,
  ExternalShelfAlbum,
  ExternalShelfBook,
} from "@/server/adapters/weread/types";

function resolveReadingStatus(
  finishReading?: number,
  progress?: number,
  isStartReading?: number,
): ReadingStatus {
  if (finishReading === 1 || progress === 100) {
    return "finished";
  }
  if ((progress && progress > 0) || isStartReading === 1) {
    return "reading";
  }
  return "queued";
}

function summarizeBook(intro?: string, category?: string): string {
  if (intro?.trim()) {
    return intro.trim().slice(0, 140);
  }
  if (category?.trim()) {
    return `Shelf category: ${category.trim()}.`;
  }
  return "Synced from your WeRead shelf.";
}

export function transformShelfBook(
  item: ExternalShelfBook,
  progress?: ExternalBookProgress,
  noteCounts?: { highlights: number; notes: number },
): Book {
  const bookProgress = progress?.book?.progress ?? (item.finishReading === 1 ? 100 : 0);
  const status = resolveReadingStatus(item.finishReading, bookProgress, progress?.book?.isStartReading);

  return {
    id: item.bookId,
    title: item.title,
    author: item.author,
    category: item.category?.trim() || "Uncategorized",
    coverTone: pickCoverTone(item.bookId),
    status,
    progress: bookProgress,
    minutesRead: formatDurationMinutes(progress?.book?.recordReadingTime),
    lastReadAt: formatUnixDate(item.readUpdateTime ?? progress?.book?.updateTime),
    startedAt: formatUnixDate(item.updateTime),
    finishedAt:
      status === "finished"
        ? formatUnixDate(progress?.book?.finishTime ?? item.readUpdateTime)
        : undefined,
    highlights: noteCounts?.highlights ?? 0,
    notes: noteCounts?.notes ?? 0,
    summary: summarizeBook(undefined, item.category),
  };
}

export function transformShelfAlbum(item: ExternalShelfAlbum): Book {
  const album = item.albumInfo;
  const status: ReadingStatus = album.finish === 1 ? "finished" : "reading";

  return {
    id: `album-${album.albumId}`,
    title: album.name,
    author: album.authorName?.trim() || "WeRead Album",
    category: "Audiobook",
    coverTone: pickCoverTone(album.albumId),
    status,
    progress: album.finish === 1 ? 100 : 0,
    minutesRead: 0,
    lastReadAt: formatUnixDate(item.albumInfoExtra?.lectureReadUpdateTime ?? album.updateTime),
    startedAt: formatUnixDate(album.updateTime),
    finishedAt: album.finish === 1 ? formatUnixDate(album.updateTime) : undefined,
    highlights: 0,
    notes: 0,
    summary: album.intro?.trim().slice(0, 140) || "Audiobook album from your WeRead shelf.",
  };
}

export function notebookCounts(item: ExternalNotebookBook) {
  const highlights = item.noteCount ?? 0;
  const notes = item.reviewCount ?? 0;
  const bookmarks = item.bookmarkCount ?? 0;
  return { highlights, notes, total: highlights + notes + bookmarks };
}

export function buildMetricsFromReadData(monthly: ExternalReadDataDetail, overall?: ExternalReadDataDetail): Metric[] {
  const totalNotes =
    overall?.readStat?.find((item) => item.stat === "笔记")?.counts ??
    monthly.readStat?.find((item) => item.stat === "笔记")?.counts;

  return [
    {
      label: "Reading time",
      value: formatDurationLabel(monthly.totalReadTime),
      hint: "This month",
      tone: "yellow",
    },
    {
      label: "Active days",
      value: String(monthly.readDays ?? 0),
      hint: formatPercentChange(monthly.compare),
      tone: "white",
    },
    {
      label: "Finished books",
      value:
        monthly.readStat?.find((item) => item.stat === "读完")?.counts?.replace(/本$/, "") ??
        "0",
      hint: "This month",
      tone: "white",
    },
    {
      label: "Notes",
      value: totalNotes?.replace(/条$/, "") ?? "0",
      hint: "Across your library",
      tone: "white",
    },
  ];
}

export function buildTrendFromReadData(detail: ExternalReadDataDetail): TrendPoint[] {
  const buckets = detail.readTimes ?? {};
  const entries = Object.entries(buckets)
    .map(([timestamp, seconds]) => ({
      timestamp: Number(timestamp),
      minutes: formatDurationMinutes(seconds),
    }))
    .sort((left, right) => left.timestamp - right.timestamp);

  const recent = entries.slice(-7);
  return recent.map((entry, index) => ({
    label: `D${index + 1}`,
    minutes: entry.minutes,
  }));
}

export function buildCategoryDistribution(detail: ExternalReadDataDetail): DistributionPoint[] {
  const categories = detail.preferCategory ?? [];
  if (categories.length === 0) {
    return [];
  }

  const total = categories.reduce((sum, item) => sum + (item.readingTime ?? item.val ?? 0), 0) || 1;

  return categories.slice(0, 5).map((item) => ({
    label: item.categoryTitle,
    value: Math.round(((item.readingTime ?? item.val ?? 0) / total) * 100),
  }));
}

export function transformBookmarkHighlight(
  bookmark: ExternalBookmark,
  bookTitle: string,
  chapterMap: Map<number, string>,
): HighlightItem {
  const chapter =
    bookmark.chapterUid !== undefined
      ? chapterMap.get(bookmark.chapterUid) ?? `Chapter ${bookmark.chapterUid}`
      : "Highlight";

  return {
    id: bookmark.bookmarkId,
    bookId: bookmark.bookId,
    bookTitle,
    quote: bookmark.markText,
    createdAt: formatUnixDate(bookmark.createTime),
    chapter,
  };
}

export function transformReviewHighlight(
  item: ExternalReviewItem,
  bookId: string,
  bookTitle: string,
): HighlightItem {
  return {
    id: item.review.reviewId,
    bookId,
    bookTitle,
    quote: item.review.content,
    createdAt: formatUnixDate(item.review.createTime),
    chapter: item.review.chapterName?.trim() || "Thought",
  };
}

export function transformHighlightsFromBookmarkList(
  payload: ExternalBookmarkListResponse,
): HighlightItem[] {
  const bookTitle = payload.book?.title ?? "WeRead Book";
  const chapterMap = new Map(
    (payload.chapters ?? []).map((chapter) => [chapter.chapterUid, chapter.title]),
  );

  return (payload.updated ?? []).map((bookmark) =>
    transformBookmarkHighlight(bookmark, bookTitle, chapterMap),
  );
}

export function transformRecommendation(item: ExternalRecommendBook, index: number): RecommendationItem {
  return {
    id: item.bookId || `rec-${index}`,
    title: item.title,
    author: item.author,
    reason: item.reason?.trim() || "Recommended based on your recent reading.",
    tag: item.newRatingDetail?.title || item.category?.trim() || "Pick",
    coverTone: pickCoverTone(item.bookId || String(index)),
  };
}

export function transformSearchResult(item: ExternalSearchBook): Book {
  const info = item.bookInfo;
  const ratingLabel =
    info.newRating !== undefined ? `${Math.round(info.newRating / 10) / 10}` : "n/a";

  return {
    id: info.bookId,
    title: info.title,
    author: info.author,
    category: info.category?.trim() || "Store",
    coverTone: pickCoverTone(info.bookId),
    status: "queued",
    progress: 0,
    minutesRead: 0,
    lastReadAt: "",
    startedAt: "",
    highlights: 0,
    notes: 0,
    summary:
      info.intro?.trim().slice(0, 140) ||
      `Store rating ${ratingLabel} from ${info.newRatingCount ?? 0} readers.`,
  };
}

export function buildDashboardHero(bookCount: number): Pick<DashboardData, "heroTitle" | "heroBody"> {
  return {
    heroTitle: "Your WeRead reading life, in one dashboard.",
    heroBody: `Synced ${bookCount} shelf entries from WeRead — bookshelf, stats, highlights, and recommendations in one plain view.`,
  };
}
