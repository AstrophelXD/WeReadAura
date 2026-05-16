import { Card } from "@/components/ui/Card";
import type { HighlightItem } from "@/lib/types";

export function HighlightList({ items }: { items: HighlightItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">{item.bookTitle}</p>
          <p className="mt-4 text-lg font-medium leading-7">“{item.quote}”</p>
          {item.note ? <p className="mt-4 text-sm font-medium leading-6">Note: {item.note}</p> : null}
          <p className="mt-4 text-sm font-semibold">
            {item.chapter} · {item.createdAt}
          </p>
        </Card>
      ))}
    </div>
  );
}
