"use client";

import { Button } from "@/components/ui/Button";
import { READ_DATA_MODE_OPTIONS, type ReadDataMode } from "@/lib/stats-query";
import { useQueryParams } from "@/lib/use-query-params";

interface StatsPeriodTabsProps {
  current: ReadDataMode;
}

export function StatsPeriodTabs({ current }: StatsPeriodTabsProps) {
  const { replaceParams, isPending } = useQueryParams();

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {READ_DATA_MODE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          secondary={current !== option.value}
          disabled={isPending}
          onClick={() =>
            replaceParams({
              mode: option.value === "monthly" ? null : option.value,
              period: null,
            })
          }
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
