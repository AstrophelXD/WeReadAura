import { describe, expect, it } from "vitest";

import { executeAssistantTool } from "@/server/services/assistant/assistant-tools";

describe("executeAssistantTool", () => {
  it("returns dashboard summary for get_dashboard_summary", async () => {
    const result = (await executeAssistantTool("get_dashboard_summary", "{}")) as {
      metrics: unknown[];
      heroTitle: string;
    };
    expect(result.heroTitle).toBeTruthy();
    expect(Array.isArray(result.metrics)).toBe(true);
  });

  it("returns error for unknown tool", async () => {
    const result = (await executeAssistantTool("unknown_tool", "{}")) as { error: string };
    expect(result.error).toContain("未知工具");
  });

  it("requires bookId for get_book_detail", async () => {
    const result = (await executeAssistantTool("get_book_detail", "{}")) as { error: string };
    expect(result.error).toBe("缺少 bookId");
  });
});
