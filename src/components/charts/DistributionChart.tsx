"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { buildDistributionChartConfig, chartKeyForIndex } from "@/lib/chart-theme";
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
    <div className="space-y-4">
      <ChartContainer
        config={chartConfig}
        className="mx-auto max-h-[300px] [&_.recharts-pie-label-text]:fill-[var(--ink)]"
      >
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
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
          <Pie data={chartData} dataKey="value" nameKey="key" stroke="var(--ink)" strokeWidth={2} />
          <ChartLegend
            content={<ChartLegendContent nameKey="key" />}
            className="-translate-y-2 flex-wrap gap-2 *:basis-1/2 *:justify-start sm:*:basis-1/3"
          />
        </PieChart>
      </ChartContainer>
      <ul className="space-y-2 border-t-2 border-[var(--ink)] pt-4">
        {data.map((item) => (
          <li key={item.label} className="type-caption flex items-center justify-between gap-3">
            <span className="truncate">{item.label}</span>
            <span className="shrink-0 font-medium">{formatPercent(item.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
