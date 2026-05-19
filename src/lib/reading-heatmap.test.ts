import { describe, expect, it } from "vitest";

import { buildReadingHeatmapGrid } from "@/lib/reading-heatmap";

describe("reading-heatmap", () => {
  it("lays out weeks with seven weekday rows for a date range", () => {
    const { weeks } = buildReadingHeatmapGrid([], {
      startDateKey: "2026-05-01",
      endDateKey: "2026-05-31",
    });
    expect(weeks.length).toBeGreaterThan(0);
    for (const week of weeks) {
      expect(week).toHaveLength(7);
    }
  });

  it("maps minutes by timestamp buckets", () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const dateKey = new Date(timestamp * 1000).toISOString().slice(0, 10);
    const { weeks, maxMinutes } = buildReadingHeatmapGrid(
      [{ label: dateKey.slice(5), minutes: 45, timestamp }],
      { startDateKey: dateKey, endDateKey: dateKey },
    );
    const cells = weeks.flat().filter((cell): cell is NonNullable<typeof cell> => cell !== null);
    const today = cells.find((cell) => cell.dateKey === dateKey);
    expect(today?.minutes).toBe(45);
    expect(maxMinutes).toBeGreaterThanOrEqual(45);
  });
});
