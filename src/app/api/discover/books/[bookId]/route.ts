import { NextResponse } from "next/server";

import { fetchDiscoverBookPreview } from "@/server/services/discover-preview";

export async function GET(
  _request: Request,
  context: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await context.params;
  const preview = await fetchDiscoverBookPreview(bookId);

  if (!preview) {
    return NextResponse.json({ message: "未找到该书籍。" }, { status: 404 });
  }

  return NextResponse.json(preview);
}
