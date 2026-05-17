import { shouldShowPopularHighlights } from "@/lib/discover-preview-rules";
import { formatWeReadRecommendPercent, parseWeReadRecommend } from "@/lib/weread-recommend";
import type { ReadingStatus } from "@/lib/types";
import type {
  Book,
  BookDiscoverDetail,
  BookDiscoverPreview,
  DashboardData,
  DistributionPoint,
  HighlightItem,
  Metric,
  PopularHighlight,
  RecommendationItem,
} from "@/lib/types";
import {
  formatDurationLabel,
  formatDurationMinutes,
  formatPercentChange,
  formatUnixDate,
  pickCoverTone,
} from "@/lib/formatters";
import {
  resolveBookProgress,
  resolveLastReadAt,
  resolveReadingSeconds,
  resolveReadingStatus,
  resolveStartedAt,
} from "@/server/services/weread-progress";
import type { NotebookBookMeta } from "@/server/services/weread-progress";
import type {
  ExternalBestBookmarksResponse,
  ExternalBookInfo,
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

function summarizeBook(intro?: string, category?: string): string {
  if (intro?.trim()) {
    return intro.trim().slice(0, 140);
  }
  if (category?.trim()) {
    return `书架分类：${category.trim()}。`;
  }
  return "来自你的微信读书书架。";
}

export function transformShelfBook(
  item: ExternalShelfBook,
  progress?: ExternalBookProgress,
  notebookMeta?: NotebookBookMeta,
  readTimeFallbackSeconds?: number,
): Book {
  const bookProgress = resolveBookProgress({
    finishReading: item.finishReading,
    apiProgress: progress?.book?.progress,
    notebookProgress: notebookMeta?.readingProgress,
    notebookMarkedFinished: notebookMeta?.markedStatus,
  });
  const lastReadAt = resolveLastReadAt(progress?.book?.updateTime, item.readUpdateTime);
  const highlightCount = notebookMeta?.highlights ?? 0;
  const noteCount = notebookMeta?.notes ?? 0;
  const status = resolveReadingStatus({
    finishReading: item.finishReading,
    progress: bookProgress,
    isStartReading: progress?.book?.isStartReading,
    lastReadAt,
    highlightCount,
    noteCount,
  });

  return {
    id: item.bookId,
    title: item.title,
    author: item.author,
    category: item.category?.trim() || "未分类",
    coverTone: pickCoverTone(item.bookId),
    status,
    progress: bookProgress,
    minutesRead: formatDurationMinutes(
      resolveReadingSeconds(progress?.book, readTimeFallbackSeconds),
    ),
    lastReadAt,
    startedAt: resolveStartedAt(progress?.book),
    finishedAt:
      status === "finished"
        ? formatUnixDate(progress?.book?.finishTime ?? item.readUpdateTime)
        : undefined,
    highlights: highlightCount,
    notes: noteCount,
    summary: summarizeBook(undefined, item.category),
  };
}

export function transformShelfAlbum(item: ExternalShelfAlbum): Book {
  const album = item.albumInfo;
  const status: ReadingStatus = album.finish === 1 ? "finished" : "reading";

  return {
    id: `album-${album.albumId}`,
    title: album.name,
    author: album.authorName?.trim() || "微信读书",
    category: "有声书",
    coverTone: pickCoverTone(album.albumId),
    status,
    progress: album.finish === 1 ? 100 : 0,
    minutesRead: 0,
    lastReadAt: formatUnixDate(item.albumInfoExtra?.lectureReadUpdateTime ?? album.updateTime),
    startedAt: formatUnixDate(album.updateTime),
    finishedAt: album.finish === 1 ? formatUnixDate(album.updateTime) : undefined,
    highlights: 0,
    notes: 0,
    summary: album.intro?.trim().slice(0, 140) || "来自微信读书书架的有声专辑。",
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
      label: "阅读时长",
      value: formatDurationLabel(monthly.totalReadTime),
      hint: "本月",
      tone: "yellow",
    },
    {
      label: "阅读天数",
      value: String(monthly.readDays ?? 0),
      hint: formatPercentChange(monthly.compare),
      tone: "white",
    },
    {
      label: "读完书籍",
      value:
        monthly.readStat?.find((item) => item.stat === "读完")?.counts?.replace(/本$/, "") ??
        "0",
      hint: "本月",
      tone: "white",
    },
    {
      label: "笔记",
      value: totalNotes?.replace(/条$/, "") ?? "0",
      hint: "全库累计",
      tone: "white",
    },
  ];
}

export { buildTrendForPeriod, buildTrendFromReadData } from "@/server/services/stats-analytics";

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
  chapterOrderMap?: Map<number, number>,
): HighlightItem {
  const chapter =
    bookmark.chapterUid !== undefined
      ? chapterMap.get(bookmark.chapterUid) ?? `第 ${bookmark.chapterUid} 章`
      : "划线";

  return {
    id: bookmark.bookmarkId,
    bookId: bookmark.bookId,
    bookTitle,
    quote: bookmark.markText,
    createdAt: formatUnixDate(bookmark.createTime),
    chapter,
    chapterUid: bookmark.chapterUid,
    chapterOrder:
      bookmark.chapterUid !== undefined ? chapterOrderMap?.get(bookmark.chapterUid) : undefined,
    createdAtTime: bookmark.createTime > 0 ? bookmark.createTime : undefined,
  };
}

export function transformReviewHighlight(
  item: ExternalReviewItem,
  bookId: string,
  bookTitle: string,
  chapterTitleOrderMap?: Map<string, number>,
): HighlightItem {
  const chapter = item.review.chapterName?.trim() || "想法";
  const chapterOrder = chapterTitleOrderMap?.get(chapter);

  return {
    id: item.review.reviewId,
    bookId,
    bookTitle,
    quote: item.review.content,
    createdAt: formatUnixDate(item.review.createTime),
    chapter,
    chapterOrder,
    createdAtTime: item.review.createTime > 0 ? item.review.createTime : undefined,
  };
}

export function transformHighlightsFromBookmarkList(
  payload: ExternalBookmarkListResponse,
): HighlightItem[] {
  const bookTitle = payload.book?.title ?? "微信读书书籍";
  const chapters = payload.chapters ?? [];
  const chapterMap = new Map(chapters.map((chapter) => [chapter.chapterUid, chapter.title]));
  const chapterOrderMap = new Map(
    [...chapters]
      .sort((left, right) => {
        if (left.chapterIdx !== undefined && right.chapterIdx !== undefined) {
          return left.chapterIdx - right.chapterIdx;
        }
        return left.chapterUid - right.chapterUid;
      })
      .map((chapter, index) => [chapter.chapterUid, index]),
  );
  return (payload.updated ?? []).map((bookmark) =>
    transformBookmarkHighlight(bookmark, bookTitle, chapterMap, chapterOrderMap),
  );
}

export function transformRecommendation(item: ExternalRecommendBook, index: number): RecommendationItem {
  return {
    id: item.bookId || `rec-${index}`,
    title: item.title,
    author: item.author,
    reason: item.reason?.trim() || "根据你最近的阅读偏好推荐。",
    tag: item.newRatingDetail?.title || item.category?.trim() || "推荐",
    coverTone: pickCoverTone(item.bookId || String(index)),
  };
}

export function transformSearchResult(item: ExternalSearchBook): Book {
  const info = item.bookInfo;
  const recommend = parseWeReadRecommend({
    newRating: info.newRating ?? item.newRating,
    newRatingCount: info.newRatingCount,
    newRatingDetail: info.newRatingDetail ?? item.newRatingDetail,
  });
  const ratingLabel =
    recommend.recommendRating !== undefined ? `${recommend.recommendRating}` : "—";

  return {
    id: info.bookId,
    title: info.title,
    author: info.author,
    category: info.category?.trim() || "书城",
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
      `推荐值 ${ratingLabel}%，${info.newRatingCount ?? 0} 人评分。`,
    ...recommend,
  };
}

export function buildDashboardHero(bookCount: number): Pick<DashboardData, "heroBody" | "heroTitle"> {
  return {
    heroTitle: "你的微信读书阅读全貌，一屏看清。",
    heroBody: `已从微信读书同步 ${bookCount} 个书架条目——书架、统计、划线与推荐集中展示。`,
  };
}

/** @deprecated Use formatWeReadRecommendPercent from @/lib/weread-recommend */
export function formatStoreRating(newRating?: number): number | undefined {
  return formatWeReadRecommendPercent(newRating);
}

export function transformBookDiscoverDetail(info: ExternalBookInfo): BookDiscoverDetail {
  const recommend = parseWeReadRecommend(info);
  return {
    intro: info.intro?.trim() || "暂无简介。",
    publisher: info.publisher?.trim() || undefined,
    rating: recommend.recommendRating,
    ratingLabel: recommend.recommendLabel,
    ratingCount: recommend.recommendRatingCount,
    wordCount: info.wordCount,
  };
}

export function transformPopularHighlights(payload: ExternalBestBookmarksResponse): PopularHighlight[] {
  const chapterMap = new Map(
    (payload.chapters ?? []).map((chapter) => [chapter.chapterUid, chapter.title]),
  );

  return (payload.items ?? []).map((item) => ({
    id: item.bookmarkId,
    quote: item.markText,
    highlightCount: item.totalCount ?? 0,
    chapter:
      item.chapterUid !== undefined
        ? chapterMap.get(item.chapterUid) ?? `第 ${item.chapterUid} 章`
        : "热门划线",
    chapterUid: item.chapterUid,
    range: item.range,
  }));
}

export function bookFromStoreInfo(info: ExternalBookInfo): Book {
  const recommend = parseWeReadRecommend(info);
  const ratingLabel = recommend.recommendRating !== undefined ? `${recommend.recommendRating}` : "—";

  return {
    id: info.bookId,
    title: info.title,
    author: info.author,
    category: info.category?.trim() || "书城",
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
      `推荐值 ${ratingLabel}%，${info.newRatingCount ?? 0} 人评分。`,
    ...recommend,
  };
}

export function buildDiscoverPreview(
  info: ExternalBookInfo,
  onShelf: boolean,
  shelfBook: Book | undefined,
  popularHighlights: PopularHighlight[],
): BookDiscoverPreview {
  const book = shelfBook ?? bookFromStoreInfo(info);
  const recommend = parseWeReadRecommend(info);

  return {
    book: {
      ...book,
      ...recommend,
      title: info.title || book.title,
      author: info.author || book.author,
      category: info.category?.trim() || book.category,
      summary: info.intro?.trim().slice(0, 140) || book.summary,
    },
    onShelf,
    detail: transformBookDiscoverDetail(info),
    popularHighlights: shouldShowPopularHighlights(shelfBook) ? popularHighlights : [],
    shelfProgress: onShelf
      ? {
          status: book.status,
          progress: book.progress,
          minutesRead: book.minutesRead,
          highlights: book.highlights,
          notes: book.notes,
        }
      : undefined,
  };
}
