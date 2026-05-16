import { describe, expect, it } from "vitest";

import {
  formatWeReadRecommendLine,
  formatWeReadRecommendPercent,
  parseWeReadRecommend,
} from "@/lib/weread-recommend";

describe("weread-recommend", () => {
  it("converts thousand-scale rating to percent", () => {
    expect(formatWeReadRecommendPercent(925)).toBe(92.5);
    expect(formatWeReadRecommendPercent(1000)).toBe(100);
  });

  it("parses label and count", () => {
    const fields = parseWeReadRecommend({
      newRating: 888,
      newRatingCount: 12000,
      newRatingDetail: { title: "神作" },
    });
    expect(fields.recommendRating).toBe(88.8);
    expect(fields.recommendLabel).toBe("神作");
    expect(fields.recommendRatingCount).toBe(12000);
    expect(formatWeReadRecommendLine(fields)).toBe("88.8% · 神作");
  });
});
