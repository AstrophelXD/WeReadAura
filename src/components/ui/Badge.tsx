import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type BadgeTone = "yellow" | "green" | "blue" | "pink" | "white";

type BadgeProps = {
  children: ReactNode;
  /** Kept for call-site compatibility; badges render as plain text only. */
  tone?: BadgeTone;
  className?: string;
  interactive?: boolean;
};

export function Badge({ children, className }: BadgeProps) {
  return <span className={cn("type-field-label", className)}>{children}</span>;
}
