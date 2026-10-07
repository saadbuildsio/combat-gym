"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { ButtonLink, Card, Pill, SectionTitle } from "@/components/ui";
import { BOXING_LEVELS } from "@/content/boxing/levels";
import { getLesson } from "@/content/boxing/lessons";
import { localizeLesson, localizeLevel } from "@/content/localize";
import { isLevelComplete, lockReason, placedLevelFor } from "@/domain/curriculum";
import type { PlayerProfile } from "@/domain/types";
import { todaysPlan } from "@/lib/today";

export default function TrainPage() {
  return <AppShell>{(profile) => <BoxingPath profile={profile} />}</AppShell>;
}

/** The Boxing path: six levels, lessons unlock with XP. */
function BoxingPath({ profile }: { profile: PlayerProfile }) {
  const plan = todaysPlan(profile);
  const { language, t } = useLanguage();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("train.eyebrow")}</p>
        <h1 className="text-3xl font-black">{t("train.boxingPath")}</h1>
      </div>

      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <SectionTitle>{t("train.todaysSession")}</SectionTitle>
          <p className="mt-1 text-lg font-bold">
            {t("train.partsAndMinutes", { parts: plan.blocks.length, minutes: plan.totalMinutes })}
          </p>
        </div>
        <ButtonLink href="/train/session">{t("common.startTraining")}</ButtonLink>
      </Card>

      <Link href="/train/moves" className="flex items-center justify-between rounded-2xl bg-surface p-5 hover:bg-surface-2">
        <span>
          <span className="block text-lg font-bold">{t("train.moveLibrary")}</span>
          <span className="text-sm text-muted">{t("train.moveLibraryHint")}</span>
        </span>
        <span aria-hidden className="text-2xl text-muted">
          ›
        </span>
      </Link>

      <ol className="space-y-4">
        {BOXING_LEVELS.map((englishLevel) => {
          const level = localizeLevel(englishLevel, language);
          const reason = lockReason(level, profile.totalXp, profile.completedLessonIds, placedLevelFor(profile.onboarding?.experience));
          const unlocked = reason === null;
          const complete = isLevelComplete(level, profile.completedLessonIds);
          return (
            <li key={level.level}>
              <Card className={unlocked ? "" : "opacity-60"}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("common.level", { level: level.level })}</p>
                    <h2 className="text-xl font-black">{level.title}</h2>
                    <p className="text-sm text-muted">{level.goal}</p>
                  </div>
                  {complete ? (
                    <Pill tone="good">{t("train.levelComplete")}</Pill>
                  ) : unlocked ? (
                    <Pill tone="accent">{t("train.levelOpen")}</Pill>
                  ) : (
                    <Pill>
                      {reason === "coming_soon"
                        ? t("common.lockedComingSoon")
                        : reason === "finish_previous"
                          ? t("train.finishLevel", { level: level.level - 1 })
                          : `🔒 ${t("common.xp", { xp: level.unlockXp.toLocaleString() })}`}
                    </Pill>
                  )}
                </div>
                {unlocked && (
                  <ul className="mt-4 space-y-2">
                    {level.lessonIds.map((id) => {
                      const found = getLesson(id);
                      if (!found) return null;
                      const lesson = localizeLesson(found, language);
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
                            <span aria-label={done ? t("train.lessonDone") : t("train.lessonNotDone")}>{done ? "✓" : "›"}</span>
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
