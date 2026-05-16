import { DistributionChart } from "@/components/charts/DistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { MetricCard } from "@/components/layout/MetricCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getDataSourceInfo, getStatsPayload } from "@/server/services/reading-data";

export default async function StatsPage() {
  const [{ metrics, readingTrend, categoryDistribution }, dataSource] = await Promise.all([
    getStatsPayload(),
    getDataSourceInfo(),
  ]);

  return (
    <Section
      title="阅读统计"
      eyebrow="统计"
      description={
        dataSource.mode === "live"
          ? "以下数据来自微信读书本月阅读统计。"
          : "当前为演示统计。同步后将展示你的真实阅读时长与偏好分类。"
      }
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">阅读趋势</p>
          <p className="mt-2 text-lg font-semibold">按日展示本月阅读时长分布。</p>
          <div className="mt-6">
            <TrendChart data={readingTrend} />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">分类占比</p>
          <p className="mt-2 text-lg font-semibold">偏好分类在阅读时长中的相对权重。</p>
          <div className="mt-6">
            <DistributionChart data={categoryDistribution} />
          </div>
        </Card>
      </div>
    </Section>
  );
}
