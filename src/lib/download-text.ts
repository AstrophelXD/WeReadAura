/** Trigger a browser download for plain text (e.g. Markdown export). */
export function downloadTextFile(filename: string, content: string, mimeType = "text/markdown;charset=utf-8"): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function sanitizeFilenameSegment(name: string, maxLength = 80): string {
  const cleaned = name.replace(/[<>:"/\\|?*\n\r]/g, "_").trim();
  if (!cleaned) {
    return "export";
  }
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}
