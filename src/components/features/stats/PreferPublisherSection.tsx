import { Card } from "@/components/ui/Card";
import type { PreferPublisherEntry } from "@/lib/types";

function PublisherList({ title, description, items }: { title: string; description: string; items: PreferPublisherEntry[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <h4 className="type-card-title">{title}</h4>
      <p className="type-caption mt-1">{description}</p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.name}
            className="type-caption flex items-center justify-between gap-3 border-2 border-[var(--ink)] bg-[var(--white)] px-3 py-2"
          >
            <span className="truncate">{item.name}</span>
            <span className="shrink-0 font-medium">{item.bookCount} 本</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PreferPublisherSection({
  publishers,
  copyright,
}: {
  publishers: PreferPublisherEntry[];
  copyright: PreferPublisherEntry[];
}) {
  if (publishers.length === 0 && copyright.length === 0) {
    return null;
  }

  return (
    <Card className="lg:col-span-2">
      <h3 className="type-card-title-lg">出版与版权</h3>
      <p className="type-caption mt-2">达到展示阈值后由 preferPublisher / preferCp 返回。</p>
      <div className="mt-5 grid gap-6 md:grid-cols-2">
        <PublisherList
          title="偏好出版社"
          description="阅读本数最多的出版社。"
          items={publishers}
        />
        <PublisherList
          title="偏好版权方"
          description="阅读本数最多的版权方。"
          items={copyright}
        />
      </div>
    </Card>
  );
}
