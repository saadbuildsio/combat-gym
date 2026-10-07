"use client";

import { AppShell } from "@/components/app-shell";
import { ButtonLink, Card, ProgressBar, SectionTitle } from "@/components/ui";
import { missionsFor, type Mission } from "@/domain/missions";
import type { PlayerProfile } from "@/domain/types";
import { todayKey } from "@/lib/today";

export default function ChallengesPage() {
  return <AppShell>{(profile) => <Challenges profile={profile} />}</AppShell>;
}

function Challenges({ profile }: { profile: PlayerProfile }) {
  const missions = missionsFor(profile.history, todayKey());
  const daily = missions.filter((m) => m.period === "daily");
  const weekly = missions.filter((m) => m.period === "weekly");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Challenges</p>
        <h1 className="text-3xl font-black">🎯 Missions</h1>
        <p className="mt-1 text-muted">Daily missions reset at midnight. Weekly challenges reset on Monday.</p>
      </div>
      <MissionList title="Today" missions={daily} />
      <MissionList title="This week" missions={weekly} />
      <ButtonLink href="/train/session" className="w-full">
        Start training
      </ButtonLink>
    </div>
  );
}

function MissionList({ title, missions }: { title: string; missions: Mission[] }) {
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <ul className="mt-4 space-y-4">
        {missions.map((m) => (
          <li key={m.id}>
            <div className="flex items-baseline justify-between">
              <span className={`font-semibold ${m.done ? "text-good" : ""}`}>
                {m.done ? "✓ " : ""}
                {m.title}
              </span>
              <span className="text-sm tabular-nums text-muted">
                {m.progress}/{m.target}
              </span>
            </div>
            <ProgressBar value={m.progress} max={m.target} className="mt-2" />
          </li>
        ))}
      </ul>
    </Card>
  );
}
