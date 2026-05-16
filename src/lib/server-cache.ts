import { unstable_noStore as noStore } from "next/cache";

/** Opt out of Next.js data cache so sync results show on the next render. */
export function markReadingDataVolatile(): void {
  noStore();
}
