import { NextRequest, NextResponse } from "next/server";

import { searchStoreBooks } from "@/server/services/reading-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const payload = await searchStoreBooks(query);
  return NextResponse.json(payload);
}
