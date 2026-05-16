/** Open book in WeRead app (Skill deep link schema). */
export function wereadReadingUrl(bookId: string): string {
  return `weread://reading?bId=${bookId}`;
}
