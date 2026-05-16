import { describe, expect, it } from "vitest";

import { buildTrendForPeriod } from "@/server/services/stats-analytics";
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

describe("buildTrendForPeriod", () => {
  it("labels weekly buckets with dates", () => {
    const trend = buildTrendForPeriod(
      {
        readTimes: {
          "1778000000": 1800,
          "1778086400": 2400,
          "1778172800": 1200,
        },
      },
      "7d",
    );
    expect(trend.length).toBeLessThanOrEqual(7);
    expect(trend[0]?.label).toMatch(/^\d{2}-\d{2}$/);
  });
});
