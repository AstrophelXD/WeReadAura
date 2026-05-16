import { ChartCardHeading } from "@/components/charts/ChartCardHeading";
import { DistributionChart } from "@/components/charts/DistributionChart";
import { TrendChart } from "@/components/charts/TrendChart";
import { BookCard } from "@/components/layout/BookCard";
import { HighlightList } from "@/components/layout/HighlightList";
import { MetricCard } from "@/components/layout/MetricCard";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getDashboardData, getDataSourceInfo } from "@/server/services/reading-data";

export default async function HomePage() {
  const [dashboardData, dataSource] = await Promise.all([getDashboardData(), getDataSourceInfo()]);

  return (
    <>
      <section className="section-shell">
        <div className="container-shell grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="neo-eyebrow">个人阅读驾驶舱</p>
            <h1 className="hero-title mt-5 max-w-5xl">{dashboardData.heroTitle}</h1>
            <p className="section-copy mt-6 max-w-2xl">{dashboardData.heroBody}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/bookshelf">打开书架</Button>
              <Button href="/settings" secondary>
                {dataSource.mode === "live" ? "同步设置" : "连接微信读书"}
              </Button>
            </div>
          </div>
          <Card className="neo-paper p-5 shadow-[var(--shadow-lg)]">
            <div className="rounded-[var(--radius)] border-[3px] border-[var(--ink)] bg-white p-6">
              <p className="type-field-label">上次同步</p>
              <p className="type-metric-lg mt-3">{dashboardData.syncStatus.lastSyncedAt}</p>
              <p className="type-card-subtitle mt-3">{dashboardData.syncStatus.source}</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">在读</p>
                  <p className="type-metric-sm mt-2">{dashboardData.activeBooks.length}</p>
                </div>
                <div className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">近期划线</p>
                  <p className="type-metric-sm mt-2">{dashboardData.recentHighlights.length}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

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
        <div className="grid gap-5 xl:grid-cols-2">
          {dashboardData.activeBooks.concat(dashboardData.finishedBooks).map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </Section>

      <Section
        title="近期划线"
        eyebrow="产出"
        description="阅读分析不仅看投入，也看哪些句子与想法真正留了下来。"
      >
        <HighlightList items={dashboardData.recentHighlights} />
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
      </Section>
    </>
  );
}
