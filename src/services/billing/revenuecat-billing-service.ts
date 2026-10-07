import { Purchases, type CustomerInfo, type PurchasesPackage } from "@revenuecat/purchases-capacitor";
import { PRO_ENTITLEMENT_ID } from "@/config/monetization";
import type { BillingService, ProOffer, PurchaseOutcome } from "./billing-service";

/** Android app: Google Play Billing through RevenueCat. Users are anonymous; Google Play links the purchase to their account. */
export class RevenueCatBillingService implements BillingService {
  readonly canPurchase = true;
  private ready: Promise<void>;

  constructor(apiKey: string) {
    this.ready = Purchases.configure({ apiKey });
  }

  private static hasPro(info: CustomerInfo): boolean {
    return info.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
  }

  private async currentPackage(): Promise<PurchasesPackage | null> {
    await this.ready;
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages[0] ?? null;
  }

  async isPro(): Promise<boolean> {
    await this.ready;
    const { customerInfo } = await Purchases.getCustomerInfo();
    return RevenueCatBillingService.hasPro(customerInfo);
  }

  async getOffer(): Promise<ProOffer | null> {
    const pkg = await this.currentPackage();
    return pkg ? { priceText: pkg.product.priceString, period: pkg.product.subscriptionPeriod } : null;
  }

  async purchase(): Promise<PurchaseOutcome> {
    const pkg = await this.currentPackage();
    if (!pkg) return "failed";
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      return RevenueCatBillingService.hasPro(customerInfo) ? "pro" : "failed";
    } catch (error) {
      // RevenueCat marks a closed payment sheet with userCancelled.
      return (error as { userCancelled?: boolean })?.userCancelled ? "cancelled" : "failed";
    }
  }

  async restore(): Promise<boolean> {
    await this.ready;
    const { customerInfo } = await Purchases.restorePurchases();
    return RevenueCatBillingService.hasPro(customerInfo);
  }

  async managementUrl(): Promise<string | null> {
    await this.ready;
    const { customerInfo } = await Purchases.getCustomerInfo();
    return customerInfo.managementURL;
  }

  onChange(listener: (isPro: boolean) => void): void {
    void this.ready.then(() => Purchases.addCustomerInfoUpdateListener((info) => listener(RevenueCatBillingService.hasPro(info))));
  }
}
