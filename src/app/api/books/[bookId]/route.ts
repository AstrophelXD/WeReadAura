import { NextResponse } from "next/server";

import { findBook, findHighlightsForBook } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params;
  const book = findBook(bookId);

  if (!book) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({
    book,
    highlights: findHighlightsForBook(bookId),
  });
}
