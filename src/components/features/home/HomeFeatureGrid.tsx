import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { DataSourceInfo } from "@/server/services/reading-data";

type FeatureTone = "yellow" | "green" | "blue" | "pink";

type HomeFeatureGridProps = {
  bookshelfTotal: number;
  highlightCount: number;
  recommendationCount: number;
  primaryMetricLabel?: string;
  primaryMetricValue?: string;
  dataSource: DataSourceInfo;
};

const toneSurface: Record<FeatureTone, string> = {
  yellow: "neo-yellow",
  green: "neo-green",
  blue: "neo-blue",
  pink: "neo-pink",
};

export function HomeFeatureGrid({
  bookshelfTotal,
  highlightCount,
  recommendationCount,
  primaryMetricLabel,
  primaryMetricValue,
  dataSource,
}: HomeFeatureGridProps) {
  const syncHint = dataSource.mode === "live" ? "已同步 Skill 数据" : "连接后自动更新";

  const features: Array<{
    href: string;
    eyebrow: string;
    title: string;
    description: string;
    tone: FeatureTone;
    stat: string;
    statLabel: string;
  }> = [
    {
      href: "/bookshelf",
      eyebrow: "书架",
      title: "藏书全景",
      description: "在读、想读与已读完分栏浏览，支持分类与状态筛选。",
      tone: "yellow",
      stat: String(bookshelfTotal),
      statLabel: "册在架",
    },
    {
      href: "/stats",
      eyebrow: "统计",
      title: "阅读节奏",
      description: "周期切换、时长趋势与偏好分类占比，口径与微信读书一致。",
      tone: "blue",
      stat: primaryMetricValue ?? "—",
      statLabel: primaryMetricLabel ?? "核心指标",
    },
    {
      href: "/notes",
      eyebrow: "笔记",
      title: "划线与想法",
      description: "按书籍聚合回顾，点击卡片查看原文与上下文。",
      tone: "green",
      stat: String(highlightCount),
      statLabel: "条近期产出",
    },
    {
      href: "/discover",
      eyebrow: "发现",
      title: "找书与推荐",
      description: "书城搜索、微信读书「为你推荐」与书单探索。",
      tone: "pink",
      stat: String(recommendationCount),
      statLabel: "条推荐",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href} className="group block h-full">
            <Card pressOnHover className={`h-full ${toneSurface[feature.tone]}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="neo-eyebrow">{feature.eyebrow}</p>
                <Badge tone="white">{feature.statLabel}</Badge>
              </div>
              <p className="type-metric-sm mt-4">{feature.stat}</p>
              <h3 className="type-card-title-lg mt-3">{feature.title}</h3>
              <p className="type-body mt-3 flex-1">{feature.description}</p>
              <p className="type-link mt-5 group-hover:underline">进入 {feature.eyebrow} →</p>
            </Card>
          </Link>
        ))}
      </div>
      <Link href="/settings" className="group block">
        <Card pressOnHover className="neo-muted">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="neo-eyebrow">同步</p>
              <h3 className="type-card-title-lg">微信读书 Skill 一键拉取</h3>
              <p className="type-body">
                配置 API Key 后同步书架、阅读统计、划线与推荐；{syncHint}。
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Badge tone={dataSource.mode === "live" ? "green" : "yellow"}>
                {dataSource.mode === "live" ? "已连接" : dataSource.hasApiKey ? "待同步" : "演示模式"}
              </Badge>
              <span className="neo-button neo-button--primary neo-press inline-flex min-h-12 items-center px-5 text-sm md:text-base">
                {dataSource.mode === "live" ? "管理连接" : "去设置并同步"}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}
