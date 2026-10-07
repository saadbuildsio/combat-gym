"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ProgressBar } from "@/components/ui";
import { DIRECTION_NAMES } from "@/content/boxing/callouts";
import { localizeDrill, localizePhrase } from "@/content/localize";
import { scoreReaction } from "@/domain/scoring";
import type { Drill } from "@/domain/types";
import { useLanguage } from "../language-provider";
import { pick, type DrillProps } from "./types";

const PROMPTS = 8;
const TIMEOUT_MS = 2000;

type Phase = "intro" | "waiting" | "prompt" | "feedback" | "done";

/**
 * Reaction drill: a cue appears after a random delay; tap the matching button.
 * Measures real reaction time in milliseconds on correct taps.
 */
export function ReactionDrill({ drill, options, onDone }: DrillProps & { drill: Drill; options: string[] }) {
  const { language, t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [cue, setCue] = useState("");
  const [feedback, setFeedback] = useState("");
  const times = useRef<number[]>([]);
  const shownAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timer.current) clearTimeout(timer.current);
  };
  useEffect(() => clear, []);

  const finish = () => {
    clear();
    const correct = times.current;
    const avg = correct.length ? Math.round(correct.reduce((a, b) => a + b, 0) / correct.length) : 0;
    setPhase("done");
    onDone({
      drillId: drill.id,
      kind: drill.kind,
      completed: true,
      scores: { reaction: scoreReaction(correct, PROMPTS) },
      stats: { avgReactionMs: avg, correct: correct.length, prompts: PROMPTS },
    });
  };

  // Timers call these plain functions; they only use refs, setters and props, so stale closures are safe.
  const next = (nextRound: number) => {
    clear();
    if (nextRound >= PROMPTS) {
      finish();
      return;
    }
    setRound(nextRound);
    setPhase("waiting");
    timer.current = setTimeout(
      () => {
        setCue(pick(options));
        shownAt.current = performance.now();
        setPhase("prompt");
        timer.current = setTimeout(() => showFeedback(t("reaction.tooSlow"), nextRound), TIMEOUT_MS);
      },
      700 + Math.random() * 1300,
    );
  };

  const showFeedback = (text: string, currentRound: number) => {
    clear();
    setFeedback(text);
    setPhase("feedback");
    timer.current = setTimeout(() => next(currentRound + 1), 700);
  };

  const tap = (option: string) => {
    if (phase === "waiting") {
      showFeedback(t("reaction.tooEarly"), round);
      return;
    }
    if (phase !== "prompt") return;
    const ms = Math.round(performance.now() - shownAt.current);
    if (option === cue) {
      times.current.push(ms);
      showFeedback(t("reaction.ms", { ms }), round);
    } else {
      showFeedback(t("reaction.wrong"), round);
    }
  };

  if (phase === "intro") {
    return (
      <div className="text-center">
        <p className="text-muted">{localizeDrill(drill, language).description}</p>
        <p className="mt-4 text-sm text-muted">{t("reaction.intro", { count: PROMPTS })}</p>
        <Button className="mt-8 w-full" onClick={() => next(0)}>
          {t("common.start")}
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <ProgressBar value={round} max={PROMPTS} />
      <div className="mt-8 flex h-40 items-center justify-center rounded-2xl bg-surface-2" aria-live="assertive">
        {phase === "waiting" && <span className="text-muted">{t("reaction.wait")}</span>}
        {phase === "prompt" && (
          <span className="text-7xl font-black text-accent">
            {cue}
            {DIRECTION_NAMES[cue] && <span className="block text-base text-muted">{localizePhrase(DIRECTION_NAMES[cue], language)}</span>}
          </span>
        )}
        {phase === "feedback" && <span className="text-2xl font-bold">{feedback}</span>}
      </div>
      <div className={`mt-6 grid gap-3 ${options.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
        {options.map((o) => (
          <Button key={o} variant="secondary" className="h-20 text-3xl" onClick={() => tap(o)}>
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}
