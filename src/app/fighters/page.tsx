"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { useLanguage } from "@/components/language-provider";
import { Card, Pill } from "@/components/ui";
import { BOXING_OPPONENTS } from "@/content/boxing/opponents";
import { localizeOpponent } from "@/content/localize";
import type { PlayerProfile } from "@/domain/types";
import { availableOpponents } from "@/domain/finish-session";
import { placedLevelFor } from "@/domain/curriculum";

export default function FightersPage() {
  return <AppShell>{(profile) => <Fighters profile={profile} />}</AppShell>;
}

/** AI opponents: each style teaches a different strategy. */
function Fighters({ profile }: { profile: PlayerProfile }) {
  const openIds = new Set(availableOpponents(profile.totalXp, profile.completedLessonIds, placedLevelFor(profile.onboarding?.experience)).map((o) => o.id));
  const { language, t } = useLanguage();

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">{t("fighters.eyebrow")}</p>
        <h1 className="text-3xl font-black">{t("fighters.title")}</h1>
        <p className="mt-1 text-muted">{t("fighters.intro")}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {BOXING_OPPONENTS.map((english) => {
          const o = localizeOpponent(english, language);
          const open = openIds.has(o.id);
          const body = (
            <Card className={`h-full ${open ? "hover:ring-1 hover:ring-accent" : "opacity-60"}`}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-black">{o.name}</h2>
                {open ? (
                  <Pill tone="accent">{t("fighters.fight")}</Pill>
                ) : (
                  <Pill>{o.availableInMvp ? t("common.lockedLevel", { level: o.unlockLevel }) : t("common.lockedComingSoon")}</Pill>
                )}
              </div>
              <p className="mt-2 text-muted">{o.description}</p>
              <p className="mt-3 text-sm">
                <span className="font-bold">{t("fighters.teaches")} </span>
                {o.lesson}
              </p>
            </Card>
          );
          return open ? (
            <Link key={o.id} href={`/fighters/${o.id}`} className="block">
              {body}
            </Link>
          ) : (
            <div key={o.id}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
