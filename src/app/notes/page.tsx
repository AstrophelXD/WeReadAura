import { HighlightList } from "@/components/layout/HighlightList";
import { Section } from "@/components/ui/Section";
import { getDataSourceInfo, getNotesItems } from "@/server/services/reading-data";

export default async function NotesPage() {
  const [{ items }, dataSource] = await Promise.all([getNotesItems(), getDataSourceInfo()]);

  return (
    <Section
      title="划线与笔记"
      eyebrow="笔记"
      description={
        dataSource.mode === "live"
          ? `已同步 ${items.length} 条近期划线与想法。`
          : "当前为演示内容。同步后将展示你笔记本中的划线与想法。"
      }
    >
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <input className="neo-input" placeholder="搜索划线或想法" readOnly value="搜索功能即将上线" />
        <input className="neo-input" placeholder="按书籍筛选" readOnly value="全部书籍" />
        <input className="neo-input" placeholder="时间范围" readOnly value="最近 30 天" />
      </div>
      <HighlightList items={items} />
    </Section>
  );
}
