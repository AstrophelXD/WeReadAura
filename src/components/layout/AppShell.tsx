import type { ReactNode } from "react";

import { AppShellChrome } from "@/components/layout/AppShellChrome";
import { isDeepSeekConfigured } from "@/server/adapters/ai/deepseek-client";
import type { DataSourceInfo } from "@/server/services/reading-data";

export function AppShell({
  children,
  dataSource,
}: {
  children: ReactNode;
  dataSource: DataSourceInfo;
}) {
  return (
    <AppShellChrome dataSource={dataSource} aiConfigured={isDeepSeekConfigured()}>
      {children}
    </AppShellChrome>
  );
}
