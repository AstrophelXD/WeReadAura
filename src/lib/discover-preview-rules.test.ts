import { describe, expect, it } from "vitest";

import { shouldFetchPopularForBookPage, shouldShowPopularHighlights } from "@/lib/discover-preview-rules";
import type { Book } from "@/lib/types";

const shelfBook = (minutesRead: number): Book => ({
  id: "b",
  title: "测试",
  author: "作者",
  category: "文学",
  coverTone: "white",
  status: "queued",
  progress: 0,
  minutesRead,
  lastReadAt: "",
  startedAt: "",
  highlights: 0,
  notes: 0,
  summary: "",
});

describe("shouldShowPopularHighlights", () => {
  it("shows for books not on shelf", () => {
    expect(shouldShowPopularHighlights(undefined)).toBe(true);
  });

  it("shows for on-shelf books with no reading time", () => {
    expect(shouldShowPopularHighlights(shelfBook(0))).toBe(true);
  });

  it("hides for on-shelf books with recorded reading time", () => {
    expect(shouldShowPopularHighlights(shelfBook(12))).toBe(false);
  });
});

describe("shouldFetchPopularForBookPage", () => {
  it("fetches when no personal items and no reading time", () => {
    expect(shouldFetchPopularForBookPage(shelfBook(0), 0)).toBe(true);
  });

  it("skips when user already has highlights", () => {
    expect(shouldFetchPopularForBookPage(shelfBook(0), 3)).toBe(false);
  });

  it("skips when reading time is recorded", () => {
    expect(shouldFetchPopularForBookPage(shelfBook(60), 0)).toBe(false);
  });
});
