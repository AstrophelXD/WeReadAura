import { describe, expect, it } from "vitest";

import {
  normalizeRecommendBook,
  parseRecommendBooksResponse,
} from "@/server/services/weread-recommendations";

describe("weread-recommendations", () => {
  it("parses flat recommend books with intro", () => {
    const books = parseRecommendBooksResponse({
      books: [
        {
          bookId: "123",
          title: "三体",
          author: "刘慈欣",
          intro: "科幻长篇。",
          reason: "根据偏好推荐",
        },
      ],
    });
    expect(books).toHaveLength(1);
    expect(books[0]?.intro).toBe("科幻长篇。");
  });

  it("parses nested bookInfo intro", () => {
    const book = normalizeRecommendBook({
      bookInfo: {
        bookId: "456",
        title: "活着",
        author: "余华",
        intro: "讲述普通人命运。",
      },
      newRating: 888,
    });
    expect(book?.bookId).toBe("456");
    expect(book?.intro).toBe("讲述普通人命运。");
    expect(book?.newRating).toBe(888);
  });

  it("reads books from recommend wrapper", () => {
    const books = parseRecommendBooksResponse({
      recommend: {
        books: [{ bookId: "1", title: "A", author: "B", intro: "简介" }],
      },
    });
    expect(books[0]?.intro).toBe("简介");
  });
});
