"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { MoveAnimation } from "@/components/move-animation";
import { ALL_MOVE_IDS, getMove, type MoveId } from "@/content/boxing/moves";
import { localizeMove } from "@/content/localize";
import type { MessageKey } from "@/i18n/messages/en";

const GROUPS: { title: MessageKey; moves: MoveId[] }[] = [
  { title: "moves.groupPunches", moves: ["jab", "cross", "lead-hook", "rear-hook", "lead-uppercut", "rear-uppercut", "body-jab", "body-cross", "body-hook"] },
  { title: "moves.groupDefense", moves: ["block", "slip-left", "slip-right", "roll", "parry", "pull-back"] },
  { title: "moves.groupFootwork", moves: ["step-forward", "step-back", "step-left", "step-right", "pivot"] },
  { title: "moves.groupFightIq", moves: ["feint"] },
  { title: "moves.groupStance", moves: ["guard", "guard-check", "reset"] },
];

export default function MovesPage() {
  return <AppShell>{() => <MoveLibrary />}</AppShell>;
}

/** Every move in one place, animated, with slow motion. Punch numbers match the callouts. */
function MoveLibrary() {
  const [selected, setSelected] = useState<MoveId>("jab");
  const [slow, setSlow] = useState(false);
  const number = PUNCH_NUMBERS[selected];
  const { language, t } = useLanguage();
  const moveName = (id: MoveId) => localizeMove(getMove(id), language).name;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("train.eyebrow")}</p>
        <h1 className="text-3xl font-black">{t("moves.title")}</h1>
        <p className="text-sm text-muted">{t("moves.count", { count: ALL_MOVE_IDS.length })}</p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-black">
            {number && <span className="mr-2 text-accent">{number}</span>}
            {moveName(selected)}
          </h2>
          <button type="button" onClick={() => setSlow((s) => !s)} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-bold">
            {slow ? t("moves.slowMotion") : t("moves.fullSpeed")}
          </button>
        </div>
        <MoveAnimation moves={[selected]} playKey={selected} slow={slow} />
      </div>

      {GROUPS.map((group) => (
        <section key={group.title}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted">{t(group.title)}</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {group.moves.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelected(id)}
                className={`rounded-xl px-3 py-3 text-left font-bold ${id === selected ? "bg-accent text-white" : "bg-surface-2"}`}
              >
                {PUNCH_NUMBERS[id] && <span className="mr-2 opacity-70">{PUNCH_NUMBERS[id]}</span>}
                {moveName(id)}
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

const PUNCH_NUMBERS: Partial<Record<MoveId, string>> = {
  jab: "1",
  cross: "2",
  "lead-hook": "3",
  "rear-hook": "4",
  "lead-uppercut": "5",
  "rear-uppercut": "6",
};
