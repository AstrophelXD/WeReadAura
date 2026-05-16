import { BookCard } from "@/components/layout/BookCard";
import { Section } from "@/components/ui/Section";
import { getBookshelfItems } from "@/server/services/reading-data";

export default async function BookshelfPage() {
  const { items } = await getBookshelfItems();

  return (
    <Section
      title="Your bookshelf"
      eyebrow="Bookshelf"
      description="Shelf entries from WeRead after sync, with status, progress, highlights, and drilldown into each book."
    >
      <div className="mb-5 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <input className="neo-input" placeholder="Search your shelf" readOnly value="Use /api/bookshelf?q= keyword" />
        <input className="neo-input" placeholder="Status" readOnly value="Reading / Finished / Queued" />
        <input className="neo-input" placeholder="Sort" readOnly value="Last read" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {items.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Section>
  );
}
