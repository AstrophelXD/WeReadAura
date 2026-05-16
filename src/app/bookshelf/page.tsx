import { Suspense } from "react";

import { BookshelfExplorer } from "@/components/features/bookshelf/BookshelfExplorer";
import { ListFiltersFallback } from "@/components/feedback/ListFiltersFallback";
import { Section } from "@/components/ui/Section";
import { parseBookshelfQuery } from "@/lib/bookshelf-query";
import { getBookshelfPageData, getDataSourceInfo } from "@/server/services/reading-data";

export default async function BookshelfPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const query = parseBookshelfQuery({
    q: typeof raw.q === "string" ? raw.q : undefined,
    status: typeof raw.status === "string" ? raw.status : undefined,
    sort: typeof raw.sort === "string" ? raw.sort : undefined,
  });

  const [pageData, dataSource] = await Promise.all([getBookshelfPageData(query), getDataSourceInfo()]);

  return (
    <Section
      title="我的书架"
      eyebrow="书架"
      description={
        dataSource.mode === "live"
          ? `已同步 ${pageData.totalAll} 个条目，支持搜索、筛选与排序。`
          : "当前为演示数据。在设置页同步后，将展示你的微信读书书架。"
      }
    >
      <Suspense fallback={<ListFiltersFallback />}>
        <BookshelfExplorer allBooks={pageData.all} initialQuery={query} />
      </Suspense>
    </Section>
  );
}
