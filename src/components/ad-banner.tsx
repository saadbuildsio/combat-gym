"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { showsAds, type BannerPlacement } from "@/domain/monetization";
import { removeBanner, showBanner } from "@/services/ads/ads-service";
import { useT } from "./language-provider";
import { usePlan } from "./plan-provider";

/**
 * Banner ad for free players in the Android app. The ad itself is drawn by AdMob just above the bottom bar;
 * this keeps room for it so it never covers page content, and offers a "Remove ads" link.
 * Renders nothing on the website and for Pro players.
 */
export function AdBanner({ placement }: { placement: BannerPlacement }) {
  const { plan, isApp } = usePlan();
  const t = useT();
  const [shown, setShown] = useState(false);
  const active = isApp && showsAds(plan);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    showBanner().then((ok) => {
      if (!cancelled) setShown(ok);
    });
    return () => {
      cancelled = true;
      setShown(false);
      void removeBanner();
    };
  }, [active, placement]);

  if (!active) return null;
  return (
    <div className="text-center" data-ad-placement={placement}>
      <Link href="/pro" className="text-xs font-semibold text-muted underline">
        {t("pro.removeAds")}
      </Link>
      {/* Space the banner occupies, so the last content on the page stays visible above it. */}
      {shown && <div aria-hidden className="h-16" />}
    </div>
  );
}
