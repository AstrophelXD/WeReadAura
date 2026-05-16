"use client";

import { Button } from "@/components/ui/Button";
import { STATS_PERIOD_OPTIONS, type StatsPeriod } from "@/lib/stats-query";
import { useQueryParams } from "@/lib/use-query-params";

interface StatsPeriodTabsProps {
  current: StatsPeriod;
}

export function StatsPeriodTabs({ current }: StatsPeriodTabsProps) {
  const { replaceParams, isPending } = useQueryParams();

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {STATS_PERIOD_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          secondary={current !== option.value}
          disabled={isPending}
          onClick={() => replaceParams({ period: option.value === "30d" ? null : option.value })}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
