import { Card } from "@/components/ui/Card";

export function StatsMedals({ medals }: { medals: string[] }) {
  if (medals.length === 0) {
    return null;
  }

  return (
    <Card>
      <h3 className="type-card-title-lg">勋章</h3>
      <p className="type-caption mt-2">本周期可展示的阅读勋章。</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {medals.map((medal, index) => (
          <li
            key={`${medal}-${index}`}
            className="type-caption rounded-[var(--radius-sm)] border-2 border-[var(--ink)] bg-[var(--green)] px-3 py-1.5 font-medium"
          >
            {medal}
          </li>
        ))}
      </ul>
    </Card>
  );
}
