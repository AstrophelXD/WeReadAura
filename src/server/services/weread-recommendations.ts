import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
import type { ExternalBookInfo, ExternalRecommendBook } from "@/server/adapters/weread/types";
import type { RecommendationItem } from "@/lib/types";
import { transformRecommendation } from "@/server/services/weread-transform";

function pickString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

function pickNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) {
      return value;
    }
  }
  return undefined;
}

function pickRatingDetail(
  value: unknown,
): ExternalRecommendBook["newRatingDetail"] | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }
  const detail = value as { title?: string };
  return detail.title ? { title: detail.title } : undefined;
}

/** 兼容 Gateway 回包：顶层 books、recommend.books、嵌套 bookInfo 等。 */
export function normalizeRecommendBook(raw: unknown): ExternalRecommendBook | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  const item = raw as Record<string, unknown>;
  const nestedBook = item.book as Record<string, unknown> | undefined;
  const bookInfo = (item.bookInfo ?? nestedBook?.bookInfo) as Record<string, unknown> | undefined;

  const bookId = pickString(item.bookId, bookInfo?.bookId);
  const title = pickString(item.title, bookInfo?.title);
  if (!bookId || !title) {
    return null;
  }

  return {
    bookId,
    title,
    author: pickString(item.author, bookInfo?.author) ?? "",
    cover: pickString(item.cover, bookInfo?.cover),
    intro: pickString(item.intro, bookInfo?.intro),
    category: pickString(item.category, bookInfo?.category),
    reason: pickString(item.reason),
    readingCount: pickNumber(item.readingCount),
    searchIdx: pickNumber(item.searchIdx),
    newRating: pickNumber(item.newRating, bookInfo?.newRating),
    newRatingCount: pickNumber(item.newRatingCount, bookInfo?.newRatingCount),
    newRatingDetail: pickRatingDetail(item.newRatingDetail ?? bookInfo?.newRatingDetail),
  };
}

/** 从 /book/recommend 回包解析书籍列表（见 weread-skills discover.md）。 */
export function parseRecommendBooksResponse(payload: Record<string, unknown>): ExternalRecommendBook[] {
  const nested = payload.recommend as Record<string, unknown> | undefined;
  const candidates = [payload.books, nested?.books];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }
    return candidate
      .map((entry) => normalizeRecommendBook(entry))
      .filter((book): book is ExternalRecommendBook => book !== null);
  }

  return [];
}

async function resolveRecommendIntro(
  gateway: WeReadGateway,
  context: GatewayContext,
  book: ExternalRecommendBook,
): Promise<string | undefined> {
  if (book.intro?.trim()) {
    return book.intro.trim();
  }

  if (!book.bookId) {
    return undefined;
  }

  try {
    const info: ExternalBookInfo = await gateway.getBookInfo(context, book.bookId);
    return info.intro?.trim() || undefined;
  } catch {
    return undefined;
  }
}

/**
 * 拉取个性化推荐并为卡片补全书城简介。
 * Skill：/book/recommend 含 books[].intro；缺省时按 discover 工作流调 /book/info。
 */
export async function fetchRecommendationsWithIntros(
  gateway: WeReadGateway,
  context: GatewayContext,
  count = 12,
): Promise<RecommendationItem[]> {
  const payload = (await gateway.getRecommendations(context, count)) as unknown as Record<
    string,
    unknown
  >;
  const books = parseRecommendBooksResponse(payload);

  const enriched = await Promise.all(
    books.map(async (book, index) => {
      const intro = await resolveRecommendIntro(gateway, context, book);
      return transformRecommendation({ ...book, intro }, index);
    }),
  );

  return enriched;
}
