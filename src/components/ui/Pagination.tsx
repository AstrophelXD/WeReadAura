import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

const paginationLinkBase =
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] border-2 border-[var(--ink)] bg-[var(--white)] text-[var(--ink)] text-sm font-biao shadow-[var(--box-shadow-x)_var(--box-shadow-y)_0_var(--ink)] transition-[transform,box-shadow] duration-140 ease-out hover:translate-x-[var(--box-shadow-x)] hover:translate-y-[var(--box-shadow-y)] hover:shadow-none focus-visible:outline-3 focus-visible:outline-[var(--ink)] focus-visible:outline-offset-2";

const paginationSizeClass = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3",
  lg: "h-11 px-8",
  icon: "size-10 min-w-10 px-0",
} as const;

function Pagination({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row flex-wrap items-center justify-center gap-2", className)}
      {...props}
    />
  );
}

function PaginationItem({ className, ...props }: ComponentProps<"li">) {
  return <li data-slot="pagination-item" className={cn("", className)} {...props} />;
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: ComponentProps<"a"> & {
  isActive?: boolean;
  size?: keyof typeof paginationSizeClass;
}) {
  return (
    <a
      data-slot="pagination-link"
      aria-current={isActive ? "page" : undefined}
      className={cn(
        paginationLinkBase,
        paginationSizeClass[size],
        isActive && "border-[3px] shadow-none translate-x-[var(--box-shadow-x)] translate-y-[var(--box-shadow-y)]",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      data-slot="pagination-previous"
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 pl-2.5", className)}
      {...props}
    >
      <ChevronLeft className="size-4" />
      <span>Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      data-slot="pagination-next"
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 pr-2.5", className)}
      {...props}
    >
      <span>Next</span>
      <ChevronRight className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      aria-hidden
      className={cn(
        "flex size-10 items-center justify-center text-[var(--ink)]",
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
