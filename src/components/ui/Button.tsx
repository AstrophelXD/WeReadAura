import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Button as NeoButton } from "@neo/components/ui/button";

type ButtonBaseProps = {
  children: ReactNode;
  secondary?: boolean;
  className?: string;
};

type LinkButtonProps = ButtonBaseProps & {
  href: string;
  type?: never;
  onClick?: never;
  disabled?: never;
};

type ActionButtonProps = ButtonBaseProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "onClick" | "disabled"> & {
    href?: never;
  };

type ButtonProps = LinkButtonProps | ActionButtonProps;

export function Button(props: ButtonProps) {
  const variant = props.secondary ? "neutral" : "default";
  const className = cn("min-h-12 px-5 text-base font-semibold max-sm:w-full", props.className);

  if ("href" in props && props.href) {
    return (
      <NeoButton asChild variant={variant} className={className}>
        <Link href={props.href}>{props.children}</Link>
      </NeoButton>
    );
  }

  const { children, type = "button", onClick, disabled } = props;

  return (
    <NeoButton
      type={type}
      variant={variant}
      className={className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </NeoButton>
  );
}

