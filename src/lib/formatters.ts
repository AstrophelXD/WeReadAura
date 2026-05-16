const COVER_TONES = ["yellow", "green", "blue", "pink", "white"] as const;

export type CoverTone = (typeof COVER_TONES)[number];

export function pickCoverTone(seed: string): CoverTone {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash + seed.charCodeAt(index) * (index + 1)) % COVER_TONES.length;
  }
  return COVER_TONES[hash] ?? "white";
}

export function formatUnixDate(timestamp?: number): string {
  if (!timestamp) {
    return "";
  }
  return new Date(timestamp * 1000).toISOString().slice(0, 10);
}

export function formatDurationMinutes(seconds?: number): number {
  if (!seconds || seconds <= 0) {
    return 0;
  }
  return Math.round(seconds / 60);
}

export function formatDurationLabel(seconds?: number): string {
  if (!seconds || seconds <= 0) {
    return "0 分钟";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours === 0) {
    return `${minutes} 分钟`;
  }
  if (minutes === 0) {
    return `${hours} 小时`;
  }
  return `${hours} 小时 ${minutes} 分钟`;
}

export function formatPercentChange(value?: number): string {
  if (value === undefined || Number.isNaN(value)) {
    return "暂无环比";
  }
  const percent = Math.round(value * 100);
  if (percent === 0) {
    return "与上期持平";
  }
  return percent > 0 ? `较上期 +${percent}%` : `较上期 ${percent}%`;
}
