import type { HighlightItem } from "@/lib/types";

export function isThoughtHighlight(item: HighlightItem): boolean {
  return item.chapter === "想法";
}

export function highlightKindLabel(item: HighlightItem): "划线" | "想法" {
  return isThoughtHighlight(item) ? "想法" : "划线";
}

export function buildHighlightCopyText(item: HighlightItem): string {
  const parts = [item.quote.trim()];
  if (item.note?.trim()) {
    parts.push(`想法：${item.note.trim()}`);
  }
  return parts.join("\n\n");
}
