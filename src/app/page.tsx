"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SessionBlocksList } from "@/components/session-blocks-list";
import { ButtonLink, Card, Pill, ProgressBar, SectionTitle, StatBar } from "@/components/ui";
import { SPORTS } from "@/content/sports";
import { homeCoachLine } from "@/domain/coach-rules";
import { missionsFor } from "@/domain/missions";
import { SKILL_LABELS } from "@/domain/skills";
import { visibleStreak } from "@/domain/streak";
import { CAMERA_SKILLS, MEASURED_SKILLS, type PlayerProfile } from "@/domain/types";
import { levelProgress } from "@/domain/xp";
import { todayKey, todaysPlan } from "@/lib/today";
import { track } from "@/services/analytics/events";

const CAMERA_LABELS = { technique: "Technique", accuracy: "Accuracy", footwork: "Footwork", defenseForm: "Defense form" };

export default function HomePage() {
  return <AppShell>{(profile) => <Dashboard profile={profile} />}</AppShell>;
}

function Dashboard({ profile }: { profile: PlayerProfile }) {
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
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Welcome back</p>
          <h1 className="text-3xl font-black">{profile.displayName}</h1>
        </div>
        <Pill tone={streak > 0 ? "accent" : "muted"}>🔥 {streak} day streak</Pill>
      </div>

      {/* Primary action: what to do today */}
      <Card className="border border-accent/30 bg-gradient-to-br from-accent/15 to-surface">
        <SectionTitle>{trainedToday ? "Train again" : "Today's training"}</SectionTitle>
        <div className="mt-2 flex items-baseline justify-between">
          <h2 className="text-2xl font-black">🥊 Boxing</h2>
          <span className="text-muted">{plan.totalMinutes} min</span>
        </div>
        <div className="mt-4">
          <SessionBlocksList blocks={plan.blocks} />
        </div>
        <ButtonLink href="/train/session" className="mt-5 w-full text-lg">
          Start training
        </ButtonLink>
      </Card>

      <Card>
        <SectionTitle>AI coach</SectionTitle>
        <p className="mt-2 text-lg">&ldquo;{homeCoachLine(profile.skills, profile.history.length)}&rdquo;</p>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <div className="flex items-baseline justify-between">
            <SectionTitle>Level {level.level}</SectionTitle>
            <span className="text-sm font-bold text-accent">{level.title}</span>
          </div>
          <ProgressBar value={level.xpIntoLevel} max={level.xpForNextLevel} className="mt-3" />
          <p className="mt-2 text-sm text-muted">
            {level.xpIntoLevel.toLocaleString()} / {level.xpForNextLevel.toLocaleString()} XP to level {level.level + 1}
          </p>
        </Card>

        <Card>
          <div className="flex items-baseline justify-between">
            <SectionTitle>Daily missions</SectionTitle>
            <Link href="/challenges" className="text-sm font-semibold text-accent">
              All
            </Link>
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {missions.map((m) => (
              <li key={m.id} className="flex items-center justify-between">
                <span className={m.done ? "text-muted line-through" : ""}>{m.title}</span>
                <span className="tabular-nums text-muted">{m.done ? "✓" : `${m.progress}/${m.target}`}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <div className="flex items-baseline justify-between">
          <SectionTitle>Your skills</SectionTitle>
          <Link href="/progress" className="text-sm font-semibold text-accent">
            View progress
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {MEASURED_SKILLS.map((s) => (
            <StatBar key={s} label={SKILL_LABELS[s]} value={profile.skills[s]} />
          ))}
          {CAMERA_SKILLS.map((s) => (
            <StatBar key={s} label={CAMERA_LABELS[s]} value={0} locked />
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">Locked skills need camera coaching, which is coming later. We only score what we can measure.</p>
      </Card>

      <Card>
        <SectionTitle>Sports</SectionTitle>
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
                <span className="mt-1 block font-bold">{sport.name}</span>
                <span className={`text-xs ${available ? "text-accent" : "text-muted"}`}>{available ? "✓ Available" : "🔒 Coming soon"}</span>
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
