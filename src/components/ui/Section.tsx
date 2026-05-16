import type { ReactNode } from "react";

type SectionProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: ReactNode;
};

export function Section({ title, eyebrow, description, children }: SectionProps) {
  return (
    <section className="section-shell">
      <div className="container-shell">
        {(eyebrow || description) && (
          <div className="mb-5 space-y-3">
            {eyebrow ? <p className="neo-eyebrow">{eyebrow}</p> : null}
            <div className="max-w-3xl space-y-3">
              <h2 className="section-title">{title}</h2>
              {description ? <p className="section-copy">{description}</p> : null}
            </div>
          </div>
        )}
        {!eyebrow && !description ? <h2 className="section-title mb-5">{title}</h2> : null}
        {children}
      </div>
    </section>
  );
}
