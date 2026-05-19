"use client";

import { useMemo, useState } from "react";

import {
  buildReadingHeatmapGrid,
  heatmapCellFill,
  heatmapLegendLevels,
  type HeatmapCell,
  type HeatmapDateRange,
} from "@/lib/reading-heatmap";
import { formatDurationLabel } from "@/lib/formatters";
import type { TrendPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

type ReadingTrendHeatmapProps = {
  data: TrendPoint[];
  range: HeatmapDateRange;
  readTimes?: Record<string, number>;
};

function cellTitle(cell: HeatmapCell): string {
  if (cell.minutes <= 0) {
    return `${cell.label} · 未阅读`;
  }
  return `${cell.label} · ${formatDurationLabel(cell.minutes * 60)}`;
}

export function ReadingTrendHeatmap({ data, range, readTimes }: ReadingTrendHeatmapProps) {
  const { weeks, maxMinutes, weekdayLabels } = useMemo(
    () => buildReadingHeatmapGrid(data, range, readTimes),
    [data, range, readTimes],
  );
  const legendLevels = useMemo(() => heatmapLegendLevels(), []);
  const [activeCell, setActiveCell] = useState<HeatmapCell | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex justify-center overflow-x-auto pb-1">
        <div className="inline-flex gap-2">
          <div className="grid shrink-0 grid-rows-7 gap-1 pt-0.5" aria-hidden>
            {weekdayLabels.map((label, index) => (
              <span
                key={label}
                className={cn(
                  "type-caption flex h-3 w-3 items-center justify-center text-[10px] leading-none text-[color-mix(in_srgb,var(--ink)_55%,transparent)] sm:h-3.5 sm:w-3.5",
                  index % 2 === 0 ? "opacity-100" : "opacity-0 sm:opacity-100",
                )}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-rows-7 gap-1">
                {week.map((cell, dayIndex) =>
                  cell ? (
                    <button
                      key={cell.dateKey}
                      type="button"
                      className="h-3 w-3 rounded-[2px] transition-[filter] hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--ink)] sm:h-3.5 sm:w-3.5"
                      style={{ background: heatmapCellFill(cell.minutes, maxMinutes) }}
                      title={cellTitle(cell)}
                      aria-label={cellTitle(cell)}
                      onMouseEnter={() => setActiveCell(cell)}
                      onFocus={() => setActiveCell(cell)}
                      onMouseLeave={() => setActiveCell(null)}
                      onBlur={() => setActiveCell(null)}
                    />
                  ) : (
                    <span
                      key={`pad-${weekIndex}-${dayIndex}`}
                      className="h-3 w-3 sm:h-3.5 sm:w-3.5"
                      aria-hidden
                    />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="type-caption min-h-[1.25rem] text-[color-mix(in_srgb,var(--ink)_70%,transparent)]">
          {activeCell ? cellTitle(activeCell) : "悬停格子查看当日阅读时长"}
        </p>
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="type-caption text-[10px] text-[color-mix(in_srgb,var(--ink)_55%,transparent)]">
            少
          </span>
          {legendLevels.map((fill, index) => (
            <span
              key={index}
              className="h-3 w-3 rounded-[2px] sm:h-3.5 sm:w-3.5"
              style={{ background: fill }}
            />
          ))}
          <span className="type-caption text-[10px] text-[color-mix(in_srgb,var(--ink)_55%,transparent)]">
            多
          </span>
        </div>
      </div>
    </div>
  );
}
