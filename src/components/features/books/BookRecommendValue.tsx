import { cn } from "@/lib/cn";
import { formatWeReadRecommendLine } from "@/lib/weread-recommend";
import type { Book } from "@/lib/types";

type BookRecommendValueProps = {
  book: Pick<Book, "recommendRating" | "recommendLabel" | "recommendRatingCount">;
  /** 是否显示字段名「微信读书推荐值」 */
  showLabel?: boolean;
  /** 右上角紧凑展示（右对齐、略小字号） */
  align?: "start" | "end";
  className?: string;
};

export function BookRecommendValue({
  book,
  showLabel = true,
  align = "start",
  className,
}: BookRecommendValueProps) {
  const line = formatWeReadRecommendLine(book);
  if (!line) {
    return null;
  }

  const isEnd = align === "end";

  return (
    <div className={cn("shrink-0", isEnd && "max-w-[min(100%,14rem)] text-right", className)}>
      {showLabel ? (
        <p className={cn("type-field-label", isEnd && "text-[0.8125rem]")}>微信读书推荐值</p>
      ) : null}
      <p
        className={cn(
          isEnd ? "type-metric-sm mt-1" : showLabel ? "type-card-title mt-2" : "type-caption",
        )}
      >
        {line}
      </p>
      {book.recommendRatingCount ? (
        <p className={cn("type-caption-muted", isEnd ? "mt-0.5" : "mt-1")}>
          {book.recommendRatingCount.toLocaleString("zh-CN")} 人评分
        </p>
      ) : null}
    </div>
  );
}
