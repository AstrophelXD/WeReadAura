import { NextResponse } from "next/server";

import { recommendations } from "@/lib/mock-data";

export function GET() {
  return NextResponse.json({ items: recommendations });
}
