import { NextRequest, NextResponse } from "next/server";

import { WEREAD_API_KEY_COOKIE } from "@/server/auth/credentials";
import { clearSyncSnapshot } from "@/server/cache/sync-cache";
import { getDataSourceInfo } from "@/server/services/reading-data";

function maskApiKey(apiKey: string): string {
  if (apiKey.length <= 8) {
    return "wrk-****";
  }
  return `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}`;
}

export async function GET() {
  const info = await getDataSourceInfo();
  return NextResponse.json({
    mode: info.mode,
    source: info.source,
    lastSyncedAt: info.lastSyncedAt,
    hasApiKey: info.hasApiKey,
    docsUrl: "https://weread.qq.com/r/weread-skills",
  });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as { apiKey?: string; clear?: boolean };
  const response = NextResponse.json({ status: "saved" });

  if (body.clear) {
    response.cookies.set(WEREAD_API_KEY_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    clearSyncSnapshot();
    return response;
  }

  const apiKey = body.apiKey?.trim();
  if (!apiKey) {
    return NextResponse.json({ status: "error", message: "请填写 API Key。" }, { status: 400 });
  }

  if (!apiKey.startsWith("wrk-")) {
    return NextResponse.json(
      { status: "error", message: "微信读书 API Key 以 wrk- 开头。" },
      { status: 400 },
    );
  }

  response.cookies.set(WEREAD_API_KEY_COOKIE, apiKey, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });

  clearSyncSnapshot();

  return NextResponse.json({
    status: "saved",
    maskedKey: maskApiKey(apiKey),
  });
}
