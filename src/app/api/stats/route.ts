import { NextResponse } from "next/server";

import { parseStatsPeriod } from "@/lib/stats-query";
import { getStatsPayload } from "@/server/services/reading-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = parseStatsPeriod(searchParams.get("period"));
  const payload = await getStatsPayload(period);
  return NextResponse.json(payload);
}
