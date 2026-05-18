"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RecommendationItem } from "@/lib/types";

type RecommendationCardProps = {
  item: RecommendationItem;
  onViewDetails?: (item: RecommendationItem) => void;
};

export function RecommendationCard({ item, onViewDetails }: RecommendationCardProps) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="type-card-title-lg">{item.title}</h3>
          <p className="type-card-subtitle mt-1">{item.author}</p>
        </div>
        <Badge tone={item.coverTone}>{item.tag}</Badge>
      </div>
      <p className="type-book-intro font-biao mt-4 line-clamp-4">{item.reason}</p>
      {onViewDetails ? (
        <Button
          plain
          className="mt-4"
          type="button"
          onClick={() => onViewDetails(item)}
        >
          查看详情
        </Button>
      ) : (
        <Button plain className="mt-4" href={`/discover?bookId=${encodeURIComponent(item.id)}`}>
          查看详情
        </Button>
      )}
    </Card>
  );
}
