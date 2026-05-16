import type { TrendPoint } from "@/lib/types";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return <p className="type-empty">暂无趋势数据，请先同步微信读书统计。</p>;
  }

  const max = Math.max(...data.map((item) => item.minutes), 1);

  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}>
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-3">
          <div className="flex h-48 w-full items-end rounded-[0.75rem] border-[3px] border-[var(--ink)] bg-white p-2 shadow-[4px_4px_0_var(--ink)]">
            <div
              className="w-full rounded-[0.4rem] border-[2px] border-[var(--ink)] bg-[var(--ink)]"
              style={{ height: `${Math.max(16, (item.minutes / max) * 100)}%` }}
            />
          </div>
          <div className="type-caption text-center">
            <p>{item.label}</p>
            <p>{item.minutes} 分</p>
          </div>
        </div>
      ))}
    </div>
  );
}
