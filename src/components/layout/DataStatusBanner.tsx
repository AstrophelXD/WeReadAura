"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  DATA_STATUS_BANNER_CHANGE_EVENT,
  readDataStatusBannerVisible,
  writeDataStatusBannerVisible,
} from "@/lib/data-status-banner-preference";
import type { DataSourceInfo } from "@/server/services/reading-data";

export function DataStatusBanner({ info }: { info: DataSourceInfo }) {
  const isLive = info.mode === "live";
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setVisible(readDataStatusBannerVisible());
    setReady(true);

    function onPreferenceChange(event: Event) {
      const detail = (event as CustomEvent<{ visible: boolean }>).detail;
      if (typeof detail?.visible === "boolean") {
        setVisible(detail.visible);
        return;
      }
      setVisible(readDataStatusBannerVisible());
    }

    window.addEventListener(DATA_STATUS_BANNER_CHANGE_EVENT, onPreferenceChange);
    return () => window.removeEventListener(DATA_STATUS_BANNER_CHANGE_EVENT, onPreferenceChange);
  }, []);

  function hideBanner() {
    writeDataStatusBannerVisible(false);
    setVisible(false);
  }

  if (!ready || !visible) {
    return null;
  }

  return (
    <div
      className={`border-b-[3px] border-[var(--ink)] ${isLive ? "bg-[var(--green)]" : "bg-[var(--yellow)]"}`}
    >
      <div className="type-caption container-shell flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between">
        <p>
          {isLive ? (
            <>
              <span className="type-field-label mr-2">已连接</span>
              正在展示微信读书同步数据 · 上次同步 {info.lastSyncedAt}
            </>
          ) : info.hasApiKey ? (
            <>
              <span className="type-field-label mr-2">待同步</span>
              已配置 API Key，请点击同步拉取书架与统计
            </>
          ) : (
            <>
              <span className="type-field-label mr-2">演示模式</span>
              当前为示例数据 · 在设置页绑定微信读书 API Key 后可查看真实阅读数据
            </>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Link className="type-link" href="/settings">
            {isLive ? "管理连接" : "去设置并同步"}
          </Link>
          <button type="button" className="type-link" onClick={hideBanner}>
            隐藏横幅
          </button>
        </div>
      </div>
    </div>
  );
}
