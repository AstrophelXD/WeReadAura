import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RecommendationItem } from "@/lib/types";

export function RecommendationCard({ item }: { item: RecommendationItem }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="type-card-title-lg">{item.title}</h3>
          <p className="type-card-subtitle mt-1">{item.author}</p>
        </div>
        <Badge tone={item.coverTone}>{item.tag}</Badge>
      </div>
      <p className="type-body mt-5">{item.reason}</p>
      <Button className="mt-6 w-full sm:w-auto" type="button">
        加入想读
      </Button>
    </Card>
  );
}
