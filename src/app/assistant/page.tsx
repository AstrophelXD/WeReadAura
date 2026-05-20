import type { Metadata } from "next";

import { AssistantPageView } from "@/components/features/assistant/AssistantPageView";
import { isDeepSeekConfigured } from "@/server/adapters/ai/deepseek-client";
import { getDataSourceInfo } from "@/server/services/reading-data";

export const metadata: Metadata = {
  title: "阅读助手 · WeReadAura",
  description: "基于阅读快照的 AI 解读与问答。",
};

export default async function AssistantPage() {
  const dataSource = await getDataSourceInfo();

  return (
    <AssistantPageView
      dataSource={dataSource}
      aiConfigured={isDeepSeekConfigured()}
    />
  );
}
