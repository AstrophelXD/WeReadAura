import type { DistributionPoint } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export function DistributionChart({ data }: { data: DistributionPoint[] }) {
  if (data.length === 0) {
    return <p className="type-empty">暂无分类数据，请先同步微信读书统计。</p>;
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.label} className="space-y-2">
          <div className="type-caption flex items-center justify-between">
            <span>{item.label}</span>
            <span>{formatPercent(item.value)}</span>
          </div>
          <div className="h-4 rounded-[999px] border-[2px] border-[var(--ink)] bg-[var(--muted)]">
            <div
              className="h-full rounded-[999px] bg-[var(--ink)]"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
