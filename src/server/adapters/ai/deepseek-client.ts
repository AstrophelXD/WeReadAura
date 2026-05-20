import type { DeepSeekChatRequest, DeepSeekChatResponse } from "@/server/adapters/ai/deepseek-types";

const DEEPSEEK_CHAT_URL = "https://api.deepseek.com/chat/completions";
const DEFAULT_MODEL = "deepseek-chat";
const DEFAULT_TIMEOUT_MS = 60_000;

export function getDeepSeekApiKey(): string | null {
  const key = process.env.DEEPSEEK_API_KEY?.trim();
  return key || null;
}

export function isDeepSeekConfigured(): boolean {
  return Boolean(getDeepSeekApiKey());
}

export class DeepSeekClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "DeepSeekClientError";
  }
}

export async function createDeepSeekChatCompletion(
  request: DeepSeekChatRequest,
  options?: { timeoutMs?: number },
): Promise<DeepSeekChatResponse> {
  const apiKey = getDeepSeekApiKey();
  if (!apiKey) {
    throw new DeepSeekClientError("未配置 DEEPSEEK_API_KEY。请在 .env.local 中设置后重启开发服务器。");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model || DEFAULT_MODEL,
        messages: request.messages,
        tools: request.tools,
        tool_choice: request.tool_choice ?? "auto",
        temperature: request.temperature ?? 0.4,
        max_tokens: request.max_tokens ?? 2048,
        stream: request.stream ?? false,
      }),
      signal: controller.signal,
    });

    const payload = (await response.json()) as DeepSeekChatResponse;

    if (!response.ok) {
      const detail = payload.error?.message ?? response.statusText;
      throw new DeepSeekClientError(`DeepSeek 请求失败：${detail}`, response.status);
    }

    if (!payload.choices?.length) {
      throw new DeepSeekClientError("DeepSeek 返回为空。");
    }

    return payload;
  } catch (error) {
    if (error instanceof DeepSeekClientError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new DeepSeekClientError("DeepSeek 请求超时，请稍后重试。");
    }
    throw new DeepSeekClientError(
      error instanceof Error ? error.message : "DeepSeek 请求失败。",
    );
  } finally {
    clearTimeout(timeout);
  }
}

/** Stream text deltas from the final chat completion (OpenAI-compatible SSE). */
export async function* streamDeepSeekChatCompletion(
  request: DeepSeekChatRequest,
  options?: { timeoutMs?: number },
): AsyncGenerator<string> {
  const apiKey = getDeepSeekApiKey();
  if (!apiKey) {
    throw new DeepSeekClientError("未配置 DEEPSEEK_API_KEY。请在 .env.local 中设置后重启开发服务器。");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options?.timeoutMs ?? DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch(DEEPSEEK_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: request.model || DEFAULT_MODEL,
        messages: request.messages,
        tools: request.tools,
        tool_choice: request.tool_choice ?? "none",
        temperature: request.temperature ?? 0.4,
        max_tokens: request.max_tokens ?? 2048,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const payload = (await response.json()) as DeepSeekChatResponse;
      const detail = payload.error?.message ?? response.statusText;
      throw new DeepSeekClientError(`DeepSeek 请求失败：${detail}`, response.status);
    }

    if (!response.body) {
      throw new DeepSeekClientError("DeepSeek 流式响应为空。");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          continue;
        }
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") {
          return;
        }
        try {
          const json = JSON.parse(data) as {
            choices?: { delta?: { content?: string } }[];
          };
          const piece = json.choices?.[0]?.delta?.content;
          if (piece) {
            yield piece;
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }
  } catch (error) {
    if (error instanceof DeepSeekClientError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new DeepSeekClientError("DeepSeek 请求超时，请稍后重试。");
    }
    throw new DeepSeekClientError(
      error instanceof Error ? error.message : "DeepSeek 流式请求失败。",
    );
  } finally {
    clearTimeout(timeout);
  }
}
