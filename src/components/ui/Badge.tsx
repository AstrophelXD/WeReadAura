import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type BadgeTone = "yellow" | "green" | "blue" | "pink" | "white";

type BadgeProps = {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  interactive?: boolean;
};

const toneClasses: Record<BadgeTone, string> = {
  yellow: "bg-[color-mix(in_srgb,var(--yellow)_40%,var(--white))]",
  green: "bg-[color-mix(in_srgb,var(--green)_32%,var(--white))]",
  blue: "bg-[color-mix(in_srgb,var(--blue)_32%,var(--white))]",
  pink: "bg-[color-mix(in_srgb,var(--pink)_32%,var(--white))]",
  white: "bg-[var(--white)]",
};

export function Badge({ children, tone = "white", className, interactive = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "neo-badge text-[var(--ink)]",
        toneClasses[tone],
        interactive && "neo-badge--interactive",
        className,
      )}
    >
      {children}
    </span>
  );
}
