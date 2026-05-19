import { describe, expect, it, vi } from "vitest";

import { buildTrendForMode } from "@/server/services/stats-analytics";
import {
  normalizePercentValue,
  resolveBookProgress,
  resolveLastReadAt,
  resolveReadingSeconds,
  resolveReadingStatus,
  resolveStartedAt,
} from "@/server/services/weread-progress";

describe("normalizePercentValue", () => {
  it("treats fractional values as ratios", () => {
    expect(normalizePercentValue(0.67)).toBe(67);
  });

  it("keeps integer percents", () => {
    expect(normalizePercentValue(67)).toBe(67);
  });
});

describe("resolveBookProgress", () => {
  it("returns 100 when finished on shelf", () => {
    expect(resolveBookProgress({ finishReading: 1, apiProgress: 12 })).toBe(100);
  });

  it("prefers API progress over notebook", () => {
    expect(resolveBookProgress({ apiProgress: 67, notebookProgress: 10 })).toBe(67);
  });
});

describe("resolveReadingSeconds", () => {
  it("uses readingTime when recordReadingTime is zero", () => {
    expect(
      resolveReadingSeconds({ recordReadingTime: 0, readingTime: 124_794 }),
    ).toBe(124_794);
  });

  it("prefers recordReadingTime when set", () => {
    expect(
      resolveReadingSeconds({ recordReadingTime: 3600, readingTime: 999 }),
    ).toBe(3600);
  });

  it("uses fallback when book fields are empty", () => {
    expect(resolveReadingSeconds(undefined, 600)).toBe(600);
  });
});

describe("resolveStartedAt", () => {
  it("uses startReadingTime from progress API", () => {
    expect(resolveStartedAt({ startReadingTime: 1_765_252_844, isStartReading: 1 })).toBe(
      "2025-12-09",
    );
  });

  it("does not use shelf updateTime semantics", () => {
    expect(resolveStartedAt(undefined, undefined)).toBe("");
  });
});

describe("resolveLastReadAt", () => {
  it("prefers progress updateTime", () => {
    expect(resolveLastReadAt(1_778_923_368, 1_708_592_332)).toBe("2026-05-16");
  });
});

describe("resolveReadingStatus", () => {
  it("marks in-progress books with partial progress", () => {
    expect(resolveReadingStatus({ progress: 67, isStartReading: 1 })).toBe("reading");
  });
});

describe("buildTrendForMode", () => {
  it("always returns seven weekly bars (Mon–Sun)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-19T12:00:00+08:00"));

    const trend = buildTrendForMode(
      {
        readTimes: {
          [String(Math.floor(new Date("2026-05-19T08:00:00+08:00").getTime() / 1000))]: 1800,
        },
      },
      "weekly",
    );

    expect(trend).toHaveLength(7);
    expect(trend.map((point) => point.label)).toEqual([
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
      "周日",
    ]);
    expect(trend[1]?.minutes).toBe(30);

    vi.useRealTimers();
  });

  it("labels annually buckets by month when no dailyReadTimes", () => {
    const trend = buildTrendForMode(
      {
        readTimes: {
          "1704067200": 3600,
          "1706745600": 1800,
        },
      },
      "annually",
    );
    expect(trend[0]?.label).toMatch(/^\d{2}月$/);
  });
});
