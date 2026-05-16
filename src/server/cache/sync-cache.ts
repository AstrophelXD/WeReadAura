import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";

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

const CACHE_DIR = path.join(process.cwd(), ".data");
const CACHE_FILE = path.join(CACHE_DIR, "sync-snapshot.json");

type SyncGlobal = typeof globalThis & {
  __wereadSyncSnapshot?: SyncSnapshot | null;
};

function getGlobalStore(): SyncSnapshot | null | undefined {
  return (globalThis as SyncGlobal).__wereadSyncSnapshot;
}

function setGlobalStore(next: SyncSnapshot | null): void {
  (globalThis as SyncGlobal).__wereadSyncSnapshot = next;
}

function readSnapshotFromDisk(): SyncSnapshot | null {
  try {
    if (!existsSync(CACHE_FILE)) {
      return null;
    }
    const raw = readFileSync(CACHE_FILE, "utf8");
    return JSON.parse(raw) as SyncSnapshot;
  } catch {
    return null;
  }
}

function writeSnapshotToDisk(next: SyncSnapshot): void {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(CACHE_FILE, JSON.stringify(next), "utf8");
}

function removeSnapshotFromDisk(): void {
  try {
    if (existsSync(CACHE_FILE)) {
      unlinkSync(CACHE_FILE);
    }
  } catch {
    // ignore cleanup errors
  }
}

/** Shared across Route Handlers and Server Components (via global + disk). */
export function getSyncSnapshot(): SyncSnapshot | null {
  const cached = getGlobalStore();
  if (cached !== undefined) {
    return cached;
  }

  const fromDisk = readSnapshotFromDisk();
  setGlobalStore(fromDisk);
  return fromDisk;
}

export function setSyncSnapshot(next: SyncSnapshot): SyncSnapshot {
  setGlobalStore(next);
  writeSnapshotToDisk(next);
  return next;
}

export function clearSyncSnapshot(): void {
  setGlobalStore(null);
  removeSnapshotFromDisk();
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
