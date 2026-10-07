/**
 * Ads and Pro settings. Values come from NEXT_PUBLIC_* build variables so the real IDs are set at build time,
 * not written in code. Until they are set, Google's public TEST ad units are used, which never pay out.
 * None of these are secrets: AdMob unit IDs and the RevenueCat public SDK key are meant to ship inside the app.
 */

/** Google's official AdMob test IDs (https://developers.google.com/admob/android/test-ads). */
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_INTERSTITIAL_ID = "ca-app-pub-3940256099942544/1033173712";

export const ADMOB_BANNER_ID = process.env.NEXT_PUBLIC_ADMOB_BANNER_ID || TEST_BANNER_ID;
export const ADMOB_INTERSTITIAL_ID = process.env.NEXT_PUBLIC_ADMOB_INTERSTITIAL_ID || TEST_INTERSTITIAL_ID;
/** True while the test IDs are in use: ads are labelled "Test Ad" and earn nothing. */
export const ADS_ARE_TEST = !process.env.NEXT_PUBLIC_ADMOB_BANNER_ID;

/** RevenueCat public Android SDK key ("goog_..."). Empty means purchases are switched off. */
export const REVENUECAT_ANDROID_KEY = process.env.NEXT_PUBLIC_REVENUECAT_ANDROID_KEY || "";
/** The entitlement id set up in RevenueCat that means "this user has Pro". */
export const PRO_ENTITLEMENT_ID = "pro";

/** Height of our bottom navigation bar in dp, so the banner sits just above it. */
export const BOTTOM_NAV_HEIGHT_DP = 64;
