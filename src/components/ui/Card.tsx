import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  /** Subtle lift on hover (dashboard panels) */
  liftOnHover?: boolean;
  /** Press-in on hover (clickable cards) */
  pressOnHover?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
};

export function Card({
  children,
  className,
  liftOnHover,
  pressOnHover,
  onClick,
  "aria-label": ariaLabel,
}: CardProps) {
  const interactive = Boolean(onClick);

  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={cn(
        "neo-card flex flex-col gap-0 p-[clamp(1rem,2vw,1.5rem)]",
        liftOnHover && "neo-card--lift",
        pressOnHover && "neo-card--press",
        interactive && "cursor-pointer",
        className,
      )}
    >
      {children}
    </div>
  );
}
