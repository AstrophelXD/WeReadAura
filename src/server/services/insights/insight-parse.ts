import type { InsightConfidence, PeriodSummaryInsight } from "@/lib/insight-types";
import type { PeriodInsightSignals } from "@/server/services/insights/period-signals";
import { buildDeterministicPeriodSummary } from "@/server/services/insights/period-summary-fallback";
import { periodInsightTitle } from "@/server/services/insights/period-signals";

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value.trim() : fallback;
}

function asStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean)
    .slice(0, max);
}

function parseConfidence(value: unknown, fallback: InsightConfidence): InsightConfidence {
  if (value === "low" || value === "medium" || value === "high") {
    return value;
  }
  return fallback;
}

function extractJsonObject(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start < 0 || end <= start) {
    return null;
  }
  try {
    return JSON.parse(trimmed.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parsePeriodSummaryFromModel(
  raw: string,
  signals: PeriodInsightSignals,
): PeriodSummaryInsight | null {
  const parsed = extractJsonObject(raw);
  if (!parsed) {
    return null;
  }

  const headline = asString(parsed.headline);
  const summary = asString(parsed.summary);
  if (!headline || !summary) {
    return null;
  }

  const evidence = asStringArray(parsed.evidence, 4);
  if (evidence.length === 0) {
    return null;
  }

  const notableBooks: PeriodSummaryInsight["notableBooks"] = [];
  if (Array.isArray(parsed.notableBooks)) {
    for (const item of parsed.notableBooks) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const row = item as Record<string, unknown>;
      const title = asString(row.title);
      const reason = asString(row.reason);
      if (title && reason) {
        notableBooks.push({
          title,
          reason,
          bookId: asString(row.bookId) || undefined,
        });
      }
    }
  }

  const fallback = buildDeterministicPeriodSummary(signals);

  return {
    type: "period-summary",
    period: signals.period,
    generatedAt: new Date().toISOString(),
    sourceMode: signals.sourceMode,
    title: periodInsightTitle(signals.period),
    summary,
    confidence: parseConfidence(parsed.confidence, signals.confidence),
    evidence,
    disclaimer: fallback.disclaimer,
    headline,
    keywords: asStringArray(parsed.keywords, 4).length
      ? asStringArray(parsed.keywords, 4)
      : fallback.keywords,
    keyFindings: asStringArray(parsed.keyFindings, 5).length
      ? asStringArray(parsed.keyFindings, 5)
      : fallback.keyFindings,
    notableBooks: notableBooks.length ? notableBooks.slice(0, 3) : fallback.notableBooks,
    noteThemes: asStringArray(parsed.noteThemes, 3),
  };
}
