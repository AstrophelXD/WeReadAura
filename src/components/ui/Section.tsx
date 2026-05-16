import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type SectionProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  /** 说明文字 class，默认 section-copy */
  descriptionClassName?: string;
  /** 标题与说明不包在 max-w 容器内（如书籍详情简介） */
  looseHeader?: boolean;
  children: ReactNode;
};

export function Section({
  title,
  eyebrow,
  description,
  descriptionClassName,
  looseHeader,
  children,
}: SectionProps) {
  const descriptionClass = cn(descriptionClassName ?? "section-copy");

  return (
    <section className="section-shell">
      <div className="container-shell">
        {(eyebrow || description) && (
          <div className="mb-5 space-y-3">
            {eyebrow ? <p className="neo-eyebrow">{eyebrow}</p> : null}
            {looseHeader ? (
              <>
                <h2 className="section-title">{title}</h2>
                {description ? <p className={cn("mt-3", descriptionClass)}>{description}</p> : null}
              </>
            ) : (
              <div className="max-w-3xl space-y-3">
                <h2 className="section-title">{title}</h2>
                {description ? <p className={descriptionClass}>{description}</p> : null}
              </div>
            )}
          </div>
        )}
        {!eyebrow && !description ? <h2 className="section-title mb-5">{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
