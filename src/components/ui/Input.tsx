import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export const formControlClassName = "neo-control";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <input className={cn(formControlClassName, className)} {...props} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn(formControlClassName, className)} {...props} />;
}
