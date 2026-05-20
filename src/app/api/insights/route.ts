import { NextRequest, NextResponse } from "next/server";

import { parseReadDataMode } from "@/lib/stats-query";
import { getPeriodSummaryInsight } from "@/server/services/insights/insight-service";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  if (type !== "period-summary") {
    return NextResponse.json(
      { error: "仅支持 type=period-summary。" },
      { status: 400 },
    );
  }

  const period = parseReadDataMode(request.nextUrl.searchParams.get("period"));
  const result = await getPeriodSummaryInsight(period);
  return NextResponse.json(result);
}
