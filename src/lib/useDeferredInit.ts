import { useEffect, useState } from "react";

/**
 * Defer client-side work until the browser is idle (or after a short timeout).
 * This helps keep the initial render free of layout thrash that hurts LCP/TBT.
 */
export function useDeferredInit(timeout = 150) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cancelIdle: (() => void) | undefined;

    const run = () => {
      if (!cancelled) setReady(true);
    };

    const idleCb = (window as unknown as { requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number }).requestIdleCallback;
    const cancelIdleCb = (window as unknown as { cancelIdleCallback?: (handle: number) => void }).cancelIdleCallback;

    if (typeof idleCb === "function") {
      const id = idleCb(run, { timeout });
      cancelIdle = () => cancelIdleCb?.(id);
    } else {
      const id = window.setTimeout(run, timeout);
      cancelIdle = () => window.clearTimeout(id);
    }

    return () => {
      cancelled = true;
      cancelIdle?.();
    };
  }, [timeout]);

  return ready;
}
