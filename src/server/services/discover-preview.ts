import { books as mockBooks, recommendations as mockRecommendations } from "@/lib/mock-data";
import type { BookDiscoverPreview, PopularHighlight } from "@/lib/types";
import { getWeReadApiKey } from "@/server/auth/credentials";
import { createGatewayContext, getWeReadGateway } from "@/server/adapters/weread/get-gateway";
import {
  buildDiscoverPreview,
  transformPopularHighlights,
} from "@/server/services/weread-transform";
import { findBookshelfBook } from "@/server/services/reading-data";

const MOCK_POPULAR: PopularHighlight[] = [
  {
    id: "mock-pop-1",
    quote: "习惯是重复足够多次后变得自动化的行为。",
    highlightCount: 1284,
    chapter: "第 1 章",
  },
  {
    id: "mock-pop-2",
    quote: "你不会上升到目标的高度，只会跌落到系统的水平。",
    highlightCount: 956,
    chapter: "第 1 章",
  },
  {
    id: "mock-pop-3",
    quote: "每一个小习惯都在为你想成为的那种人投票。",
    highlightCount: 742,
    chapter: "第 2 章",
  },
];

function mockShelfBook(bookId: string) {
  return mockBooks.find((book) => book.id === bookId);
}

function mockPreviewFromRecommendation(bookId: string): BookDiscoverPreview | null {
  const rec = mockRecommendations.find((item) => item.id === bookId);
  if (!rec) {
    return null;
  }

  const shelfBook = mockShelfBook(bookId);
  const onShelf = Boolean(shelfBook);

  return {
    book: shelfBook ?? {
      id: bookId,
      title: rec.title,
      author: rec.author,
      category: rec.tag,
      coverTone: rec.coverTone,
      status: "queued",
      progress: 0,
      minutesRead: 0,
      lastReadAt: "",
      startedAt: "",
      highlights: 0,
      notes: 0,
      summary: rec.reason,
    },
    onShelf,
    detail: {
      intro: rec.reason,
      rating: 8.6,
      ratingCount: 1200,
    },
    popularHighlights: onShelf ? [] : MOCK_POPULAR,
    shelfProgress: shelfBook
      ? {
          status: shelfBook.status,
          progress: shelfBook.progress,
          minutesRead: shelfBook.minutesRead,
          highlights: shelfBook.highlights,
          notes: shelfBook.notes,
        }
      : undefined,
  };
}

function mockPreview(bookId: string): BookDiscoverPreview | null {
  const shelfBook = mockShelfBook(bookId);
  if (shelfBook) {
    return {
      book: shelfBook,
      onShelf: true,
      detail: { intro: shelfBook.summary },
      popularHighlights: [],
      shelfProgress: {
        status: shelfBook.status,
        progress: shelfBook.progress,
        minutesRead: shelfBook.minutesRead,
        highlights: shelfBook.highlights,
        notes: shelfBook.notes,
      },
    };
  }

  return mockPreviewFromRecommendation(bookId) ?? {
    book: {
      id: bookId,
      title: "示例书目",
      author: "作者",
      category: "演示",
      coverTone: "white",
      status: "queued",
      progress: 0,
      minutesRead: 0,
      lastReadAt: "",
      startedAt: "",
      highlights: 0,
      notes: 0,
      summary: "连接微信读书 API 后可查看真实书籍详情与热门划线。",
    },
    onShelf: false,
    detail: {
      intro: "当前为演示数据。配置 API Key 并同步后，将拉取微信读书书城的真实简介与热门划线。",
    },
    popularHighlights: MOCK_POPULAR,
  };
}

export async function fetchDiscoverBookPreview(bookId: string): Promise<BookDiscoverPreview | null> {
  const normalized = bookId.trim();
  if (!normalized) {
    return null;
  }

  const shelfBook = findBookshelfBook(normalized);
  const onShelf = Boolean(shelfBook);

  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);

  if (!gateway || !apiKey) {
    return mockPreview(normalized);
  }

  try {
    const context = createGatewayContext(apiKey);
    const info = await gateway.getBookInfo(context, normalized);
    const popularPayload = onShelf
      ? { items: [], chapters: [] }
      : await gateway.getBestBookmarks(context, normalized);
    const popularHighlights = onShelf ? [] : transformPopularHighlights(popularPayload);

    return buildDiscoverPreview(info, onShelf, shelfBook, popularHighlights);
  } catch {
    return mockPreview(normalized);
  }
}
