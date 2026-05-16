import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import { Input as NeoInput } from "@neo/components/ui/input";

export const formControlClassName =
  "min-h-[52px] w-full rounded-[var(--radius-sm)] border-2 border-border bg-secondary-background px-3 py-2 text-base font-medium text-foreground shadow-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return <NeoInput className={cn(formControlClassName, className)} {...props} />;
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, ...props }: SelectProps) {
  return <select className={cn(formControlClassName, className)} {...props} />;
}
