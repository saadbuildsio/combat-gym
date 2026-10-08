import { Capacitor } from "@capacitor/core";
import { ADMOB_BANNER_ID, ADMOB_INTERSTITIAL_ID, ADS_ARE_TEST, BOTTOM_NAV_HEIGHT_DP } from "@/config/monetization";

/**
 * AdMob ads in the Android app. On the website every call does nothing.
 * Callers decide WHETHER to show an ad (see domain/monetization.ts); this only shows it.
 */

const isAndroid = () => Capacitor.getPlatform() === "android";

let started: Promise<boolean> | null = null;

async function admob() {
  return (await import("@capacitor-community/admob")).AdMob;
}

/** Starts AdMob once: asks for privacy consent where the law requires it, then initialises. Returns whether ads may load. */
export function startAds(): Promise<boolean> {
  if (!isAndroid()) return Promise.resolve(false);
  started ??= (async () => {
    try {
      const AdMob = await admob();
      const { MaxAdContentRating } = await import("@capacitor-community/admob");
      // Our players are 16+: keep ads to the Teen rating at most. Gambling, dating and alcohol are blocked in the AdMob dashboard.
      await AdMob.initialize({ initializeForTesting: ADS_ARE_TEST, maxAdContentRating: MaxAdContentRating.Teen });
      const consent = await AdMob.requestConsentInfo();
      if (consent.isConsentFormAvailable && !consent.canRequestAds) {
        const after = await AdMob.showConsentForm();
        return after.canRequestAds;
      }
      return consent.canRequestAds;
    } catch {
      // No ads is always a safe fallback.
      return false;
    }
  })();
  return started;
}

export async function showBanner(): Promise<boolean> {
  if (!(await startAds())) return false;
  try {
    const AdMob = await admob();
    const { BannerAdPosition, BannerAdSize } = await import("@capacitor-community/admob");
    await AdMob.showBanner({
      adId: ADMOB_BANNER_ID,
      isTesting: ADS_ARE_TEST,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      // Sit just above our bottom navigation bar instead of covering it.
      margin: BOTTOM_NAV_HEIGHT_DP,
    });
    return true;
  } catch {
    return false;
  }
}

export async function removeBanner(): Promise<void> {
  if (!isAndroid()) return;
  try {
    await (await admob()).removeBanner();
  } catch {
    // ignore
  }
}

export async function showInterstitial(): Promise<boolean> {
  if (!(await startAds())) return false;
  try {
    const AdMob = await admob();
    await AdMob.prepareInterstitial({ adId: ADMOB_INTERSTITIAL_ID, isTesting: ADS_ARE_TEST });
    await AdMob.showInterstitial();
    return true;
  } catch {
    return false;
  }
}

export type BannerStatus = { state: "loading" } | { state: "loaded"; heightDp: number } | { state: "failed"; reason: string };

/** Reports whether the banner really loaded, so the page only leaves room for it when it is there (and test builds can show why not). */
export async function watchBanner(onStatus: (status: BannerStatus) => void): Promise<() => void> {
  if (!isAndroid()) return () => {};
  const AdMob = await admob();
  const { BannerAdPluginEvents } = await import("@capacitor-community/admob");
  onStatus({ state: "loading" });
  const handles = await Promise.all([
    AdMob.addListener(BannerAdPluginEvents.SizeChanged, (size) => {
      if (size.height > 0) onStatus({ state: "loaded", heightDp: size.height });
    }),
    AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => onStatus({ state: "failed", reason: `${error.code}: ${error.message}` })),
  ]);
  return () => handles.forEach((h) => void h.remove());
}
