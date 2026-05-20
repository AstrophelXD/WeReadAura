import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type NeoProseProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

/**
 * Neo-brutalism markdown body container.
 * See docs/neo-brutalism-markdown-guide.md
 */
export function NeoProse({ className, children, ...props }: NeoProseProps) {
  return (
    <div className={cn("neo-prose", className)} {...props}>
      {children}
    </div>
  );
}
