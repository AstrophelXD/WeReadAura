import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { RecommendationItem } from "@/lib/types";

export function RecommendationCard({ item }: { item: RecommendationItem }) {
  return (
    <Card className="h-full">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold tracking-[-0.03em]">{item.title}</h3>
          <p className="mt-1 font-semibold">{item.author}</p>
        </div>
        <Badge tone={item.coverTone}>{item.tag}</Badge>
      </div>
      <p className="mt-5 font-medium leading-6">{item.reason}</p>
      <Button className="mt-6 w-full sm:w-auto" type="button">
        加入想读
      </Button>
    </Card>
  );
}
