import { applyBookshelfQuery, type BookshelfQuery } from "@/lib/bookshelf-query";
import { applyNotesQuery, type NotesQuery } from "@/lib/notes-query";
import { markReadingDataVolatile } from "@/lib/server-cache";
import {
  parseStatsPeriod,
  statsPeriodLabel,
  statsPeriodToWeReadMode,
  type StatsPeriod,
} from "@/lib/stats-query";
import { books as mockBooks, dashboardData, findBook, findHighlightsForBook } from "@/lib/mock-data";
import type { Book, DashboardData, HighlightItem, RecommendationItem, StoreSearchHit } from "@/lib/types";
import { getWeReadApiKey } from "@/server/auth/credentials";
import { createGatewayContext, getWeReadGateway, isValidWeReadApiKey } from "@/server/adapters/weread/get-gateway";
import {
  getSyncSnapshot,
  setSyncSnapshot,
  snapshotToDashboard,
} from "@/server/cache/sync-cache";
import { fetchLiveBookDetail } from "@/server/services/fetch-live-book-detail";
import { buildTrendForPeriod } from "@/server/services/stats-analytics";
import { syncFromWeRead } from "@/server/services/weread-sync";
import {
  buildCategoryDistribution,
  buildMetricsFromReadData,
  transformRecommendation,
  transformSearchResult,
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

function getAllBookshelfBooks(): Book[] {
  const books = getLiveBooks() ?? mockBooks;
  return Array.from(new Map(books.map((book) => [book.id, book])).values());
}

function getShelfBookIdSet(): Set<string> {
  const ids = getSyncSnapshot()?.books.map((book) => book.id) ?? mockBooks.map((book) => book.id);
  return new Set(ids);
}

export async function getBookshelfItems(
  query: BookshelfQuery = {},
): Promise<{ items: Book[]; total: number; totalAll: number }> {
  markReadingDataVolatile();
  const all = getAllBookshelfBooks();
  const items = applyBookshelfQuery(all, query);
  return { items, total: items.length, totalAll: all.length };
}

export async function getBookshelfPageData(query: BookshelfQuery = {}) {
  markReadingDataVolatile();
  const all = getAllBookshelfBooks();
  const items = applyBookshelfQuery(all, query);
  return { all, items, total: items.length, totalAll: all.length };
}

export async function getStatsPayload(periodInput?: StatsPeriod) {
  markReadingDataVolatile();
  const period = periodInput ?? "30d";
  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (gateway && apiKey) {
    try {
      const mode = statsPeriodToWeReadMode(period);
      const context = createGatewayContext(apiKey);
      const detail = await gateway.getReadingStats(context, mode);
      const overall =
        period === "30d" ? await gateway.getReadingStats(context, "overall") : undefined;

      let categoryDistribution = buildCategoryDistribution(detail);
      if (categoryDistribution.length === 0 && mode !== "monthly") {
        const monthlyDetail = await gateway.getReadingStats(context, "monthly");
        categoryDistribution = buildCategoryDistribution(monthlyDetail);
      }

      return {
        metrics: buildMetricsFromReadData(detail, overall),
        readingTrend: buildTrendForPeriod(detail, period),
        categoryDistribution,
        period,
        periodLabel: statsPeriodLabel(period),
      };
    } catch {
      // fall back to cached snapshot / mock below
    }
  }

  const dashboard = await getDashboardData();
  return {
    metrics: dashboard.metrics,
    readingTrend: dashboard.readingTrend,
    categoryDistribution: dashboard.categoryDistribution,
    period,
    periodLabel: statsPeriodLabel(period),
  };
}

export function parseStatsPeriodFromSearchParams(
  raw?: Record<string, string | string[] | undefined>,
): StatsPeriod {
  const value = typeof raw?.period === "string" ? raw.period : undefined;
  return parseStatsPeriod(value);
}

export async function getAllNotesItems(): Promise<HighlightItem[]> {
  markReadingDataVolatile();
  const snapshot = getSyncSnapshot();
  return snapshot?.highlights ?? dashboardData.recentHighlights;
}

export async function getNotesItems(
  query: NotesQuery = {},
): Promise<{ items: HighlightItem[]; total: number; totalAll: number }> {
  markReadingDataVolatile();
  const all = await getAllNotesItems();
  const items = applyNotesQuery(all, query);
  return { items, total: items.length, totalAll: all.length };
}

export async function getNotesPageData(query: NotesQuery = {}) {
  markReadingDataVolatile();
  const all = await getAllNotesItems();
  const items = applyNotesQuery(all, query);
  return { all, items, total: items.length, totalAll: all.length };
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

  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (gateway && apiKey && !bookId.startsWith("album-")) {
    try {
      return await fetchLiveBookDetail(
        gateway,
        createGatewayContext(apiKey),
        bookId,
        cachedBook ?? undefined,
      );
    } catch {
      // fall back to cached/mock below
    }
  }

  if (!cachedBook && !mockBook) {
    return null;
  }

  const book = cachedBook ?? mockBook!;
  const highlights =
    snapshot?.highlights.filter((item) => item.bookId === bookId) ??
    findHighlightsForBook(bookId);

  return { book, highlights };
}

function withShelfFlag(book: Book, shelfIds: Set<string>): StoreSearchHit {
  return { book, onShelf: shelfIds.has(book.id) };
}

export async function searchStoreBooks(
  query?: string,
): Promise<{ items: StoreSearchHit[]; total: number }> {
  markReadingDataVolatile();
  const normalized = query?.trim();
  const shelfIds = getShelfBookIdSet();
  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (gateway && apiKey && normalized) {
    try {
      const results = await gateway.searchBooks(createGatewayContext(apiKey), normalized, 15);
      const books = (results.results ?? []).flatMap((group) =>
        (group.books ?? []).map(transformSearchResult),
      );
      const items = books.map((book) => withShelfFlag(book, shelfIds));
      return { items, total: items.length };
    } catch {
      const fallback = await getBookshelfItems({ q: normalized });
      return {
        items: fallback.items.map((book) => withShelfFlag(book, shelfIds)),
        total: fallback.total,
      };
    }
  }

  if (normalized) {
    const fallback = await getBookshelfItems({ q: normalized });
    return {
      items: fallback.items.map((book) => withShelfFlag(book, shelfIds)),
      total: fallback.total,
    };
  }

  return { items: [], total: 0 };
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
