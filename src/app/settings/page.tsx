import { SettingsPanel } from "@/components/features/settings/SettingsPanel";
import { Section } from "@/components/ui/Section";
import { getDataSourceInfo } from "@/server/services/reading-data";

export default async function SettingsPage() {
  const info = await getDataSourceInfo();

  return (
    <Section
      title="Settings and sync"
      eyebrow="Settings"
      description="Connect your WeRead account via the official Skill API, then sync shelf, stats, highlights, and recommendations."
    >
      <SettingsPanel
        initialMode={info.mode}
        initialSource={info.source}
        initialLastSyncedAt={info.lastSyncedAt}
        initialHasApiKey={info.hasApiKey}
      />
    </Section>
  );
}
