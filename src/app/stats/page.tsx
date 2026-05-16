import { DistributionChart } from "@/components/charts/DistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { MetricCard } from "@/components/layout/MetricCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getStatsPayload } from "@/server/services/reading-data";

export default async function StatsPage() {
  const { metrics, readingTrend, categoryDistribution } = await getStatsPayload();

  return (
    <Section
      title="Reading statistics"
      eyebrow="Stats"
      description="Reading time, active days, completion, and category mix from WeRead after sync."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Daily reading trend</p>
          <p className="mt-2 text-lg font-semibold">Recent buckets from your monthly WeRead stats.</p>
          <div className="mt-6">
            <TrendChart data={readingTrend} />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Category distribution</p>
          <p className="mt-2 text-lg font-semibold">Preference weights from WeRead reading data.</p>
          <div className="mt-6">
            <DistributionChart data={categoryDistribution} />
          </div>
        </Card>
      </div>
    </Section>
  );
}
