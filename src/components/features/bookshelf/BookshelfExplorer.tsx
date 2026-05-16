"use client";

import { useEffect, useMemo, useState } from "react";

import { BookCard } from "@/components/layout/BookCard";
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

  function commitSearch() {
    replaceParams({ q: searchDraft.trim() || null });
  }

  return (
    <>
      <div className="type-caption mb-3 flex flex-wrap items-center justify-between gap-2">
        <p>
          显示 {filtered.length} / {allBooks.length} 本
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
          onChange={(event) => replaceParams({ sort: event.target.value })}
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
        <div className="grid gap-5 xl:grid-cols-2">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  );
}
