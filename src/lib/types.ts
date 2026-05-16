export type ReadingStatus = "reading" | "finished" | "queued";

export interface Metric {
  label: string;
  value: string;
  hint: string;
  tone?: "yellow" | "green" | "blue" | "pink" | "white";
}

export interface TrendPoint {
  label: string;
  minutes: number;
}

export interface DistributionPoint {
  label: string;
  value: number;
}

export interface HighlightItem {
  id: string;
  bookId: string;
  bookTitle: string;
  quote: string;
  note?: string;
  createdAt: string;
  chapter: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverTone: "yellow" | "green" | "blue" | "pink" | "white";
  status: ReadingStatus;
  progress: number;
  minutesRead: number;
  lastReadAt: string;
  startedAt: string;
  finishedAt?: string;
  highlights: number;
  notes: number;
  summary: string;
}

export interface StoreSearchHit {
  book: Book;
  onShelf: boolean;
}

export interface RecommendationItem {
  id: string;
  title: string;
  author: string;
  reason: string;
  tag: string;
  coverTone: "yellow" | "green" | "blue" | "pink" | "white";
}

export interface DashboardData {
  heroTitle: string;
  heroBody: string;
  metrics: Metric[];
  readingTrend: TrendPoint[];
  categoryDistribution: DistributionPoint[];
  activeBooks: Book[];
  finishedBooks: Book[];
  recentHighlights: HighlightItem[];
  recommendations: RecommendationItem[];
  syncStatus: {
    lastSyncedAt: string;
    source: string;
  };
}
