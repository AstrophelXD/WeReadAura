"use client";

import { Suspense, useEffect, useRef } from "react";

import {
  AssistantChat,
  assistantStatusBadgeLabel,
  assistantStatusBadgeTone,
  assistantStatusCaption,
} from "@/components/features/assistant/AssistantChat";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { DataSourceInfo } from "@/server/services/reading-data";

export function AssistantPanel({
  onClose,
  dataSource,
  aiConfigured,
}: {
  onClose: () => void;
  dataSource: DataSourceInfo;
  aiConfigured: boolean;
}) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
    panelRef.current?.focus();
  }, []);

  return (
    <aside
      id="assistant-panel"
      ref={panelRef}
      tabIndex={-1}
      role="complementary"
      aria-labelledby="assistant-panel-title"
      className="app-shell__assistant flex min-h-0 flex-col bg-[var(--paper)]"
    >
      <header className="shrink-0 bg-[var(--paper)]">
        <div className="flex min-h-[3.5rem] items-center justify-between gap-2 px-3 py-3">
          <div className="min-w-0">
            <h2 id="assistant-panel-title" className="type-nav-brand truncate text-base">
              阅读助手
            </h2>
            <p className="type-caption mt-0.5 truncate text-[var(--ink)]/75">
              {assistantStatusCaption(dataSource)}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Badge tone={assistantStatusBadgeTone(dataSource)}>
              {assistantStatusBadgeLabel(dataSource, aiConfigured)}
            </Badge>
            <Button type="button" plain onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <AssistantChat variant="sidebar" />
      </Suspense>
    </aside>
  );
}
