"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useTransition } from "react";

export function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const replaceParams = useCallback(
    (updates: Record<string, string | null | undefined>, options?: { debounce?: boolean }) => {
      const apply = () => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(updates)) {
          if (value === null || value === undefined || value === "") {
            params.delete(key);
          } else {
            params.set(key, value);
          }
        }
        const query = params.toString();
        startTransition(() => {
          router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        });
      };

      if (options?.debounce) {
        return apply;
      }
      apply();
    },
    [pathname, router, searchParams],
  );

  return { searchParams, replaceParams, isPending };
}

export function useDebouncedQueryParam(
  key: string,
  delayMs = 300,
): {
  value: string;
  setValue: (next: string) => void;
  isPending: boolean;
} {
  const { searchParams, replaceParams, isPending } = useQueryParams();
  const value = searchParams.get(key) ?? "";
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setValue = useCallback(
    (next: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        replaceParams({ [key]: next || null });
      }, delayMs);
    },
    [delayMs, key, replaceParams],
  );

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  return { value, setValue, isPending };
}
