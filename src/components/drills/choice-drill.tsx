"use client";

import { useState } from "react";
import { Button, ProgressBar } from "@/components/ui";
import { useT } from "../language-provider";

export interface ChoiceQuestion {
  id: string;
  prompt: string;
  options: string[];
  bestIndex: number;
  okIndexes?: number[];
  explanation: string;
}

/**
 * Shared multiple-choice runner for the lesson quiz and Fight IQ.
 * Shows the explanation after each answer, because the explanation is where the learning happens.
 */
export function ChoiceDrill({
  intro,
  questions,
  onComplete,
}: {
  intro?: React.ReactNode;
  questions: ChoiceQuestion[];
  onComplete: (chosenIndexes: number[]) => void;
}) {
  const t = useT();
  const [started, setStarted] = useState(!intro);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<number[]>([]);
  const answered = chosen.length > index;
  const question = questions[index];

  if (!started) {
    return (
      <div className="text-center">
        {intro}
        <Button className="mt-8 w-full" onClick={() => setStarted(true)}>
          {t("common.start")}
        </Button>
      </div>
    );
  }

  const result = (i: number) => {
    if (i === question.bestIndex) return "best";
    if (question.okIndexes?.includes(i)) return "ok";
    return "wrong";
  };

  const choiceClass = (i: number) => {
    if (!answered) return "border-surface-3 bg-surface-2 hover:border-muted";
    const r = result(i);
    if (r === "best") return "border-good bg-good/10";
    if (chosen[index] === i) return r === "ok" ? "border-accent bg-accent/10" : "border-danger bg-danger/10";
    return "border-surface-3 bg-surface-2 opacity-60";
  };

  return (
    <div>
      <ProgressBar value={index + (answered ? 1 : 0)} max={questions.length} />
      <h3 className="mt-6 text-xl font-bold">{question.prompt}</h3>
      <div className="mt-4 space-y-3">
        {question.options.map((option, i) => (
          <button
            key={option}
            type="button"
            disabled={answered}
            onClick={() => setChosen([...chosen, i])}
            className={`w-full rounded-xl border px-4 py-4 text-left font-semibold transition ${choiceClass(i)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {answered && (
        <div className="mt-4 rounded-xl bg-surface-2 p-4" aria-live="polite">
          <p className="font-bold">
            {result(chosen[index]) === "best" ? t("choice.best") : result(chosen[index]) === "ok" ? t("choice.ok") : t("choice.wrong")}
          </p>
          <p className="mt-1 text-sm text-muted">{question.explanation}</p>
          <Button
            className="mt-4 w-full"
            onClick={() => (index + 1 >= questions.length ? onComplete(chosen) : setIndex(index + 1))}
          >
            {index + 1 >= questions.length ? t("common.finish") : t("common.next")}
          </Button>
        </div>
      )}
    </div>
  );
}
