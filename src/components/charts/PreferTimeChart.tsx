"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatDurationLabel } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const PREFER_TIME_ORIGIN_HOUR = 6;

function preferTimeHourLabel(slotIndex: number): string {
  const hour = (PREFER_TIME_ORIGIN_HOUR + slotIndex) % 24;
  return `${hour}时`;
}

type PreferTimeChartProps = {
  preferTime: number[];
  caption?: string;
};

export function PreferTimeChart({ preferTime, caption }: PreferTimeChartProps) {
  if (preferTime.length === 0) {
    return <p className="type-empty">暂无阅读时段分布。</p>;
  }

  const chartData = preferTime.map((seconds, index) => ({
    label: preferTimeHourLabel(index),
    minutes: Math.round(seconds / 60),
  }));

  const chartConfig = {
    minutes: { label: "阅读时长", color: "var(--chart-2)" },
  };

  return (
    <div className="space-y-3">
      {caption ? (
        <p className="type-caption text-[color-mix(in_srgb,var(--ink)_70%,transparent)]">{caption}</p>
      ) : null}
      <ChartContainer
        config={chartConfig}
        className="h-[min(240px,42vw)] min-h-[200px] [--chart-bar-fill:var(--color-minutes)] [&_.recharts-cartesian-grid_line]:stroke-[color-mix(in_srgb,var(--ink)_14%,transparent)]"
      >
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 4, bottom: 4 }}>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={2}
            tick={{ fill: "var(--ink)", fontSize: 10 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tick={{ fill: "var(--ink)", fontSize: 10 }}
          />
          <ChartTooltip
            cursor={{ fill: "color-mix(in srgb, var(--pink) 18%, transparent)" }}
            content={
              <ChartTooltipContent
                labelFormatter={(label) => String(label)}
                formatter={(value) => [formatDurationLabel(Number(value) * 60), "阅读时长"]}
              />
            }
          />
          <Bar
            dataKey="minutes"
            fill="var(--color-minutes)"
            radius={4}
            stroke="var(--ink)"
            strokeWidth={2}
          />
        </BarChart>
      </ChartContainer>
      <p className={cn("type-caption", "text-[color-mix(in_srgb,var(--ink)_55%,transparent)]")}>
        横轴从 6:00 起按小时分桶，与微信读书阅读统计口径一致。
      </p>
    </div>
  );
}
