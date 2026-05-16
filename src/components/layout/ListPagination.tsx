"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MouseEvent } from "react";

import { cn } from "@/lib/cn";
import { buildPageRange } from "@/lib/pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/Pagination";

type ListPaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function ListPagination({
  currentPage,
  pageCount,
  onPageChange,
  className,
}: ListPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  const tokens = buildPageRange(currentPage, pageCount);
  const atStart = currentPage <= 1;
  const atEnd = currentPage >= pageCount;

  function goTo(page: number, event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (page < 1 || page > pageCount || page === currentPage) {
      return;
    }
    onPageChange(page);
  }

  return (
    <Pagination className={cn("mt-8", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={atStart}
            className={cn(atStart && "pointer-events-none opacity-50")}
            onClick={(event) => goTo(currentPage - 1, event)}
          >
            <ChevronLeft className="size-4" />
            <span>上一页</span>
          </PaginationPrevious>
        </PaginationItem>

        {tokens.map((token, index) =>
          token === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={token}>
              <PaginationLink
                href="#"
                isActive={token === currentPage}
                onClick={(event) => goTo(token, event)}
              >
                {token}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={atEnd}
            className={cn(atEnd && "pointer-events-none opacity-50")}
            onClick={(event) => goTo(currentPage + 1, event)}
          >
            <span>下一页</span>
            <ChevronRight className="size-4" />
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
