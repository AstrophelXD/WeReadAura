import { Suspense } from "react";

import { PeriodSummaryCard } from "@/components/features/insights/PeriodSummaryCard";
import { StatsPeriodTabs } from "@/components/features/stats/StatsPeriodTabs";
import { isDeepSeekConfigured } from "@/server/adapters/ai/deepseek-client";
import { StatsHighlights } from "@/components/features/stats/StatsHighlights";
import { StatsInsightMetrics } from "@/components/features/stats/StatsInsightMetrics";
import { ReadStatGrid } from "@/components/features/stats/ReadStatGrid";
import { ReadLongestRanking } from "@/components/features/stats/ReadLongestRanking";
import { PreferAuthorList } from "@/components/features/stats/PreferAuthorList";
import { PreferPublisherSection } from "@/components/features/stats/PreferPublisherSection";
import { ReadingMixBar } from "@/components/features/stats/ReadingMixBar";
import { StatsMedals } from "@/components/features/stats/StatsMedals";
import { ChartCardHeading } from "@/components/charts/ChartCardHeading";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { PreferTimeChart } from "@/components/charts/PreferTimeChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { MetricCard } from "@/components/layout/MetricCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import {
  getDataSourceInfo,
  getStatsPayload,
  parseStatsPeriodFromSearchParams,
} from "@/server/services/reading-data";

export default async function StatsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const mode = parseStatsPeriodFromSearchParams(raw);
  const [payload, dataSource] = await Promise.all([getStatsPayload(mode), getDataSourceInfo()]);
  const {
    metrics,
    readingTrend,
    categoryDistribution,
    modeLabel,
    trendVariant,
    trendDescription,
    heatmapRange,
    heatmapBuckets,
    preferTime,
    preferTimeWord,
    insights,
  } = payload;

  const showPreferTime = Boolean(preferTime && preferTime.length > 0);
  const hasExtras =
    insights.highlights.length > 0 ||
    insights.secondaryMetrics.length > 0 ||
    insights.readStats.length > 0 ||
    insights.readLongest.length > 0 ||
    insights.preferAuthors.length > 0 ||
    insights.preferPublishers.length > 0 ||
    insights.preferCopyright.length > 0 ||
    insights.medals.length > 0 ||
    Boolean(insights.readingMix);

  return (
    <Section
      title="阅读统计"
      eyebrow="统计"
      description={
        dataSource.mode === "live"
          ? `数据来自微信读书 /readdata/detail（${modeLabel}）。含时长、排行、偏好与阅读形态等字段。`
          : "当前为演示统计。同步后在设置页连接微信读书，即可查看真实数据。"
      }
    >
      <Suspense fallback={null}>
        <StatsPeriodTabs current={mode} />
      </Suspense>

      <PeriodSummaryCard period={mode} aiConfigured={isDeepSeekConfigured()} />

      {insights.highlights.length > 0 ? (
        <div className="mb-6">
          <StatsHighlights items={insights.highlights} />
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {insights.secondaryMetrics.length > 0 ? (
        <div className="mt-6">
          <StatsInsightMetrics metrics={insights.secondaryMetrics} />
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <ChartCardHeading title="阅读趋势" description={trendDescription} />
          <div className="mt-6">
            <TrendChart
              data={readingTrend}
              variant={trendVariant}
              heatmapRange={heatmapRange}
              heatmapBuckets={heatmapBuckets}
            />
          </div>
        </Card>
        <Card>
          <ChartCardHeading
            title="分类占比"
            description="preferCategory 相对权重（当前周期无数据时回退本月）。"
          />
          <div className="mt-6">
            <DistributionChart data={categoryDistribution} />
          </div>
        </Card>

        {insights.readingMix ? (
          <ReadingMixBar mix={insights.readingMix} />
        ) : null}

        {showPreferTime ? (
          <Card className={insights.readingMix ? "" : "lg:col-span-2"}>
            <ChartCardHeading
              title="阅读时段"
              description="preferTime：从 6:00 起 24 小时分布。"
            />
            <div className="mt-6">
              <PreferTimeChart preferTime={preferTime!} caption={preferTimeWord} />
            </div>
          </Card>
        ) : null}

        {insights.medals.length > 0 ? <StatsMedals medals={insights.medals} /> : null}
      </div>

      {hasExtras ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          <ReadLongestRanking items={insights.readLongest} />
          <PreferAuthorList authors={insights.preferAuthors} authorCount={insights.authorCount} />
          <ReadStatGrid items={insights.readStats} />
          <PreferPublisherSection
            publishers={insights.preferPublishers}
            copyright={insights.preferCopyright}
          />
        </div>
      ) : null}
    </Section>
  );
}
