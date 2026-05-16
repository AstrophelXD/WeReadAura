import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { getDataSourceInfo } from "@/server/services/reading-data";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "600", "700"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "WeReadAura · 微信读书阅读分析",
  description: "把微信读书书架、统计、划线与推荐汇总成个人阅读驾驶舱。",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const dataSource = await getDataSourceInfo();

  return (
    <html className={sourceSerif.variable} lang="zh-CN">
      <body>
        <AppShell dataSource={dataSource}>{children}</AppShell>
      </body>
    </html>
  );
}
