"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { BookDiscoverDialog } from "@/components/features/discover/BookDiscoverDialog";
import { StoreSearchHitCard } from "@/components/features/discover/StoreSearchHitCard";
import { ListPagination } from "@/components/layout/ListPagination";
import { RecommendationCard } from "@/components/layout/RecommendationCard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { DISCOVER_SEARCH_PAGE_SIZE, paginateSlice } from "@/lib/pagination";
import type { Book, RecommendationItem, StoreSearchHit } from "@/lib/types";

interface DiscoverExplorerProps {
  recommendations: RecommendationItem[];
  hasLiveData: boolean;
  initialBookId?: string;
  initialBookTitle?: string;
  initialBookAuthor?: string;
}

type DetailTarget = {
  bookId: string;
  title: string;
  author: string;
};

export function DiscoverExplorer({
  recommendations,
  hasLiveData,
  initialBookId,
  initialBookTitle,
  initialBookAuthor,
}: DiscoverExplorerProps) {
  const [keyword, setKeyword] = useState("");
  const [hits, setHits] = useState<StoreSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState<DetailTarget | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const openBookDetails = useCallback((bookId: string, title: string, author: string) => {
    setDetailTarget({ bookId, title, author });
    setDetailOpen(true);
  }, []);

  const openFromBook = useCallback((book: Book) => {
    openBookDetails(book.id, book.title, book.author);
  }, [openBookDetails]);

  const openFromRecommendation = useCallback(
    (item: RecommendationItem) => {
      openBookDetails(item.id, item.title, item.author);
    },
    [openBookDetails],
  );

  useEffect(() => {
    if (!initialBookId) {
      return;
    }
    openBookDetails(initialBookId, initialBookTitle ?? "", initialBookAuthor ?? "");
  }, [initialBookAuthor, initialBookId, initialBookTitle, openBookDetails]);

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
    setSearchPage(1);

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

  const { slice: pageHits, page: hitPage, pageCount: hitPageCount } = useMemo(
    () => paginateSlice(hits, searchPage, DISCOVER_SEARCH_PAGE_SIZE),
    [hits, searchPage],
  );

  return (
    <>
      <div className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <h2 className="type-card-title-lg">搜索书城</h2>
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
              <p className="type-book-intro font-biao">
                {hasLiveData
                  ? "搜索书城后点击「查看详情」：未在书架的书可预览热门划线；已在书架的可查看阅读进度。"
                  : "连接并同步微信读书后，可搜索书城并查看详情。未连接时仅在本地演示数据中搜索。"}
              </p>
            ) : null}
            {error ? <p className="type-caption-muted">{error}</p> : null}
            {searched && !loading && hits.length === 0 && !error ? (
              <p className="type-caption-muted">没有找到相关书籍，换个关键词试试。</p>
            ) : null}
            {pageHits.map((hit) => (
              <StoreSearchHitCard key={hit.book.id} hit={hit} onViewDetails={openFromBook} />
            ))}
            {hits.length > 0 ? (
              <p className="type-caption">
                共 {hits.length} 条结果
                {hitPageCount > 1 ? ` · 第 ${hitPage} / ${hitPageCount} 页` : null}
              </p>
            ) : null}
            <ListPagination
              currentPage={hitPage}
              pageCount={hitPageCount}
              onPageChange={setSearchPage}
              className="mt-4"
            />
          </div>
        </Card>
        <Card className="neo-paper">
          <h2 className="type-card-title-lg">提示</h2>
          <ul className="type-book-intro font-biao mt-4 list-disc space-y-3 pl-5">
            <li>「查看详情」拉取书城简介；未加入书架时展示热门划线（约 Top 20）。</li>
            <li>已在书架的书可进入「我的阅读」查看进度与个人划线。</li>
            <li>加入书架需在微信读书 App 内完成；详情页可跳转打开。</li>
          </ul>
        </Card>
      </div>

      <div>
        <p className="neo-eyebrow">推荐</p>
        <h2 className="type-card-title-lg mt-2">为你推荐</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {recommendations.map((item) => (
            <RecommendationCard key={item.id} item={item} onViewDetails={openFromRecommendation} />
          ))}
        </div>
      </div>

      <BookDiscoverDialog
        bookId={detailTarget?.bookId ?? null}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        fallbackTitle={detailTarget?.title}
        fallbackAuthor={detailTarget?.author}
      />
    </>
  );
}
