import { describe, expect, it } from "vitest";

import {
  buildAssistantUserMessage,
  embeddedUserDisplayContent,
  highlightToQuoted,
} from "@/lib/assistant-quote";
import type { HighlightItem } from "@/lib/types";

const sample: HighlightItem = {
  id: "h1",
  bookId: "b1",
  bookTitle: "测试书",
  quote: "习惯是重复足够多次后变得自动化的行为。",
  note: "和系统有关",
  createdAt: "2026/05/01",
  chapter: "第 3 章",
};

describe("assistant-quote", () => {
  it("embeds quoted notes in the user message", () => {
    const quoted = [highlightToQuoted(sample)];
    const { message } = buildAssistantUserMessage("这些笔记在讲什么？", quoted);
    expect(message).toContain("引用的笔记");
    expect(message).toContain(sample.quote);
    expect(message).toContain("这些笔记在讲什么");
  });

  it("omits quotes from display when embedded on book page", () => {
    const quoted = [highlightToQuoted(sample)];
    const { display, message } = buildAssistantUserMessage("这些笔记在讲什么？", quoted, {
      showQuotesInDisplay: false,
    });
    expect(display).toBe("这些笔记在讲什么？");
    expect(display).not.toContain("引用的笔记");
    expect(message).toContain("引用的笔记");
  });

  it("strips quoted block for embedded thread display", () => {
    const quoted = [highlightToQuoted(sample)];
    const { display } = buildAssistantUserMessage("这些笔记在讲什么？", quoted);
    expect(embeddedUserDisplayContent(display)).toBe("这些笔记在讲什么？");
    expect(embeddedUserDisplayContent(display)).not.toContain(sample.quote);
  });
});
