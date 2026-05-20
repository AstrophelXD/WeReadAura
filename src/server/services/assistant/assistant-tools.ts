import { parseReadDataMode, type ReadDataMode } from "@/lib/stats-query";
import type { DeepSeekToolDefinition } from "@/server/adapters/ai/deepseek-types";
import type { BookshelfQuery } from "@/lib/bookshelf-query";
import type { NotesQuery } from "@/lib/notes-query";
import {
  getBookDetail,
  getBookshelfItems,
  getDashboardData,
  getDataSourceInfo,
  getNotesItems,
  getRecommendations,
  getStatsPayload,
  searchStoreBooks,
} from "@/server/services/reading-data";

const MAX_BOOKS = 12;
const MAX_NOTES = 8;
const MAX_RECOMMENDATIONS = 8;
const MAX_SEARCH = 8;
const NOTE_EXCERPT = 160;

function truncateText(value: string, max = NOTE_EXCERPT): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) {
    return trimmed;
  }
  return `${trimmed.slice(0, max)}…`;
}

function parseToolArgs<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return {} as T;
  }
}

export const ASSISTANT_TOOL_DEFINITIONS: DeepSeekToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "get_data_source_info",
      description: "返回当前是否已连接微信读书、是否已同步、数据来源与最近同步时间。",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "get_dashboard_summary",
      description: "返回首页核心指标、阅读趋势摘要、在读/已读书籍预览、最近划线与推荐摘要。",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "get_stats_by_period",
      description:
        "按周期返回阅读统计：核心指标、趋势、分类分布、偏好时段、洞察高亮、阅读时长排行等。",
      parameters: {
        type: "object",
        properties: {
          period: {
            type: "string",
            enum: ["weekly", "monthly", "annually", "overall"],
            description: "统计周期：本周/本月/本年/累计",
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_bookshelf",
      description: "按关键词、阅读状态、排序返回书架书籍列表（截断）。",
      parameters: {
        type: "object",
        properties: {
          q: { type: "string", description: "搜索书名或作者" },
          status: {
            type: "string",
            enum: ["all", "reading", "finished", "queued"],
          },
          sort: {
            type: "string",
            enum: ["lastRead", "title", "progress", "minutes"],
          },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_book_detail",
      description: "返回单本书的基础信息、进度、个人划线/想法摘要（截断）、热门划线数量。",
      parameters: {
        type: "object",
        properties: {
          bookId: { type: "string", description: "书籍 ID" },
        },
        required: ["bookId"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_notes",
      description: "在当前划线与笔记中按关键词、书籍、时间范围筛选（截断）。",
      parameters: {
        type: "object",
        properties: {
          q: { type: "string" },
          bookId: { type: "string" },
          range: { type: "string", enum: ["all", "30d"] },
        },
        additionalProperties: false,
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_recommendations",
      description: "返回个性化推荐书单及推荐理由摘要（截断）。",
      parameters: { type: "object", properties: {}, additionalProperties: false },
    },
  },
  {
    type: "function",
    function: {
      name: "search_store_books",
      description: "在书城搜索书籍，并标注是否已在书架（截断）。",
      parameters: {
        type: "object",
        properties: {
          q: { type: "string", description: "搜索关键词" },
        },
        required: ["q"],
        additionalProperties: false,
      },
    },
  },
];

export async function executeAssistantTool(
  name: string,
  argsJson: string,
): Promise<unknown> {
  switch (name) {
    case "get_data_source_info":
      return get_data_source_info();
    case "get_dashboard_summary":
      return get_dashboard_summary();
    case "get_stats_by_period":
      return get_stats_by_period(parseToolArgs<{ period?: string }>(argsJson).period);
    case "list_bookshelf":
      return list_bookshelf(parseToolArgs<BookshelfQuery>(argsJson));
    case "get_book_detail":
      return get_book_detail(parseToolArgs<{ bookId?: string }>(argsJson).bookId);
    case "search_notes":
      return search_notes(parseToolArgs<NotesQuery>(argsJson));
    case "get_recommendations":
      return get_recommendations_tool();
    case "search_store_books":
      return search_store_books_tool(parseToolArgs<{ q?: string }>(argsJson).q);
    default:
      return { error: `未知工具：${name}` };
  }
}

async function get_data_source_info() {
  const info = await getDataSourceInfo();
  return {
    mode: info.mode,
    source: info.source,
    lastSyncedAt: info.lastSyncedAt,
    hasApiKey: info.hasApiKey,
  };
}

async function get_dashboard_summary() {
  const dashboard = await getDashboardData();
  const active = dashboard.activeBooks.slice(0, 6).map((book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    status: book.status,
    progress: book.progress,
    minutesRead: book.minutesRead,
  }));
  const finished = dashboard.finishedBooks.slice(0, 4).map((book) => ({
    id: book.id,
    title: book.title,
    progress: book.progress,
  }));

  return {
    heroTitle: dashboard.heroTitle,
    metrics: dashboard.metrics,
    trendSample: dashboard.readingTrend.slice(-10),
    categoryDistribution: dashboard.categoryDistribution,
    activeBooks: active,
    finishedBooks: finished,
    recentHighlights: dashboard.recentHighlights.slice(0, 5).map((item) => ({
      bookTitle: item.bookTitle,
      quote: truncateText(item.quote, 100),
      createdAt: item.createdAt,
    })),
    recommendations: dashboard.recommendations.slice(0, MAX_RECOMMENDATIONS).map((item) => ({
      title: item.title,
      author: item.author,
      tag: item.tag,
      reason: truncateText(item.reason, 120),
    })),
  };
}

async function get_stats_by_period(periodRaw?: string) {
  const period: ReadDataMode = parseReadDataMode(periodRaw);
  const payload = await getStatsPayload(period);
  return {
    period: payload.mode,
    periodLabel: payload.modeLabel,
    metrics: payload.metrics,
    trendSample: payload.readingTrend.slice(-14),
    categoryDistribution: payload.categoryDistribution,
    preferTimeWord: payload.preferTimeWord,
    insights: {
      highlights: payload.insights.highlights,
      secondaryMetrics: payload.insights.secondaryMetrics,
      readLongest: payload.insights.readLongest.slice(0, 5),
      preferAuthors: payload.insights.preferAuthors.slice(0, 5),
      readingMix: payload.insights.readingMix,
    },
    trendDescription: payload.trendDescription,
  };
}

async function list_bookshelf(query: BookshelfQuery) {
  const { items, total, totalAll } = await getBookshelfItems(query);
  return {
    total,
    totalAll,
    items: items.slice(0, MAX_BOOKS).map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      status: book.status,
      progress: book.progress,
      minutesRead: book.minutesRead,
      lastReadAt: book.lastReadAt,
    })),
  };
}

async function get_book_detail(bookIdRaw?: string) {
  const bookId = bookIdRaw?.trim();
  if (!bookId) {
    return { error: "缺少 bookId" };
  }

  const detail = await getBookDetail(bookId);
  if (!detail) {
    return { error: "未找到该书籍" };
  }

  return {
    book: {
      id: detail.book.id,
      title: detail.book.title,
      author: detail.book.author,
      status: detail.book.status,
      progress: detail.book.progress,
      minutesRead: detail.book.minutesRead,
      highlightCount: detail.highlights.length,
    },
    highlights: detail.highlights.slice(0, MAX_NOTES).map((item) => ({
      chapter: item.chapter,
      quote: truncateText(item.quote),
      note: item.note ? truncateText(item.note) : undefined,
      createdAt: item.createdAt,
    })),
    popularHighlightCount: detail.popularHighlights.length,
  };
}

async function search_notes(query: NotesQuery) {
  const { items, total, totalAll } = await getNotesItems(query);
  return {
    total,
    totalAll,
    items: items.slice(0, MAX_NOTES).map((item) => ({
      bookId: item.bookId,
      bookTitle: item.bookTitle,
      chapter: item.chapter,
      quote: truncateText(item.quote),
      note: item.note ? truncateText(item.note) : undefined,
      createdAt: item.createdAt,
    })),
  };
}

async function get_recommendations_tool() {
  const items = await getRecommendations();
  return {
    total: items.length,
    items: items.slice(0, MAX_RECOMMENDATIONS).map((item) => ({
      id: item.id,
      title: item.title,
      author: item.author,
      tag: item.tag,
      reason: truncateText(item.reason, 120),
    })),
  };
}

async function search_store_books_tool(qRaw?: string) {
  const q = qRaw?.trim();
  if (!q) {
    return { error: "缺少搜索关键词" };
  }
  const { items, total } = await searchStoreBooks(q);
  return {
    total,
    items: items.slice(0, MAX_SEARCH).map((hit) => ({
      id: hit.book.id,
      title: hit.book.title,
      author: hit.book.author,
      onShelf: hit.onShelf,
    })),
  };
}
