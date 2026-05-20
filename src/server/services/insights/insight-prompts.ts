import type { PeriodInsightSignals } from "@/server/services/insights/period-signals";

export function buildPeriodSummarySystemPrompt(): string {
  return [
    "你是 WeReadAura 的阅读数据归纳助手，只根据输入的结构化事实生成「周期阅读摘要」。",
    "禁止输出人格标签、性格测试、心理诊断或「你是某某型读者」表述。",
    "禁止编造未提供的数据；样本不足时 confidence 必须为 low，语气收敛。",
    "只输出一个 JSON 对象，不要 Markdown 围栏，不要额外说明。",
    "JSON 字段：headline, summary, keywords(2-4), keyFindings(3-5), notableBooks([{title,reason,bookId?}]), noteThemes(0-3), confidence(low|medium|high), evidence(1-4 条，须可对应输入事实)。",
  ].join("\n");
}

export function buildPeriodSummaryUserPrompt(signals: PeriodInsightSignals): string {
  return JSON.stringify(
    {
      task: "period-summary",
      period: signals.period,
      periodLabel: signals.periodLabel,
      sourceMode: signals.sourceMode,
      suggestedConfidence: signals.confidence,
      facts: {
        readDays: signals.readDays,
        totalReadTimeLabel: signals.totalReadTimeLabel,
        compareLabel: signals.compareLabel,
        highlights: signals.highlights,
        metrics: signals.metrics,
        topBooks: signals.topBooks,
        topAuthors: signals.topAuthors,
        categoryHint: signals.categoryHint,
        timeHint: signals.timeHint,
      },
    },
    null,
    2,
  );
}
