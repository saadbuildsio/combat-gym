"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ADS_ARE_TEST } from "@/config/monetization";
import { showsAds, type BannerPlacement } from "@/domain/monetization";
import { removeBanner, showBanner, watchBanner, type BannerStatus } from "@/services/ads/ads-service";
import { useT } from "./language-provider";
import { usePlan } from "./plan-provider";

/**
 * Banner ad for free players in the Android app. AdMob draws the ad itself, fixed just above the bottom menu;
 * this component keeps room at the end of the page so the ad never hides content, and offers "Remove ads".
 * Renders nothing on the website and for Pro players.
 */
export function AdBanner({ placement }: { placement: BannerPlacement }) {
  const { plan, isApp } = usePlan();
  const t = useT();
  const [status, setStatus] = useState<BannerStatus | null>(null);
  const active = isApp && showsAds(plan);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let stopWatching = () => {};
    void watchBanner((s) => {
      if (!cancelled) setStatus(s);
    }).then((stop) => {
      if (cancelled) stop();
      else stopWatching = stop;
      return showBanner();
    });
    return () => {
      cancelled = true;
      stopWatching();
      setStatus(null);
      void removeBanner();
    };
  }, [active, placement]);

  if (!active) return null;
  return (
    <div className="text-center" data-ad-placement={placement}>
      <Link href="/pro" className="text-xs font-semibold text-muted underline">
        {t("pro.removeAds")}
      </Link>
      {/* Test builds only: say why no ad is showing, so problems can be fixed from a screenshot. */}
      {ADS_ARE_TEST && status && status.state !== "loaded" && (
        <p className="mt-1 text-[10px] text-muted">Test ad: {status.state === "failed" ? `failed (${status.reason})` : "loading…"}</p>
      )}
      {/* Room for the fixed banner, so the last content on the page is not hidden behind it. */}
      {status?.state === "loaded" && <div aria-hidden style={{ height: status.heightDp + 8 }} />}
    </div>
  );
}
