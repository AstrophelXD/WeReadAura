import type { Book } from "@/lib/types";

/** 未入书架，或已在书架但尚无阅读时长记录时，展示书城热门划线。 */
export function shouldShowPopularHighlights(shelfBook: Book | undefined): boolean {
  if (!shelfBook) {
    return true;
  }

  return shelfBook.minutesRead <= 0;
}

/** 书籍详情页：无个人划线/想法且尚无阅读时长时，补充书城热门划线。 */
export function shouldFetchPopularForBookPage(book: Book, personalItemCount: number): boolean {
  if (personalItemCount > 0) {
    return false;
  }

  return book.minutesRead <= 0;
}
