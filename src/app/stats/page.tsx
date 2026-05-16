import { Suspense } from "react";

import { StatsPeriodTabs } from "@/components/features/stats/StatsPeriodTabs";
import { ChartCardHeading } from "@/components/charts/ChartCardHeading";
import { DistributionChart } from "@/components/charts/DistributionChart";
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
  const period = parseStatsPeriodFromSearchParams(raw);
  const [{ metrics, readingTrend, categoryDistribution, periodLabel }, dataSource] =
    await Promise.all([getStatsPayload(period), getDataSourceInfo()]);

  return (
    <Section
      title="阅读统计"
      eyebrow="统计"
      description={
        dataSource.mode === "live"
          ? `以下数据来自微信读书阅读统计（${periodLabel}）。切换周期将实时拉取。`
          : "当前为演示统计。同步后在设置页连接微信读书，即可查看真实数据。"
      }
    >
      <Suspense fallback={null}>
        <StatsPeriodTabs current={period} />
      </Suspense>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <ChartCardHeading
            title="阅读趋势"
            description={`${periodLabel}每日阅读时长分布。`}
          />
          <div className="mt-6">
            <TrendChart data={readingTrend} />
          </div>
        </Card>
        <Card>
          <ChartCardHeading
            title="分类占比"
            description="偏好分类在阅读时长中的相对权重（周期无数据时展示本月）。"
          />
          <div className="mt-6">
            <DistributionChart data={categoryDistribution} />
          </div>
        </Card>
      </div>
    </Section>
  );
}
