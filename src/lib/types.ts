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
  /** Unix seconds (UTC date buckets); used by reading heatmap layout. */
  timestamp?: number;
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
  chapterUid?: number;
  /** 全书目录中的顺序（0 起），用于按章节排序 */
  chapterOrder?: number;
  /** Unix 秒，用于按时间排序 */
  createdAtTime?: number;
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
  /** 微信读书推荐值（百分制，如 92.5） */
  recommendRating?: number;
  /** 推荐标签，如「神作」「力荐」 */
  recommendLabel?: string;
  recommendRatingCount?: number;
}

export interface StoreSearchHit {
  book: Book;
  onShelf: boolean;
}

/** 书城热门划线（/book/bestbookmarks） */
export interface PopularHighlight {
  id: string;
  quote: string;
  highlightCount: number;
  chapter: string;
  chapterUid?: number;
  range?: string;
}

export interface BookDiscoverDetail {
  intro: string;
  publisher?: string;
  rating?: number;
  ratingLabel?: string;
  ratingCount?: number;
  wordCount?: number;
}

export interface BookDiscoverPreview {
  book: Book;
  onShelf: boolean;
  detail: BookDiscoverDetail;
  popularHighlights: PopularHighlight[];
  shelfProgress?: Pick<Book, "status" | "progress" | "minutesRead" | "highlights" | "notes">;
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
