import { describe, expect, it } from "vitest";

import {
  buildPageRange,
  clampPage,
  getPageCount,
  paginateSlice,
  parsePageParam,
} from "@/lib/pagination";

describe("parsePageParam", () => {
  it("defaults invalid values to 1", () => {
    expect(parsePageParam(null)).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("x")).toBe(1);
  });

  it("parses positive integers", () => {
    expect(parsePageParam("3")).toBe(3);
  });
});

describe("paginateSlice", () => {
  it("returns the correct slice and clamps page", () => {
    const items = [1, 2, 3, 4, 5];
    expect(paginateSlice(items, 2, 2)).toEqual({
      slice: [3, 4],
      page: 2,
      pageCount: 3,
    });
    expect(paginateSlice(items, 99, 2).page).toBe(3);
  });
});

describe("getPageCount", () => {
  it("returns at least one page for empty lists", () => {
    expect(getPageCount(0, 10)).toBe(1);
    expect(getPageCount(25, 10)).toBe(3);
  });
});

describe("clampPage", () => {
  it("keeps page within bounds", () => {
    expect(clampPage(0, 5)).toBe(1);
    expect(clampPage(9, 5)).toBe(5);
  });
});

describe("buildPageRange", () => {
  it("returns all pages when total is small", () => {
    expect(buildPageRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("inserts ellipsis for large totals", () => {
    expect(buildPageRange(5, 10)).toEqual([1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  });
});
