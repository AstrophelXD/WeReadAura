import type { ReadDataMode } from "@/lib/stats-query";
import type { InsightResponse } from "@/lib/insight-types";
import {
  createDeepSeekChatCompletion,
  isDeepSeekConfigured,
} from "@/server/adapters/ai/deepseek-client";
import { createGatewayContext, getWeReadGateway } from "@/server/adapters/weread/get-gateway";
import { getWeReadApiKey } from "@/server/auth/credentials";
import {
  isDemoData,
  needsSyncHint,
} from "@/server/services/assistant/assistant-guards";
import {
  buildDeterministicPeriodSummary,
} from "@/server/services/insights/period-summary-fallback";
import { parsePeriodSummaryFromModel } from "@/server/services/insights/insight-parse";
import {
  buildPeriodSummarySystemPrompt,
  buildPeriodSummaryUserPrompt,
} from "@/server/services/insights/insight-prompts";
import {
  buildPeriodInsightSignals,
} from "@/server/services/insights/period-signals";
import { getDataSourceInfo, getStatsPayload } from "@/server/services/reading-data";

async function loadPeriodSignals(period: ReadDataMode) {
  const [payload, dataSource] = await Promise.all([
    getStatsPayload(period),
    getDataSourceInfo(),
  ]);

  const sourceMode = dataSource.mode === "live" ? "live" : "mock";
  let extras: { readDays?: number; totalReadTime?: number; compare?: number } | undefined;

  const apiKey = await getWeReadApiKey();
  const gateway = getWeReadGateway(apiKey);
  if (gateway && apiKey && sourceMode === "live") {
    try {
      const context = createGatewayContext(apiKey);
      const detail = await gateway.getReadingStats(context, period);
      extras = {
        readDays: detail.readDays,
        totalReadTime: detail.totalReadTime,
        compare: detail.compare,
      };
    } catch {
      // use payload-only signals
    }
  }

  const signals = buildPeriodInsightSignals(payload, sourceMode, extras);
  return { signals, dataSource };
}

export async function getPeriodSummaryInsight(period: ReadDataMode): Promise<InsightResponse> {
  const { signals, dataSource } = await loadPeriodSignals(period);
  const aiConfigured = isDeepSeekConfigured();
  const base = {
    aiConfigured,
    needsSync: needsSyncHint(dataSource),
    isDemo: isDemoData(dataSource),
  };

  const fallbackInsight = buildDeterministicPeriodSummary(signals);

  if (!aiConfigured) {
    return {
      insight: fallbackInsight,
      generatedBy: "deterministic",
      ...base,
    };
  }

  try {
    const response = await createDeepSeekChatCompletion({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: buildPeriodSummarySystemPrompt() },
        { role: "user", content: buildPeriodSummaryUserPrompt(signals) },
      ],
      temperature: 0.3,
      max_tokens: 900,
      tool_choice: "none",
    });

    const raw = response.choices[0]?.message?.content?.trim() ?? "";
    const parsed = parsePeriodSummaryFromModel(raw, signals);
    if (parsed) {
      return {
        insight: parsed,
        generatedBy: "ai",
        ...base,
      };
    }
  } catch {
    // deterministic fallback
  }

  return {
    insight: fallbackInsight,
    generatedBy: "deterministic",
    ...base,
  };
}
