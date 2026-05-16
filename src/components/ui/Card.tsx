import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Subtle lift on hover (dashboard panels) */
  liftOnHover?: boolean;
  /** Press-in on hover (clickable cards) */
  pressOnHover?: boolean;
};

export function Card({ children, className, liftOnHover, pressOnHover }: CardProps) {
  return (
    <div
      className={cn(
        "neo-card flex flex-col gap-0 p-[clamp(1rem,2vw,1.5rem)]",
        liftOnHover && "neo-card--lift",
        pressOnHover && "neo-card--press",
        className,
      )}
    >
      {children}
    </div>
  );
}
