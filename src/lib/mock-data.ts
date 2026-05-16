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
    title: "掌控习惯",
    author: "詹姆斯·克利尔",
    category: "自我成长",
    coverTone: "yellow",
    status: "reading",
    progress: 68,
    minutesRead: 312,
    lastReadAt: "2026-05-15",
    startedAt: "2026-04-20",
    highlights: 18,
    notes: 7,
    summary: "围绕行为回路、线索设计与微小改变的稳定重读。",
  },
  {
    id: "the-argumentative-chinese",
    title: "论辩中国",
    author: "文集",
    category: "历史",
    coverTone: "green",
    status: "finished",
    progress: 100,
    minutesRead: 441,
    lastReadAt: "2026-05-10",
    startedAt: "2026-03-12",
    finishedAt: "2026-05-10",
    highlights: 34,
    notes: 12,
    summary: "关于思想史与公共记忆的密集随笔，读完仍值得回看。",
  },
  {
    id: "build",
    title: "Build",
    author: "托尼·法德尔",
    category: "产品",
    coverTone: "blue",
    status: "reading",
    progress: 42,
    minutesRead: 208,
    lastReadAt: "2026-05-14",
    startedAt: "2026-05-02",
    highlights: 11,
    notes: 4,
    summary: "把产品与团队经验整理成可执行的操作手册。",
  },
  {
    id: "seeing-like-a-state",
    title: "国家的视角",
    author: "詹姆斯·C·斯科特",
    category: "社会",
    coverTone: "pink",
    status: "queued",
    progress: 0,
    minutesRead: 0,
    lastReadAt: "2026-05-01",
    startedAt: "2026-05-01",
    highlights: 0,
    notes: 0,
    summary: "列入想读：关于可读性、规划与地方知识的经典。",
  },
  {
    id: "deep-work",
    title: "深度工作",
    author: "卡尔·纽波特",
    category: "效率",
    coverTone: "white",
    status: "finished",
    progress: 100,
    minutesRead: 265,
    lastReadAt: "2026-04-26",
    startedAt: "2026-04-01",
    finishedAt: "2026-04-26",
    highlights: 21,
    notes: 9,
    summary: "提醒深度是一种可训练的习惯，而不是一时状态。",
  },
];

export const highlights: HighlightItem[] = [
  {
    id: "h-1",
    bookId: "atomic-habits",
    bookTitle: "掌控习惯",
    quote: "你不会上升到目标的高度，只会跌落到系统的水平。",
    note: "也适合用来设计每周阅读节奏。",
    createdAt: "2026-05-15",
    chapter: "第 1 章",
  },
  {
    id: "h-2",
    bookId: "build",
    bookTitle: "Build",
    quote: "领导者的工作，是在信息不完整时做出决定。",
    createdAt: "2026-05-14",
    chapter: "团队",
  },
  {
    id: "h-3",
    bookId: "the-argumentative-chinese",
    bookTitle: "论辩中国",
    quote: "传统既靠服从延续，也靠争论延续。",
    note: "可与近期关于公共讨论的笔记对照。",
    createdAt: "2026-05-10",
    chapter: "随笔 8",
  },
];

export const recommendations: RecommendationItem[] = [
  {
    id: "r-1",
    title: "信息为什么会增长",
    author: "塞萨尔·伊达尔戈",
    reason: "你最近在划线里常出现系统思维与集体知识。",
    tag: "系统",
    coverTone: "yellow",
  },
  {
    id: "r-2",
    title: "公众的反叛",
    author: "马丁·古里",
    reason: "近期历史与社会类阅读偏向制度与公共辩论。",
    tag: "社会",
    coverTone: "pink",
  },
  {
    id: "r-3",
    title: "水平思考法",
    author: "爱德华·德·波诺",
    reason: "与你在产品策略笔记里的重构习惯相近。",
    tag: "思维",
    coverTone: "blue",
  },
];

export const readingTrend = [
  { label: "一", minutes: 110 },
  { label: "二", minutes: 145 },
  { label: "三", minutes: 90 },
  { label: "四", minutes: 172 },
  { label: "五", minutes: 201 },
];

export const categoryDistribution: DistributionPoint[] = [
  { label: "历史", value: 32 },
  { label: "产品", value: 24 },
  { label: "自我成长", value: 21 },
  { label: "社会", value: 14 },
  { label: "效率", value: 9 },
];

export const dashboardData: DashboardData = {
  heroTitle: "把你的阅读生活，收进一块屏幕。",
  heroBody:
    "从书架到划线，WeReadAura 用清晰、醒目的版面呈现个人阅读全貌。配置 API Key 并同步后，将替换为微信读书真实数据。",
  metrics: [
    { label: "阅读时长", value: "1,226 分钟", hint: "近 90 天（示例）", tone: "yellow" },
    { label: "活跃天数", value: "24", hint: "近 30 天（示例）", tone: "white" },
    { label: "读完书籍", value: "2", hint: "本月（示例）", tone: "white" },
    { label: "笔记划线", value: "84", hint: "全库（示例）", tone: "white" },
  ],
  readingTrend,
  categoryDistribution,
  activeBooks: books.filter((book) => book.status === "reading"),
  finishedBooks: books.filter((book) => book.status === "finished"),
  recentHighlights: highlights,
  recommendations,
  syncStatus: {
    lastSyncedAt: "2026-05-16 09:20",
    source: "演示数据",
  },
};

export function findBook(bookId: string): Book | undefined {
  return books.find((book) => book.id === bookId);
}

export function findHighlightsForBook(bookId: string): HighlightItem[] {
  return highlights.filter((item) => item.bookId === bookId);
}
