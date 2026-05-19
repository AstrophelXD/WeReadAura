import { describe, expect, it, vi, afterEach } from "vitest";

import {
  buildLocalMonthRange,
  buildLocalWeekRange,
  localDateKeyFromUnixSeconds,
  startOfLocalWeekMonday,
} from "@/lib/local-calendar";

describe("local-calendar", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("anchors weekly range on Monday in local time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-19T12:00:00+08:00"));

    const range = buildLocalWeekRange();
    expect(range.startDateKey).toBe("2026-05-18");
    expect(range.endDateKey).toBe("2026-05-24");
    expect(startOfLocalWeekMonday(new Date()).getDay()).toBe(1);
  });

  it("uses local month for May baseTime (China offset)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-19T12:00:00+08:00"));

    const mayFirstLocal = Math.floor(new Date("2026-05-01T00:00:00+08:00").getTime() / 1000);
    const range = buildLocalMonthRange(mayFirstLocal);
    expect(range.startDateKey).toBe("2026-05-01");
    expect(range.endDateKey).toBe("2026-05-19");
  });

  it("maps unix buckets to local date keys", () => {
    const ts = Math.floor(new Date("2026-05-19T08:00:00+08:00").getTime() / 1000);
    expect(localDateKeyFromUnixSeconds(ts)).toBe("2026-05-19");
  });
});
