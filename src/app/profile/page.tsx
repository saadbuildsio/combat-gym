"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdBanner } from "@/components/ad-banner";
import { usePlan } from "@/components/plan-provider";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { LanguagePicker } from "@/components/language-picker";
import { useLanguage, useT } from "@/components/language-provider";
import { useProfile } from "@/components/profile-provider";
import { Button, Card, Pill, SectionTitle } from "@/components/ui";
import { ACHIEVEMENTS } from "@/content/achievements";
import { localizeAchievement, localizeSafety } from "@/content/localize";
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
  const { language, t } = useLanguage();
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
            {t("profile.levelAndRank", { level: level.level, rank: t(level.titleKey) })}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Pill tone="accent">🔥 {t("common.streak", { count: streak })}</Pill>
            <Pill>{t("profile.boxing")}</Pill>
            <Pill>{profile.plan === "pro" ? t("profile.pro") : t("profile.freePlan")}</Pill>
          </div>
        </div>
      </Card>

      <ProCard />

      <Card>
        <SectionTitle>{t("language.setting")}</SectionTitle>
        <div className="mt-3">
          <LanguagePicker />
        </div>
      </Card>

      <Card>
        <SectionTitle>{t("common.achievements")}</SectionTitle>
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
          {ACHIEVEMENTS.map((english) => {
            const a = localizeAchievement(english, language);
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
        <SectionTitle>{t("profile.equipment")}</SectionTitle>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          {localizeSafety("equipment", EQUIPMENT_GUIDANCE, language).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">{localizeSafety("disclaimer", SAFETY_DISCLAIMER, language)}</p>
      </Card>

      <Card>
        <SectionTitle>{t("profile.data")}</SectionTitle>
        <p className="mt-2 text-sm text-muted">{t("profile.dataNote")}</p>
        {confirmReset ? (
          <div className="mt-4 flex gap-3">
            <Button
              variant="danger"
              onClick={async () => {
                await resetProfile();
                router.replace("/welcome");
              }}
            >
              {t("profile.confirmDelete")}
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              {t("common.cancel")}
            </Button>
          </div>
        ) : (
          <Button variant="danger" className="mt-4" onClick={() => setConfirmReset(true)}>
            {t("profile.reset")}
          </Button>
        )}
        <p className="mt-4 text-xs">
          <Link href="/privacy" className="text-muted underline">
            {t("privacy.link")}
          </Link>
        </p>
      </Card>
      <AdBanner placement="profile" />
    </div>
  );
}

/** Free: invite to Pro. Pro: show it is active. */
function ProCard() {
  const t = useT();
  const { plan } = usePlan();
  return (
    <Link href="/pro" className="flex items-center justify-between rounded-2xl border border-accent/40 bg-accent/10 p-5">
      <span>
        <span className="block text-lg font-black">{plan === "pro" ? t("pro.youArePro") : t("pro.cardTitle")}</span>
        <span className="text-sm text-muted">{plan === "pro" ? t("pro.cardActive") : t("pro.cardBody")}</span>
      </span>
      <span aria-hidden className="text-2xl text-muted">
        ›
      </span>
    </Link>
  );
}
