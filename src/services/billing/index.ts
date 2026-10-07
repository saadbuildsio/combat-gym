import { Capacitor } from "@capacitor/core";
import { REVENUECAT_ANDROID_KEY } from "@/config/monetization";
import { NoBillingService, type BillingService } from "./billing-service";

/** Picks the right billing for where the app is running. Loaded lazily so the website never pulls in the store code. */
export async function createBillingService(): Promise<BillingService> {
  if (Capacitor.getPlatform() === "android" && REVENUECAT_ANDROID_KEY) {
    const { RevenueCatBillingService } = await import("./revenuecat-billing-service");
    return new RevenueCatBillingService(REVENUECAT_ANDROID_KEY);
  }
  return new NoBillingService();
}

export type { BillingService, ProOffer, PurchaseOutcome } from "./billing-service";
