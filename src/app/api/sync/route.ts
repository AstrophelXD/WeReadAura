import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    status: "ok",
    mode: "mock",
    syncedAt: "2026-05-16T09:20:00+08:00",
  });
}
