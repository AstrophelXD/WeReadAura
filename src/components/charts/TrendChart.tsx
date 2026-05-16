import type { TrendPoint } from "@/lib/types";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const max = Math.max(...data.map((item) => item.minutes), 1);

  return (
    <div className="grid grid-cols-5 gap-3">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-3">
          <div className="flex h-48 w-full items-end rounded-[0.75rem] border-[3px] border-[var(--ink)] bg-white p-2 shadow-[4px_4px_0_var(--ink)]">
            <div
              className="w-full rounded-[0.4rem] border-[2px] border-[var(--ink)] bg-[var(--blue)]"
              style={{ height: `${Math.max(16, (item.minutes / max) * 100)}%` }}
            />
          </div>
          <div className="text-center text-sm font-black">
            <p>{item.label}</p>
            <p>{item.minutes}m</p>
          </div>
        </div>
      ))}
    </div>
  );
}
