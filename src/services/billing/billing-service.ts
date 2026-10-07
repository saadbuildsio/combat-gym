/**
 * Pro subscriptions. On Android, Google Play handles the payment and RevenueCat checks it on its servers,
 * so Pro cannot be switched on by editing the phone's storage. On the website there is nothing to buy:
 * the Go Pro screen points people to the Android app.
 */

export interface ProOffer {
  /** Price as the store shows it in the user's currency, e.g. "Rs 450.00" or "$2.99". */
  priceText: string;
  /** ISO 8601 period such as "P1M" (monthly) or "P1Y" (yearly), when known. */
  period: string | null;
}

export type PurchaseOutcome = "pro" | "cancelled" | "failed";

export interface BillingService {
  /** True when this device can buy Pro (the Android app with a store key configured). */
  readonly canPurchase: boolean;
  isPro(): Promise<boolean>;
  getOffer(): Promise<ProOffer | null>;
  purchase(): Promise<PurchaseOutcome>;
  /** Finds a subscription bought earlier with the same Google account, e.g. on a new phone. */
  restore(): Promise<boolean>;
  /** Google Play's page for cancelling or changing the subscription. */
  managementUrl(): Promise<string | null>;
  onChange(listener: (isPro: boolean) => void): void;
}

/** Website: no purchases. */
export class NoBillingService implements BillingService {
  readonly canPurchase = false;
  async isPro() {
    return false;
  }
  async getOffer() {
    return null;
  }
  async purchase(): Promise<PurchaseOutcome> {
    return "failed";
  }
  async restore() {
    return false;
  }
  async managementUrl() {
    return null;
  }
  onChange() {}
}
