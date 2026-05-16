import { NextResponse } from "next/server";

import { getStatsPayload } from "@/server/services/reading-data";

export async function GET() {
  const payload = await getStatsPayload();
  return NextResponse.json(payload);
}
