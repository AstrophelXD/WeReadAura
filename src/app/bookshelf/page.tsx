import { BookCard } from "@/components/layout/BookCard";
import { Section } from "@/components/ui/Section";
import { books } from "@/lib/mock-data";

export default function BookshelfPage() {
  return (
    <Section
      title="Your bookshelf"
      eyebrow="Bookshelf"
      description="A smallest-useful version of the shelf with status, progress, highlights, and quick drilldown into each book."
    >
      <div className="mb-5 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <input className="neo-input" placeholder="Search your shelf" readOnly value="Atomic / Build / History" />
        <input className="neo-input" placeholder="Status" readOnly value="Reading / Finished / Queued" />
        <input className="neo-input" placeholder="Sort" readOnly value="Last read" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </Section>
  );
}
