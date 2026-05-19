import { describe, expect, it } from "vitest";

import { buildStatsInsights } from "@/server/services/stats-insights";

describe("buildStatsInsights", () => {
  it("maps readdata fields into insight sections", () => {
    const insights = buildStatsInsights(
      {
        preferCategoryWord: "偏好阅读文学",
        preferTimeWord: "偏好夜间阅读",
        dayAverageReadTime: 3600,
        totalReadTime: 7200,
        readDays: 2,
        readRate: 72,
        wrReadTime: 5000,
        wrListenTime: 2200,
        readStat: [
          { stat: "读过", counts: "8本" },
          { stat: "读完", counts: "2本" },
        ],
        readLongest: [
          {
            book: { bookId: "b1", title: "测试书", author: "作者" },
            readTime: 1800,
            tags: ["笔记最多"],
          },
        ],
        preferAuthor: [{ name: "作者A", count: 2, readTime: "3小时" }],
        preferPublisher: [{ name: "出版社A", count: 4 }],
      },
      "monthly",
    );

    expect(insights.highlights).toContain("偏好阅读文学");
    expect(insights.secondaryMetrics.some((item) => item.label === "自然日均")).toBe(true);
    expect(insights.readStats).toEqual([{ label: "读过", value: "8本" }]);
    expect(insights.readLongest[0]?.title).toBe("测试书");
    expect(insights.readingMix?.readRate).toBe(72);
    expect(insights.preferAuthors[0]?.name).toBe("作者A");
  });

  it("includes weekly rank in highlights", () => {
    const insights = buildStatsInsights(
      { rank: { text: "朋友中排第3名" } },
      "weekly",
    );
    expect(insights.highlights).toContain("朋友中排第3名");
  });
});
