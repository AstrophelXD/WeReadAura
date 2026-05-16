import { markReadingDataVolatile } from "@/lib/server-cache";
import { books as mockBooks, dashboardData, findBook, findHighlightsForBook } from "@/lib/mock-data";
import type { Book, DashboardData, HighlightItem, RecommendationItem } from "@/lib/types";
import { getWeReadApiKey } from "@/server/auth/credentials";
import { createGatewayContext, getWeReadGateway, isValidWeReadApiKey } from "@/server/adapters/weread/get-gateway";
import {
  getSyncSnapshot,
  setSyncSnapshot,
  snapshotToDashboard,
} from "@/server/cache/sync-cache";
import { syncFromWeRead } from "@/server/services/weread-sync";
import {
  transformHighlightsFromBookmarkList,
  transformRecommendation,
  transformReviewHighlight,
  transformSearchResult,
  transformShelfBook,
} from "@/server/services/weread-transform";

export type DataMode = "live" | "mock";

export interface DataSourceInfo {
  mode: DataMode;
  source: string;
  lastSyncedAt: string;
  hasApiKey: boolean;
}

function mockSourceInfo(): DataSourceInfo {
  return {
    mode: "mock",
    source: dashboardData.syncStatus.source,
    lastSyncedAt: dashboardData.syncStatus.lastSyncedAt,
    hasApiKey: false,
  };
}

function liveSourceInfo(snapshot = getSyncSnapshot()): DataSourceInfo {
  if (!snapshot) {
    return {
      mode: "mock",
      source: "微信读书 Skill（尚未同步）",
      lastSyncedAt: "从未同步",
      hasApiKey: true,
    };
  }

  return {
    mode: "live",
    source: snapshot.source,
    lastSyncedAt: snapshot.syncedAt,
    hasApiKey: true,
  };
}

export async function getDataSourceInfo(): Promise<DataSourceInfo> {
  markReadingDataVolatile();
  const apiKey = await getWeReadApiKey();
  if (!isValidWeReadApiKey(apiKey)) {
    return mockSourceInfo();
  }
  return liveSourceInfo();
}

export async function runSync(): Promise<{ snapshot: Awaited<ReturnType<typeof syncFromWeRead>>; mode: DataMode }> {
  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (!gateway || !apiKey) {
    throw new Error("未配置微信读书 API Key。请在 .env.local 设置 WEREAD_API_KEY，或在设置页保存。");
  }

  const snapshot = await syncFromWeRead(gateway, createGatewayContext(apiKey));
  setSyncSnapshot(snapshot);
  return { snapshot, mode: "live" };
}

function getLiveBooks(): Book[] | null {
  return getSyncSnapshot()?.books ?? null;
}

export async function getDashboardData(): Promise<DashboardData> {
  markReadingDataVolatile();
  const snapshot = getSyncSnapshot();
  if (snapshot) {
    return snapshotToDashboard(snapshot);
  }
  return dashboardData;
}

export async function getBookshelfItems(query?: string): Promise<{ items: Book[]; total: number }> {
  markReadingDataVolatile();
  const books = getLiveBooks() ?? mockBooks;
  const unique = Array.from(new Map(books.map((book) => [book.id, book])).values());
  const normalized = query?.trim().toLowerCase();

  const items = normalized
    ? unique.filter(
        (book) =>
          book.title.toLowerCase().includes(normalized) ||
          book.author.toLowerCase().includes(normalized) ||
          book.category.toLowerCase().includes(normalized),
      )
    : unique;

  return { items, total: items.length };
}

export async function getStatsPayload() {
  markReadingDataVolatile();
  const dashboard = await getDashboardData();
  return {
    metrics: dashboard.metrics,
    readingTrend: dashboard.readingTrend,
    categoryDistribution: dashboard.categoryDistribution,
  };
}

export async function getNotesItems(query?: string): Promise<{ items: HighlightItem[]; total: number }> {
  markReadingDataVolatile();
  const snapshot = getSyncSnapshot();
  const items = snapshot?.highlights ?? dashboardData.recentHighlights;
  const normalized = query?.trim().toLowerCase();

  const filtered = normalized
    ? items.filter(
        (item) =>
          item.bookTitle.toLowerCase().includes(normalized) ||
          item.quote.toLowerCase().includes(normalized) ||
          item.note?.toLowerCase().includes(normalized),
      )
    : items;

  return { items: filtered, total: filtered.length };
}

export async function getRecommendations(): Promise<RecommendationItem[]> {
  markReadingDataVolatile();
  const snapshot = getSyncSnapshot();
  return snapshot?.recommendations ?? dashboardData.recommendations;
}

export async function getBookDetail(bookId: string) {
  markReadingDataVolatile();
  const snapshot = getSyncSnapshot();
  const cachedBook = snapshot?.books.find((book) => book.id === bookId);
  const mockBook = findBook(bookId);

  if (!cachedBook && !mockBook) {
    const apiKey = await getWeReadApiKey();
    const gateway = getWeReadGateway(apiKey);
    if (gateway && apiKey && !bookId.startsWith("album-")) {
      try {
        const context = createGatewayContext(apiKey);
        const [info, progress, bookmarkList, reviews] = await Promise.all([
          gateway.getBookInfo(context, bookId),
          gateway.getBookProgress(context, bookId),
          gateway.getBookmarkList(context, bookId),
          gateway.getMyReviews(context, bookId),
        ]);

        const book = transformShelfBook(
          {
            bookId: info.bookId,
            title: info.title,
            author: info.author,
            category: info.category,
          },
          progress,
        );
        book.summary = info.intro?.trim().slice(0, 200) || book.summary;

        const highlights = [
          ...transformHighlightsFromBookmarkList(bookmarkList),
          ...(reviews.reviews ?? []).map((review) =>
            transformReviewHighlight(review, bookId, info.title),
          ),
        ];

        return { book, highlights };
      } catch {
        return null;
      }
    }
    return null;
  }

  const book = cachedBook ?? mockBook!;
  const highlights =
    snapshot?.highlights.filter((item) => item.bookId === bookId) ??
    findHighlightsForBook(bookId);

  return { book, highlights };
}

export async function searchStoreBooks(query?: string): Promise<{ items: Book[]; total: number }> {
  const normalized = query?.trim();
  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (gateway && apiKey && normalized) {
    try {
      const results = await gateway.searchBooks(createGatewayContext(apiKey), normalized, 15);
      const books = (results.results ?? []).flatMap((group) =>
        (group.books ?? []).map(transformSearchResult),
      );
      return { items: books, total: books.length };
    } catch {
      return getBookshelfItems(normalized);
    }
  }

  if (normalized) {
    return getBookshelfItems(normalized);
  }

  const mockItems = dashboardData.recommendations.map((item) => ({
    id: item.id,
    title: item.title,
    author: item.author,
    category: item.tag,
    coverTone: item.coverTone,
    status: "queued" as const,
    progress: 0,
    minutesRead: 0,
    lastReadAt: "",
    startedAt: "",
    highlights: 0,
    notes: 0,
    summary: item.reason,
  }));

  return { items: mockItems, total: mockItems.length };
}

export async function searchRecommendationsFromGateway(): Promise<RecommendationItem[]> {
  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (!gateway || !apiKey) {
    return getRecommendations();
  }

  try {
    const response = await gateway.getRecommendations(createGatewayContext(apiKey), 12);
    return (response.books ?? []).map(transformRecommendation);
  } catch {
    return getRecommendations();
  }
}
