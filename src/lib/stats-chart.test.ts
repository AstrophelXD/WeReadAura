import { describe, expect, it, vi, afterEach } from "vitest";

import {
  buildHeatmapDateRange,
  trendBucketGranularity,
  trendChartVariant,
} from "@/lib/stats-chart";

describe("stats-chart", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses bar chart for weekly daily buckets", () => {
    expect(trendChartVariant("weekly", { readTimes: { "1": 60 } })).toBe("bar");
    expect(trendBucketGranularity("weekly", {})).toBe("day");
  });

  it("uses heatmap for monthly daily buckets in local month", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-19T12:00:00+08:00"));

    expect(trendChartVariant("monthly", { readTimes: { "1": 60 } })).toBe("heatmap");
    const mayFirstLocal = Math.floor(new Date("2026-05-01T00:00:00+08:00").getTime() / 1000);
    const range = buildHeatmapDateRange("monthly", { baseTime: mayFirstLocal });
    expect(range?.startDateKey).toBe("2026-05-01");
    expect(range?.endDateKey).toBe("2026-05-19");
  });

  it("uses monthly bars for annually without dailyReadTimes", () => {
    expect(trendChartVariant("annually", { readTimes: { "1": 60 } })).toBe("bar");
    expect(trendBucketGranularity("annually", {})).toBe("month");
  });

  it("uses heatmap for annually with dailyReadTimes", () => {
    expect(
      trendChartVariant("annually", {
        dailyReadTimes: { "1": 60 },
        baseTime: 1_704_067_200,
      }),
    ).toBe("heatmap");
  });

  it("uses yearly bars for overall", () => {
    expect(trendChartVariant("overall", { readTimes: { "1": 60 } })).toBe("bar");
    expect(trendBucketGranularity("overall", {})).toBe("year");
  });
});
