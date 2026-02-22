/**
 * @fileoverview Shared utility functions.
 *
 * @module lib/utils
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS class strings intelligently.
 *
 * Combines `clsx` (conditional class joining) with `tailwind-merge`
 * (conflict resolution) so that the last class wins when two utilities
 * target the same CSS property.
 *
 * @param inputs - One or more class values (strings, arrays, objects).
 * @returns A single de-duplicated class string.
 *
 * @example
 * cn("px-4 py-2", isLarge && "px-8") // → "py-2 px-8" when isLarge is true
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
