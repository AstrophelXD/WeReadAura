export function formatPercent(value: number): string {
  return `${value}%`;
}

export function statusLabel(status: "reading" | "finished" | "queued"): string {
  if (status === "reading") {
    return "In progress";
  }

  if (status === "finished") {
    return "Finished";
  }

  return "Queued";
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
