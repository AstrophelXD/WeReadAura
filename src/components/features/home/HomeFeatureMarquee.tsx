import { Marquee } from "@/components/ui/Marquee";

const FEATURE_MARQUEE_ITEMS = [
  "书架总览",
  "阅读统计",
  "划线笔记",
  "发现推荐",
  "Skill 同步",
  "周期趋势",
  "分类占比",
  "书籍详情",
  "书城搜索",
  "数据驾驶舱",
] as const;

export function HomeFeatureMarquee() {
  return <Marquee items={[...FEATURE_MARQUEE_ITEMS]} />;
}
