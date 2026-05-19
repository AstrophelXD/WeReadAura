import { NextResponse } from "next/server";

import { parseReadDataMode } from "@/lib/stats-query";
import { getStatsPayload } from "@/server/services/reading-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = parseReadDataMode(
    searchParams.get("mode") ?? searchParams.get("period"),
  );
  const payload = await getStatsPayload(mode);
  return NextResponse.json(payload);
}
