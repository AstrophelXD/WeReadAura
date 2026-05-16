import { HighlightList } from "@/components/layout/HighlightList";
import { Section } from "@/components/ui/Section";
import { highlights } from "@/lib/mock-data";

export default function NotesPage() {
  return (
    <Section
      title="Highlights and notes"
      eyebrow="Notes"
      description="A compact note center that keeps book source, quote, note body, and timestamp together."
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <input className="neo-input" placeholder="Search notes" readOnly value="systems / leader / tradition" />
        <input className="neo-input" placeholder="Book filter" readOnly value="All books" />
        <input className="neo-input" placeholder="Date range" readOnly value="Last 30 days" />
      </div>
      <HighlightList items={highlights} />
    </Section>
  );
}
