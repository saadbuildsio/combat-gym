"use client";

import { useState } from "react";
import { LESSON_MOVES, getMove } from "@/content/boxing/moves";
import { localizeMove } from "@/content/localize";
import { useLanguage } from "./language-provider";
import { MoveAnimation } from "./move-animation";

/** The lesson's move(s) on our animated fighter, with slow motion for learning. */
export function LessonMoves({ lessonId }: { lessonId: string }) {
  const moves = LESSON_MOVES[lessonId] ?? [];
  const [slow, setSlow] = useState(true);
  const [index, setIndex] = useState(0);
  const { language, t } = useLanguage();
  if (moves.length === 0) return null;
  const move = moves[Math.min(index, moves.length - 1)];
  return (
    <section aria-label={t("moves.animation")}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {moves.length > 1 &&
            moves.map((id, i) => (
              <button
                key={id}
                type="button"
                onClick={() => setIndex(i)}
                className={`rounded-full px-3 py-1 text-sm font-bold ${i === index ? "bg-accent text-white" : "bg-surface-2 text-muted"}`}
              >
                {localizeMove(getMove(id), language).name}
              </button>
            ))}
        </div>
        <button type="button" onClick={() => setSlow((s) => !s)} className="rounded-full bg-surface-2 px-3 py-1 text-sm font-bold">
          {slow ? t("moves.slowMotion") : t("moves.fullSpeed")}
        </button>
      </div>
      <MoveAnimation moves={[move]} playKey={move} slow={slow} />
    </section>
  );
}
