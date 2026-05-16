"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import {
  ChartContainer as NeoChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@neo/components/ui/chart";

export {
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
};

const chartContainerClassName = cn(
  "h-[min(320px,50vw)] min-h-[260px] w-full !aspect-auto",
  "[&_.recharts-cartesian-axis-tick_text]:!fill-[var(--ink)]",
  "[&_.recharts-bar-rectangle]:!fill-[var(--chart-bar-fill,var(--chart-1))]",
  "[&_.recharts-bar-rectangle_path]:!stroke-[var(--ink)]",
  "[&_.recharts-pie-sector]:!stroke-[var(--ink)]",
  "[&_.recharts-pie-sector_path]:!fill-opacity-100",
);

export function ChartContainer({
  className,
  ...props
}: ComponentProps<typeof NeoChartContainer>) {
  return <NeoChartContainer className={cn(chartContainerClassName, className)} {...props} />;
}
