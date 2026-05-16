import { NextResponse } from "next/server";

import { categoryDistribution, dashboardData, readingTrend } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({
    metrics: dashboardData.metrics,
    readingTrend,
    categoryDistribution,
  });
}
