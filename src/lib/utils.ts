export { cn } from "@/lib/cn";

export function formatPercent(value: number): string {
  return `${value}%`;
}

export function statusLabel(status: "reading" | "finished" | "queued"): string {
  if (status === "reading") {
    return "在读";
  }

  if (status === "finished") {
    return "已读完";
  }

  return "想读";
}

export function toneClass(
  tone: "yellow" | "green" | "blue" | "pink" | "white" | undefined,
): string {
  switch (tone) {
    case "yellow":
      return "bg-[var(--yellow)]";
    case "green":
      return "bg-[var(--green)]";
    case "blue":
      return "bg-[var(--blue)]";
    case "pink":
      return "bg-[var(--pink)]";
    default:
      return "bg-white";
  }
}
