import type { PeriodSummaryInsight } from "@/lib/insight-types";
import {
  buildPeriodInsightSignals,
  periodInsightTitle,
  type PeriodInsightSignals,
} from "@/server/services/insights/period-signals";

function buildDisclaimer(signals: PeriodInsightSignals): string {
  if (signals.sourceMode !== "live") {
    return "当前为演示数据；连接并同步微信读书后可获得基于真实快照的摘要。";
  }
  if (signals.confidence === "low") {
    return "本周期有效阅读天数较少，以下为基于现有数据的描述性归纳，不作强结论。";
  }
  return "基于最近一次同步快照；数据非实时更新。";
}

export function buildDeterministicPeriodSummary(
  signals: PeriodInsightSignals,
): PeriodSummaryInsight {
  const evidence: string[] = [];

  if (signals.totalReadTimeLabel) {
    evidence.push(`${signals.periodLabel}总阅读时长约 ${signals.totalReadTimeLabel}`);
  }
  if (signals.readDays !== undefined) {
    evidence.push(`有效阅读 ${signals.readDays} 天`);
  }
  if (signals.compareLabel) {
    evidence.push(`日均时长环比 ${signals.compareLabel}`);
  }
  for (const highlight of signals.highlights.slice(0, 2)) {
    evidence.push(highlight);
  }
  for (const book of signals.topBooks.slice(0, 2)) {
    evidence.push(`《${book.title}》投入 ${book.durationLabel}`);
  }

  const keyFindings: string[] = [];
  if (signals.highlights.length > 0) {
    keyFindings.push(signals.highlights[0]!);
  }
  if (signals.topBooks[0]) {
    keyFindings.push(
      `投入最多的读物是《${signals.topBooks[0].title}》（${signals.topBooks[0].durationLabel}）。`,
    );
  }
  if (signals.topAuthors[0]) {
    keyFindings.push(`偏好作者包括 ${signals.topAuthors.slice(0, 2).join("、")}。`);
  }
  if (signals.compareLabel && !keyFindings.some((f) => f.includes("环比"))) {
    keyFindings.push(`阅读节奏方面，日均时长较上期 ${signals.compareLabel}。`);
  }
  if (keyFindings.length === 0) {
    keyFindings.push("本周期数据条目较少，建议在助手页提问获取更细解读。");
  }

  const keywords = [
    signals.periodLabel,
    ...signals.highlights.slice(0, 2).map((h) => h.replace(/^偏好/, "")),
  ].filter(Boolean);

  const headline =
    signals.confidence === "low"
      ? `${signals.periodLabel}：样本尚少，先看清基础节奏`
      : signals.topBooks[0]
        ? `${signals.periodLabel}：主要精力在《${signals.topBooks[0].title}》`
        : `${signals.periodLabel}：保持阅读习惯`;

  const summary =
    signals.confidence === "low"
      ? `当前仅观察到少量阅读记录，建议同步更多数据后再做周期复盘。`
      : [
          signals.totalReadTimeLabel
            ? `${signals.periodLabel}累计阅读约 ${signals.totalReadTimeLabel}。`
            : null,
          signals.categoryHint ? `内容偏好信号：${signals.categoryHint}。` : null,
        ]
          .filter(Boolean)
          .join(" ") || headline;

  return {
    type: "period-summary",
    period: signals.period,
    generatedAt: new Date().toISOString(),
    sourceMode: signals.sourceMode,
    title: periodInsightTitle(signals.period),
    summary,
    confidence: signals.confidence,
    evidence: evidence.slice(0, 4),
    disclaimer: buildDisclaimer(signals),
    headline,
    keywords: [...new Set(keywords)].slice(0, 4),
    keyFindings: keyFindings.slice(0, 5),
    notableBooks: signals.topBooks.map((b) => ({
      bookId: b.bookId,
      title: b.title,
      reason: `本周期阅读 ${b.durationLabel}`,
    })),
    noteThemes: [],
  };
}

export function buildDeterministicPeriodSummaryFromPayload(
  payload: Parameters<typeof buildPeriodInsightSignals>[0],
  sourceMode: "mock" | "live",
  extras?: Parameters<typeof buildPeriodInsightSignals>[2],
): PeriodSummaryInsight {
  const signals = buildPeriodInsightSignals(payload, sourceMode, extras);
  return buildDeterministicPeriodSummary(signals);
}
