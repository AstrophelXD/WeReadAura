/**
 * Book highlight Markdown export — structure follows docs/neo-brutalism-markdown-guide.md §6.
 */
import { highlightKindLabel, isThoughtHighlight } from "@/lib/highlight-content";
import { groupHighlightsByChapter } from "@/lib/highlight-sort";
import type { HighlightItem } from "@/lib/types";

export type BookMarkdownMeta = {
  title: string;
  author: string;
  exportedAt?: string;
};

function escapeMarkdownInline(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

export type HighlightMarkdownItemOptions = {
  /** 已按章节分组导出时，条目标题不再重复章节名 */
  omitChapterInHeading?: boolean;
};

/** Single highlight / thought entry as Markdown fragment. */
export function highlightItemToMarkdown(
  item: HighlightItem,
  options?: HighlightMarkdownItemOptions,
): string {
  const kind = highlightKindLabel(item);
  const heading = options?.omitChapterInHeading
    ? `### ${item.createdAt} · ${kind}`
    : `### ${item.chapter} · ${item.createdAt} · ${kind}`;
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

  const groups = groupHighlightsByChapter(items);
  const sections = groups.map(({ chapter, items: chapterItems }) => {
    const chapterHeading = `## ${escapeMarkdownInline(chapter)}\n\n`;
    const entries = chapterItems
      .map((item) => highlightItemToMarkdown(item, { omitChapterInHeading: true }))
      .join("");
    return chapterHeading + entries;
  });

  return header + sections.join("");
}
