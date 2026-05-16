import Link from "next/link";

import type { DataSourceInfo } from "@/server/services/reading-data";

export function DataStatusBanner({ info }: { info: DataSourceInfo }) {
  const isLive = info.mode === "live";

  return (
    <div
      className={`border-b-[3px] border-[var(--ink)] ${isLive ? "bg-[var(--green)]" : "bg-[var(--yellow)]"}`}
    >
      <div className="type-caption container-shell flex flex-col gap-2 md:flex-row md:items-center md:justify-between py-3">
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
        <Link className="type-link" href="/settings">
          {isLive ? "管理连接" : "去设置并同步"}
        </Link>
      </div>
    </div>
  );
}
