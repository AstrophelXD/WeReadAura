"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { InsightResponse } from "@/lib/insight-types";
import type { ReadDataMode } from "@/lib/stats-query";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function PeriodSummaryCard({
  period,
  aiConfigured,
}: {
  period: ReadDataMode;
  aiConfigured: boolean;
}) {
  const [data, setData] = useState<InsightResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(`/api/insights?type=period-summary&period=${period}`)
      .then(async (response) => {
        const payload = (await response.json()) as InsightResponse & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "加载失败");
        }
        if (!cancelled) {
          setData(payload);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || "加载失败");
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  if (loading) {
    return (
      <Card className="mb-6 animate-pulse">
        <div className="h-5 w-40 rounded bg-[var(--muted)]" />
        <div className="mt-4 h-4 w-full max-w-xl rounded bg-[var(--muted)]" />
        <div className="mt-2 h-4 w-2/3 rounded bg-[var(--muted)]" />
      </Card>
    );
  }

  if (error || !data) {
    return null;
  }

  const { insight } = data;
  const tone =
    insight.confidence === "high"
      ? "green"
      : insight.confidence === "medium"
        ? "yellow"
        : "white";

  return (
    <Card className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="type-label">{insight.title}</p>
          <h2 className="type-section-title mt-2">{insight.headline}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge tone={tone}>
            {insight.confidence === "high"
              ? "证据较充分"
              : insight.confidence === "medium"
                ? "样本一般"
                : "样本较少"}
          </Badge>
          <Badge tone={data.generatedBy === "ai" && aiConfigured ? "green" : "white"}>
            {data.generatedBy === "ai" && aiConfigured ? "AI 归纳" : "规则摘要"}
          </Badge>
          {data.isDemo ? <Badge tone="yellow">演示数据</Badge> : null}
        </div>
      </div>

      <p className="type-body mt-4 text-[var(--ink)]/85">{insight.summary}</p>

      {insight.keywords.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {insight.keywords.map((word) => (
            <span
              key={word}
              className="type-caption rounded-[var(--radius-sm)] border-[2px] border-[var(--ink)] bg-[var(--white)] px-2.5 py-1"
            >
              {word}
            </span>
          ))}
        </div>
      ) : null}

      <ul className="type-body mt-4 grid gap-2">
        {insight.keyFindings.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="font-biao shrink-0">·</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {insight.notableBooks.length > 0 ? (
        <ul className="type-caption mt-4 grid gap-2 text-[var(--ink)]/80">
          {insight.notableBooks.map((book) => (
            <li key={`${book.title}-${book.reason}`}>
              {book.bookId ? (
                <Link className="underline" href={`/books/${book.bookId}`}>
                  《{book.title}》
                </Link>
              ) : (
                <span>《{book.title}》</span>
              )}
              <span> — {book.reason}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <details className="mt-4">
        <summary className="type-caption cursor-pointer font-biao">依据与说明</summary>
        <ul className="type-caption mt-2 grid gap-1 text-[var(--ink)]/75">
          {insight.evidence.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <p className={cn("type-caption mt-2 text-[var(--ink)]/70")}>{insight.disclaimer}</p>
      </details>

      <p className="type-caption mt-4">
        <Link className="underline" href="/assistant">
          在阅读助手中继续追问本周期
        </Link>
      </p>
    </Card>
  );
}
