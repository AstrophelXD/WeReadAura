import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getBookshelfItems, getDataSourceInfo, getRecommendations } from "@/server/services/reading-data";

export default async function DiscoverPage() {
  const [searchPreview, recommendations, dataSource] = await Promise.all([
    getBookshelfItems(),
    getRecommendations(),
    getDataSourceInfo(),
  ]);

  return (
    <Section
      title="搜索与发现"
      eyebrow="发现"
      description={
        dataSource.mode === "live"
          ? "推荐来自微信读书「为你推荐」；书城搜索接口已就绪。"
          : "同步后可搜索书城并查看个性化推荐；当前展示演示内容。"
      }
    >
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">搜索书籍</p>
          <input className="neo-input mt-4" readOnly value="书城搜索 UI 即将上线（API：/api/discover/search?q=关键词）" />
          <div className="mt-5 grid gap-4">
            {searchPreview.items.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-white p-4"
              >
                <p className="text-xl font-bold tracking-[-0.03em]">{book.title}</p>
                <p className="mt-1 font-semibold">{book.author}</p>
                <p className="mt-2 text-sm font-medium">{book.category}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="neo-paper">
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">如何使用</p>
          <p className="mt-4 text-lg font-semibold leading-7">
            在设置页保存 API Key 并同步后，即可拉取真实推荐；顶栏黄/绿条会显示当前是演示还是已连接数据。
          </p>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {recommendations.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  );
}
