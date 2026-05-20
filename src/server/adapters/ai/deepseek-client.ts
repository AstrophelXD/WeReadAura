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
