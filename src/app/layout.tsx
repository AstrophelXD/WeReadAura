import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { AppShell } from "@/components/layout/AppShell";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "WeReadAura",
  description: "Personal reading analytics for WeRead users.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={sourceSerif.variable} lang="zh-CN">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
