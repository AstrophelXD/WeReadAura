import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

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

const buttonClassName = (secondary: boolean | undefined, className?: string) =>
  cn(
    "neo-button neo-press min-h-12 px-5 text-sm md:text-base max-sm:w-full",
    secondary ? "neo-button--neutral" : "neo-button--primary",
    className,
  );

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={buttonClassName(props.secondary, props.className)}>
        {props.children}
      </Link>
    );
  }

  const { children, type = "button", onClick, disabled, secondary, className } = props;

  return (
    <button
      type={type}
      className={buttonClassName(secondary, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
