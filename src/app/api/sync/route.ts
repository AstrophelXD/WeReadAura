import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { getDataSourceInfo, runSync } from "@/server/services/reading-data";
import { WeReadApiError } from "@/server/adapters/weread/errors";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const result = await runSync();
    revalidatePath("/", "layout");
    return NextResponse.json({
      status: "ok",
      mode: result.mode,
      syncedAt: result.snapshot.syncedAt,
      bookCount: result.snapshot.books.length,
      highlightCount: result.snapshot.highlights.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    const status = error instanceof WeReadApiError ? 502 : 400;
    return NextResponse.json({ status: "error", message }, { status });
  }
}

export async function GET() {
  const info = await getDataSourceInfo();
  return NextResponse.json(info);
}
