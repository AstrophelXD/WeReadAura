"use client";

import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";
import {
  Dialog as NeoDialog,
  DialogClose,
  DialogContent as NeoDialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@neo/components/ui/dialog";

export {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  NeoDialog as Dialog,
};

type DialogContentProps = ComponentProps<typeof NeoDialogContent>;

export function DialogContent({ className, ...props }: DialogContentProps) {
  return <NeoDialogContent className={cn(className)} {...props} />;
}

/** Full-viewport reader surface for long-form quote / note content. */
export function DialogContentFullscreen({ className, ...props }: DialogContentProps) {
  return (
    <NeoDialogContent
      className={cn(
        "inset-0 top-0 left-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 shadow-none sm:max-w-none",
        "data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100",
        "[&>button]:top-5 [&>button]:right-5 [&>button]:z-20 [&>button]:border-2 [&>button]:border-[var(--ink)] [&>button]:bg-[var(--white)] [&>button]:p-2",
        className,
      )}
      {...props}
    />
  );
}
