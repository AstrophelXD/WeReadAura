import { formatDurationLabel, formatPercentChange } from "@/lib/formatters";
import type { ReadDataMode } from "@/lib/stats-query";
import type {
  PreferAuthorEntry,
  PreferPublisherEntry,
  ReadLongestEntry,
  ReadingMixInsight,
  StatsInsightMetric,
  StatsInsights,
} from "@/lib/types";
import type { ExternalReadDataDetail } from "@/server/adapters/weread/types";

const MAIN_METRIC_STATS = new Set(["读完", "笔记"]);

function readingDayAverageSeconds(detail: ExternalReadDataDetail): number | undefined {
  const days = detail.readDays ?? 0;
  const total = detail.totalReadTime ?? 0;
  if (days <= 0 || total <= 0) {
    return undefined;
  }
  return Math.round(total / days);
}

function buildSecondaryMetrics(detail: ExternalReadDataDetail): StatsInsightMetric[] {
  const items: StatsInsightMetric[] = [];

  if (detail.dayAverageReadTime && detail.dayAverageReadTime > 0) {
    items.push({
      label: "自然日均",
      value: formatDurationLabel(detail.dayAverageReadTime),
      hint: "按周期内自然日平均，分母非阅读天数",
    });
  }

  const activeDayAverage = readingDayAverageSeconds(detail);
  if (activeDayAverage) {
    items.push({
      label: "阅读日均",
      value: formatDurationLabel(activeDayAverage),
      hint: "总时长 ÷ 有效阅读天数",
    });
  }

  if (detail.recordReadingTime && detail.recordReadingTime > 0) {
    items.push({
      label: "朗读时长",
      value: formatDurationLabel(detail.recordReadingTime),
      hint: "记录类阅读",
    });
  }

  if (detail.authorCount && detail.authorCount > 0) {
    items.push({
      label: "涉及作者",
      value: String(detail.authorCount),
      hint: "符合统计条件的作者数",
    });
  }

  return items;
}

function buildReadStats(detail: ExternalReadDataDetail): StatsInsightMetric[] {
  return (detail.readStat ?? [])
    .filter((item) => item.stat && item.counts && !MAIN_METRIC_STATS.has(item.stat))
    .map((item) => ({
      label: item.stat,
      value: item.counts,
    }));
}

function buildReadLongest(detail: ExternalReadDataDetail): ReadLongestEntry[] {
  const items: ReadLongestEntry[] = [];

  for (const [index, entry] of (detail.readLongest ?? []).entries()) {
    const seconds = entry.readTime ?? 0;
    if (seconds <= 0) {
      continue;
    }

    if (entry.book?.title) {
      items.push({
        id: entry.book.bookId || `book-${index}`,
        title: entry.book.title,
        subtitle: entry.book.author,
        durationLabel: formatDurationLabel(seconds),
        durationSeconds: seconds,
        tags: entry.tags ?? [],
        href: entry.book.bookId ? `/books/${entry.book.bookId}` : undefined,
        kind: "book",
      });
      continue;
    }

    if (entry.albumInfo?.name) {
      items.push({
        id: entry.albumInfo.albumId || `album-${index}`,
        title: entry.albumInfo.name,
        durationLabel: formatDurationLabel(seconds),
        durationSeconds: seconds,
        tags: entry.tags ?? [],
        kind: "album",
      });
    }
  }

  return items;
}

function buildPreferAuthors(detail: ExternalReadDataDetail): PreferAuthorEntry[] {
  return (detail.preferAuthor ?? []).map((author) => ({
    name: author.name,
    bookCount: author.count ?? 0,
    readTimeLabel: author.readTime ?? "",
  }));
}

function buildPreferPublishers(detail: ExternalReadDataDetail): PreferPublisherEntry[] {
  return (detail.preferPublisher ?? []).map((publisher) => ({
    name: publisher.name,
    bookCount: publisher.count ?? 0,
  }));
}

function buildPreferCopyright(detail: ExternalReadDataDetail): PreferPublisherEntry[] {
  return (detail.preferCp ?? [])
    .map((item) => ({
      name: item.copyrightInfo?.name?.trim() ?? "",
      bookCount: item.count ?? 0,
    }))
    .filter((item) => item.name.length > 0);
}

function buildReadingMix(detail: ExternalReadDataDetail): ReadingMixInsight | undefined {
  if (detail.readRate === undefined || detail.wrReadTime === undefined || detail.wrListenTime === undefined) {
    return undefined;
  }

  const readRate =
    detail.readRate <= 1 ? Math.round(detail.readRate * 100) : Math.round(detail.readRate);

  return {
    readRate,
    readTimeLabel: formatDurationLabel(detail.wrReadTime),
    listenTimeLabel: formatDurationLabel(detail.wrListenTime),
  };
}

function buildHighlights(detail: ExternalReadDataDetail, mode: ReadDataMode): string[] {
  const items: string[] = [];

  if (detail.preferCategoryWord?.trim()) {
    items.push(detail.preferCategoryWord.trim());
  }
  if (detail.preferTimeWord?.trim()) {
    items.push(detail.preferTimeWord.trim());
  }
  if (mode === "weekly" && detail.rank?.text?.trim()) {
    items.push(detail.rank.text.trim());
  }
  if (detail.compare !== undefined) {
    items.push(`日均时长${formatPercentChange(detail.compare)}`);
  }

  return items;
}

function buildMedals(detail: ExternalReadDataDetail): string[] {
  const labels: string[] = [];
  const seen = new Set<string>();

  for (const medal of detail.medals ?? []) {
    const label = medal.title?.trim() || medal.name?.trim() || medal.desc?.trim() || "";
    if (label.length > 0 && !seen.has(label)) {
      seen.add(label);
      labels.push(label);
    }
  }

  return labels;
}

export function buildStatsInsights(detail: ExternalReadDataDetail, mode: ReadDataMode): StatsInsights {
  return {
    highlights: buildHighlights(detail, mode),
    secondaryMetrics: buildSecondaryMetrics(detail),
    readStats: buildReadStats(detail),
    readLongest: buildReadLongest(detail),
    preferAuthors: buildPreferAuthors(detail),
    preferPublishers: buildPreferPublishers(detail),
    preferCopyright: buildPreferCopyright(detail),
    readingMix: buildReadingMix(detail),
    medals: buildMedals(detail),
    authorCount: detail.authorCount,
  };
}

export function buildMockStatsInsights(): StatsInsights {
  return {
    highlights: ["偏好阅读历史", "偏好上午阅读"],
    secondaryMetrics: [
      { label: "自然日均", value: "41 分钟", hint: "按周期内自然日平均" },
      { label: "阅读日均", value: "51 分钟", hint: "总时长 ÷ 有效阅读天数" },
    ],
    readStats: [
      { label: "读过", value: "12本" },
      { label: "阅读", value: "45天" },
    ],
    readLongest: [
      {
        id: "demo-1",
        title: "置身事内",
        subtitle: "兰小欢",
        durationLabel: "8 小时 20 分钟",
        durationSeconds: 30_000,
        tags: ["笔记最多"],
        kind: "book",
      },
      {
        id: "demo-2",
        title: "芯片战争",
        subtitle: "克里斯·米勒",
        durationLabel: "6 小时 10 分钟",
        durationSeconds: 22_200,
        tags: [],
        kind: "book",
      },
    ],
    preferAuthors: [
      { name: "刘慈欣", bookCount: 3, readTimeLabel: "12小时" },
      { name: "村上春树", bookCount: 2, readTimeLabel: "8小时30分钟" },
    ],
    preferPublishers: [{ name: "中信出版集团", bookCount: 5 }],
    preferCopyright: [],
    readingMix: {
      readRate: 72,
      readTimeLabel: "18 小时",
      listenTimeLabel: "7 小时",
    },
    medals: ["阅读百万字", "笔记达人"],
  };
}
