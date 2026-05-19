import { Card } from "@/components/ui/Card";
import type { PreferAuthorEntry } from "@/lib/types";

export function PreferAuthorList({ authors, authorCount }: { authors: PreferAuthorEntry[]; authorCount?: number }) {
  if (authors.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="type-card-title-lg">偏好作者</h3>
      <p className="type-caption mt-2">
        {authorCount && authorCount > authors.length
          ? `展示前 ${authors.length} 位，共 ${authorCount} 位作者。`
          : "当前周期阅读最多的作者。"}
      </p>
      <ul className="mt-5 space-y-3">
        {authors.map((author) => (
          <li
            key={author.name}
            className="flex items-center justify-between gap-3 border-2 border-[var(--ink)] bg-[var(--white)] px-4 py-3"
          >
            <div className="min-w-0">
              <p className="type-card-title truncate">{author.name}</p>
              <p className="type-caption mt-1">{author.bookCount} 本</p>
            </div>
            {author.readTimeLabel ? (
              <span className="type-caption shrink-0 font-medium">{author.readTimeLabel}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
