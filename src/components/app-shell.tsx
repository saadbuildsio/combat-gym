"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { PlayerProfile } from "@/domain/types";
import type { MessageKey } from "@/i18n/messages/en";
import { useT } from "./language-provider";
import { useProfile } from "./profile-provider";

const NAV: { href: string; label: MessageKey; icon: string }[] = [
  { href: "/", label: "nav.home", icon: "🏠" },
  { href: "/train", label: "nav.train", icon: "🥊" },
  { href: "/challenges", label: "nav.challenges", icon: "🎯" },
  { href: "/fighters", label: "nav.fighters", icon: "🤖" },
  { href: "/progress", label: "nav.progress", icon: "📈" },
  { href: "/profile", label: "nav.profile", icon: "👤" },
];

/**
 * Page frame with navigation (bottom bar on phones, top bar on larger screens).
 * Also sends new players to the welcome flow before they can see any other screen.
 */
export function AppShell({ children }: { children: (profile: PlayerProfile) => React.ReactNode }) {
  const { profile, loading } = useProfile();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const ready = !!profile?.onboarding && !!profile.safetyAcknowledgedAt;

  useEffect(() => {
    if (loading || ready) return;
    router.replace(profile?.safetyAcknowledgedAt ? "/onboarding" : "/welcome");
  }, [loading, ready, profile, router]);

  if (loading || !ready || !profile) {
    return <div className="flex min-h-dvh items-center justify-center text-muted">{t("common.loading")}</div>;
  }

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-dvh pb-24 md:pb-0">
      <header className="sticky top-0 z-10 hidden border-b border-surface-2 bg-background/90 backdrop-blur md:block">
        <nav className="mx-auto flex max-w-4xl items-center gap-1 px-4 py-3" aria-label={t("nav.main")}>
          <span className="mr-4 font-black tracking-tight">
            COMBAT <span className="text-accent">GYM</span>
          </span>
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${isActive(item.href) ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"}`}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">{children(profile)}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-6 border-t border-surface-2 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label={t("nav.main")}
      >
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold ${isActive(item.href) ? "text-accent" : "text-muted"}`}
          >
            <span aria-hidden className="text-lg">
              {item.icon}
            </span>
            {t(item.label)}
          </Link>
        ))}
      </nav>
    </div>
  );
}
