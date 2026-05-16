import { NextRequest, NextResponse } from "next/server";

import { highlights } from "@/lib/mock-data";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase();

  const items = query
    ? highlights.filter(
        (item) =>
          item.bookTitle.toLowerCase().includes(query) ||
          item.quote.toLowerCase().includes(query) ||
          item.note?.toLowerCase().includes(query),
      )
    : highlights;

  return NextResponse.json({ items, total: items.length });
}
