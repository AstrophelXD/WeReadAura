import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { getBookshelfItems, getRecommendations } from "@/server/services/reading-data";

export default async function DiscoverPage() {
  const [searchPreview, recommendations] = await Promise.all([
    getBookshelfItems(),
    getRecommendations(),
  ]);

  return (
    <Section
      title="Search and discover"
      eyebrow="Discover"
      description="Store search uses WeRead Skill when connected; recommendations come from your synced profile."
    >
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Search books</p>
          <input
            className="neo-input mt-4"
            readOnly
            value="Call GET /api/discover/search?q=keyword with your API key saved"
          />
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
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">How discovery works</p>
          <p className="mt-4 text-lg font-semibold leading-7">
            Save your API key on Settings, sync once, then search the WeRead store or browse personalized picks.
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
