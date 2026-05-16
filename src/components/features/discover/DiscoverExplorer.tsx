"use client";

import { useState } from "react";

import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { StoreSearchHitCard } from "@/components/features/discover/StoreSearchHitCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { RecommendationItem, StoreSearchHit } from "@/lib/types";

interface DiscoverExplorerProps {
  recommendations: RecommendationItem[];
  hasLiveData: boolean;
}

export function DiscoverExplorer({ recommendations, hasLiveData }: DiscoverExplorerProps) {
  const [keyword, setKeyword] = useState("");
  const [hits, setHits] = useState<StoreSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function runSearch(event?: React.FormEvent) {
    event?.preventDefault();
    const q = keyword.trim();
    if (!q) {
      setHits([]);
      setSearched(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const response = await fetch(`/api/discover/search?q=${encodeURIComponent(q)}`);
      const payload = (await response.json()) as { items?: StoreSearchHit[]; message?: string };
      if (!response.ok) {
        setError(payload.message ?? "搜索失败，请稍后重试。");
        setHits([]);
        return;
      }
      setHits(payload.items ?? []);
    } catch {
      setError("网络错误，请检查连接后重试。");
      setHits([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">搜索书城</p>
          <form className="mt-4 flex flex-wrap gap-3" onSubmit={runSearch}>
            <Input
              className="min-w-[12rem] flex-1"
              placeholder="输入书名或作者，如：三体"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Button className="w-auto" type="submit" disabled={loading}>
              {loading ? "搜索中…" : "搜索"}
            </Button>
          </form>

          <div className="mt-5 space-y-4">
            {!searched ? (
              <p className="font-medium leading-6 text-[color-mix(in_srgb,var(--ink)_75%,transparent)]">
                {hasLiveData
                  ? "在上方输入关键词搜索微信读书书城；结果会标注是否已在你的书架中。"
                  : "连接并同步微信读书后，可搜索书城。未连接时仅在本地演示数据中搜索。"}
              </p>
            ) : null}
            {error ? <p className="font-semibold leading-6">{error}</p> : null}
            {searched && !loading && hits.length === 0 && !error ? (
              <p className="font-semibold leading-6">没有找到相关书籍，换个关键词试试。</p>
            ) : null}
            {hits.map((hit) => (
              <StoreSearchHitCard key={hit.book.id} hit={hit} />
            ))}
          </div>
        </Card>
        <Card className="neo-paper">
          <p className="text-sm font-semibold uppercase tracking-[0.06em]">提示</p>
          <ul className="mt-4 space-y-3 text-base font-medium leading-7">
            <li>已在书架的书可点进详情查看进度与划线。</li>
            <li>推荐区在下方，来自微信读书「为你推荐」。</li>
            <li>搜索依赖 API Key；请确保设置页已配置并同步。</li>
          </ul>
        </Card>
      </div>

      <div>
        <p className="neo-eyebrow mb-4">为你推荐</p>
        <div className="grid gap-5 lg:grid-cols-3">
          {recommendations.map((item) => (
            <RecommendationCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}
