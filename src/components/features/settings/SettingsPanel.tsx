"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface SettingsPanelProps {
  initialMode: string;
  initialSource: string;
  initialLastSyncedAt: string;
  initialHasApiKey: boolean;
}

export function SettingsPanel({
  initialMode,
  initialSource,
  initialLastSyncedAt,
  initialHasApiKey,
}: SettingsPanelProps) {
  const [mode, setMode] = useState(initialMode);
  const [source, setSource] = useState(initialSource);
  const [lastSyncedAt, setLastSyncedAt] = useState(initialLastSyncedAt);
  const [hasApiKey, setHasApiKey] = useState(initialHasApiKey);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function saveApiKey() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey }),
      });
      const payload = (await response.json()) as { status: string; message?: string; maskedKey?: string };
      if (!response.ok) {
        setMessage(payload.message ?? "Failed to save API key.");
        return;
      }
      setHasApiKey(true);
      setMode("mock");
      setSource("WeRead Skill Gateway (not synced yet)");
      setLastSyncedAt("Never");
      setApiKey("");
      setMessage(payload.maskedKey ? `Saved ${payload.maskedKey}. Run sync to load live data.` : "API key saved.");
    } catch {
      setMessage("Network error while saving API key.");
    } finally {
      setBusy(false);
    }
  }

  async function clearApiKey() {
    setBusy(true);
    setMessage("");
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clear: true }),
      });
      setHasApiKey(false);
      setMode("mock");
      setSource("Mock WeRead Gateway");
      setLastSyncedAt("Not connected");
      setMessage("API key removed. Mock data is active again.");
    } catch {
      setMessage("Network error while clearing API key.");
    } finally {
      setBusy(false);
    }
  }

  async function runSync() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/sync", { method: "POST" });
      const payload = (await response.json()) as {
        status: string;
        message?: string;
        syncedAt?: string;
        bookCount?: number;
      };
      if (!response.ok) {
        setMessage(payload.message ?? "Sync failed.");
        return;
      }
      setMode("live");
      setSource("WeRead Skill Gateway");
      setLastSyncedAt(payload.syncedAt ?? "Just now");
      setMessage(
        payload.bookCount !== undefined
          ? `Synced ${payload.bookCount} shelf entries from WeRead.`
          : "Sync completed.",
      );
    } catch {
      setMessage("Network error while syncing.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.06em]">Gateway</p>
        <p className="mt-3 text-2xl font-bold">{source}</p>
        <p className="mt-3 font-medium leading-6">
          Mode: <strong>{mode}</strong>. Connect your account with a WeRead API key from the official Skill page.
        </p>
        <p className="mt-3 text-sm font-medium">
          <a className="underline" href="https://weread.qq.com/r/weread-skills" target="_blank" rel="noreferrer">
            Get API Key on WeRead
          </a>
        </p>
      </Card>

      <Card>
        <p className="text-sm font-semibold uppercase tracking-[0.06em]">Last sync</p>
        <p className="mt-3 text-2xl font-bold">{lastSyncedAt}</p>
        <p className="mt-3 font-medium leading-6">
          {hasApiKey
            ? "Run sync after saving your key to pull shelf, stats, highlights, and recommendations."
            : "Save an API key first, then sync to replace mock data."}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={runSync} disabled={busy || !hasApiKey}>
            Sync now
          </Button>
          {hasApiKey ? (
            <Button type="button" secondary onClick={clearApiKey} disabled={busy}>
              Clear key
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="neo-paper">
        <p className="text-sm font-semibold uppercase tracking-[0.06em]">API key</p>
        <p className="mt-3 font-medium leading-6">
          Keys stay in an HTTP-only cookie on this device. You can also set <code>WEREAD_API_KEY</code> in{" "}
          <code>.env.local</code>.
        </p>
        <label className="mt-4 block">
          <span className="sr-only">WeRead API key</span>
          <input
            className="neo-input mt-2 w-full"
            type="password"
            autoComplete="off"
            placeholder="wrk-xxxxxxxx"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={saveApiKey} disabled={busy || apiKey.trim().length === 0}>
            Save key
          </Button>
          <Button href="/" secondary>
            Back to dashboard
          </Button>
        </div>
        {message ? <p className="mt-4 font-semibold leading-6">{message}</p> : null}
      </Card>
    </div>
  );
}
