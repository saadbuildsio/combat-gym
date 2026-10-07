"use client";

import { ButtonLink, Card, Pill, SectionTitle } from "@/components/ui";
import { getAchievement } from "@/content/achievements";
import { localizeAchievement, localizeSafety } from "@/content/localize";
import { PAIN_STOP_MESSAGE } from "@/content/safety";
import type { SessionOutcome } from "@/domain/progress";
import { SKILL_LABEL_KEYS } from "@/domain/skills";
import { MEASURED_SKILLS, type SkillRatings } from "@/domain/types";
import { levelProgress } from "@/domain/xp";
import { AdBanner } from "./ad-banner";
import { useLanguage } from "./language-provider";

/** End-of-session screen: XP, skill changes, achievements and the coach's honest note. */
export function SessionResults({ outcome, skillsBefore }: { outcome: SessionOutcome; skillsBefore: SkillRatings }) {
  const { profile, coach } = outcome;
  const { language, t } = useLanguage();
  const level = levelProgress(profile.totalXp);
  const changed = MEASURED_SKILLS.filter((s) => profile.skills[s] !== skillsBefore[s]);

  return (
    <div className="space-y-5">
      {coach.tone === "safety" ? (
        <Card className="border border-danger/40">
          <h1 className="text-2xl font-black">{t("results.stopped")}</h1>
          <p className="mt-3">{localizeSafety("painStop", PAIN_STOP_MESSAGE, language)}</p>
        </Card>
      ) : (
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("results.complete")}</p>
          <p className="mt-2 text-6xl font-black text-accent">{t("common.plusXp", { xp: outcome.xpEarned })}</p>
          {outcome.leveledUp && (
            <p className="mt-3">
              <Pill tone="accent">
                {t("results.levelUp", { level: level.level, title: t(level.titleKey) })}
              </Pill>
            </p>
          )}
        </div>
      )}

      <Card>
        <SectionTitle>{t("common.aiCoach")}</SectionTitle>
        <p className="mt-2 text-xl font-bold">{t(coach.headline)}</p>
        <p className="mt-2 text-muted">{t(coach.detail)}</p>
      </Card>

      {changed.length > 0 && (
        <Card>
          <SectionTitle>{t("common.skills")}</SectionTitle>
          <ul className="mt-3 space-y-2">
            {changed.map((s) => {
              const delta = profile.skills[s] - skillsBefore[s];
              const first = skillsBefore[s] === 0;
              return (
                <li key={s} className="flex items-center justify-between">
                  <span className="font-semibold">{t(SKILL_LABEL_KEYS[s])}</span>
                  <span className="tabular-nums">
                    {profile.skills[s]}{" "}
                    <span className={first ? "text-muted" : delta >= 0 ? "text-good" : "text-danger"}>
                      {first ? t("results.firstScore") : `${delta >= 0 ? "+" : ""}${delta}`}
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
          <SectionTitle>{t("results.achievementsUnlocked")}</SectionTitle>
          <ul className="mt-3 space-y-2">
            {outcome.newAchievements.map((id) => {
              const found = getAchievement(id);
              const a = found ? localizeAchievement(found, language) : undefined;
              return a ? (
                <li key={id} className="flex items-center justify-between">
                  <span>
                    {a.emoji} <span className="font-bold">{a.title}</span>
                  </span>
                  <span className="text-sm text-accent">{t("common.plusXp", { xp: a.xpReward })}</span>
                </li>
              ) : null;
            })}
          </ul>
        </Card>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        <ButtonLink href="/">{t("results.backHome")}</ButtonLink>
        <ButtonLink href="/progress" variant="secondary">
          {t("common.viewProgress")}
        </ButtonLink>
      </div>
      {/* No ad on the pain screen: that moment is about safety. */}
      {coach.tone !== "safety" && <AdBanner placement="results" />}
    </div>
  );
}
