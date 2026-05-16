import { NextResponse } from "next/server";

import { dashboardData } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json(dashboardData);
}
