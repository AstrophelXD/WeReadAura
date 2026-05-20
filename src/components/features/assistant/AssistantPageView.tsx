"use client";

import { Suspense } from "react";

import {
  AssistantChat,
  assistantStatusBadgeLabel,
  assistantStatusBadgeTone,
  assistantStatusCaption,
} from "@/components/features/assistant/AssistantChat";
import { Badge } from "@/components/ui/Badge";
import type { DataSourceInfo } from "@/server/services/reading-data";

export function AssistantPageView({
  dataSource,
  aiConfigured,
}: {
  dataSource: DataSourceInfo;
  aiConfigured: boolean;
}) {
  return (
    <div className="assistant-page flex min-h-0 flex-1 flex-col">
      <div className="assistant-page__header shrink-0 bg-[var(--paper)]">
        <div className="container-shell flex min-h-[4.5rem] flex-wrap items-center justify-between gap-3 py-4">
          <div className="min-w-0">
            <h1 className="type-nav-brand">阅读助手</h1>
            <p className="type-caption mt-1 text-[var(--ink)]/75">
              {assistantStatusCaption(dataSource)}
            </p>
          </div>
          <Badge tone={assistantStatusBadgeTone(dataSource)}>
            {assistantStatusBadgeLabel(dataSource, aiConfigured)}
          </Badge>
        </div>
      </div>

      <Suspense fallback={null}>
        <AssistantChat variant="page" />
      </Suspense>
    </div>
  );
}
