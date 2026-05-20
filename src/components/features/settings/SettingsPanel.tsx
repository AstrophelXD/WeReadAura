"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DATA_STATUS_BANNER_CHANGE_EVENT,
  readDataStatusBannerVisible,
  writeDataStatusBannerVisible,
} from "@/lib/data-status-banner-preference";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

interface SettingsPanelProps {
  initialMode: string;
  initialSource: string;
  initialLastSyncedAt: string;
  initialHasApiKey: boolean;
  aiConfigured: boolean;
}

function modeLabel(mode: string): string {
  return mode === "live" ? "已同步" : "演示 / 待同步";
}

export function SettingsPanel({
  initialMode,
  initialSource,
  initialLastSyncedAt,
  initialHasApiKey,
  aiConfigured,
}: SettingsPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [source, setSource] = useState(initialSource);
  const [lastSyncedAt, setLastSyncedAt] = useState(initialLastSyncedAt);
  const [hasApiKey, setHasApiKey] = useState(initialHasApiKey);
  const [apiKey, setApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showDataBanner, setShowDataBanner] = useState(true);

  useEffect(() => {
    setShowDataBanner(readDataStatusBannerVisible());

    function onPreferenceChange(event: Event) {
      const detail = (event as CustomEvent<{ visible: boolean }>).detail;
      if (typeof detail?.visible === "boolean") {
        setShowDataBanner(detail.visible);
        return;
      }
      setShowDataBanner(readDataStatusBannerVisible());
    }

    window.addEventListener(DATA_STATUS_BANNER_CHANGE_EVENT, onPreferenceChange);
    return () => window.removeEventListener(DATA_STATUS_BANNER_CHANGE_EVENT, onPreferenceChange);
  }, []);

  function toggleDataBanner() {
    const next = !showDataBanner;
    writeDataStatusBannerVisible(next);
    setShowDataBanner(next);
  }

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
        setMessage(payload.message ?? "保存 API Key 失败。");
        return;
      }
      setHasApiKey(true);
      setMode("mock");
      setSource("微信读书 Skill（尚未同步）");
      setLastSyncedAt("从未同步");
      setApiKey("");
      setMessage(
        payload.maskedKey
          ? `已保存 ${payload.maskedKey}，请点击「立即同步」加载真实数据。`
          : "API Key 已保存。",
      );
    } catch {
      setMessage("保存时网络出错，请稍后重试。");
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
      setSource("演示数据");
      setLastSyncedAt("未连接");
      setMessage("已清除 API Key，页面恢复为演示数据。");
      router.refresh();
    } catch {
      setMessage("清除时网络出错，请稍后重试。");
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
        setMessage(payload.message ?? "同步失败，请检查 API Key 是否有效。");
        return;
      }
      setMode("live");
      setSource("微信读书 Skill");
      setLastSyncedAt(payload.syncedAt ?? "刚刚");
      setMessage(
        payload.bookCount !== undefined
          ? `同步完成：已拉取 ${payload.bookCount} 个书架条目，正在跳转总览…`
          : "同步完成，正在跳转总览…",
      );
      router.refresh();
      router.push("/");
    } catch {
      setMessage("同步时网络出错，请稍后重试。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-3">
      <Card className="lg:col-span-3">
        <p className="type-label">界面</p>
        <p className="type-body mt-3">
          顶部绿色/黄色连接状态横幅（已连接、上次同步等）。隐藏后仍可在本页重新打开。
        </p>
        <div className="mt-5">
          <Button type="button" secondary onClick={toggleDataBanner}>
            {showDataBanner ? "隐藏连接状态横幅" : "显示连接状态横幅"}
          </Button>
        </div>
      </Card>

      <Card>
        <p className="type-label">数据源</p>
        <p className="type-metric-sm mt-3">{source}</p>
        <p className="type-body mt-3">
          当前状态：<strong>{modeLabel(mode)}</strong>。请使用微信读书官方 Skill 页面获取 API Key。
        </p>
        <p className="type-caption mt-3">
          <a className="underline" href="https://weread.qq.com/r/weread-skills" target="_blank" rel="noreferrer">
            前往微信读书获取 API Key
          </a>
        </p>
      </Card>

      <Card>
        <p className="type-label">上次同步</p>
        <p className="type-metric-sm mt-3">{lastSyncedAt}</p>
        <p className="type-body mt-3">
          {hasApiKey
            ? "保存密钥后点击同步，将拉取书架、统计、划线与推荐。"
            : "请先保存 API Key，或在 .env.local 中配置 WEREAD_API_KEY。"}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={runSync} disabled={busy || !hasApiKey}>
            立即同步
          </Button>
          {hasApiKey ? (
            <Button type="button" secondary onClick={clearApiKey} disabled={busy}>
              清除密钥
            </Button>
          ) : null}
        </div>
      </Card>

      <Card className="lg:col-span-3">
        <p className="type-label">AI 阅读助手</p>
        <p className="type-body mt-3">
          {aiConfigured
            ? "已配置 DeepSeek（DEEPSEEK_API_KEY），助手与统计页周期摘要可调用模型归纳。"
            : "未配置 DEEPSEEK_API_KEY 时，助手与周期摘要使用确定性规则降级，不访问外部模型。"}
        </p>
        <ul className="type-caption mt-3 grid gap-2 text-[var(--ink)]/75">
          <li>· 仅基于本机同步快照与只读工具回答，不写入微信读书</li>
          <li>· 笔记与划线在服务端截断后发送，不上传完整账号数据</li>
          <li>· 不做人格/性格测试式标签，结论需能对应统计与书目事实</li>
        </ul>
      </Card>

      <Card className="neo-paper lg:col-span-3">
        <p className="type-label">API Key</p>
        <p className="type-body mt-3">
          密钥保存在本机 HTTP-only Cookie，不会写入代码仓库。也可在 <code>.env.local</code> 中设置{" "}
          <code>WEREAD_API_KEY</code>。
        </p>
        <label className="mt-4 block">
          <span className="sr-only">微信读书 API Key</span>
          <Input
            className="mt-2 w-full"
            type="password"
            autoComplete="off"
            placeholder="wrk-xxxxxxxx"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </label>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button type="button" onClick={saveApiKey} disabled={busy || apiKey.trim().length === 0}>
            保存密钥
          </Button>
          <Button href="/" secondary>
            返回总览
          </Button>
        </div>
        {message ? <p className="type-body mt-4">{message}</p> : null}
      </Card>
    </div>
  );
}
