import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "yellow" | "green" | "blue" | "pink" | "white";
};

export function Badge({ children, tone = "white" }: BadgeProps) {
  return <span className={`neo-badge neo-${tone}`}>{children}</span>;
}
