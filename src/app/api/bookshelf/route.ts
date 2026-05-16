import { NextRequest, NextResponse } from "next/server";

import { books } from "@/lib/mock-data";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase();

  const items = query
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.category.toLowerCase().includes(query),
      )
    : books;

  return NextResponse.json({ items, total: items.length });
}
