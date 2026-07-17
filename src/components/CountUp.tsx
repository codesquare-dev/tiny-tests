"use client";
import { useEffect, useState } from "react";

const DURATION_MS = 800;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Counts 0 → value over ~0.8s on an ease-out curve.
 * Under `prefers-reduced-motion` the final value is returned immediately.
 */
export function useCountUp(value: number, duration = DURATION_MS): number {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    // A zero duration collapses the ramp to a single frame, so the
    // reduced-motion case needs no separate branch — and every setState
    // stays inside the rAF callback rather than the effect body.
    const ramp = prefersReducedMotion() ? 0 : duration;
    let frame = 0;
    let startedAt: number | null = null;
    const tick = (now: number) => {
      startedAt ??= now;
      const t = ramp === 0 ? 1 : Math.min((now - startedAt) / ramp, 1);
      const eased = 1 - (1 - t) ** 3; // ease-out cubic
      setShown(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return shown;
}

export function CountUp({ value, className }: { value: number; className?: string }) {
  const shown = useCountUp(value);
  return <span className={className}>{Math.round(shown)}</span>;
}
