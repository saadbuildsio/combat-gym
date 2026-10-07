"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useProfile } from "@/components/profile-provider";
import { Button, Card, Pill, SectionTitle } from "@/components/ui";
import { ACHIEVEMENTS } from "@/content/achievements";
import { EQUIPMENT_GUIDANCE, SAFETY_DISCLAIMER } from "@/content/safety";
import { visibleStreak } from "@/domain/streak";
import type { PlayerProfile } from "@/domain/types";
import { levelProgress } from "@/domain/xp";
import { todayKey } from "@/lib/today";

export default function ProfilePage() {
  return <AppShell>{(profile) => <Profile profile={profile} />}</AppShell>;
}

function Profile({ profile }: { profile: PlayerProfile }) {
  const router = useRouter();
  const { resetProfile } = useProfile();
  const [confirmReset, setConfirmReset] = useState(false);
  const level = levelProgress(profile.totalXp);
  const streak = visibleStreak(profile.streak, todayKey());

  return (
    <div className="space-y-5">
      <Card className="flex items-center gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-accent text-2xl font-black text-white" aria-hidden>
          {profile.displayName.slice(0, 1).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black uppercase">{profile.displayName}</h1>
          <p className="text-muted">
            Level {level.level} · {level.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill tone="accent">🔥 {streak} day streak</Pill>
            <Pill>🥊 Boxing</Pill>
            <Pill>{profile.plan === "pro" ? "PRO" : "Free plan"}</Pill>
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Achievements</SectionTitle>
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = profile.achievements.includes(a.id);
            return (
              <li key={a.id} className={`rounded-xl p-3 ${earned ? "bg-accent/15" : "bg-surface-2 opacity-50"}`}>
                <p className="text-2xl" aria-hidden>
                  {earned ? a.emoji : "🔒"}
                </p>
                <p className="mt-1 font-bold">{a.title}</p>
                <p className="text-xs text-muted">{a.description}</p>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <SectionTitle>Equipment</SectionTitle>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {EQUIPMENT_GUIDANCE.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">{SAFETY_DISCLAIMER}</p>
      </Card>

      <Card>
        <SectionTitle>Data</SectionTitle>
        <p className="mt-2 text-sm text-muted">Your progress is saved on this device only. Accounts and cloud sync come later.</p>
        {confirmReset ? (
          <div className="mt-4 flex gap-3">
            <Button
              variant="danger"
              onClick={async () => {
                await resetProfile();
                router.replace("/welcome");
              }}
            >
              Yes, delete everything
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button variant="danger" className="mt-4" onClick={() => setConfirmReset(true)}>
            Reset progress
          </Button>
        )}
      </Card>
    </div>
  );
}
