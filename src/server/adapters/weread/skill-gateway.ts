import { callWeReadGateway } from "@/server/adapters/weread/client";
import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
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

function withKey<T>(context: GatewayContext, body: Record<string, unknown>): Promise<T> {
  return callWeReadGateway(context.apiKey, body) as Promise<T>;
}

export class SkillWeReadGateway implements WeReadGateway {
  getBookshelf(context: GatewayContext) {
    return withKey<ExternalShelfResponse>(context, { api_name: "/shelf/sync" });
  }

  getReadingStats(context: GatewayContext, mode = "monthly", baseTime = 0) {
    return withKey<ExternalReadDataDetail>(context, {
      api_name: "/readdata/detail",
      mode,
      baseTime,
    });
  }

  getNotebooks(context: GatewayContext, count = 50, lastSort?: number) {
    const body: Record<string, unknown> = {
      api_name: "/user/notebooks",
      count,
    };
    if (lastSort !== undefined) {
      body.lastSort = lastSort;
    }
    return withKey<ExternalNotebooksResponse>(context, body);
  }

  getBookmarkList(context: GatewayContext, bookId: string) {
    return withKey<ExternalBookmarkListResponse>(context, {
      api_name: "/book/bookmarklist",
      bookId,
    });
  }

  getMyReviews(context: GatewayContext, bookId: string, synckey = 0, count = 20) {
    return withKey<ExternalReviewListResponse>(context, {
      api_name: "/review/list/mine",
      bookid: bookId,
      synckey,
      count,
    });
  }

  getBookInfo(context: GatewayContext, bookId: string) {
    return withKey<ExternalBookInfo>(context, {
      api_name: "/book/info",
      bookId,
    });
  }

  getBookProgress(context: GatewayContext, bookId: string) {
    return withKey<ExternalBookProgress>(context, {
      api_name: "/book/getprogress",
      bookId,
    });
  }

  searchBooks(context: GatewayContext, keyword: string, count = 15) {
    return withKey<ExternalSearchResponse>(context, {
      api_name: "/store/search",
      keyword,
      scope: 10,
      count,
    });
  }

  getRecommendations(context: GatewayContext, count = 12) {
    return withKey<ExternalRecommendResponse>(context, {
      api_name: "/book/recommend",
      count,
    });
  }
}
