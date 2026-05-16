/** 微信读书书城推荐值（newRating / newRatingDetail） */

export type WeReadRecommendSource = {
  newRating?: number;
  newRatingCount?: number;
  newRatingDetail?: { title?: string } | string;
};

export type WeReadRecommendFields = {
  recommendRating?: number;
  recommendLabel?: string;
  recommendRatingCount?: number;
};

/** API 为千分制（如 925 → 92.5%），与 Skill 文档一致。 */
export function formatWeReadRecommendPercent(newRating?: number): number | undefined {
  if (newRating === undefined) {
    return undefined;
  }
  return Math.round(newRating) / 10;
}

export function parseWeReadRecommend(source: WeReadRecommendSource): WeReadRecommendFields {
  const detail = source.newRatingDetail;
  const recommendLabel =
    typeof detail === "string" ? detail.trim() || undefined : detail?.title?.trim() || undefined;

  return {
    recommendRating: formatWeReadRecommendPercent(source.newRating),
    recommendLabel,
    recommendRatingCount: source.newRatingCount,
  };
}

export function formatWeReadRecommendLine(fields: WeReadRecommendFields): string | null {
  const parts: string[] = [];
  if (fields.recommendRating !== undefined) {
    parts.push(`${fields.recommendRating}%`);
  }
  if (fields.recommendLabel) {
    parts.push(fields.recommendLabel);
  }
  if (parts.length === 0) {
    return null;
  }
  return parts.join(" · ");
}
