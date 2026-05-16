import type { SyncSnapshot } from "@/server/cache/sync-cache";
import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
import {
  buildCategoryDistribution,
  buildDashboardHero,
  buildMetricsFromReadData,
  buildTrendFromReadData,
  notebookCounts,
  transformBookmarkHighlight,
  transformRecommendation,
  transformReviewHighlight,
  transformShelfAlbum,
  transformShelfBook,
} from "@/server/services/weread-transform";

const PROGRESS_SAMPLE_LIMIT = 12;
const HIGHLIGHT_BOOK_LIMIT = 3;

function formatSyncTimestamp(date: Date): string {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

async function fetchProgressMap(gateway: WeReadGateway, context: GatewayContext, bookIds: string[]) {
  const progressMap = new Map<string, Awaited<ReturnType<WeReadGateway["getBookProgress"]>>>();

  await Promise.all(
    bookIds.map(async (bookId) => {
      try {
        const progress = await gateway.getBookProgress(context, bookId);
        progressMap.set(bookId, progress);
      } catch {
        progressMap.set(bookId, { bookId });
      }
    }),
  );

  return progressMap;
}

async function fetchRecentHighlights(
  gateway: WeReadGateway,
  context: GatewayContext,
  notebookBooks: Array<{ bookId: string; book?: { title?: string }; noteCount?: number; reviewCount?: number }>,
) {
  const ranked = [...notebookBooks]
    .sort((left, right) => {
      const leftTotal = (left.noteCount ?? 0) + (left.reviewCount ?? 0);
      const rightTotal = (right.noteCount ?? 0) + (right.reviewCount ?? 0);
      return rightTotal - leftTotal;
    })
    .slice(0, HIGHLIGHT_BOOK_LIMIT);

  const highlights = await Promise.all(
    ranked.map(async (item) => {
      const bookTitle = item.book?.title ?? "WeRead Book";
      try {
        const [bookmarkList, reviews] = await Promise.all([
          gateway.getBookmarkList(context, item.bookId),
          gateway.getMyReviews(context, item.bookId),
        ]);

        const chapterMap = new Map(
          (bookmarkList.chapters ?? []).map((chapter) => [chapter.chapterUid, chapter.title]),
        );

        const bookmarkHighlights = (bookmarkList.updated ?? []).map((bookmark) =>
          transformBookmarkHighlight(bookmark, bookTitle, chapterMap),
        );
        const reviewHighlights = (reviews.reviews ?? []).map((review) =>
          transformReviewHighlight(review, item.bookId, bookTitle),
        );

        return [...bookmarkHighlights, ...reviewHighlights];
      } catch {
        return [];
      }
    }),
  );

  return highlights.flat().sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function syncFromWeRead(
  gateway: WeReadGateway,
  context: GatewayContext,
): Promise<SyncSnapshot> {
  const [shelf, monthlyStats, overallStats, notebooks, recommendations] = await Promise.all([
    gateway.getBookshelf(context),
    gateway.getReadingStats(context, "monthly"),
    gateway.getReadingStats(context, "overall"),
    gateway.getNotebooks(context, 50),
    gateway.getRecommendations(context, 12),
  ]);

  const noteCountByBook = new Map(
    (notebooks.books ?? []).map((item) => [item.bookId, notebookCounts(item)]),
  );

  const shelfBooks = shelf.books ?? [];
  const progressIds = shelfBooks.slice(0, PROGRESS_SAMPLE_LIMIT).map((book) => book.bookId);
  const progressMap = await fetchProgressMap(gateway, context, progressIds);

  const books = [
    ...shelfBooks.map((item) =>
      transformShelfBook(
        item,
        progressMap.get(item.bookId),
        noteCountByBook.get(item.bookId),
      ),
    ),
    ...(shelf.albums ?? []).map(transformShelfAlbum),
  ];

  const highlights = await fetchRecentHighlights(gateway, context, notebooks.books ?? []);

  const syncedAt = formatSyncTimestamp(new Date());
  const hero = buildDashboardHero(books.length);

  return {
    syncedAt,
    source: "WeRead Skill Gateway",
    books,
    highlights,
    recommendations: (recommendations.books ?? []).map(transformRecommendation),
    metrics: buildMetricsFromReadData(monthlyStats, overallStats),
    readingTrend: buildTrendFromReadData(monthlyStats),
    categoryDistribution: buildCategoryDistribution(monthlyStats),
    heroTitle: hero.heroTitle,
    heroBody: hero.heroBody,
  };
}
