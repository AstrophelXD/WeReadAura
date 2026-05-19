"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  buildDistributionChartConfig,
  CHART_THEME_COLORS,
  chartKeyForIndex,
} from "@/lib/chart-theme";
import type { DistributionPoint } from "@/lib/types";
import { formatPercent } from "@/lib/utils";

export function DistributionChart({ data }: { data: DistributionPoint[] }) {
  if (data.length === 0) {
    return <p className="type-empty">暂无分类数据，请先同步微信读书统计。</p>;
  }

  const chartData = data.map((item, index) => {
    const key = chartKeyForIndex(index);
    return {
      key,
      label: item.label,
      value: item.value,
      fill: `var(--color-${key})`,
    };
  });

  const chartConfig = buildDistributionChartConfig(data.map((item) => item.label));

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
      <ChartContainer
        config={chartConfig}
        className="mx-auto h-[min(200px,42vw)] min-h-[160px] max-h-[220px] w-full max-w-[220px] shrink-0 sm:mx-0 [&_.recharts-pie-label-text]:fill-[var(--ink)]"
      >
        <PieChart margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                nameKey="key"
                formatter={(value, _name, item) => {
                  const label =
                    typeof item.payload === "object" &&
                    item.payload !== null &&
                    "label" in item.payload
                      ? String(item.payload.label)
                      : "";
                  return [`${value}%`, label || "占比"];
                }}
              />
            }
          />
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="key"
            stroke="var(--ink)"
            strokeWidth={2}
            outerRadius="88%"
          />
        </PieChart>
      </ChartContainer>
      <ul className="flex min-w-0 flex-1 flex-col justify-center space-y-2 sm:border-l-2 sm:border-[var(--ink)] sm:pl-6">
        {data.map((item, index) => (
          <li key={item.label} className="type-caption flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-3 shrink-0 border-2 border-[var(--ink)]"
                style={{
                  backgroundColor: CHART_THEME_COLORS[index % CHART_THEME_COLORS.length],
                }}
                aria-hidden
              />
              <span className="truncate">{item.label}</span>
            </span>
            <span className="shrink-0 font-medium">{formatPercent(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
