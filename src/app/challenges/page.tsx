"use client";

import { AdBanner } from "@/components/ad-banner";
import { AppShell } from "@/components/app-shell";
import { useT } from "@/components/language-provider";
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
  const t = useT();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("missions.eyebrow")}</p>
        <h1 className="text-3xl font-black">{t("missions.title")}</h1>
        <p className="mt-1 text-muted">{t("missions.intro")}</p>
      </div>
      <MissionList title={t("missions.today")} missions={daily} />
      <MissionList title={t("missions.thisWeek")} missions={weekly} />
      <ButtonLink href="/train/session" className="w-full">
        {t("common.startTraining")}
      </ButtonLink>
      <AdBanner placement="challenges" />
    </div>
  );
}

function MissionList({ title, missions }: { title: string; missions: Mission[] }) {
  const t = useT();
  return (
    <Card>
      <SectionTitle>{title}</SectionTitle>
      <ul className="mt-4 space-y-4">
        {missions.map((m) => (
          <li key={m.id}>
            <div className="flex items-baseline justify-between">
              <span className={`font-semibold ${m.done ? "text-good" : ""}`}>
                {m.done ? "✓ " : ""}
                {t(m.title)}
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
