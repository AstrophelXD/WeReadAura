import { DistributionChart } from "@/components/charts/DistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { MetricCard } from "@/components/layout/MetricCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { categoryDistribution, dashboardData, readingTrend } from "@/lib/mock-data";

export default function StatsPage() {
  return (
    <Section
      title="Reading statistics"
      eyebrow="Stats"
      description="The MVP stats page focuses on a few strong signals: time, activity, completion, and thematic distribution."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardData.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Last 5 weeks</p>
          <p className="mt-2 text-lg font-semibold">Momentum is trending up after a slower week 3.</p>
          <div className="mt-6">
            <TrendChart data={readingTrend} />
          </div>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Subject balance</p>
          <p className="mt-2 text-lg font-semibold">Current reading is top-heavy toward history and product thinking.</p>
          <div className="mt-6">
            <DistributionChart data={categoryDistribution} />
          </div>
        </Card>
      </div>
    </Section>
  );
}
