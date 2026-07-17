"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatMs, percentileFromMs } from "@/lib/reaction";
import { NextTests } from "./NextTests";

const TRIALS = 5;
const MIN_WAIT_MS = 1500;
const MAX_WAIT_MS = 4000;

/**
 * Under 80 ms is faster than human visual reaction physically allows — it means
 * the click was already on its way, or a pointer and key event both landed.
 * Treated as a false start rather than a record-breaking trial.
 */
const MIN_VALID_MS = 80;

type Stage = "idle" | "waiting" | "go" | "scored" | "tooSoon" | "done";

function randomWaitMs(): number {
  return MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);
}

function average(values: number[]): number {
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Stage surface: paper by default, ink while waiting, claret on go. */
const SURFACE: Record<Stage, string> = {
  idle: "border-rule-strong bg-paper-raised text-ink",
  waiting: "border-ink bg-ink text-paper",
  go: "border-accent-deep bg-accent text-paper",
  scored: "border-rule-strong bg-paper-raised text-ink",
  tooSoon: "border-accent bg-paper-raised text-ink",
  done: "border-rule-strong bg-paper-raised text-ink",
};

export function ReactionGame() {
  const [stage, setStage] = useState<Stage>("idle");
  const [trials, setTrials] = useState<number[]>([]);
  const [lastMs, setLastMs] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goAtRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (null !== timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => clearTimer, [clearTimer]);

  const startTrial = useCallback(() => {
    clearTimer();
    setLastMs(null);
    setStage("waiting");
    timerRef.current = setTimeout(() => {
      goAtRef.current = performance.now();
      setStage("go");
    }, randomWaitMs());
  }, [clearTimer]);

  const falseStart = useCallback(() => {
    clearTimer();
    setLastMs(null);
    setStage("tooSoon");
  }, [clearTimer]);

  const score = useCallback(() => {
    const ms = performance.now() - goAtRef.current;
    if (MIN_VALID_MS > ms) {
      falseStart();
      return;
    }
    const next = [...trials, ms];
    setTrials(next);
    setLastMs(ms);
    setStage(TRIALS === next.length ? "done" : "scored");
  }, [falseStart, trials]);

  const retry = useCallback(() => {
    clearTimer();
    setTrials([]);
    setLastMs(null);
    setStage("idle");
  }, [clearTimer]);

  const press = useCallback(() => {
    if ("waiting" === stage) return falseStart();
    if ("go" === stage) return score();
    if ("done" === stage) return;
    startTrial();
  }, [falseStart, score, stage, startTrial]);

  if ("done" === stage) {
    return <Result trials={trials} onRetry={retry} />;
  }

  return (
    <div className="mt-8">
      <StageButton stage={stage} lastMs={lastMs} onPress={press} />
      <Progress count={trials.length} />
      <Announcer stage={stage} lastMs={lastMs} />
    </div>
  );
}

const HEADLINE: Record<Stage, string> = {
  idle: "Click to start",
  waiting: "Wait for it…",
  go: "CLICK",
  scored: "",
  tooSoon: "Too soon",
  done: "",
};

const SUBLINE: Record<Stage, string> = {
  idle: "Five trials. Click the moment the panel turns red.",
  waiting: "The panel will turn red. Not yet.",
  go: "",
  scored: "Click for the next trial.",
  tooSoon:
    "You clicked before the panel turned. This trial doesn't count — click to take it again.",
  done: "",
};

function StageButton({
  stage,
  lastMs,
  onPress,
}: {
  stage: Stage;
  lastMs: number | null;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onPointerDown={onPress}
      onKeyDown={(e) => {
        // Space and Enter would otherwise fire click on key*up*, adding tens of
        // milliseconds of phantom reaction time. Score on the keydown instead.
        if (" " === e.key || "Enter" === e.key) {
          e.preventDefault();
          if (!e.repeat) onPress();
        }
      }}
      aria-label="Reaction stage — click or press space when the panel turns red"
      className={`flex h-64 w-full flex-col items-center justify-center gap-3 rounded-sm border px-6 text-center sm:h-80 ${SURFACE[stage]}`}
    >
      {"scored" === stage && null !== lastMs ? (
        <span className="font-display text-6xl tabular-nums tracking-tight sm:text-7xl">
          {formatMs(lastMs)}
        </span>
      ) : (
        <span
          className={
            "go" === stage
              ? "font-display text-6xl tracking-[0.08em] sm:text-7xl"
              : "font-display text-3xl tracking-tight sm:text-4xl"
          }
        >
          {HEADLINE[stage]}
        </span>
      )}
      {"" !== SUBLINE[stage] && (
        <span
          className={`max-w-sm text-sm leading-relaxed ${
            "waiting" === stage ? "text-rule" : "text-ink-muted"
          }`}
        >
          {SUBLINE[stage]}
        </span>
      )}
    </button>
  );
}

function Progress({ count }: { count: number }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="label">
        Trial {Math.min(count + 1, TRIALS)} of {TRIALS}
      </p>
      <div aria-hidden className="flex gap-1.5">
        {Array.from({ length: TRIALS }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 w-6 rounded-full ${
              i < count ? "bg-accent" : "bg-rule"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/** State changes are colour-coded; screen readers get the same news in words. */
function Announcer({ stage, lastMs }: { stage: Stage; lastMs: number | null }) {
  const message =
    "waiting" === stage
      ? "Wait for it."
      : "go" === stage
        ? "Click now."
        : "tooSoon" === stage
          ? "Too soon. This trial doesn't count."
          : "scored" === stage && null !== lastMs
            ? `${formatMs(lastMs)}. Click for the next trial.`
            : "";
  return (
    <p role="status" aria-live="assertive" className="sr-only">
      {message}
    </p>
  );
}

function Result({ trials, onRetry }: { trials: number[]; onRetry: () => void }) {
  const avg = average(trials);
  const best = Math.min(...trials);
  const percentile = percentileFromMs(avg);

  return (
    <section
      aria-label="result"
      className="mt-8 flex flex-col gap-3 rounded-sm border border-rule bg-paper-raised p-6"
    >
      <p className="font-display text-3xl leading-tight tracking-tight">
        You are faster than{" "}
        <span className="text-accent tabular-nums">{percentile}%</span> of people
      </p>

      <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-rule bg-rule">
        <div className="bg-paper-raised px-4 py-3">
          <dt className="label">Average of {trials.length}</dt>
          <dd className="mt-1 font-display text-3xl tabular-nums">
            {formatMs(avg)}
          </dd>
        </div>
        <div className="bg-paper-raised px-4 py-3">
          <dt className="label">Best trial</dt>
          <dd className="mt-1 font-display text-3xl tabular-nums">
            {formatMs(best)}
          </dd>
        </div>
      </dl>

      <div className="mt-2">
        <h3 className="label">Every trial</h3>
        <ol className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums text-ink-muted">
          {trials.map((ms, i) => (
            <li key={i}>
              <span className="text-rule-strong">{i + 1}.</span> {formatMs(ms)}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-muted">
        The percentile is an approximation, not a measurement. We hold no dataset
        of our own: your average is placed on a log-normal curve centred on the
        273 ms median that Human Benchmark publishes from its own (large,
        self-selected) sample. Your hardware adds latency too — a wireless mouse
        and a slow display can cost you tens of milliseconds.
      </p>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-sm border border-rule-strong px-4 py-2 text-sm font-medium hover:border-ink"
        >
          Try again
        </button>
      </div>

      <p className="label mt-1">
        Source: Human Benchmark published statistics —{" "}
        <Link href="/methodology/" className="underline hover:text-accent">
          Methodology
        </Link>
      </p>
      <NextTests excludeHref="/reaction-time/" />
    </section>
  );
}
