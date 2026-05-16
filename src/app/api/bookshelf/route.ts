import { NextRequest, NextResponse } from "next/server";

import { parseBookshelfQuery } from "@/lib/bookshelf-query";
import { getBookshelfItems } from "@/server/services/reading-data";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = parseBookshelfQuery({
    q: params.get("q") ?? undefined,
    status: params.get("status") ?? undefined,
    sort: params.get("sort") ?? undefined,
  });
  const payload = await getBookshelfItems(query);
  return NextResponse.json(payload);
}
