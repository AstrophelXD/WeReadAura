export function StatsHighlights({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="type-caption rounded-[var(--radius-sm)] border-2 border-[var(--ink)] bg-[var(--yellow)] px-3 py-1.5 font-medium"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
