import { NextResponse } from "next/server";

import { dashboardData } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({
    source: dashboardData.syncStatus.source,
    lastSyncedAt: dashboardData.syncStatus.lastSyncedAt,
  });
}

export async function PATCH() {
  return NextResponse.json({
    status: "saved",
  });
}
