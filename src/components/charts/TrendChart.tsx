"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { readingTrendChartConfig } from "@/lib/chart-theme";
import { formatDurationLabel } from "@/lib/formatters";
import type { TrendPoint } from "@/lib/types";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  if (data.length === 0) {
    return <p className="type-empty">暂无趋势数据，请先同步微信读书统计。</p>;
  }

  const chartData = data.map((item) => ({
    label: item.label,
    minutes: item.minutes,
  }));

  return (
    <ChartContainer
      config={readingTrendChartConfig}
      className="[--chart-bar-fill:var(--color-minutes)] [&_.recharts-cartesian-grid_line]:stroke-[color-mix(in_srgb,var(--ink)_14%,transparent)]"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 12, right: 12, left: 4, bottom: 4 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval="preserveStartEnd"
          minTickGap={20}
          tick={{ fill: "var(--ink)", fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={44}
          tick={{ fill: "var(--ink)", fontSize: 11 }}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip
          cursor={{ fill: "color-mix(in srgb, var(--yellow) 22%, transparent)" }}
          content={
            <ChartTooltipContent
              labelFormatter={(label) => String(label)}
              formatter={(value) => [formatDurationLabel(Number(value) * 60), "阅读时长"]}
            />
          }
        />
        <Bar dataKey="minutes" fill="var(--color-minutes)" radius={6} stroke="var(--ink)" strokeWidth={2} />
      </BarChart>
    </ChartContainer>
  );
}
