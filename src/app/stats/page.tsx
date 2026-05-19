import { Suspense } from "react";

import { StatsPeriodTabs } from "@/components/features/stats/StatsPeriodTabs";
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
  const [
    {
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
    },
    dataSource,
  ] = await Promise.all([getStatsPayload(mode), getDataSourceInfo()]);

  const showPreferTime = Boolean(preferTime && preferTime.length > 0);

  return (
    <Section
      title="阅读统计"
      eyebrow="统计"
      description={
        dataSource.mode === "live"
          ? `以下数据来自微信读书 /readdata/detail（${modeLabel}，自然周期）。切换维度将按接口 mode 拉取。`
          : "当前为演示统计。同步后在设置页连接微信读书，即可查看真实数据。"
      }
    >
      <Suspense fallback={null}>
        <StatsPeriodTabs current={mode} />
      </Suspense>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
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
            description="偏好分类在阅读时长中的相对权重（当前周期无数据时回退本月）。"
          />
          <div className="mt-6">
            <DistributionChart data={categoryDistribution} />
          </div>
        </Card>
        {showPreferTime ? (
          <Card className="lg:col-span-2">
            <ChartCardHeading
              title="阅读时段"
              description="24 小时分布（从 6:00 起算，与微信读书 preferTime 一致）。"
            />
            <div className="mt-6">
              <PreferTimeChart preferTime={preferTime!} caption={preferTimeWord} />
            </div>
          </Card>
        ) : null}
      </div>
    </Section>
  );
}
