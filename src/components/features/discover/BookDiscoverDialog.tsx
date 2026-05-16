"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { BookRecommendValue } from "@/components/features/books/BookRecommendValue";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/Dialog";
import { formatDurationLabel } from "@/lib/formatters";
import { shouldShowPopularHighlights } from "@/lib/discover-preview-rules";
import type { BookDiscoverPreview } from "@/lib/types";
import { statusLabel } from "@/lib/utils";
import { wereadReadingUrl } from "@/lib/weread-links";

type BookDiscoverDialogProps = {
  bookId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fallbackTitle?: string;
  fallbackAuthor?: string;
};

export function BookDiscoverDialog({
  bookId,
  open,
  onOpenChange,
  fallbackTitle,
  fallbackAuthor,
}: BookDiscoverDialogProps) {
  const [preview, setPreview] = useState<BookDiscoverPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !bookId) {
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");
    setPreview(null);

    void (async () => {
      try {
        const response = await fetch(`/api/discover/books/${encodeURIComponent(bookId)}`);
        const payload = (await response.json()) as BookDiscoverPreview & { message?: string };
        if (cancelled) {
          return;
        }
        if (!response.ok) {
          setError(payload.message ?? "无法加载书籍详情。");
          return;
        }
        setPreview(payload);
      } catch {
        if (!cancelled) {
          setError("网络错误，请稍后重试。");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookId, open]);

  const title = preview?.book.title ?? fallbackTitle ?? "书籍详情";
  const author = preview?.book.author ?? fallbackAuthor ?? "";
  const wantsPopularHighlights =
    preview &&
    shouldShowPopularHighlights(
      preview.onShelf
        ? {
            ...preview.book,
            minutesRead: preview.shelfProgress?.minutesRead ?? preview.book.minutesRead,
          }
        : undefined,
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(90vh,720px)] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <div className="shrink-0 border-b-2 border-[var(--ink)] bg-[var(--white)] px-6 py-5 pr-14">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="type-card-title-lg text-left">{title}</DialogTitle>
              {author ? (
                <DialogDescription className="type-card-subtitle mt-1 text-left">{author}</DialogDescription>
              ) : null}
              {preview ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone={preview.onShelf ? "green" : "white"}>
                    {preview.onShelf ? "已在书架" : "未加入书架"}
                  </Badge>
                  {preview.book.category ? <Badge tone="white">{preview.book.category}</Badge> : null}
                </div>
              ) : null}
            </div>
            {preview && !loading ? (
              <BookRecommendValue
                align="end"
                book={{
                  recommendRating: preview.detail.rating,
                  recommendLabel: preview.detail.ratingLabel,
                  recommendRatingCount: preview.detail.ratingCount,
                }}
              />
            ) : null}
          </div>
        </div>

        <div className="scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {loading ? <p className="type-body">正在加载书籍信息…</p> : null}
          {error ? <p className="type-body">{error}</p> : null}

          {preview && !loading ? (
            <div className="space-y-6">
              {preview.detail.publisher ? (
                <p className="type-caption">出版社：{preview.detail.publisher}</p>
              ) : null}

              <div>
                <p className="type-field-label">简介</p>
                <p className="type-body mt-2 leading-relaxed">{preview.detail.intro}</p>
              </div>

              {preview.onShelf && preview.shelfProgress ? (
                <div className="rounded-[var(--radius-sm)] border-2 border-[var(--ink)] bg-[var(--muted)] p-4">
                  <p className="type-field-label">我的阅读</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="type-caption">状态</p>
                      <p className="type-card-title mt-1">{statusLabel(preview.shelfProgress.status)}</p>
                    </div>
                    <div>
                      <p className="type-caption">进度</p>
                      <p className="type-card-title mt-1">{preview.shelfProgress.progress}%</p>
                    </div>
                    <div>
                      <p className="type-caption">阅读时长</p>
                      <p className="type-card-title mt-1">
                        {preview.shelfProgress.minutesRead > 0
                          ? formatDurationLabel(preview.shelfProgress.minutesRead * 60)
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="type-caption">划线 / 想法</p>
                      <p className="type-card-title mt-1">
                        {preview.shelfProgress.highlights} / {preview.shelfProgress.notes}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {preview.popularHighlights.length > 0 ? (
                <div>
                  <p className="type-field-label">热门划线</p>
                  <p className="type-caption-muted mt-1">
                    来自微信读书全书热度 Top，共展示 {preview.popularHighlights.length} 条
                  </p>
                  <ul className="mt-4 space-y-4">
                    {preview.popularHighlights.map((item) => (
                      <li
                        key={item.id}
                        className="rounded-[var(--radius-sm)] border-2 border-[var(--ink)] bg-[var(--white)] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="type-caption">{item.chapter}</p>
                          <Badge tone="yellow">{item.highlightCount} 人划线</Badge>
                        </div>
                        <p className="type-quote-preview font-quote mt-3">
                          <span aria-hidden>「</span>
                          {item.quote}
                          <span aria-hidden>」</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {wantsPopularHighlights && preview.popularHighlights.length === 0 ? (
                <p className="type-caption-muted">暂无热门划线数据，可在微信读书 App 中查看。</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-3 border-t-2 border-[var(--ink)] bg-[var(--white)] px-6 py-4">
          {preview?.onShelf ? (
            <Button href={`/books/${preview.book.id}`} className="w-auto">
              我的阅读详情
            </Button>
          ) : null}
          {bookId ? (
            <Button href={wereadReadingUrl(bookId)} secondary className="w-auto">
              <ExternalLink className="size-4" aria-hidden />
              在微信读书中打开
            </Button>
          ) : null}
          {!preview?.onShelf && bookId ? (
            <p className="type-caption-muted w-full">
              加入书架请在微信读书 App 内操作；上方链接可跳转阅读或预览。
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
