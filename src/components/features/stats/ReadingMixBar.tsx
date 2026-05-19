import { Card } from "@/components/ui/Card";
import type { ReadingMixInsight } from "@/lib/types";

export function ReadingMixBar({ mix }: { mix: ReadingMixInsight }) {
  return (
    <Card>
      <h3 className="type-card-title-lg">阅读形态</h3>
      <p className="type-caption mt-2">文字阅读与听书/TTS/有声时长占比（readRate）。</p>
      <div className="mt-6 space-y-4">
        <div className="flex h-4 w-full overflow-hidden border-2 border-[var(--ink)]">
          <div
            className="h-full bg-[var(--blue)]"
            style={{ width: `${mix.readRate}%` }}
            title={`文字阅读 ${mix.readRate}%`}
          />
          <div
            className="h-full bg-[var(--pink)]"
            style={{ width: `${100 - mix.readRate}%` }}
            title={`听书/有声 ${100 - mix.readRate}%`}
          />
        </div>
        <div className="flex flex-wrap gap-6">
          <p className="type-caption">
            <span className="mr-2 inline-block h-3 w-3 border border-[var(--ink)] bg-[var(--blue)]" />
            文字阅读 {mix.readRate}% · {mix.readTimeLabel}
          </p>
          <p className="type-caption">
            <span className="mr-2 inline-block h-3 w-3 border border-[var(--ink)] bg-[var(--pink)]" />
            听书/有声 {100 - mix.readRate}% · {mix.listenTimeLabel}
          </p>
        </div>
      </div>
    </Card>
  );
}
