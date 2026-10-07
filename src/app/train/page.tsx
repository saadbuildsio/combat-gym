"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ButtonLink, Card, Pill, SectionTitle } from "@/components/ui";
import { BOXING_LEVELS } from "@/content/boxing/levels";
import { getLesson } from "@/content/boxing/lessons";
import { isLevelComplete } from "@/domain/curriculum";
import type { PlayerProfile } from "@/domain/types";
import { todaysPlan } from "@/lib/today";

export default function TrainPage() {
  return <AppShell>{(profile) => <BoxingPath profile={profile} />}</AppShell>;
}

/** The Boxing path: six levels, lessons unlock with XP. */
function BoxingPath({ profile }: { profile: PlayerProfile }) {
  const plan = todaysPlan(profile);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Train</p>
        <h1 className="text-3xl font-black">🥊 Boxing path</h1>
      </div>

      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionTitle>Today&apos;s session</SectionTitle>
          <p className="mt-1 text-lg font-bold">
            {plan.blocks.length} parts · {plan.totalMinutes} min
          </p>
        </div>
        <ButtonLink href="/train/session">Start training</ButtonLink>
      </Card>

      <ol className="space-y-4">
        {BOXING_LEVELS.map((level) => {
          const unlocked = level.contentReady && profile.totalXp >= level.unlockXp;
          const complete = isLevelComplete(level, profile.completedLessonIds);
          return (
            <li key={level.level}>
              <Card className={unlocked ? "" : "opacity-60"}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Level {level.level}</p>
                    <h2 className="text-xl font-black">{level.title}</h2>
                    <p className="text-sm text-muted">{level.goal}</p>
                  </div>
                  {complete ? (
                    <Pill tone="good">✓ Complete</Pill>
                  ) : unlocked ? (
                    <Pill tone="accent">Open</Pill>
                  ) : (
                    <Pill>{level.contentReady ? `🔒 ${level.unlockXp.toLocaleString()} XP` : "🔒 Coming soon"}</Pill>
                  )}
                </div>
                {unlocked && (
                  <ul className="mt-4 space-y-2">
                    {level.lessonIds.map((id) => {
                      const lesson = getLesson(id);
                      if (!lesson) return null;
                      const done = profile.completedLessonIds.includes(id);
                      return (
                        <li key={id}>
                          <Link
                            href={`/train/lesson/${id}`}
                            className="flex items-center justify-between rounded-xl bg-surface-2 px-4 py-3 hover:bg-surface-3"
                          >
                            <span>
                              <span className="font-semibold">{lesson.title}</span>
                              <span className="block text-xs text-muted">{lesson.summary}</span>
                            </span>
                            <span aria-label={done ? "Completed" : "Not completed"}>{done ? "✓" : "›"}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
