import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { dashboardData } from "@/lib/mock-data";

export default function SettingsPage() {
  return (
    <Section
      title="Settings and sync"
      eyebrow="Settings"
      description="For the MVP, settings stay intentionally small: sync visibility, gateway source, and the next action."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Gateway</p>
          <p className="mt-3 text-2xl font-bold">{dashboardData.syncStatus.source}</p>
          <p className="mt-3 font-medium leading-6">
            This version is powered by mock data so we can shape the UI before plugging in a real WeRead gateway.
          </p>
        </Card>
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Last sync</p>
          <p className="mt-3 text-2xl font-bold">{dashboardData.syncStatus.lastSyncedAt}</p>
          <p className="mt-3 font-medium leading-6">
            Later this page will expose manual sync, connection health, and credential management.
          </p>
        </Card>
        <Card className="neo-paper">
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">Next step</p>
          <p className="mt-3 text-2xl font-bold">Wire the real adapter</p>
          <p className="mt-3 font-medium leading-6">
            The page structure is ready for replacing mock payloads with standardized WeRead responses.
          </p>
          <div className="mt-5">
            <Button href="/">Back to dashboard</Button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
