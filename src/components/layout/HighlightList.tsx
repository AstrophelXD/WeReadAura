import { Card } from "@/components/ui/Card";
import type { HighlightItem } from "@/lib/types";

export function HighlightList({ items }: { items: HighlightItem[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="type-empty">暂无划线或笔记。同步微信读书数据后，这里会展示最近内容。</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <p className="type-label">{item.bookTitle}</p>
          <p className="type-body-lg mt-4">「{item.quote}」</p>
          {item.note ? <p className="type-caption mt-4">想法：{item.note}</p> : null}
          <p className="type-caption mt-4 font-heading">
            {item.chapter} · {item.createdAt}
          </p>
        </Card>
      ))}
    </div>
  );
}
