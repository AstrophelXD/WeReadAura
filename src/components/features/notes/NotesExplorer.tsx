"use client";

import { useEffect, useMemo, useState } from "react";

import { HighlightList } from "@/components/layout/HighlightList";
import {
  applyNotesQuery,
  buildNoteBookOptions,
  NOTES_RANGE_OPTIONS,
  type NotesQuery,
  type NotesRangeFilter,
} from "@/lib/notes-query";
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

  return (
    <>
      <div className="mb-3 text-sm font-semibold">
        <p>
          显示 {filtered.length} / {allItems.length} 条
          {isPending ? " · 更新中…" : null}
        </p>
      </div>

      <form
        className="mb-5 grid gap-4 md:grid-cols-3"
        onSubmit={(event) => {
          event.preventDefault();
          replaceParams({ q: searchDraft.trim() || null });
        }}
      >
        <div className="flex gap-2 md:col-span-1">
          <input
            className="neo-input"
            placeholder="搜索划线、想法或章节"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
          />
          <button className="neo-btn shrink-0" type="submit">
            搜索
          </button>
        </div>
        <select
          className="neo-input"
          value={query.bookId ?? ""}
          onChange={(event) => replaceParams({ bookId: event.target.value || null })}
        >
          <option value="">全部书籍</option>
          {bookOptions.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>
        <select
          className="neo-input"
          value={query.range ?? "all"}
          onChange={(event) => {
            const value = event.target.value as NotesRangeFilter;
            replaceParams({ range: value === "all" ? null : value });
          }}
        >
          {NOTES_RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </form>

      <HighlightList items={filtered} />
    </>
  );
}
