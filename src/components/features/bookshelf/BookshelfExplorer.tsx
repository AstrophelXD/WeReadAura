"use client";

import { useEffect, useMemo, useState } from "react";

import { BookCard } from "@/components/layout/BookCard";
import { ListPagination } from "@/components/layout/ListPagination";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  applyBookshelfQuery,
  BOOKSHELF_SORT_OPTIONS,
  BOOKSHELF_STATUS_OPTIONS,
  type BookshelfQuery,
  type BookshelfSort,
  type BookshelfStatusFilter,
} from "@/lib/bookshelf-query";
import {
  BOOKSHELF_PAGE_SIZE,
  pageRangeLabel,
  paginateSlice,
  parsePageParam,
} from "@/lib/pagination";
import type { Book } from "@/lib/types";
import { useQueryParams } from "@/lib/use-query-params";

interface BookshelfExplorerProps {
  allBooks: Book[];
  initialQuery: BookshelfQuery;
}

export function BookshelfExplorer({ allBooks, initialQuery }: BookshelfExplorerProps) {
  const { searchParams, replaceParams, isPending } = useQueryParams();

  const query = useMemo<BookshelfQuery>(() => {
    const status = searchParams.get("status") as BookshelfStatusFilter | null;
    const sort = searchParams.get("sort") as BookshelfSort | null;
    return {
      q: searchParams.get("q") ?? initialQuery.q,
      status:
        status === "reading" || status === "finished" || status === "queued"
          ? status
          : (initialQuery.status ?? "all"),
      sort:
        sort === "title" || sort === "progress" || sort === "minutes" || sort === "lastRead"
          ? sort
          : (initialQuery.sort ?? "lastRead"),
    };
  }, [initialQuery.q, initialQuery.sort, initialQuery.status, searchParams]);

  const [searchDraft, setSearchDraft] = useState(query.q ?? "");

  useEffect(() => {
    setSearchDraft(query.q ?? "");
  }, [query.q]);

  const filtered = useMemo(() => applyBookshelfQuery(allBooks, query), [allBooks, query]);

  const requestedPage = parsePageParam(searchParams.get("page"));
  const { slice: pageBooks, page, pageCount } = useMemo(
    () => paginateSlice(filtered, requestedPage, BOOKSHELF_PAGE_SIZE),
    [filtered, requestedPage],
  );

  function commitSearch() {
    replaceParams({ q: searchDraft.trim() || null, page: null });
  }

  function goToPage(nextPage: number) {
    replaceParams({ page: nextPage <= 1 ? null : String(nextPage) });
  }

  const pageParam = searchParams.get("page");

  useEffect(() => {
    if (!pageParam) {
      return;
    }
    const requested = parsePageParam(pageParam);
    if (requested <= pageCount) {
      return;
    }
    replaceParams({ page: pageCount <= 1 ? null : String(pageCount) });
  }, [pageCount, pageParam, replaceParams]);

  return (
    <>
      <div className="type-caption mb-3 flex flex-wrap items-center justify-between gap-2">
        <p>
          {filtered.length > 0
            ? `显示 ${pageRangeLabel(page, BOOKSHELF_PAGE_SIZE, filtered.length)} / ${filtered.length} 本`
            : `显示 0 / ${allBooks.length} 本`}
          {filtered.length !== allBooks.length ? `（书架共 ${allBooks.length} 本）` : null}
          {pageCount > 1 ? ` · 第 ${page} / ${pageCount} 页` : null}
          {isPending ? " · 更新中…" : null}
        </p>
      </div>

      <form
        className="mb-5 grid gap-4 md:grid-cols-[2fr_1fr_1fr]"
        onSubmit={(event) => {
          event.preventDefault();
          commitSearch();
        }}
      >
        <div className="flex gap-2">
          <Input
            placeholder="搜索书名、作者或分类"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
          <Button className="w-auto shrink-0" type="submit">
            搜索
          </Button>
        </div>
        <Select
          value={query.status ?? "all"}
          onChange={(event) =>
            replaceParams({
              status: event.target.value === "all" ? null : event.target.value,
              page: null,
            })
          }
        >
          {BOOKSHELF_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Select
          value={query.sort ?? "lastRead"}
          onChange={(event) => replaceParams({ sort: event.target.value, page: null })}
        >
          {BOOKSHELF_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </form>

      {filtered.length === 0 ? (
        <p className="type-empty">没有匹配的书籍，试试调整关键词或筛选条件。</p>
      ) : (
        <>
          <div className="grid gap-5 xl:grid-cols-2">
            {pageBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          <ListPagination currentPage={page} pageCount={pageCount} onPageChange={goToPage} />
        </>
      )}
    </>
  );
}
