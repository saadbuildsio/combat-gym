"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useT } from "@/components/language-provider";
import { SessionBlocksList } from "@/components/session-blocks-list";
import { ButtonLink, Card, Pill, ProgressBar, SectionTitle, StatBar } from "@/components/ui";
import { SPORTS } from "@/content/sports";
import { homeCoachLine } from "@/domain/coach-rules";
import { missionsFor } from "@/domain/missions";
import { SKILL_LABEL_KEYS } from "@/domain/skills";
import { visibleStreak } from "@/domain/streak";
import { CAMERA_SKILLS, MEASURED_SKILLS, type PlayerProfile } from "@/domain/types";
import { levelProgress } from "@/domain/xp";
import type { MessageKey } from "@/i18n/messages/en";
import { todayKey, todaysPlan } from "@/lib/today";
import { track } from "@/services/analytics/events";

const CAMERA_LABELS: Record<(typeof CAMERA_SKILLS)[number], MessageKey> = {
  technique: "skill.technique",
  accuracy: "skill.accuracy",
  footwork: "skill.footwork",
  defenseForm: "skill.defenseForm",
};

const SPORT_NAMES: Record<string, MessageKey> = {
  boxing: "sport.boxing",
  kickboxing: "sport.kickboxing",
  wrestling: "sport.wrestling",
  mma: "sport.mma",
};

export default function HomePage() {
  return <AppShell>{(profile) => <Dashboard profile={profile} />}</AppShell>;
}

function Dashboard({ profile }: { profile: PlayerProfile }) {
  const t = useT();
  const today = todayKey();
  const plan = todaysPlan(profile, today);
  const streak = visibleStreak(profile.streak, today);
  const level = levelProgress(profile.totalXp);
  const trainedToday = profile.history.some((s) => s.date === today);
  const missions = missionsFor(profile.history, today).filter((m) => m.period === "daily");

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("home.welcomeBack")}</p>
          <h1 className="text-3xl font-black">{profile.displayName}</h1>
        </div>
        <Pill tone={streak > 0 ? "accent" : "muted"}>🔥 {t("common.streak", { count: streak })}</Pill>
      </div>

      {/* Primary action: what to do today */}
      <Card className="border border-accent/30 bg-gradient-to-br from-accent/15 to-surface">
        <SectionTitle>{trainedToday ? t("home.trainAgain") : t("home.todaysTraining")}</SectionTitle>
        <div className="mt-2 flex items-baseline justify-between">
          <h2 className="text-2xl font-black">🥊 {t("sport.boxing")}</h2>
          <span className="text-muted">{t("common.minutes", { minutes: plan.totalMinutes })}</span>
        </div>
        <div className="mt-4">
          <SessionBlocksList blocks={plan.blocks} />
        </div>
        <ButtonLink href="/train/session" className="mt-5 w-full text-lg">
          {t("common.startTraining")}
        </ButtonLink>
      </Card>

      <Card>
        <SectionTitle>{t("common.aiCoach")}</SectionTitle>
        <p className="mt-2 text-lg">&ldquo;{t(homeCoachLine(profile.skills, profile.history.length))}&rdquo;</p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <div className="flex items-baseline justify-between">
            <SectionTitle>{t("common.level", { level: level.level })}</SectionTitle>
            <span className="text-sm font-bold text-accent">{t(level.titleKey)}</span>
          </div>
          <ProgressBar value={level.xpIntoLevel} max={level.xpForNextLevel} className="mt-3" />
          <p className="mt-2 text-sm text-muted">
            {t("home.levelProgress", {
              into: level.xpIntoLevel.toLocaleString(),
              needed: level.xpForNextLevel.toLocaleString(),
              next: level.level + 1,
            })}
          </p>
        </Card>

        <Card>
          <div className="flex items-baseline justify-between">
            <SectionTitle>{t("home.dailyMissions")}</SectionTitle>
            <Link href="/challenges" className="text-sm font-semibold text-accent">
              {t("home.all")}
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {missions.map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <span className={m.done ? "text-muted line-through" : ""}>{t(m.title)}</span>
                <span className="tabular-nums text-muted">{m.done ? "✓" : `${m.progress}/${m.target}`}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-baseline justify-between">
          <SectionTitle>{t("home.yourSkills")}</SectionTitle>
          <Link href="/progress" className="text-sm font-semibold text-accent">
            {t("common.viewProgress")}
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {MEASURED_SKILLS.map((s) => (
            <StatBar key={s} label={t(SKILL_LABEL_KEYS[s])} value={profile.skills[s]} />
          ))}
          {CAMERA_SKILLS.map((s) => (
            <StatBar key={s} label={t(CAMERA_LABELS[s])} value={0} locked />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">{t("home.lockedSkillsNote")}</p>
      </Card>

      <Card>
        <SectionTitle>{t("home.sports")}</SectionTitle>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
          {SPORTS.map((sport) => {
            const available = sport.status === "available";
            return (
              <button
                key={sport.id}
                type="button"
                className={`rounded-xl p-4 text-left ${available ? "bg-accent/15" : "bg-surface-2 opacity-70"}`}
                onClick={() => !available && track("locked_sport_tapped", { sport: sport.id })}
              >
                <span className="text-2xl" aria-hidden>
                  {sport.emoji}
                </span>
                <span className="mt-1 block font-bold">{SPORT_NAMES[sport.id] ? t(SPORT_NAMES[sport.id]) : sport.name}</span>
                <span className={`text-xs ${available ? "text-accent" : "text-muted"}`}>{available ? t("sport.available") : t("common.lockedComingSoon")}</span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
