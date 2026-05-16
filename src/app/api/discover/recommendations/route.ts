import { NextResponse } from "next/server";

import { searchRecommendationsFromGateway } from "@/server/services/reading-data";

export async function GET() {
  const items = await searchRecommendationsFromGateway();
  return NextResponse.json({ items });
}
