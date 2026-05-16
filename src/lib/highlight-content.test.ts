import { describe, expect, it } from "vitest";

import { buildHighlightCopyText, highlightKindLabel, isThoughtHighlight } from "@/lib/highlight-content";
import type { HighlightItem } from "@/lib/types";

const sample: HighlightItem = {
  id: "1",
  bookId: "b",
  bookTitle: "测试书",
  quote: "引用正文",
  note: "我的笔记",
  createdAt: "2026-05-15",
  chapter: "第 1 章",
};

describe("highlight-content", () => {
  it("detects thought entries by chapter label", () => {
    expect(isThoughtHighlight({ ...sample, chapter: "想法" })).toBe(true);
    expect(highlightKindLabel({ ...sample, chapter: "想法" })).toBe("想法");
    expect(highlightKindLabel(sample)).toBe("划线");
  });

  it("builds copy text with optional note", () => {
    expect(buildHighlightCopyText(sample)).toBe("引用正文\n\n想法：我的笔记");
    expect(buildHighlightCopyText({ ...sample, note: undefined })).toBe("引用正文");
  });
});
