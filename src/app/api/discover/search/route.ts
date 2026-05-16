import { NextRequest, NextResponse } from "next/server";

import { books } from "@/lib/mock-data";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase();

  const items = query
    ? books.filter((book) => book.title.toLowerCase().includes(query))
    : books.slice(0, 3);

  return NextResponse.json({ items, total: items.length });
}
