import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonBaseProps = {
  children: ReactNode;
  secondary?: boolean;
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
  const className = `neo-btn ${props.secondary ? "neo-btn-secondary" : ""}`;

  if ("href" in props && props.href) {
    return (
      <Link className={className} href={props.href}>
        {props.children}
      </Link>
    );
  }

  const { children, type = "button", onClick, disabled } = props;

  return (
    <button className={className} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
