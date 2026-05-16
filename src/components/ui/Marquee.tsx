import { cn } from "@/lib/cn";

type MarqueeProps = {
  items: string[];
  className?: string;
};

/**
 * Based on neobrutalism-components-local marquee; animations in src/styles/marquee.css.
 */
export function Marquee({ items, className }: MarqueeProps) {
  if (items.length === 0) {
    return null;
  }

  function renderTrack(prefix: string) {
    return items.map((item) => (
      <span key={`${prefix}-${item}`} className="mx-6 inline-block font-heading text-2xl md:text-3xl">
        {item}
      </span>
    ));
  }

  return (
    <div
      aria-hidden
      className={cn(
        "relative flex w-full overflow-x-hidden border-b-[3px] border-[var(--ink)] bg-[var(--white)] text-[var(--ink)]",
        className,
      )}
    >
      <div className="animate-marquee flex whitespace-nowrap py-8 md:py-10">{renderTrack("a")}</div>
      <div className="animate-marquee2 absolute top-0 flex whitespace-nowrap py-8 md:py-10">
        {renderTrack("b")}
      </div>
    </div>
  );
}
