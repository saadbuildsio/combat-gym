"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { fill, LANGUAGE_STORAGE_KEY, type Language } from "@/i18n/language";
import { en, type MessageKey } from "@/i18n/messages/en";
import { roman } from "@/i18n/messages/roman";

const MESSAGES = { en, roman } as const;

interface LanguageContextValue {
  language: Language;
  /** False until the player has picked a language on this device. */
  chosen: boolean;
  setLanguage: (language: Language) => void;
  t: (key: MessageKey, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/** Keeps the chosen language on this device and gives every screen a `t()` for its wording. */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [chosen, setChosen] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "en" || saved === "roman") setLanguageState(saved);
      else setChosen(false);
    } catch {
      // Storage blocked: stay in English.
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "roman" ? "ur-Latn" : "en";
  }, [language]);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    setChosen(true);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback((key: MessageKey, values?: Record<string, string | number>) => fill(MESSAGES[language][key] ?? en[key], values), [language]);

  const value = useMemo(() => ({ language, chosen, setLanguage, t }), [language, chosen, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

/** Shortcut for screens that only need wording. */
export function useT() {
  return useLanguage().t;
}
