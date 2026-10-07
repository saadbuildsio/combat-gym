"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { useT } from "@/components/language-provider";
import { usePlan } from "@/components/plan-provider";
import { Button, Card } from "@/components/ui";
import { PRO_BENEFITS } from "@/domain/monetization";
import type { MessageKey } from "@/i18n/messages/en";
import { track } from "@/services/analytics/events";

const BENEFIT_KEYS: Record<(typeof PRO_BENEFITS)[number], { title: MessageKey; body: MessageKey; icon: string }> = {
  noAds: { title: "pro.benefitNoAdsTitle", body: "pro.benefitNoAdsBody", icon: "🚫" },
  supportNewSports: { title: "pro.benefitSupportTitle", body: "pro.benefitSupportBody", icon: "🥋" },
};

/** Go Pro: what you get, the price from Google Play, subscribe, restore and manage. */
export default function ProPage() {
  return <AppShell>{() => <GoPro />}</AppShell>;
}

function GoPro() {
  const t = useT();
  const { plan, isApp, canPurchase, offer, purchase, restore, manageUrl } = usePlan();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    track("pro_screen_viewed");
  }, []);

  const buy = async () => {
    setBusy(true);
    setNote(null);
    const outcome = await purchase();
    setBusy(false);
    if (outcome === "failed") setNote(t("pro.purchaseFailed"));
  };

  const doRestore = async () => {
    setBusy(true);
    const found = await restore();
    setBusy(false);
    setNote(found ? t("pro.restored") : t("pro.nothingToRestore"));
  };

  const manage = async () => {
    const url = (await manageUrl()) ?? "https://play.google.com/store/account/subscriptions";
    window.open(url, "_blank", "noopener");
  };

  const period = offer?.period === "P1Y" ? t("pro.perYear") : t("pro.perMonth");

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Combat Gym Pro</p>
        <h1 className="text-3xl font-black">{plan === "pro" ? t("pro.youArePro") : t("pro.title")}</h1>
        <p className="mt-1 text-muted">{t("pro.subtitle")}</p>
      </div>

      <Card className="space-y-4">
        {PRO_BENEFITS.map((b) => (
          <div key={b} className="flex gap-3">
            <span aria-hidden className="text-2xl">
              {BENEFIT_KEYS[b].icon}
            </span>
            <div>
              <p className="font-bold">{t(BENEFIT_KEYS[b].title)}</p>
              <p className="text-sm text-muted">{t(BENEFIT_KEYS[b].body)}</p>
            </div>
          </div>
        ))}
      </Card>

      {plan === "pro" ? (
        <Button variant="secondary" className="w-full" onClick={manage}>
          {t("pro.manage")}
        </Button>
      ) : !isApp ? (
        <Card>
          <p className="font-bold">{t("pro.appOnlyTitle")}</p>
          <p className="mt-1 text-sm text-muted">{t("pro.appOnlyBody")}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {offer && (
            <p className="text-center text-3xl font-black">
              {offer.priceText}
              <span className="text-base font-semibold text-muted"> / {period}</span>
            </p>
          )}
          <Button className="w-full" disabled={busy || !canPurchase || !offer} onClick={buy}>
            {t("pro.subscribe")}
          </Button>
          <Button variant="ghost" className="w-full" disabled={busy || !canPurchase} onClick={doRestore}>
            {t("pro.restore")}
          </Button>
          {!canPurchase && <p className="text-center text-sm text-muted">{t("pro.notReady")}</p>}
          <p className="text-center text-xs text-muted">{t("pro.terms")}</p>
        </div>
      )}

      {note && (
        <p className="text-center text-sm font-semibold" role="status">
          {note}
        </p>
      )}

      <p className="text-center text-xs text-muted">
        <Link href="/privacy" className="underline">
          {t("privacy.link")}
        </Link>
      </p>
    </div>
  );
}
