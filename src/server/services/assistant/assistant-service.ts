import type {
  AssistantChatRequest,
  AssistantChatResponse,
  AssistantMessage,
} from "@/lib/assistant-types";
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

export async function runAssistantChat(
  request: AssistantChatRequest,
): Promise<AssistantChatResponse> {
  const validationError = validateChatRequest(request);
  if (validationError) {
    return {
      reply: validationError,
      usedTools: [],
      dataSource: await buildResponseDataSource(),
      needsSync: false,
      isDemo: true,
      error: "validation",
    };
  }

  const message = sanitizeUserMessage(request.message);
  const history = sanitizeHistory(request.history);
  const dataSource = await getDataSourceInfo();
  const base = {
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

  if (!isDeepSeekConfigured()) {
    const fallback = await runAssistantFallback(message, dataSource, request.context);
    const notice = buildDataStatusNotice(dataSource);
    return {
      reply: `${fallback.reply}\n\n— ${notice}`,
      usedTools: fallback.usedTools,
      ...base,
    };
  }

  try {
    const { reply, usedTools } = await runDeepSeekChat(message, history, dataSource, request.context);
    const notice = buildDataStatusNotice(dataSource);
    return {
      reply: `${reply}\n\n— ${notice}`,
      usedTools,
      ...base,
    };
  } catch (error) {
    const fallback = await runAssistantFallback(message, dataSource, request.context);
    const detail =
      error instanceof DeepSeekClientError ? error.message : "AI 服务暂时不可用。";
    const notice = buildDataStatusNotice(dataSource);
    return {
      reply: `${detail}\n\n以下为降级结果：\n\n${fallback.reply}\n\n— ${notice}`,
      usedTools: fallback.usedTools,
      ...base,
      error: "deepseek",
    };
  }
}

async function buildResponseDataSource() {
  const dataSource = await getDataSourceInfo();
  return {
    mode: dataSource.mode,
    source: dataSource.source,
    lastSyncedAt: dataSource.lastSyncedAt,
    hasApiKey: dataSource.hasApiKey,
    aiConfigured: isDeepSeekConfigured(),
  };
}

async function runDeepSeekChat(
  message: string,
  history: AssistantMessage[],
  dataSource: Awaited<ReturnType<typeof getDataSourceInfo>>,
  pageContext?: AssistantChatRequest["context"],
): Promise<{ reply: string; usedTools: string[] }> {
  const messages: DeepSeekMessage[] = [
    {
      role: "system",
      content: buildAssistantSystemPrompt(dataSource, pageContext),
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

    const text = choice.content?.trim();
    if (!text) {
      throw new DeepSeekClientError("模型返回空内容。");
    }

    return { reply: text, usedTools };
  }

  throw new DeepSeekClientError("工具调用轮次过多，请缩小问题范围后重试。");
}
