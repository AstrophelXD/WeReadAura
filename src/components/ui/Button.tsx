import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonBaseProps = {
  children: ReactNode;
  secondary?: boolean;
  /** 无边框/阴影，用于卡片内「查看详情」等文字型操作 */
  plain?: boolean;
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

const buttonClassName = (
  secondary: boolean | undefined,
  plain: boolean | undefined,
  className?: string,
) =>
  plain
    ? cn(
        "type-link inline-flex min-h-0 w-auto items-center gap-2 border-0 bg-transparent px-0 py-0 shadow-none",
        className,
      )
    : cn(
        "neo-button neo-press min-h-12 px-5 text-sm font-biao md:text-base md:font-base max-sm:w-full",
        secondary ? "neo-button--neutral" : "neo-button--primary",
        className,
      );

export function Button(props: ButtonProps) {
  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        className={buttonClassName(props.secondary, props.plain, props.className)}
      >
        {props.children}
      </Link>
    );
  }

  const { children, type = "button", onClick, disabled, secondary, plain, className } = props;

  return (
    <button
      type={type}
      className={buttonClassName(secondary, plain, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
