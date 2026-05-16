import type {
  Book,
  DashboardData,
  DistributionPoint,
  HighlightItem,
  RecommendationItem,
} from "@/lib/types";

export const books: Book[] = [
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Growth",
    coverTone: "yellow",
    status: "reading",
    progress: 68,
    minutesRead: 312,
    lastReadAt: "2026-05-15",
    startedAt: "2026-04-20",
    highlights: 18,
    notes: 7,
    summary: "A steady reread focused on behavior loops, cue design, and tiny wins.",
  },
  {
    id: "the-argumentative-chinese",
    title: "The Argumentative Chinese Reader",
    author: "Editor Collection",
    category: "History",
    coverTone: "green",
    status: "finished",
    progress: 100,
    minutesRead: 441,
    lastReadAt: "2026-05-10",
    startedAt: "2026-03-12",
    finishedAt: "2026-05-10",
    highlights: 34,
    notes: 12,
    summary: "Dense but rewarding essays around intellectual history and civic memory.",
  },
  {
    id: "build",
    title: "Build",
    author: "Tony Fadell",
    category: "Product",
    coverTone: "blue",
    status: "reading",
    progress: 42,
    minutesRead: 208,
    lastReadAt: "2026-05-14",
    startedAt: "2026-05-02",
    highlights: 11,
    notes: 4,
    summary: "Product and team lessons collected into a practical operator handbook.",
  },
  {
    id: "seeing-like-a-state",
    title: "Seeing Like a State",
    author: "James C. Scott",
    category: "Society",
    coverTone: "pink",
    status: "queued",
    progress: 0,
    minutesRead: 0,
    lastReadAt: "2026-05-01",
    startedAt: "2026-05-01",
    highlights: 0,
    notes: 0,
    summary: "Queued for a deeper pass on legibility, planning, and local knowledge.",
  },
  {
    id: "deep-work",
    title: "Deep Work",
    author: "Cal Newport",
    category: "Productivity",
    coverTone: "white",
    status: "finished",
    progress: 100,
    minutesRead: 265,
    lastReadAt: "2026-04-26",
    startedAt: "2026-04-01",
    finishedAt: "2026-04-26",
    highlights: 21,
    notes: 9,
    summary: "A practical reminder that depth is a trainable habit, not a mood.",
  },
];

export const highlights: HighlightItem[] = [
  {
    id: "h-1",
    bookId: "atomic-habits",
    bookTitle: "Atomic Habits",
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    note: "Useful framing for weekly reading cadence too.",
    createdAt: "2026-05-15",
    chapter: "Chapter 1",
  },
  {
    id: "h-2",
    bookId: "build",
    bookTitle: "Build",
    quote: "The job of a leader is to make decisions with imperfect information.",
    createdAt: "2026-05-14",
    chapter: "Teams",
  },
  {
    id: "h-3",
    bookId: "the-argumentative-chinese",
    bookTitle: "The Argumentative Chinese Reader",
    quote: "Tradition survives by argument as much as by obedience.",
    note: "Worth connecting with current note on public discourse.",
    createdAt: "2026-05-10",
    chapter: "Essay 8",
  },
];

export const recommendations: RecommendationItem[] = [
  {
    id: "r-1",
    title: "Why Information Grows",
    author: "Cesar Hidalgo",
    reason: "You recently highlighted systems thinking and collective knowledge.",
    tag: "Systems",
    coverTone: "yellow",
  },
  {
    id: "r-2",
    title: "The Revolt of the Public",
    author: "Martin Gurri",
    reason: "Your recent history and society reading leans toward institutions and public debate.",
    tag: "Society",
    coverTone: "pink",
  },
  {
    id: "r-3",
    title: "Lateral Thinking",
    author: "Edward de Bono",
    reason: "Matches your note-taking pattern around product strategy and reframing.",
    tag: "Thinking",
    coverTone: "blue",
  },
];

export const readingTrend = [
  { label: "W1", minutes: 110 },
  { label: "W2", minutes: 145 },
  { label: "W3", minutes: 90 },
  { label: "W4", minutes: 172 },
  { label: "W5", minutes: 201 },
];

export const categoryDistribution: DistributionPoint[] = [
  { label: "History", value: 32 },
  { label: "Product", value: 24 },
  { label: "Self Growth", value: 21 },
  { label: "Society", value: 14 },
  { label: "Productivity", value: 9 },
];

export const dashboardData: DashboardData = {
  heroTitle: "See your reading life in one place.",
  heroBody:
    "From bookshelf to highlights, this MVP turns WeRead data into a plain, bold reading dashboard you can actually review.",
  metrics: [
    { label: "Reading time", value: "1,226 min", hint: "Last 90 days", tone: "yellow" },
    { label: "Active days", value: "24", hint: "Past 30 days", tone: "green" },
    { label: "Finished books", value: "2", hint: "This month", tone: "blue" },
    { label: "Highlights", value: "84", hint: "Across all books", tone: "pink" },
  ],
  readingTrend,
  categoryDistribution,
  activeBooks: books.filter((book) => book.status === "reading"),
  finishedBooks: books.filter((book) => book.status === "finished"),
  recentHighlights: highlights,
  recommendations,
  syncStatus: {
    lastSyncedAt: "2026-05-16 09:20",
    source: "Mock WeRead Gateway",
  },
};

export function findBook(bookId: string): Book | undefined {
  return books.find((book) => book.id === bookId);
}

export function findHighlightsForBook(bookId: string): HighlightItem[] {
  return highlights.filter((item) => item.bookId === bookId);
}
