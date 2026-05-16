import { NextResponse } from "next/server";

import { getBookDetail } from "@/server/services/reading-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params;
  const detail = await getBookDetail(bookId);

  if (!detail) {
    return NextResponse.json({ message: "Book not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
