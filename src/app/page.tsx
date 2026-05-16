import { DistributionChart } from "@/components/charts/DistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { BookCard } from "@/components/layout/BookCard";
import { HighlightList } from "@/components/layout/HighlightList";
import { MetricCard } from "@/components/layout/MetricCard";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { dashboardData } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <section className="section-shell">
        <div className="container-shell grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="neo-eyebrow">Reading dashboard MVP</p>
            <h1 className="hero-title mt-5 max-w-5xl">{dashboardData.heroTitle}</h1>
            <p className="section-copy mt-6 max-w-2xl">{dashboardData.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/bookshelf">Open bookshelf</Button>
              <Button href="/settings" secondary>
                Sync settings
              </Button>
            </div>
          </div>
          <Card className="neo-yellow p-5 shadow-[var(--shadow-lg)]">
            <div className="rounded-[var(--radius)] border-[3px] border-[var(--ink)] bg-white p-6">
              <p className="text-sm font-black uppercase tracking-[0.08em]">Last sync</p>
              <p className="mt-4 text-5xl font-black tracking-[-0.06em]">
                {dashboardData.syncStatus.lastSyncedAt}
              </p>
              <p className="mt-3 text-lg font-semibold">{dashboardData.syncStatus.source}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--green)] p-4">
                  <p className="text-sm font-black uppercase">Now reading</p>
                  <p className="mt-2 text-2xl font-black">{dashboardData.activeBooks.length}</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--pink)] p-4">
                  <p className="text-sm font-black uppercase">Fresh highlights</p>
                  <p className="mt-2 text-2xl font-black">{dashboardData.recentHighlights.length}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Section
        title="Core metrics"
        eyebrow="Overview"
        description="A fast snapshot of reading time, active days, finished books, and highlight volume."
      >
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardData.metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>
      </Section>

      <Section
        title="Momentum and category mix"
        eyebrow="Patterns"
        description="The MVP uses simple chart cards with strong boundaries and text-first interpretation."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <p className="text-sm font-black uppercase tracking-[0.08em]">Weekly reading trend</p>
            <p className="mt-2 text-lg font-semibold">Reading time climbed again in week 5.</p>
            <div className="mt-6">
              <TrendChart data={dashboardData.readingTrend} />
            </div>
          </Card>
          <Card>
            <p className="text-sm font-black uppercase tracking-[0.08em]">Category distribution</p>
            <p className="mt-2 text-lg font-semibold">History and product books currently dominate the stack.</p>
            <div className="mt-6">
              <DistributionChart data={dashboardData.categoryDistribution} />
            </div>
          </Card>
        </div>
      </Section>

      <Section
        title="Books in motion"
        eyebrow="Bookshelf"
        description="In-progress books and recently finished titles are kept visible on the front page."
      >
        <div className="grid gap-5 xl:grid-cols-2">
          {dashboardData.activeBooks.concat(dashboardData.finishedBooks).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </Section>

      <Section
        title="Recent highlights"
        eyebrow="Output"
        description="Notes and highlights matter because reading analysis is about what stayed with you."
      >
        <HighlightList items={dashboardData.recentHighlights} />
      </Section>

      <Section
        title="What to read next"
        eyebrow="Recommendations"
        description="These are mock recommendation cards for the MVP, shaped to support future WeRead gateway data."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {dashboardData.recommendations.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
