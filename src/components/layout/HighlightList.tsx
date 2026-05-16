import { Card } from "@/components/ui/Card";
import type { HighlightItem } from "@/lib/types";

export function HighlightList({ items }: { items: HighlightItem[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="font-semibold leading-6">暂无划线或笔记。同步微信读书数据后，这里会展示最近内容。</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">{item.bookTitle}</p>
          <p className="mt-4 text-lg font-medium leading-7">「{item.quote}」</p>
          {item.note ? <p className="mt-4 text-sm font-medium leading-6">想法：{item.note}</p> : null}
          <p className="mt-4 text-sm font-semibold">
            {item.chapter} · {item.createdAt}
          </p>
        </Card>
      ))}
    </div>
  );
}
