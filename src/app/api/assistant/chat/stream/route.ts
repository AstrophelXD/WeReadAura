import { NextRequest } from "next/server";

import type { AssistantChatRequest } from "@/lib/assistant-types";
import { runAssistantChatStream } from "@/server/services/assistant/assistant-stream";

export async function POST(request: NextRequest) {
  let body: AssistantChatRequest;
  try {
    body = (await request.json()) as AssistantChatRequest;
  } catch {
    return new Response("请求体无效。", { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runAssistantChatStream(body)) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (error) {
        const message = error instanceof Error ? error.message : "流式响应失败。";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "error", message })}\n\n`),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
