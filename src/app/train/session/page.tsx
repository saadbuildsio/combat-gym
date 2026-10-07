"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BlockRunner } from "@/components/block-runner";
import { useLanguage } from "@/components/language-provider";
import { useProfile } from "@/components/profile-provider";
import { SessionResults } from "@/components/session-results";
import { AppShell } from "@/components/app-shell";
import { ProgressBar } from "@/components/ui";
import { localizeSafety } from "@/content/localize";
import { SAFETY_TIPS } from "@/content/safety";
import { finishSession, type FinishedBlock } from "@/domain/finish-session";
import type { SessionOutcome } from "@/domain/progress";
import type { DrillResult, PlayerProfile, SkillRatings, TrainingSessionPlan } from "@/domain/types";
import { blockTitle, todayKey, todaysPlan } from "@/lib/today";
import { track } from "@/services/analytics/events";

export default function SessionPage() {
  return <AppShell>{(profile) => <SessionPlayer profile={profile} />}</AppShell>;
}

/** Runs today's session block by block, then shows results. */
function SessionPlayer({ profile }: { profile: PlayerProfile }) {
  const { saveProfile } = useProfile();
  const { language, t } = useLanguage();
  const [plan] = useState<TrainingSessionPlan>(() => todaysPlan(profile));
  const [skillsBefore] = useState<SkillRatings>(() => profile.skills);
  const [index, setIndex] = useState(0);
  const [outcome, setOutcome] = useState<SessionOutcome | null>(null);
  const finished = useRef<FinishedBlock[]>([]);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    track("training_started", { minutes: plan.totalMinutes, focus: plan.focus });
  }, [plan]);

  const complete = async (blocks: FinishedBlock[], pain: boolean) => {
    const completedLessonIds = plan.blocks
      .map((b, i) => (b.type === "learn" && blocks[i]?.result.completed ? b.lessonId : undefined))
      .filter((id): id is string => !!id);
    const result = finishSession(profile, { planId: plan.id, date: todayKey(), blocks, completedLessonIds });
    await saveProfile(result.profile);
    setOutcome(result);
    window.scrollTo({ top: 0 });

    track(pain ? "training_stopped_pain" : "training_completed", { xp: result.xpEarned, blocks: blocks.length });
    completedLessonIds.forEach((id) => track("lesson_completed", { lesson: id }));
    result.newAchievements.forEach((id) => track("achievement_unlocked", { achievement: id }));
    if (result.leveledUp) track("level_up");
    if (result.profile.streak.current === 1 && profile.streak.current !== 1) track("streak_started");
  };

  const onDone = (result: DrillResult) => {
    finished.current = [...finished.current, { result, minutes: plan.blocks[index].minutes }];
    if (index + 1 >= plan.blocks.length) {
      void complete(finished.current, false);
    } else {
      setIndex(index + 1);
      window.scrollTo({ top: 0 });
    }
  };

  const onPain = (partial: DrillResult) => {
    finished.current = [...finished.current, { result: partial, minutes: plan.blocks[index].minutes }];
    void complete(finished.current, true);
  };

  if (outcome) return <SessionResults outcome={outcome} skillsBefore={skillsBefore} />;

  const block = plan.blocks[index];
  const tips = localizeSafety("tips", SAFETY_TIPS, language);
  return (
    <div className="mx-auto max-w-lg">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>{t("session.part", { part: index + 1, total: plan.blocks.length })}</span>
        <Link href="/" className="font-semibold hover:text-foreground">
          {t("session.exit")}
        </Link>
      </div>
      <ProgressBar value={index} max={plan.blocks.length} className="mt-2" />
      <h1 className="mt-6 text-2xl font-black">{blockTitle(block, language)}</h1>
      <div className="mt-6">
        {/* key forces a fresh drill state for each block */}
        <BlockRunner key={index} block={block} profile={profile} onDone={onDone} onPain={onPain} />
      </div>
      <p className="mt-10 text-center text-xs text-muted">💡 {tips[index % tips.length]}</p>
    </div>
  );
}
