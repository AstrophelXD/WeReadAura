import type { GatewayContext, WeReadGateway } from "@/server/adapters/weread/gateway";
import type { HighlightItem } from "@/lib/types";
import { transformReviewHighlight } from "@/server/services/weread-transform";

export async function fetchAllMyReviewsForBook(
  gateway: WeReadGateway,
  context: GatewayContext,
  bookId: string,
  bookTitle: string,
): Promise<HighlightItem[]> {
  const items: HighlightItem[] = [];
  let synckey = 0;

  for (let page = 0; page < 20; page += 1) {
    const response = await gateway.getMyReviews(context, bookId, synckey, 20);
    for (const entry of response.reviews ?? []) {
      items.push(transformReviewHighlight(entry, bookId, bookTitle));
    }
    if (response.hasMore !== 1) {
      break;
    }
    const nextKey = response.synckey ?? 0;
    if (nextKey === synckey) {
      break;
    }
    synckey = nextKey;
  }

  return items;
}
