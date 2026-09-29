import { clsx, type ClassValue } from "clsx";
import type { CSSProperties } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pad = (value: number) => String(value).padStart(2, "0");

/** Index for CSS stagger delays (reads var(--i)). */
export const stagger = (index: number) => ({ "--i": index }) as CSSProperties;
