import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Badge as NeoBadge } from "@neo/components/ui/badge";

type BadgeTone = "yellow" | "green" | "blue" | "pink" | "white";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
};

const toneClasses: Record<BadgeTone, string> = {
  yellow: "bg-[color-mix(in_srgb,var(--yellow)_28%,var(--white))]",
  green: "bg-[color-mix(in_srgb,var(--green)_24%,var(--white))]",
  blue: "bg-[color-mix(in_srgb,var(--blue)_24%,var(--white))]",
  pink: "bg-[color-mix(in_srgb,var(--pink)_24%,var(--white))]",
  white: "bg-secondary-background",
};

export function Badge({ children, tone = "white", className }: BadgeProps) {
  return (
    <NeoBadge
      variant="neutral"
      className={cn(
        "rounded-full px-3 py-1 text-xs font-base shadow-shadow",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </NeoBadge>
  );
}
