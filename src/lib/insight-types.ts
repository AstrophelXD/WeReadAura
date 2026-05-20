import type { ReadDataMode } from "@/lib/stats-query";
import type { DataMode } from "@/server/services/reading-data";

export type InsightConfidence = "low" | "medium" | "high";

export type PeriodSummaryInsight = {
  type: "period-summary";
  period: ReadDataMode;
  generatedAt: string;
  sourceMode: DataMode;
  title: string;
  summary: string;
  confidence: InsightConfidence;
  evidence: string[];
  disclaimer: string;
  headline: string;
  keywords: string[];
  keyFindings: string[];
  notableBooks: Array<{
    bookId?: string;
    title: string;
    reason: string;
  }>;
  noteThemes: string[];
};

export type InsightResponse = {
  insight: PeriodSummaryInsight;
  generatedBy: "ai" | "deterministic";
  aiConfigured: boolean;
  needsSync: boolean;
  isDemo: boolean;
};

export type AssistantStreamEvent =
  | {
      type: "meta";
      usedTools: string[];
      dataSource: {
        mode: DataMode;
        source: string;
        lastSyncedAt: string;
        hasApiKey: boolean;
        aiConfigured: boolean;
      };
      needsSync: boolean;
      isDemo: boolean;
    }
  | { type: "delta"; text: string }
  | { type: "done"; reply: string; usedTools: string[] }
  | { type: "error"; message: string };
