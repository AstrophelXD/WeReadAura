import { describe, expect, it } from "vitest";

import { buildMockStatsInsights } from "@/server/services/stats-insights";
import { buildDeterministicPeriodSummaryFromPayload } from "@/server/services/insights/period-summary-fallback";

describe("period-summary-fallback", () => {
  it("builds evidence-backed summary without persona labels", () => {
    const insight = buildDeterministicPeriodSummaryFromPayload(
      {
        mode: "monthly",
        modeLabel: "本月",
        trendVariant: "calendar",
        trendDescription: "desc",
        metrics: [{ label: "阅读时长", value: "12 小时" }],
        readingTrend: [],
        categoryDistribution: [],
        insights: buildMockStatsInsights(),
      },
      "mock",
      { readDays: 2, totalReadTime: 43_200 },
    );

    expect(insight.type).toBe("period-summary");
    expect(insight.evidence.length).toBeGreaterThan(0);
    expect(insight.keyFindings.length).toBeGreaterThan(0);
    expect(insight.confidence).toBe("low");
    expect(insight.headline).not.toMatch(/型读者|人格/);
  });
});
