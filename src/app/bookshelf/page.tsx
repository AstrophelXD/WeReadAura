import { BookCard } from "@/components/layout/BookCard";
import { Section } from "@/components/ui/Section";
import { getBookshelfItems, getDataSourceInfo } from "@/server/services/reading-data";

export default async function BookshelfPage() {
  const [{ items }, dataSource] = await Promise.all([getBookshelfItems(), getDataSourceInfo()]);

  return (
    <Section
      title="我的书架"
      eyebrow="书架"
      description={
        dataSource.mode === "live"
          ? `已同步 ${items.length} 个条目，含电子书与有声专辑。`
          : "当前为演示数据。在设置页同步后，将展示你的微信读书书架。"
      }
    >
      <div className="mb-5 grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
        <input className="neo-input" placeholder="搜索书名、作者或分类" readOnly value="筛选功能即将上线" />
        <input className="neo-input" placeholder="阅读状态" readOnly value="在读 / 已读完 / 想读" />
        <input className="neo-input" placeholder="排序" readOnly value="最近阅读" />
      </div>
      {items.length === 0 ? (
        <p className="font-semibold leading-6">书架为空。请先在设置页完成同步。</p>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {items.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </Section>
  );
}
