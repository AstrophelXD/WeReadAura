import type {
  Book,
  DashboardData,
  DistributionPoint,
  HighlightItem,
  Metric,
  RecommendationItem,
  TrendPoint,
} from "@/lib/types";

export interface SyncSnapshot {
  syncedAt: string;
  source: string;
  books: Book[];
  highlights: HighlightItem[];
  recommendations: RecommendationItem[];
  metrics: Metric[];
  readingTrend: TrendPoint[];
  categoryDistribution: DistributionPoint[];
  heroTitle: string;
  heroBody: string;
}

let snapshot: SyncSnapshot | null = null;

export function getSyncSnapshot(): SyncSnapshot | null {
  return snapshot;
}

export function setSyncSnapshot(next: SyncSnapshot): SyncSnapshot {
  snapshot = next;
  return snapshot;
}

export function clearSyncSnapshot(): void {
  snapshot = null;
}

export function snapshotToDashboard(data: SyncSnapshot): DashboardData {
  return {
    heroTitle: data.heroTitle,
    heroBody: data.heroBody,
    metrics: data.metrics,
    readingTrend: data.readingTrend,
    categoryDistribution: data.categoryDistribution,
    activeBooks: data.books.filter((book) => book.status === "reading"),
    finishedBooks: data.books.filter((book) => book.status === "finished"),
    recentHighlights: data.highlights.slice(0, 6),
    recommendations: data.recommendations,
    syncStatus: {
      lastSyncedAt: data.syncedAt,
      source: data.source,
    },
  };
}
