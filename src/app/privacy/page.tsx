"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { PRIVACY_UPDATED, privacySections } from "@/content/privacy";

/** Public privacy policy. Works without a profile, so Google Play reviewers and visitors can read it. */
export default function PrivacyPage() {
  const { language, t } = useLanguage();
  return (
    <main className="mx-auto max-w-2xl space-y-5 px-4 py-10">
      <Link href="/" className="text-sm text-muted">
        ‹ Combat Gym
      </Link>
      <h1 className="text-3xl font-black">{t("privacy.title")}</h1>
      <p className="text-sm text-muted">{t("privacy.updated", { date: PRIVACY_UPDATED })}</p>
      {privacySections(language).map((s) => (
        <section key={s.heading}>
          <h2 className="text-lg font-bold">{s.heading}</h2>
          {s.body.map((p) => (
            <p key={p} className="mt-2 text-muted">
              {p}
            </p>
          ))}
        </section>
      ))}
    </main>
  );
}
