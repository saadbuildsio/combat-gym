"use client";

import { AppShell } from "@/components/app-shell";
import { Card, ProgressBar, SectionTitle, StatBar } from "@/components/ui";
import { SKILL_LABELS } from "@/domain/skills";
import { MEASURED_SKILLS, type PlayerProfile } from "@/domain/types";
import { levelProgress } from "@/domain/xp";

export default function ProgressPage() {
  return <AppShell>{(profile) => <Progress profile={profile} />}</AppShell>;
}

function Progress({ profile }: { profile: PlayerProfile }) {
  const level = levelProgress(profile.totalXp);
  const sessions = profile.history.length;
  const minutes = profile.history.reduce((sum, s) => sum + s.minutes, 0);
  const recent = profile.history.slice(-14);
  const maxXp = Math.max(1, ...recent.map((s) => s.xpEarned));

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Progress</p>
        <h1 className="text-3xl font-black">📈 Getting better</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Sessions" value={sessions} />
        <Stat label="Minutes" value={minutes} />
        <Stat label="Best streak" value={profile.streak.longest} />
      </div>

      <Card>
        <div className="flex items-baseline justify-between">
          <SectionTitle>Level {level.level}</SectionTitle>
          <span className="text-sm font-bold text-accent">{level.title}</span>
        </div>
        <ProgressBar value={level.xpIntoLevel} max={level.xpForNextLevel} className="mt-3" />
        <p className="mt-2 text-sm text-muted">
          {profile.totalXp.toLocaleString()} XP total · next rank: {level.nextTitle}
        </p>
      </Card>

      <Card>
        <SectionTitle>Skills</SectionTitle>
        <div className="mt-4 space-y-4">
          {MEASURED_SKILLS.map((s) => (
            <StatBar key={s} label={SKILL_LABELS[s]} value={profile.skills[s]} />
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle>XP per session (last 14)</SectionTitle>
        {recent.length === 0 ? (
          <p className="mt-3 text-muted">Finish your first session to start your chart.</p>
        ) : (
          <div className="mt-4 flex h-32 items-end gap-1" role="img" aria-label={`XP for your last ${recent.length} sessions`}>
            {recent.map((s, i) => (
              <div
                key={`${s.planId}-${i}`}
                className="flex-1 rounded-t bg-accent"
                style={{ height: `${Math.max(6, (s.xpEarned / maxXp) * 100)}%` }}
                title={`${s.date}: ${s.xpEarned} XP`}
              />
            ))}
          </div>
        )}
      </Card>

      <Card>
        <SectionTitle>History</SectionTitle>
        {profile.history.length === 0 ? (
          <p className="mt-3 text-muted">No sessions yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-surface-2">
            {[...profile.history]
              .reverse()
              .slice(0, 20)
              .map((s, i) => (
                <li key={`${s.planId}-${i}`} className="flex justify-between py-2 text-sm">
                  <span>{s.date}</span>
                  <span className="text-muted">
                    {s.minutes} min · +{s.xpEarned} XP
                  </span>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <Card className="text-center">
      <p className="text-3xl font-black tabular-nums">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </Card>
  );
}
