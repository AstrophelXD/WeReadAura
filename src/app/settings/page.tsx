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
        <Card className="neo-green">
          <p className="text-sm font-black uppercase tracking-[0.08em]">Gateway</p>
          <p className="mt-3 text-2xl font-black">{dashboardData.syncStatus.source}</p>
          <p className="mt-3 font-medium leading-6">
            This version is powered by mock data so we can shape the UI before plugging in a real WeRead gateway.
          </p>
        </Card>
        <Card>
          <p className="text-sm font-black uppercase tracking-[0.08em]">Last sync</p>
          <p className="mt-3 text-2xl font-black">{dashboardData.syncStatus.lastSyncedAt}</p>
          <p className="mt-3 font-medium leading-6">
            Later this page will expose manual sync, connection health, and credential management.
          </p>
        </Card>
        <Card className="neo-yellow">
          <p className="text-sm font-black uppercase tracking-[0.08em]">Next step</p>
          <p className="mt-3 text-2xl font-black">Wire the real adapter</p>
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
