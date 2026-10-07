"use client";

import { useEffect, useRef, useState } from "react";
import { Button, ProgressBar } from "@/components/ui";
import { DIRECTION_NAMES, PUNCH_NAMES } from "@/content/boxing/callouts";
import { localizeDrill, localizePhrase } from "@/content/localize";
import { scoreComboRecall } from "@/domain/scoring";
import type { Drill } from "@/domain/types";
import { useLanguage } from "../language-provider";
import { pick, type DrillProps } from "./types";

/** Combo lengths per round: starts easy, gets harder. */
const ROUND_LENGTHS = [2, 2, 3, 3, 4];

type Phase = "intro" | "show" | "input" | "feedback";

function makeCombo(options: string[], length: number): string[] {
  const combo: string[] = [];
  while (combo.length < length) {
    const next = pick(options);
    if (combo.at(-1) !== next) combo.push(next); // avoid "1, 1" repeats so the pattern is readable
  }
  return combo;
}

/** Memorise a combination for a couple of seconds, then enter it from memory. */
export function ComboRecallDrill({ drill, options, onDone }: DrillProps & { drill: Drill; options: string[] }) {
  const { language, t } = useLanguage();
  const [phase, setPhase] = useState<Phase>("intro");
  const [round, setRound] = useState(0);
  const [combo, setCombo] = useState<string[]>([]);
  const [entered, setEntered] = useState<string[]>([]);
  const [lastCorrect, setLastCorrect] = useState(false);
  const correct = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const startRound = (r: number) => {
    if (r >= ROUND_LENGTHS.length) {
      onDone({
        drillId: drill.id,
        kind: drill.kind,
        completed: true,
        scores: { comboRecall: scoreComboRecall(correct.current, ROUND_LENGTHS.length) },
        stats: { correct: correct.current, rounds: ROUND_LENGTHS.length },
      });
      return;
    }
    const length = ROUND_LENGTHS[r];
    setRound(r);
    setCombo(makeCombo(options, length));
    setEntered([]);
    setPhase("show");
    timer.current = setTimeout(() => setPhase("input"), 1500 + length * 400);
  };

  const press = (option: string) => {
    if (phase !== "input") return;
    const nextEntered = [...entered, option];
    setEntered(nextEntered);
    if (nextEntered.length === combo.length) {
      const ok = nextEntered.every((v, i) => v === combo[i]);
      if (ok) correct.current += 1;
      setLastCorrect(ok);
      setPhase("feedback");
      timer.current = setTimeout(() => startRound(round + 1), 1200);
    }
  };

  const label = (o: string) => {
    const english = PUNCH_NAMES[o] ?? DIRECTION_NAMES[o];
    return english ? localizePhrase(english, language) : o;
  };

  if (phase === "intro") {
    return (
      <div className="text-center">
        <p className="text-muted">{localizeDrill(drill, language).description}</p>
        <p className="mt-4 text-sm text-muted">{t("recall.intro", { count: ROUND_LENGTHS.length })}</p>
        <Button className="mt-8 w-full" onClick={() => startRound(0)}>
          {t("common.start")}
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <ProgressBar value={round} max={ROUND_LENGTHS.length} />
      <div className="mt-8 flex min-h-40 flex-col items-center justify-center rounded-2xl bg-surface-2 p-4" aria-live="polite">
        {phase === "show" && (
          <>
            <p className="text-sm text-muted">{t("recall.remember")}</p>
            <p className="mt-2 text-5xl font-black tracking-widest text-accent">{combo.join(" ")}</p>
            <p className="mt-2 text-sm text-muted">{combo.map(label).join(" → ")}</p>
          </>
        )}
        {phase === "input" && (
          <>
            <p className="text-sm text-muted">{t("recall.enter")}</p>
            <p className="mt-2 text-5xl font-black tracking-widest">{entered.join(" ") || "…"}</p>
          </>
        )}
        {phase === "feedback" && (
          <>
            <p className={`text-2xl font-black ${lastCorrect ? "text-good" : "text-danger"}`}>{lastCorrect ? t("recall.correct") : t("recall.notQuite")}</p>
            {!lastCorrect && <p className="mt-2 text-muted">{t("recall.itWas", { combo: combo.join(" ") })}</p>}
          </>
        )}
      </div>
      <div className={`mt-6 grid gap-3 ${options.length === 4 ? "grid-cols-4" : "grid-cols-3"}`}>
        {options.map((o) => (
          <Button key={o} variant="secondary" className="h-16 text-2xl" disabled={phase !== "input"} onClick={() => press(o)}>
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}
