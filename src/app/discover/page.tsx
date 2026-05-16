import { DiscoverExplorer } from "@/components/features/discover/DiscoverExplorer";
import { Section } from "@/components/ui/Section";
import { getDataSourceInfo, getRecommendations } from "@/server/services/reading-data";

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const initialBookId = typeof raw.bookId === "string" ? raw.bookId : undefined;

  const [recommendations, dataSource] = await Promise.all([getRecommendations(), getDataSourceInfo()]);

  const initialFromRec = initialBookId
    ? recommendations.find((item) => item.id === initialBookId)
    : undefined;

  return (
    <Section
      title="搜索与发现"
      eyebrow="发现"
      description={
        dataSource.mode === "live"
          ? "搜索微信读书书城，并查看基于你阅读偏好的推荐。"
          : "同步后可搜索书城并查看个性化推荐；当前展示演示内容。"
      }
    >
      <DiscoverExplorer
        recommendations={recommendations}
        hasLiveData={dataSource.mode === "live"}
        initialBookId={initialBookId}
        initialBookTitle={initialFromRec?.title}
        initialBookAuthor={initialFromRec?.author}
      />
    </Section>
  );
}
