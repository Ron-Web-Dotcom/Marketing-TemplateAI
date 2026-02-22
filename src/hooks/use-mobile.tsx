/**
 * @fileoverview Responsive breakpoint hook.
 *
 * @module hooks/use-mobile
 */

import * as React from "react";

/** Pixel width at which the viewport is considered "mobile". */
const MOBILE_BREAKPOINT = 768;

/**
 * Returns `true` when the viewport width is below {@link MOBILE_BREAKPOINT}.
 *
 * Uses `window.matchMedia` for efficient resize detection instead of
 * attaching a `resize` event listener.
 *
 * @returns Whether the current viewport qualifies as mobile.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
