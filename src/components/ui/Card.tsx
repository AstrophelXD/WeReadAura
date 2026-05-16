import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Card as NeoCard } from "@neo/components/ui/card";

export {
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@neo/components/ui/card";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <NeoCard className={cn("gap-0 p-[clamp(1rem,2vw,1.5rem)] shadow-shadow", className)}>{children}</NeoCard>
  );
}
