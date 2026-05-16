import { Badge } from "@/components/ui/Badge";
import type { PopularHighlight } from "@/lib/types";

type PopularHighlightsListProps = {
  items: PopularHighlight[];
};

export function PopularHighlightsList({ items }: PopularHighlightsListProps) {
  return (
    <div>
      <p className="type-field-label">热门划线</p>
      <p className="type-caption-muted mt-1">
        你还没有个人划线或想法；以下为微信读书全书热度 Top，共 {items.length} 条
      </p>
      <ul className="mt-4 grid gap-5 md:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[var(--radius-sm)] border-2 border-[var(--ink)] bg-[var(--white)] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="type-caption">{item.chapter}</p>
              <Badge tone="yellow">{item.highlightCount} 人划线</Badge>
            </div>
            <p className="type-quote-preview font-quote mt-3">
              <span aria-hidden>「</span>
              {item.quote}
              <span aria-hidden>」</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
