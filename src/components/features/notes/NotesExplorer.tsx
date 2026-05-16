"use client";

import { useEffect, useMemo, useState } from "react";

import { HighlightList } from "@/components/layout/HighlightList";
import { ListPagination } from "@/components/layout/ListPagination";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import {
  applyNotesQuery,
  buildNoteBookOptions,
  NOTES_RANGE_OPTIONS,
  type NotesQuery,
  type NotesRangeFilter,
} from "@/lib/notes-query";
import {
  NOTES_PAGE_SIZE,
  pageRangeLabel,
  paginateSlice,
  parsePageParam,
} from "@/lib/pagination";
import type { HighlightItem } from "@/lib/types";
import { useQueryParams } from "@/lib/use-query-params";

interface NotesExplorerProps {
  allItems: HighlightItem[];
  initialQuery: NotesQuery;
}

export function NotesExplorer({ allItems, initialQuery }: NotesExplorerProps) {
  const { searchParams, replaceParams, isPending } = useQueryParams();
  const bookOptions = useMemo(() => buildNoteBookOptions(allItems), [allItems]);

  const query = useMemo<NotesQuery>(() => {
    const range = searchParams.get("range");
    return {
      q: searchParams.get("q") ?? initialQuery.q,
      bookId: searchParams.get("bookId") ?? initialQuery.bookId,
      range: range === "30d" ? "30d" : (initialQuery.range ?? "all"),
    };
  }, [initialQuery.bookId, initialQuery.q, initialQuery.range, searchParams]);

  const [searchDraft, setSearchDraft] = useState(query.q ?? "");

  useEffect(() => {
    setSearchDraft(query.q ?? "");
  }, [query.q]);

  const filtered = useMemo(() => applyNotesQuery(allItems, query), [allItems, query]);

  const requestedPage = parsePageParam(searchParams.get("page"));
  const { slice: pageItems, page, pageCount } = useMemo(
    () => paginateSlice(filtered, requestedPage, NOTES_PAGE_SIZE),
    [filtered, requestedPage],
  );

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
      <div className="type-caption mb-3">
        <p>
          {filtered.length > 0
            ? `显示 ${pageRangeLabel(page, NOTES_PAGE_SIZE, filtered.length)} / ${filtered.length} 条`
            : `显示 0 / ${allItems.length} 条`}
          {filtered.length !== allItems.length ? `（笔记库共 ${allItems.length} 条）` : null}
          {pageCount > 1 ? ` · 第 ${page} / ${pageCount} 页` : null}
          {isPending ? " · 更新中…" : null}
        </p>
      </div>

      <form
        className="mb-5 grid gap-4 md:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          replaceParams({ q: searchDraft.trim() || null, page: null });
        }}
      >
        <div className="flex gap-2 md:col-span-1">
          <Input
            placeholder="搜索划线、想法或章节"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
          <Button className="w-auto shrink-0" type="submit">
            搜索
          </Button>
        </div>
        <Select
          value={query.bookId ?? ""}
          onChange={(event) => replaceParams({ bookId: event.target.value || null, page: null })}
        >
          <option value="">全部书籍</option>
          {bookOptions.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </Select>
        <Select
          value={query.range ?? "all"}
          onChange={(event) => {
            const value = event.target.value as NotesRangeFilter;
            replaceParams({ range: value === "all" ? null : value, page: null });
          }}
        >
          {NOTES_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </form>

      <HighlightList items={pageItems} />
      <ListPagination currentPage={page} pageCount={pageCount} onPageChange={goToPage} />
    </>
  );
}
