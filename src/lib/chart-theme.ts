import type { ChartConfig } from "@/components/ui/chart";

/** Theme palette mapped in src/styles/neobrutalism-theme.css (--chart-1 … --chart-5). */
export const CHART_THEME_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

export const readingTrendChartConfig = {
  minutes: {
    label: "阅读时长",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function chartKeyForIndex(index: number): string {
  return `cat${index}`;
}

export function buildDistributionChartConfig(labels: string[]): ChartConfig {
  const config: ChartConfig = {
    value: {
      label: "占比",
    },
  };

  labels.forEach((label, index) => {
    const key = chartKeyForIndex(index);
    config[key] = {
      label,
      color: CHART_THEME_COLORS[index % CHART_THEME_COLORS.length],
    };
  });

  return config;
}
