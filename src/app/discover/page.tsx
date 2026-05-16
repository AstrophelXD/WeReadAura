import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { books, recommendations } from "@/lib/mock-data";

export default function DiscoverPage() {
  return (
    <Section
      title="Search and discover"
      eyebrow="Discover"
      description="This MVP keeps discovery simple: a visible search surface plus a recommendation block driven by recent reading patterns."
    >
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="neo-blue">
          <p className="text-sm font-black uppercase tracking-[0.08em]">Search books</p>
          <input className="neo-input mt-4" readOnly value="Search results are mocked in this first version" />
          <div className="mt-5 grid gap-4">
            {books.slice(0, 3).map((book) => (
              <div
                key={book.id}
                className="rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-white p-4"
              >
                <p className="text-xl font-black tracking-[-0.04em]">{book.title}</p>
                <p className="mt-1 font-semibold">{book.author}</p>
                <p className="mt-2 text-sm font-medium">{book.category}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="neo-yellow">
          <p className="text-sm font-black uppercase tracking-[0.08em]">Why these suggestions</p>
          <p className="mt-4 text-lg font-semibold leading-7">
            Your recent mix leans toward systems, institutions, and practical product thinking.
          </p>
          <p className="mt-4 font-medium leading-6">
            The recommendation surface is shaped to later consume real WeRead recommendations while keeping a readable explanation layer.
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
