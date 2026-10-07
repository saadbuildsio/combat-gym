"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProfile } from "@/components/profile-provider";
import { Button, Card } from "@/components/ui";
import { MINIMUM_AGE, SAFETY_CHECKLIST, SAFETY_DISCLAIMER } from "@/content/safety";
import { createProfile } from "@/domain/progress";
import { track } from "@/services/analytics/events";

/** First screen for a new player: name, age confirmation and safety rules. */
export default function WelcomePage() {
  const router = useRouter();
  const { profile, saveProfile } = useProfile();
  const [name, setName] = useState(profile?.displayName ?? "");
  const [ageOk, setAgeOk] = useState(false);
  const [safetyOk, setSafetyOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 24) {
      setError("Enter a name between 2 and 24 characters.");
      return;
    }
    const now = new Date();
    const base = profile ?? createProfile(crypto.randomUUID(), trimmed, now);
    await saveProfile({ ...base, displayName: trimmed, safetyAcknowledgedAt: now.toISOString() });
    if (!profile) track("user_signup");
    track("safety_acknowledged");
    router.push("/onboarding");
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-10">
      <p className="text-sm font-black tracking-tight">
        COMBAT <span className="text-accent">GYM</span>
      </p>
      <h1 className="mt-6 text-4xl font-black leading-tight">
        Your boxing gym,
        <br />
        at home.
      </h1>
      <p className="mt-3 text-muted">Learn the fundamentals, get scored on real drills, and watch yourself improve.</p>

      <label className="mt-8 block text-sm font-semibold" htmlFor="name">
        What should we call you?
      </label>
      <input
        id="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError(null);
        }}
        maxLength={24}
        autoComplete="nickname"
        className="mt-2 w-full rounded-xl border border-surface-3 bg-surface px-4 py-3 text-lg outline-none focus:border-accent"
        placeholder="Your name"
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      <Card className="mt-6">
        <h2 className="font-bold">Before you train</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {SAFETY_CHECKLIST.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="text-accent">
                •
              </span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-muted">{SAFETY_DISCLAIMER}</p>
      </Card>

      <div className="mt-6 space-y-3 text-sm">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--accent)]" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} />
          <span>I am {MINIMUM_AGE} or older.</span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1 size-5 accent-[var(--accent)]" checked={safetyOk} onChange={(e) => setSafetyOk(e.target.checked)} />
          <span>I have read the safety rules and will stop if anything hurts.</span>
        </label>
      </div>

      <Button className="mt-8 w-full" disabled={!ageOk || !safetyOk || name.trim().length < 2} onClick={start}>
        Let&apos;s go
      </Button>
    </main>
  );
}
