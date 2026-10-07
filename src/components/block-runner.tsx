"use client";

import { Button } from "@/components/ui";
import {
  COOLDOWN_STEPS,
  DIRECTION_OPTIONS,
  MOVEMENT_CALLOUTS,
  PUNCH_COMBOS,
  PUNCH_OPTIONS_ALL,
  PUNCH_OPTIONS_BASIC,
  WARMUP_STEPS,
} from "@/content/boxing/callouts";
import { getDrill } from "@/content/boxing/drills";
import { BOXING_LESSONS, getLesson } from "@/content/boxing/lessons";
import { BOXING_OPPONENTS, getOpponent } from "@/content/boxing/opponents";
import { knowsPunches } from "@/domain/curriculum";
import { opponentForSession } from "@/domain/finish-session";
import { scoreFightIQ, scoreQuiz } from "@/domain/scoring";
import type { DrillResult, PlayerProfile, SessionBlock } from "@/domain/types";
import { ChoiceDrill } from "./drills/choice-drill";
import { ComboRecallDrill } from "./drills/combo-recall-drill";
import { LessonView } from "./drills/lesson-view";
import { ReactionDrill } from "./drills/reaction-drill";
import { TimedRound } from "./drills/timed-round";
import { shuffle } from "./drills/types";

/** Picks the right screen for one block of a training session. */
export function BlockRunner({
  block,
  profile,
  onDone,
  onPain,
}: {
  block: SessionBlock;
  profile: PlayerProfile;
  onDone: (result: DrillResult) => void;
  onPain: (partial: DrillResult) => void;
}) {
  const punches = knowsPunches(profile.completedLessonIds);

  if (block.type === "learn" && block.lessonId) {
    const lesson = getLesson(block.lessonId);
    if (!lesson) return <MissingBlock onSkip={() => onDone(skipped(block))} />;
    return (
      <div>
        <LessonView lesson={lesson} />
        <Button
          className="mt-8 w-full"
          onClick={() => onDone({ drillId: `lesson:${lesson.id}`, kind: "lesson", completed: true, scores: {} })}
        >
          Got it
        </Button>
      </div>
    );
  }

  const drill = block.drillId ? getDrill(block.drillId) : undefined;
  if (!drill) return <MissingBlock onSkip={() => onDone(skipped(block))} />;
  const props = { onDone, onPain };

  switch (drill.kind) {
    case "warmup":
      return <TimedRound {...props} drill={drill} callouts={WARMUP_STEPS} calloutEvery={20} randomOrder={false} scoreEffort={false} />;
    case "cooldown":
      return <TimedRound {...props} drill={drill} callouts={COOLDOWN_STEPS} calloutEvery={20} randomOrder={false} scoreEffort={false} />;
    case "shadowRound": {
      const usePunches = drill.id === "shadow-punches" && punches;
      return (
        <TimedRound
          {...props}
          drill={drill}
          callouts={usePunches ? PUNCH_COMBOS : MOVEMENT_CALLOUTS}
          calloutEvery={usePunches ? 4 : 3}
          randomOrder
          scoreEffort
        />
      );
    }
    case "reaction":
      return <ReactionDrill {...props} drill={drill} options={punches ? PUNCH_OPTIONS_BASIC : DIRECTION_OPTIONS} />;
    case "comboRecall":
      return <ComboRecallDrill {...props} drill={drill} options={punches ? PUNCH_OPTIONS_ALL : DIRECTION_OPTIONS} />;
    case "quiz": {
      const questions = quizQuestions(block.lessonId, profile.completedLessonIds);
      return (
        <ChoiceDrill
          questions={questions.map((q) => ({ id: q.id, prompt: q.question, options: q.options, bestIndex: q.correctIndex, explanation: q.explanation }))}
          onComplete={(chosen) =>
            onDone({
              drillId: drill.id,
              kind: drill.kind,
              completed: true,
              scores: { knowledge: scoreQuiz(chosen.filter((c, i) => c === questions[i].correctIndex).length, questions.length) },
            })
          }
        />
      );
    }
    case "fightIQ": {
      const opponent = opponentForSession(profile.totalXp, profile.history.length);
      return <FightIQMatch opponentId={opponent.id} drillId={drill.id} onDone={onDone} />;
    }
    default:
      return <MissingBlock onSkip={() => onDone(skipped(block))} />;
  }
}

/** Fight IQ round against one opponent. Also used on the Fighters screen. */
export function FightIQMatch({ opponentId, drillId, onDone }: { opponentId: string; drillId: string; onDone: (r: DrillResult) => void }) {
  const opponent = getOpponent(opponentId) ?? BOXING_OPPONENTS[0];
  return (
    <ChoiceDrill
      intro={
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Your opponent</p>
          <h3 className="mt-1 text-3xl font-black">{opponent.name}</h3>
          <p className="mt-2 text-muted">{opponent.description}</p>
          <p className="mt-4 text-sm">Read each situation and choose the smartest response.</p>
        </div>
      }
      questions={opponent.scenarios.map((s) => ({
        id: s.id,
        prompt: s.situation,
        options: s.options,
        bestIndex: s.bestIndex,
        okIndexes: s.okIndexes,
        explanation: s.explanation,
      }))}
      onComplete={(chosen) =>
        onDone({
          drillId,
          kind: "fightIQ",
          completed: true,
          scores: { fightIQ: scoreFightIQ(opponent.scenarios, chosen) },
        })
      }
    />
  );
}

function quizQuestions(lessonId: string | undefined, completed: string[]) {
  const lesson = lessonId ? getLesson(lessonId) : undefined;
  if (lesson) return lesson.quiz;
  const pool = BOXING_LESSONS.filter((l) => completed.includes(l.id)).flatMap((l) => l.quiz);
  return pool.length ? shuffle(pool).slice(0, 3) : BOXING_LESSONS[0].quiz;
}

function skipped(block: SessionBlock): DrillResult {
  return { drillId: block.drillId ?? "unknown", kind: "warmup", completed: false, scores: {} };
}

function MissingBlock({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="text-center">
      <p className="text-muted">This part of the session is not available yet.</p>
      <Button className="mt-6" variant="secondary" onClick={onSkip}>
        Skip
      </Button>
    </div>
  );
}
