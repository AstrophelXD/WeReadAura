import { Suspense } from "react";

import { NotesExplorer } from "@/components/features/notes/NotesExplorer";
import { ListFiltersFallback } from "@/components/feedback/ListFiltersFallback";
import { Section } from "@/components/ui/Section";
import { parseNotesQuery } from "@/lib/notes-query";
import { getDataSourceInfo, getNotesPageData } from "@/server/services/reading-data";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const query = parseNotesQuery({
    q: typeof raw.q === "string" ? raw.q : undefined,
    bookId: typeof raw.bookId === "string" ? raw.bookId : undefined,
    range: typeof raw.range === "string" ? raw.range : undefined,
  });

  const [pageData, dataSource] = await Promise.all([getNotesPageData(query), getDataSourceInfo()]);

  return (
    <Section
      title="划线与笔记"
      eyebrow="笔记"
      description={
        dataSource.mode === "live"
          ? `已同步 ${pageData.totalAll} 条划线与想法，支持搜索与按书筛选。`
          : "当前为演示内容。同步后将展示你笔记本中的划线与想法。"
      }
    >
      <Suspense fallback={<ListFiltersFallback />}>
        <NotesExplorer allItems={pageData.all} initialQuery={query} />
      </Suspense>
    </Section>
  );
}
