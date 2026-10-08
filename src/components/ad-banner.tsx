"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ADS_ARE_TEST } from "@/config/monetization";
import { showsAds, type BannerPlacement } from "@/domain/monetization";
import { adsStage, lastBannerError, setBannerWanted, watchBanner, type BannerStatus } from "@/services/ads/ads-service";
import { useT } from "./language-provider";
import { usePlan } from "./plan-provider";

const BUILD = process.env.NEXT_PUBLIC_BUILD_NUMBER || "local";

/**
 * Banner ad for free players in the Android app. AdMob draws the ad itself, fixed just above the bottom menu;
 * this component asks for it on this screen, keeps room at the end of the page so it never hides content,
 * and offers "Remove ads". Renders nothing on the website and for Pro players.
 */
export function AdBanner({ placement }: { placement: BannerPlacement }) {
  const { plan, isApp } = usePlan();
  const t = useT();
  const [status, setStatus] = useState<BannerStatus | null>(null);
  const [debug, setDebug] = useState("");
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
    });
    void setBannerWanted(true).then((ok) => {
      if (!cancelled) setDebug(ok ? "requested" : `not shown (${adsStage}${lastBannerError ? `; ${lastBannerError}` : ""})`);
    });
    return () => {
      cancelled = true;
      stopWatching();
      void setBannerWanted(false);
    };
  }, [active, placement]);

  if (!active) return null;
  const loaded = status?.state === "loaded";
  return (
    <div className="text-center" data-ad-placement={placement}>
      <Link href="/pro" className="text-xs font-semibold text-muted underline">
        {t("pro.removeAds")}
      </Link>
      {/* Test builds only: say what the ad is doing, so problems can be fixed from a screenshot. */}
      {ADS_ARE_TEST && (
        <p className="mt-1 text-[11px] text-muted">
          Build {BUILD} · ad {status ? (status.state === "failed" ? `failed (${status.reason})` : status.state) : "waiting"} · {debug || adsStage}
        </p>
      )}
      {/* Room for the fixed banner, so the last content on the page is not hidden behind it. */}
      {loaded && <div aria-hidden style={{ height: status.heightDp + 8 }} />}
    </div>
  );
}
