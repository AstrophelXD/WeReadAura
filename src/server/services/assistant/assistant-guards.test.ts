import { describe, expect, it } from "vitest";

import {
  isDemoData,
  needsSyncHint,
  sanitizeHistory,
  sanitizeUserMessage,
  validateChatRequest,
} from "@/server/services/assistant/assistant-guards";
import type { DataSourceInfo } from "@/server/services/reading-data";

describe("assistant-guards", () => {
  it("rejects empty messages", () => {
    expect(validateChatRequest({ message: "   " })).toBe("请输入问题。");
  });

  it("truncates long user messages", () => {
    const long = "a".repeat(3000);
    expect(sanitizeUserMessage(long).length).toBe(2000);
  });

  it("keeps only recent history turns", () => {
    const history = Array.from({ length: 30 }, (_, index) => ({
      role: index % 2 === 0 ? ("user" as const) : ("assistant" as const),
      content: `msg-${index}`,
    }));
    expect(sanitizeHistory(history).length).toBe(16);
  });

  it("detects demo and needs-sync states", () => {
    const mockSource: DataSourceInfo = {
      mode: "mock",
      source: "演示",
      lastSyncedAt: "从未",
      hasApiKey: false,
    };
    expect(isDemoData(mockSource)).toBe(true);
    expect(needsSyncHint(mockSource)).toBe(false);

    const pending: DataSourceInfo = {
      mode: "mock",
      source: "待同步",
      lastSyncedAt: "从未同步",
      hasApiKey: true,
    };
    expect(needsSyncHint(pending)).toBe(true);
  });
});
