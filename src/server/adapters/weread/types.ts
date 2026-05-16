export interface ExternalShelfBook {
  bookId: string;
  title: string;
  author: string;
  cover?: string;
  category?: string;
  readUpdateTime?: number;
  finishReading?: number;
  updateTime?: number;
  isTop?: number;
  secret?: number;
}

export interface ExternalShelfAlbum {
  albumInfo: {
    albumId: string;
    name: string;
    authorName?: string;
    cover?: string;
    trackCount?: number;
    finishStatus?: string;
    finish?: number;
    intro?: string;
    updateTime?: number;
  };
  albumInfoExtra?: {
    secret?: number;
    lectureReadUpdateTime?: number;
    isTop?: number;
  };
}

export interface ExternalShelfResponse {
  books: ExternalShelfBook[];
  albums?: ExternalShelfAlbum[];
  mp?: unknown;
  bookCount?: number;
}

export interface ExternalBookProgress {
  bookId: string;
  book?: {
    chapterUid?: number;
    progress?: number;
    updateTime?: number;
    recordReadingTime?: number;
    finishTime?: number;
    isStartReading?: number;
  };
}

export interface ExternalBookInfo {
  bookId: string;
  title: string;
  author: string;
  cover?: string;
  intro?: string;
  category?: string;
  publisher?: string;
  newRating?: number;
  newRatingCount?: number;
}

export interface ExternalReadDataDetail {
  totalReadTime?: number;
  readDays?: number;
  dayAverageReadTime?: number;
  compare?: number;
  readTimes?: Record<string, number>;
  preferCategory?: Array<{
    categoryTitle: string;
    val?: number;
    readingTime?: number;
    readingCount?: number;
  }>;
  readStat?: Array<{ stat: string; counts: string }>;
  readLongest?: Array<{
    book?: { bookId: string; title: string; author: string };
    albumInfo?: { albumId: string; name: string };
    readTime?: number;
  }>;
}

export interface ExternalNotebookBook {
  bookId: string;
  book?: { title: string; author: string; cover?: string };
  reviewCount?: number;
  noteCount?: number;
  bookmarkCount?: number;
  readingProgress?: number;
  markedStatus?: number;
  sort?: number;
}

export interface ExternalNotebooksResponse {
  totalBookCount?: number;
  totalNoteCount?: number;
  hasMore?: number;
  books: ExternalNotebookBook[];
}

export interface ExternalBookmark {
  bookmarkId: string;
  bookId: string;
  chapterUid?: number;
  markText: string;
  createTime: number;
  range?: string;
}

export interface ExternalBookmarkListResponse {
  updated: ExternalBookmark[];
  chapters?: Array<{ chapterUid: number; title: string }>;
  book?: { title: string; author: string };
}

export interface ExternalReviewItem {
  review: {
    reviewId: string;
    content: string;
    createTime: number;
    chapterName?: string;
    star?: number;
  };
}

export interface ExternalReviewListResponse {
  reviews: ExternalReviewItem[];
  totalCount?: number;
  hasMore?: number;
  synckey?: number;
}

export interface ExternalSearchBook {
  searchIdx?: number;
  bookInfo: {
    bookId: string;
    title: string;
    author: string;
    cover?: string;
    category?: string;
    intro?: string;
    newRating?: number;
    newRatingCount?: number;
    soldout?: number;
  };
  readingCount?: number;
  newRating?: number;
}

export interface ExternalSearchResponse {
  hasMore?: number;
  results: Array<{
    title: string;
    scope: number;
    books: ExternalSearchBook[];
  }>;
}

export interface ExternalRecommendBook {
  bookId: string;
  title: string;
  author: string;
  cover?: string;
  intro?: string;
  category?: string;
  reason?: string;
  newRating?: number;
  newRatingDetail?: { title?: string };
  searchIdx?: number;
}

export interface ExternalRecommendResponse {
  books: ExternalRecommendBook[];
}
