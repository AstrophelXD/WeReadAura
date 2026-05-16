import { NextRequest, NextResponse } from "next/server";

import { getBookshelfItems } from "@/server/services/reading-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const payload = await getBookshelfItems(query);
  return NextResponse.json(payload);
}
