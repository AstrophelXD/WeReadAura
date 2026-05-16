import { describe, expect, it } from "vitest";

import { buildBookHighlightsMarkdown, highlightItemToMarkdown } from "@/lib/highlight-markdown";
import type { HighlightItem } from "@/lib/types";

const bookmark: HighlightItem = {
  id: "1",
  bookId: "b",
  bookTitle: "测试书",
  quote: "引用正文",
  note: "我的笔记",
  createdAt: "2026-05-15",
  chapter: "第 1 章",
};

const thought: HighlightItem = {
  id: "2",
  bookId: "b",
  bookTitle: "测试书",
  quote: "整段想法内容",
  createdAt: "2026-05-14",
  chapter: "想法",
};

describe("highlight-markdown", () => {
  it("formats bookmark with blockquote and note", () => {
    const md = highlightItemToMarkdown(bookmark);
    expect(md).toContain("### 第 1 章 · 2026-05-15 · 划线");
    expect(md).toContain("> 引用正文");
    expect(md).toContain("**想法：** 我的笔记");
  });

  it("formats thought without blockquote", () => {
    const md = highlightItemToMarkdown(thought);
    expect(md).toContain("### 想法 · 2026-05-14 · 想法");
    expect(md).not.toContain(">");
    expect(md).toContain("整段想法内容");
  });

  it("builds book document with header and separators", () => {
    const md = buildBookHighlightsMarkdown(
      { title: "小镇喧嚣", author: "吴毅", exportedAt: "2026-05-16" },
      [bookmark, thought],
    );
    expect(md).toMatch(/^# 小镇喧嚣/);
    expect(md).toContain("**作者：** 吴毅");
    expect(md).toContain("---");
    expect(md).toContain("第 1 章");
    expect(md).toContain("整段想法内容");
  });
});
