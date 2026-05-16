import type {
  ExternalBookInfo,
  ExternalBookProgress,
  ExternalBookmarkListResponse,
  ExternalNotebooksResponse,
  ExternalReadDataDetail,
  ExternalRecommendResponse,
  ExternalReviewListResponse,
  ExternalSearchResponse,
  ExternalShelfResponse,
} from "@/server/adapters/weread/types";

export interface GatewayContext {
  apiKey: string;
}

export interface WeReadGateway {
  getBookshelf(context: GatewayContext): Promise<ExternalShelfResponse>;
  getReadingStats(
    context: GatewayContext,
    mode?: "weekly" | "monthly" | "annually" | "overall",
    baseTime?: number,
  ): Promise<ExternalReadDataDetail>;
  getNotebooks(context: GatewayContext, count?: number, lastSort?: number): Promise<ExternalNotebooksResponse>;
  getBookmarkList(context: GatewayContext, bookId: string): Promise<ExternalBookmarkListResponse>;
  getMyReviews(
    context: GatewayContext,
    bookId: string,
    synckey?: number,
    count?: number,
  ): Promise<ExternalReviewListResponse>;
  getBookInfo(context: GatewayContext, bookId: string): Promise<ExternalBookInfo>;
  getBookProgress(context: GatewayContext, bookId: string): Promise<ExternalBookProgress>;
  searchBooks(context: GatewayContext, keyword: string, count?: number): Promise<ExternalSearchResponse>;
  getRecommendations(context: GatewayContext, count?: number): Promise<ExternalRecommendResponse>;
}
