import type { PopularHighlight } from "@/lib/types";
import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
import { transformPopularHighlights } from "@/server/services/weread-transform";

export async function fetchPopularHighlightsForBook(
  gateway: WeReadGateway,
  context: GatewayContext,
  bookId: string,
): Promise<PopularHighlight[]> {
  const payload = await gateway.getBestBookmarks(context, bookId);
  return transformPopularHighlights(payload);
}
