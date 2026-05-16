import { HighlightList } from "@/components/layout/HighlightList";
import { Section } from "@/components/ui/Section";
import { getNotesItems } from "@/server/services/reading-data";

export default async function NotesPage() {
  const { items } = await getNotesItems();

  return (
    <Section
      title="Highlights and notes"
      eyebrow="Notes"
      description="Highlights and thoughts synced from WeRead notebooks and per-book exports."
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <input className="neo-input" placeholder="Search notes" readOnly value="Use /api/notes?q= keyword" />
        <input className="neo-input" placeholder="Book filter" readOnly value="All books" />
        <input className="neo-input" placeholder="Date range" readOnly value="Last 30 days" />
      </div>
      <HighlightList items={items} />
    </Section>
  );
}
