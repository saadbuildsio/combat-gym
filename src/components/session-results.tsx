"use client";

import { ButtonLink, Card, Pill, SectionTitle } from "@/components/ui";
import { getAchievement } from "@/content/achievements";
import { PAIN_STOP_MESSAGE } from "@/content/safety";
import type { SessionOutcome } from "@/domain/progress";
import { SKILL_LABELS } from "@/domain/skills";
import { MEASURED_SKILLS, type SkillRatings } from "@/domain/types";
import { levelProgress } from "@/domain/xp";

/** End-of-session screen: XP, skill changes, achievements and the coach's honest note. */
export function SessionResults({ outcome, skillsBefore }: { outcome: SessionOutcome; skillsBefore: SkillRatings }) {
  const { profile, coach } = outcome;
  const level = levelProgress(profile.totalXp);
  const changed = MEASURED_SKILLS.filter((s) => profile.skills[s] !== skillsBefore[s]);

  return (
    <div className="space-y-5">
      {coach.tone === "safety" ? (
        <Card className="border border-danger/40">
          <h1 className="text-2xl font-black">Session stopped</h1>
          <p className="mt-3">{PAIN_STOP_MESSAGE}</p>
        </Card>
      ) : (
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">Session complete</p>
          <p className="mt-2 text-6xl font-black text-accent">+{outcome.xpEarned} XP</p>
          {outcome.leveledUp && (
            <p className="mt-3">
              <Pill tone="accent">
                ⬆ Level {level.level}: {level.title}
              </Pill>
            </p>
          )}
        </div>
      )}

      <Card>
        <SectionTitle>AI coach</SectionTitle>
        <p className="mt-2 text-xl font-bold">{coach.headline}</p>
        <p className="mt-2 text-muted">{coach.detail}</p>
      </Card>

      {changed.length > 0 && (
        <Card>
          <SectionTitle>Skills</SectionTitle>
          <ul className="mt-3 space-y-2">
            {changed.map((s) => {
              const delta = profile.skills[s] - skillsBefore[s];
              const first = skillsBefore[s] === 0;
              return (
                <li key={s} className="flex items-center justify-between">
                  <span className="font-semibold">{SKILL_LABELS[s]}</span>
                  <span className="tabular-nums">
                    {profile.skills[s]}{" "}
                    <span className={first ? "text-muted" : delta >= 0 ? "text-good" : "text-danger"}>
                      {first ? "(first score)" : `${delta >= 0 ? "+" : ""}${delta}`}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      {outcome.newAchievements.length > 0 && (
        <Card>
          <SectionTitle>Achievements unlocked</SectionTitle>
          <ul className="mt-3 space-y-2">
            {outcome.newAchievements.map((id) => {
              const a = getAchievement(id);
              return a ? (
                <li key={id} className="flex items-center justify-between">
                  <span>
                    {a.emoji} <span className="font-bold">{a.title}</span>
                  </span>
                  <span className="text-sm text-accent">+{a.xpReward} XP</span>
                </li>
              ) : null;
            })}
          </ul>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <ButtonLink href="/">Back to home</ButtonLink>
        <ButtonLink href="/progress" variant="secondary">
          View progress
        </ButtonLink>
      </div>
    </div>
  );
}
