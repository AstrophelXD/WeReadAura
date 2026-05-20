import type { AssistantChatRequest, AssistantMessage } from "@/lib/assistant-types";
import type { AssistantStreamEvent } from "@/lib/insight-types";
import {
  createDeepSeekChatCompletion,
  DeepSeekClientError,
  isDeepSeekConfigured,
} from "@/server/adapters/ai/deepseek-client";
import type { DeepSeekMessage } from "@/server/adapters/ai/deepseek-types";
import { runAssistantFallback } from "@/server/services/assistant/assistant-fallback";
import {
  buildDataStatusNotice,
  isDemoData,
  needsSyncHint,
  sanitizeHistory,
  sanitizeUserMessage,
  validateChatRequest,
} from "@/server/services/assistant/assistant-guards";
import { buildAssistantSystemPrompt } from "@/server/services/assistant/assistant-prompts";
import {
  ASSISTANT_TOOL_DEFINITIONS,
  executeAssistantTool,
} from "@/server/services/assistant/assistant-tools";
import { getDataSourceInfo } from "@/server/services/reading-data";

const MAX_TOOL_ROUNDS = 6;
const STREAM_CHUNK_SIZE = 24;

function* chunkText(text: string, size = STREAM_CHUNK_SIZE): Generator<string> {
  for (let index = 0; index < text.length; index += size) {
    yield text.slice(index, index + size);
  }
}

function toDeepSeekHistory(history: AssistantMessage[]): DeepSeekMessage[] {
  return history.map((item) => ({
    role: item.role,
    content: item.content,
  }));
}

function toolResultMessage(toolCallId: string, name: string, result: unknown): DeepSeekMessage {
  return {
    role: "tool",
    tool_call_id: toolCallId,
    name,
    content: JSON.stringify(result),
  };
}

export async function* runAssistantChatStream(
  request: AssistantChatRequest,
): AsyncGenerator<AssistantStreamEvent> {
  const validationError = validateChatRequest(request);
  if (validationError) {
    yield { type: "error", message: validationError };
    return;
  }

  const message = sanitizeUserMessage(request.message);
  const history = sanitizeHistory(request.history);
  const dataSource = await getDataSourceInfo();
  const meta = {
    usedTools: [] as string[],
    dataSource: {
      mode: dataSource.mode,
      source: dataSource.source,
      lastSyncedAt: dataSource.lastSyncedAt,
      hasApiKey: dataSource.hasApiKey,
      aiConfigured: isDeepSeekConfigured(),
    },
    needsSync: needsSyncHint(dataSource),
    isDemo: isDemoData(dataSource),
  };

  yield { type: "meta", ...meta };

  const notice = buildDataStatusNotice(dataSource);

  if (!isDeepSeekConfigured()) {
    const fallback = await runAssistantFallback(message, dataSource, request.context);
    const reply = `${fallback.reply}\n\n— ${notice}`;
    yield { type: "delta", text: reply };
    yield { type: "done", reply, usedTools: fallback.usedTools };
    return;
  }

  try {
    const messages: DeepSeekMessage[] = [
      {
        role: "system",
        content: buildAssistantSystemPrompt(dataSource, request.context),
      },
      ...toDeepSeekHistory(history),
      { role: "user", content: message },
    ];

    const usedTools: string[] = [];

    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const response = await createDeepSeekChatCompletion({
        model: "deepseek-chat",
        messages,
        tools: ASSISTANT_TOOL_DEFINITIONS,
        tool_choice: "auto",
      });

      const choice = response.choices[0]?.message;
      if (!choice) {
        throw new DeepSeekClientError("模型未返回消息。");
      }

      if (choice.tool_calls?.length) {
        messages.push({
          role: "assistant",
          content: choice.content,
          tool_calls: choice.tool_calls,
        });

        for (const call of choice.tool_calls) {
          const name = call.function.name;
          usedTools.push(name);
          const result = await executeAssistantTool(name, call.function.arguments);
          messages.push(toolResultMessage(call.id, name, result));
        }
        continue;
      }

      const trimmed = choice.content?.trim();
      if (!trimmed) {
        throw new DeepSeekClientError("模型返回空内容。");
      }

      for (const piece of chunkText(trimmed)) {
        yield { type: "delta", text: piece };
      }

      const reply = `${trimmed}\n\n— ${notice}`;
      yield { type: "done", reply, usedTools };
      return;
    }

    throw new DeepSeekClientError("工具调用轮次过多，请缩小问题范围后重试。");
  } catch (error) {
    const fallback = await runAssistantFallback(message, dataSource, request.context);
    const detail =
      error instanceof DeepSeekClientError ? error.message : "AI 服务暂时不可用。";
    const reply = `${detail}\n\n以下为降级结果：\n\n${fallback.reply}\n\n— ${notice}`;
    yield { type: "delta", text: reply };
    yield { type: "done", reply, usedTools: fallback.usedTools };
  }
}
