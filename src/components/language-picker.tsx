"use client";

import { usePathname } from "next/navigation";
import { LANGUAGES } from "@/i18n/language";
import { useLanguage } from "./language-provider";

/** Two big buttons: English or Roman Urdu. Used on the first screen and in the profile. */
export function LanguagePicker({ onPicked }: { onPicked?: () => void }) {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="grid grid-cols-2 gap-3" role="radiogroup">
      {LANGUAGES.map((l) => (
        <button
          key={l.id}
          type="button"
          role="radio"
          aria-checked={language === l.id}
          onClick={() => {
            setLanguage(l.id);
            onPicked?.();
          }}
          className={`rounded-2xl border-2 p-4 text-left transition ${
            language === l.id ? "border-accent bg-accent/10" : "border-surface-3 bg-surface hover:border-muted"
          }`}
        >
          <span className="block text-lg font-black">{l.label}</span>
          <span className="block text-sm text-muted">{l.sample}</span>
        </button>
      ))}
    </div>
  );
}

/** Full-screen first step for a new device: pick a language before anything else. */
export function LanguageGate({ children }: { children: React.ReactNode }) {
  const { chosen } = useLanguage();
  const pathname = usePathname();
  // The privacy policy must open straight away for store reviewers and visitors.
  if (chosen || pathname?.startsWith("/privacy")) return <>{children}</>;
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-10">
      <p className="text-sm font-black tracking-tight">
        COMBAT <span className="text-accent">GYM</span>
      </p>
      <h1 className="mt-6 text-3xl font-black">Choose your language</h1>
      <p className="mt-1 text-xl font-bold text-muted">Apni zubaan chunein</p>
      <div className="mt-8">
        <LanguagePicker />
      </div>
    </main>
  );
}
