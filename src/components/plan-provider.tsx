"use client";

import { Capacitor } from "@capacitor/core";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Plan } from "@/domain/monetization";
import { createBillingService, type BillingService, type ProOffer, type PurchaseOutcome } from "@/services/billing";
import { track } from "@/services/analytics/events";

/** Remembered only to avoid flashing ads at a Pro user while the store check runs; the store's answer always wins. */
const PLAN_CACHE_KEY = "combat-gym:plan";

interface PlanContextValue {
  plan: Plan;
  /** True inside the Android app, where Pro can be bought. */
  isApp: boolean;
  canPurchase: boolean;
  offer: ProOffer | null;
  purchase: () => Promise<PurchaseOutcome>;
  restore: () => Promise<boolean>;
  manageUrl: () => Promise<string | null>;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlanState] = useState<Plan>("free");
  const [offer, setOffer] = useState<ProOffer | null>(null);
  const [canPurchase, setCanPurchase] = useState(false);
  const billing = useRef<BillingService | null>(null);
  const isApp = Capacitor.isNativePlatform();

  const setPlan = useCallback((next: Plan) => {
    setPlanState(next);
    try {
      localStorage.setItem(PLAN_CACHE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(PLAN_CACHE_KEY) === "pro") setPlanState("pro");
    } catch {
      // ignore
    }
    let active = true;
    createBillingService().then(async (service) => {
      billing.current = service;
      if (!active) return;
      setCanPurchase(service.canPurchase);
      service.onChange((pro) => setPlan(pro ? "pro" : "free"));
      try {
        const [pro, currentOffer] = await Promise.all([service.isPro(), service.getOffer()]);
        if (!active) return;
        setPlan(pro ? "pro" : "free");
        setOffer(currentOffer);
      } catch {
        // Offline: keep the remembered plan until the store answers.
      }
    });
    return () => {
      active = false;
    };
  }, [setPlan]);

  const purchase = useCallback(async () => {
    track("pro_purchase_started");
    const outcome = (await billing.current?.purchase()) ?? "failed";
    if (outcome === "pro") {
      setPlan("pro");
      track("pro_purchased");
    }
    return outcome;
  }, [setPlan]);

  const restore = useCallback(async () => {
    const pro = (await billing.current?.restore()) ?? false;
    if (pro) setPlan("pro");
    return pro;
  }, [setPlan]);

  const manageUrl = useCallback(async () => (await billing.current?.managementUrl()) ?? null, []);

  const value = useMemo(
    () => ({ plan, isApp, canPurchase, offer, purchase, restore, manageUrl }),
    [plan, isApp, canPurchase, offer, purchase, restore, manageUrl],
  );
  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside PlanProvider");
  return ctx;
}
