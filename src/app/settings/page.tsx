import { SettingsPanel } from "@/components/features/settings/SettingsPanel";
import { Section } from "@/components/ui/Section";
import { isDeepSeekConfigured } from "@/server/adapters/ai/deepseek-client";
import { getDataSourceInfo } from "@/server/services/reading-data";

export default async function SettingsPage() {
  const info = await getDataSourceInfo();

  return (
    <Section
      title="设置与同步"
      eyebrow="设置"
      description="连接微信读书官方 Skill API，一键同步书架、统计、划线与推荐。"
    >
      <SettingsPanel
        initialMode={info.mode}
        initialSource={info.source}
        initialLastSyncedAt={info.lastSyncedAt}
        initialHasApiKey={info.hasApiKey}
        aiConfigured={isDeepSeekConfigured()}
      />
    </Section>
  );
}
