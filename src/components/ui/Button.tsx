import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  secondary?: boolean;
};

export function Button({ href, children, secondary = false }: ButtonProps) {
  return (
    <Link className={`neo-btn ${secondary ? "neo-btn-secondary" : ""}`} href={href}>
      {children}
    </Link>
  );
}
