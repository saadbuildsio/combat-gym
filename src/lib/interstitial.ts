import { shouldShowInterstitial, type Plan } from "@/domain/monetization";
import { showInterstitial } from "@/services/ads/ads-service";
import { track } from "@/services/analytics/events";

const LAST_SHOWN_KEY = "combat-gym:last-interstitial";

/** After a finished session: shows a full-screen ad if the free-plan rules allow it. */
export async function maybeShowSessionInterstitial(input: { plan: Plan; sessionsCompleted: number; reportedPain: boolean }): Promise<void> {
  let lastShownAt: Date | null = null;
  try {
    const saved = localStorage.getItem(LAST_SHOWN_KEY);
    lastShownAt = saved ? new Date(saved) : null;
  } catch {
    // ignore
  }
  const now = new Date();
  if (!shouldShowInterstitial({ ...input, lastShownAt, now })) return;
  if (await showInterstitial()) {
    track("ad_interstitial_shown");
    try {
      localStorage.setItem(LAST_SHOWN_KEY, now.toISOString());
    } catch {
      // ignore
    }
  }
}
