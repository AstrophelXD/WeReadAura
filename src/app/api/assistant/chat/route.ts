import { NextRequest, NextResponse } from "next/server";

import type { AssistantChatRequest } from "@/lib/assistant-types";
import { runAssistantChat } from "@/server/services/assistant/assistant-service";

export async function POST(request: NextRequest) {
  let body: AssistantChatRequest;
  try {
    body = (await request.json()) as AssistantChatRequest;
  } catch {
    return NextResponse.json({ error: "请求体无效。" }, { status: 400 });
  }

  const result = await runAssistantChat(body);
  const status = result.error === "validation" ? 400 : 200;
  return NextResponse.json(result, { status });
}
