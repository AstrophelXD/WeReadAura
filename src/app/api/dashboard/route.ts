import { NextResponse } from "next/server";

import { getDashboardData } from "@/server/services/reading-data";

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}
