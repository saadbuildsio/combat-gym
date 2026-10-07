"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { FightIQMatch } from "@/components/block-runner";
import { useT } from "@/components/language-provider";
import { useProfile } from "@/components/profile-provider";
import { SessionResults } from "@/components/session-results";
import { getOpponent } from "@/content/boxing/opponents";
import { availableOpponents, finishSession } from "@/domain/finish-session";
import type { SessionOutcome } from "@/domain/progress";
import type { DrillResult, PlayerProfile, SkillRatings } from "@/domain/types";
import { todayKey } from "@/lib/today";
import { track } from "@/services/analytics/events";

const WIN_SCORE = 70;

export function FightClient({ id }: { id: string }) {
  return <AppShell>{(profile) => <Fight opponentId={id} profile={profile} />}</AppShell>;
}

/** A standalone Fight IQ match against one opponent. */
function Fight({ opponentId, profile }: { opponentId: string; profile: PlayerProfile }) {
  const { saveProfile } = useProfile();
  const t = useT();
  const [skillsBefore] = useState<SkillRatings>(() => profile.skills);
  const [outcome, setOutcome] = useState<SessionOutcome | null>(null);
  const opponent = getOpponent(opponentId);
  const allowed = availableOpponents(profile.totalXp).some((o) => o.id === opponentId);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !allowed) return;
    started.current = true;
    track("opponent_started", { opponent: opponentId });
  }, [allowed, opponentId]);

  if (!opponent || !allowed) {
    return (
      <p className="text-muted">
        {t("fighters.locked")}{" "}
        <Link href="/fighters" className="text-accent">
          {t("fighters.backToFighters")}
        </Link>
      </p>
    );
  }

  const done = async (result: DrillResult) => {
    const out = finishSession(profile, {
      planId: `fight-${opponentId}-${Date.now()}`,
      date: todayKey(),
      blocks: [{ result, minutes: 3 }],
      completedLessonIds: [],
    });
    await saveProfile(out.profile);
    if ((result.scores.fightIQ ?? 0) >= WIN_SCORE) track("opponent_defeated", { opponent: opponentId });
    setOutcome(out);
  };

  if (outcome) return <SessionResults outcome={outcome} skillsBefore={skillsBefore} />;

  return (
    <div className="mx-auto max-w-lg">
      <Link href="/fighters" className="text-sm font-semibold text-muted hover:text-foreground">
        {t("fighters.back")}
      </Link>
      <div className="mt-6">
        <FightIQMatch opponentId={opponent.id} drillId="fightiq-opponent" onDone={done} />
      </div>
    </div>
  );
}
