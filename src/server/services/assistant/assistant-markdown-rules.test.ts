import { describe, expect, it } from "vitest";

import { ASSISTANT_MARKDOWN_OUTPUT_RULES } from "@/server/services/assistant/assistant-markdown-rules";

describe("ASSISTANT_MARKDOWN_OUTPUT_RULES", () => {
  it("requires markdown structure without top-level h1", () => {
    expect(ASSISTANT_MARKDOWN_OUTPUT_RULES).toContain("Markdown");
    expect(ASSISTANT_MARKDOWN_OUTPUT_RULES).toContain("不要使用一级标题");
    expect(ASSISTANT_MARKDOWN_OUTPUT_RULES).toContain("```json");
    expect(ASSISTANT_MARKDOWN_OUTPUT_RULES).toContain("不要输出 HTML");
  });
});
