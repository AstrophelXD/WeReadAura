import { formatDurationLabel, formatPercentChange } from "@/lib/formatters";
import type { ReadDataMode } from "@/lib/stats-query";
import { readDataModeLabel } from "@/lib/stats-query";
import type { InsightConfidence } from "@/lib/insight-types";
import type { StatsPayload } from "@/server/services/reading-data";

export type PeriodInsightSignals = {
  period: ReadDataMode;
  periodLabel: string;
  sourceMode: "mock" | "live";
  readDays?: number;
  totalReadTime?: number;
  totalReadTimeLabel?: string;
  compareLabel?: string;
  highlights: string[];
  metrics: Array<{ label: string; value: string }>;
  topBooks: Array<{ bookId?: string; title: string; durationLabel: string }>;
  topAuthors: string[];
  categoryHint?: string;
  timeHint?: string;
  confidence: InsightConfidence;
};

function inferConfidence(readDays?: number): InsightConfidence {
  if (!readDays || readDays < 3) {
    return "low";
  }
  if (readDays < 8) {
    return "medium";
  }
  return "high";
}

/** Deterministic fact layer for period-summary (no LLM). */
export function buildPeriodInsightSignals(
  payload: StatsPayload,
  sourceMode: "mock" | "live",
  extras?: {
    readDays?: number;
    totalReadTime?: number;
    compare?: number;
  },
): PeriodInsightSignals {
  const readDays = extras?.readDays;
  const totalReadTimeLabel =
    extras?.totalReadTime !== undefined
      ? formatDurationLabel(extras.totalReadTime)
      : payload.metrics.find((m) => m.label.includes("时长"))?.value;

  return {
    period: payload.mode,
    periodLabel: payload.modeLabel,
    sourceMode,
    readDays,
    totalReadTime: extras?.totalReadTime,
    totalReadTimeLabel,
    compareLabel:
      extras?.compare !== undefined ? formatPercentChange(extras.compare) : undefined,
    highlights: payload.insights.highlights,
    metrics: payload.metrics.map((m) => ({ label: m.label, value: m.value })),
    topBooks: payload.insights.readLongest.slice(0, 3).map((b) => ({
      bookId: b.href?.replace("/books/", ""),
      title: b.title,
      durationLabel: b.durationLabel,
    })),
    topAuthors: payload.insights.preferAuthors.slice(0, 3).map((a) => a.name),
    categoryHint: payload.insights.highlights.find((h) => h.includes("偏好")) ?? payload.preferTimeWord,
    timeHint: payload.preferTimeWord,
    confidence: inferConfidence(readDays),
  };
}

export function periodInsightTitle(period: ReadDataMode): string {
  return `${readDataModeLabel(period)}阅读摘要`;
}
