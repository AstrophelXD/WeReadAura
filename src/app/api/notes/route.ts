import { NextRequest, NextResponse } from "next/server";

import { parseNotesQuery } from "@/lib/notes-query";
import { getNotesItems } from "@/server/services/reading-data";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = parseNotesQuery({
    q: params.get("q") ?? undefined,
    bookId: params.get("bookId") ?? undefined,
    range: params.get("range") ?? undefined,
  });
  const payload = await getNotesItems(query);
  return NextResponse.json(payload);
}
