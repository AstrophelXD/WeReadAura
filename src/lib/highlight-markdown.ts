import { highlightKindLabel, isThoughtHighlight } from "@/lib/highlight-content";
import type { HighlightItem } from "@/lib/types";

export type BookMarkdownMeta = {
  title: string;
  author: string;
  exportedAt?: string;
};

function escapeMarkdownInline(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

/** Single highlight / thought entry as Markdown fragment. */
export function highlightItemToMarkdown(item: HighlightItem): string {
  const kind = highlightKindLabel(item);
  const heading = `### ${item.chapter} · ${item.createdAt} · ${kind}`;
  const quote = escapeMarkdownInline(item.quote.trim());

  if (isThoughtHighlight(item)) {
    return `${heading}\n\n${quote}\n`;
  }

  const lines = [`${heading}\n`, `> ${quote.replace(/\n/g, "\n> ")}`];

  if (item.note?.trim()) {
    lines.push("", `**想法：** ${escapeMarkdownInline(item.note.trim())}`);
  }

  lines.push("");
  return lines.join("\n");
}

/** Full book export: title block + all items separated by horizontal rules. */
export function buildBookHighlightsMarkdown(meta: BookMarkdownMeta, items: HighlightItem[]): string {
  const exportedAt =
    meta.exportedAt ??
    new Intl.DateTimeFormat("zh-CN", { dateStyle: "long", timeStyle: "short" }).format(new Date());

  const header = [
    `# ${escapeMarkdownInline(meta.title)}`,
    "",
    `**作者：** ${escapeMarkdownInline(meta.author)}  `,
    `**导出时间：** ${exportedAt}  `,
    `**条数：** ${items.length}（划线与想法）`,
    "",
    "---",
    "",
  ].join("\n");

  if (items.length === 0) {
    return `${header}_暂无划线或想法。_\n`;
  }

  const body = items.map((item, index) => {
    const block = highlightItemToMarkdown(item);
    return index === 0 ? block : `---\n\n${block}`;
  });

  return header + body.join("");
}
