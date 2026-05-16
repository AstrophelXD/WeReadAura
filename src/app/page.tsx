import Link from "next/link";
import type { ReactNode } from "react";

import { ChartCardHeading } from "@/components/charts/ChartCardHeading";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { HomeFeatureGrid } from "@/components/features/home/HomeFeatureGrid";
import { HomeFeatureMarquee } from "@/components/features/home/HomeFeatureMarquee";
import { BookCard } from "@/components/layout/BookCard";
import { HighlightList } from "@/components/layout/HighlightList";
import { MetricCard } from "@/components/layout/MetricCard";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
  getBookshelfItems,
  getDashboardData,
  getDataSourceInfo,
} from "@/server/services/reading-data";

const HOME_BOOK_PREVIEW = 4;
const HOME_HIGHLIGHT_PREVIEW = 3;

const heroPillars = [
  { label: "书架总览", detail: "在读、想读、已读完分栏筛选" },
  { label: "阅读统计", detail: "周期趋势与分类偏好占比" },
  { label: "划线笔记", detail: "近期产出与书籍详情联动" },
] as const;

function SectionMoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <p className="mt-6 text-right">
      <Link className="type-link" href={href}>
        {children}
      </Link>
    </p>
  );
}

export default async function HomePage() {
  const [dashboardData, dataSource, { totalAll: bookshelfTotal }] = await Promise.all([
    getDashboardData(),
    getDataSourceInfo(),
    getBookshelfItems(),
  ]);

  const primaryMetric = dashboardData.metrics[0];
  const previewBooks = dashboardData.activeBooks
    .concat(dashboardData.finishedBooks)
    .slice(0, HOME_BOOK_PREVIEW);
  const previewHighlights = dashboardData.recentHighlights.slice(0, HOME_HIGHLIGHT_PREVIEW);
  const syncBadge =
    dataSource.mode === "live" ? "已连接" : dataSource.hasApiKey ? "待同步" : "演示数据";

  return (
    <>
      <section className="section-shell bg-[color-mix(in_srgb,var(--yellow)_12%,var(--paper))]">
        <div className="container-shell grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="neo-eyebrow">个人阅读驾驶舱</p>
              <Badge tone={dataSource.mode === "live" ? "green" : "yellow"}>{syncBadge}</Badge>
            </div>
            <h1 className="hero-title mt-5 max-w-4xl">{dashboardData.heroTitle}</h1>
            <p className="section-copy mt-6 max-w-2xl">{dashboardData.heroBody}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroPillars.map((pillar) => (
                <li
                  key={pillar.label}
                  className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--white)] p-4"
                >
                  <p className="type-field-label">{pillar.label}</p>
                  <p className="type-caption mt-2">{pillar.detail}</p>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/bookshelf">打开书架</Button>
              <Button href="/stats" secondary>
                查看统计
              </Button>
              <Button href="/settings" secondary>
                {dataSource.mode === "live" ? "同步设置" : "连接微信读书"}
              </Button>
            </div>
          </div>
          <Card className="neo-white" liftOnHover>
            <div className="flex items-start justify-between gap-3">
                <p className="type-field-label">数据快照</p>
                <Badge tone="white">{dashboardData.syncStatus.source}</Badge>
              </div>
              <p className="type-field-label mt-5">上次同步</p>
              <p className="type-metric-lg mt-2">{dashboardData.syncStatus.lastSyncedAt}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">书架</p>
                  <p className="type-metric-sm mt-2">{bookshelfTotal}</p>
                  <p className="type-caption-muted mt-1">册</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">在读</p>
                  <p className="type-metric-sm mt-2">{dashboardData.activeBooks.length}</p>
                  <p className="type-caption-muted mt-1">本进行中</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">近期划线</p>
                  <p className="type-metric-sm mt-2">{dashboardData.recentHighlights.length}</p>
                  <p className="type-caption-muted mt-1">条</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">推荐</p>
                  <p className="type-metric-sm mt-2">{dashboardData.recommendations.length}</p>
                  <p className="type-caption-muted mt-1">条待探索</p>
                </div>
            </div>
          </Card>
        </div>
      </section>

      <HomeFeatureMarquee />

      <Section
        title="能做什么"
        eyebrow="功能"
        description="四大模块覆盖阅读分析全流程；点击下方卡片直达对应页面。"
      >
        <HomeFeatureGrid
          bookshelfTotal={bookshelfTotal}
          highlightCount={dashboardData.recentHighlights.length}
          recommendationCount={dashboardData.recommendations.length}
          primaryMetricLabel={primaryMetric?.label}
          primaryMetricValue={primaryMetric?.value}
          dataSource={dataSource}
        />
      </Section>

      <Section
        title="核心指标"
        eyebrow="总览"
        description="阅读时长、活跃天数、读完册数与笔记划线数量，一眼掌握阶段状态。"
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardData.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
        <SectionMoreLink href="/stats">查看完整统计与周期切换 →</SectionMoreLink>
      </Section>

      <Section
        title="趋势与分类"
        eyebrow="结构"
        description="用粗边框图表呈现近期阅读节奏与偏好分类占比，并保留文字解读。"
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <ChartCardHeading title="阅读趋势" description="按日分桶展示本月阅读时长。" />
            <div className="mt-6">
              <TrendChart data={dashboardData.readingTrend} />
            </div>
          </Card>
          <Card>
            <ChartCardHeading
              title="分类占比"
              description="来自微信读书偏好分类的相对权重。"
            />
            <div className="mt-6">
              <DistributionChart data={dashboardData.categoryDistribution} />
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="正在读的书"
        eyebrow="书架"
        description="在读与最近读完的书留在首页，方便继续阅读或复盘。"
      >
        {previewBooks.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {previewBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <Card>
            <p className="type-empty">暂无在读书籍。同步微信读书后，这里会展示最近阅读。</p>
          </Card>
        )}
        <SectionMoreLink href="/bookshelf">查看全部 {bookshelfTotal} 册藏书 →</SectionMoreLink>
      </Section>

      <Section
        title="近期划线"
        eyebrow="产出"
        description="阅读分析不仅看投入，也看哪些句子与想法真正留了下来。"
      >
        <HighlightList items={previewHighlights} />
        {dashboardData.recentHighlights.length > HOME_HIGHLIGHT_PREVIEW ? (
          <SectionMoreLink href="/notes">
            还有 {dashboardData.recentHighlights.length - HOME_HIGHLIGHT_PREVIEW} 条，查看全部笔记 →
          </SectionMoreLink>
        ) : (
          <SectionMoreLink href="/notes">进入笔记页浏览与筛选 →</SectionMoreLink>
        )}
      </Section>

      <Section
        title="值得一读"
        eyebrow="推荐"
        description="同步后展示微信读书「为你推荐」；未同步时显示示例卡片。"
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {dashboardData.recommendations.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
        <SectionMoreLink href="/discover">去发现页搜索与探索 →</SectionMoreLink>
      </Section>
    </>
  );
}
