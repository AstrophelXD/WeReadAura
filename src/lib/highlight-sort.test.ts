import { describe, expect, it } from "vitest";

import {
  buildChapterOrderMap,
  compareHighlightsByChapter,
  groupHighlightsByChapter,
  sortHighlights,
} from "@/lib/highlight-sort";
import type { HighlightItem } from "@/lib/types";

function item(partial: Partial<HighlightItem> & Pick<HighlightItem, "id">): HighlightItem {
  return {
    bookId: "b",
    bookTitle: "书",
    quote: "q",
    createdAt: "2026-05-01",
    chapter: "第 1 章",
    ...partial,
  };
}

describe("highlight-sort", () => {
  it("orders by chapter then create time ascending", () => {
    const items = [
      item({ id: "a", chapter: "第 2 章", chapterOrder: 1, createdAtTime: 100 }),
      item({ id: "b", chapter: "第 1 章", chapterOrder: 0, createdAtTime: 200 }),
      item({ id: "c", chapter: "第 1 章", chapterOrder: 0, createdAtTime: 50 }),
    ];
    const sorted = sortHighlights(items, "chapter");
    expect(sorted.map((entry) => entry.id)).toEqual(["c", "b", "a"]);
  });

  it("orders by time descending", () => {
    const items = [
      item({ id: "a", createdAtTime: 10 }),
      item({ id: "b", createdAtTime: 30 }),
      item({ id: "c", createdAtTime: 20 }),
    ];
    expect(sortHighlights(items, "time").map((entry) => entry.id)).toEqual(["b", "c", "a"]);
  });

  it("builds chapter order from chapterIdx", () => {
    const map = buildChapterOrderMap([
      { chapterUid: 20, chapterIdx: 2 },
      { chapterUid: 10, chapterIdx: 1 },
    ]);
    expect(map.get(10)).toBe(0);
    expect(map.get(20)).toBe(1);
  });

  it("groups consecutive chapters for export", () => {
    const groups = groupHighlightsByChapter([
      item({ id: "1", chapter: "甲", chapterOrder: 0 }),
      item({ id: "2", chapter: "甲", chapterOrder: 0 }),
      item({ id: "3", chapter: "乙", chapterOrder: 1 }),
    ]);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.items.map((entry) => entry.id)).toEqual(["1", "2"]);
    expect(groups[1]?.items.map((entry) => entry.id)).toEqual(["3"]);
  });

  it("places thoughts after numbered chapters when inferring order", () => {
    const left = item({ id: "l", chapter: "想法" });
    const right = item({ id: "r", chapter: "第 3 章" });
    expect(compareHighlightsByChapter(right, left)).toBeLessThan(0);
  });
});
