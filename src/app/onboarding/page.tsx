"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useT } from "@/components/language-provider";
import { useProfile } from "@/components/profile-provider";
import { Button, Card, ProgressBar } from "@/components/ui";
import { buildStartingProgram, type StartingProgram } from "@/domain/onboarding";
import { completeOnboarding } from "@/domain/progress";
import type { ExperienceLevel, MinutesPerDay, TrainingGoal } from "@/domain/types";
import type { MessageKey } from "@/i18n/messages/en";
import { track } from "@/services/analytics/events";

const EXPERIENCE: { value: ExperienceLevel; label: MessageKey; hint: MessageKey }[] = [
  { value: "complete_beginner", label: "experience.complete_beginner", hint: "experience.complete_beginner.hint" },
  { value: "beginner", label: "experience.beginner", hint: "experience.beginner.hint" },
  { value: "intermediate", label: "experience.intermediate", hint: "experience.intermediate.hint" },
  { value: "advanced", label: "experience.advanced", hint: "experience.advanced.hint" },
];

const GOALS: { value: TrainingGoal; label: MessageKey }[] = [
  { value: "learn_boxing", label: "goal.learn_boxing" },
  { value: "fitness", label: "goal.fitness" },
  { value: "improve_technique", label: "goal.improve_technique" },
  { value: "competition_prep", label: "goal.competition_prep" },
  { value: "fun", label: "goal.fun" },
];

const MINUTES: MinutesPerDay[] = [5, 10, 15, 30, 45];

/** Three questions, then a personalised starting program. */
export default function OnboardingPage() {
  const router = useRouter();
  const { profile, loading, saveProfile } = useProfile();
  const t = useT();
  const [step, setStep] = useState(0);
  const [experience, setExperience] = useState<ExperienceLevel | null>(null);
  const [goal, setGoal] = useState<TrainingGoal | null>(null);
  const [program, setProgram] = useState<StartingProgram | null>(null);

  useEffect(() => {
    if (!loading && !profile?.safetyAcknowledgedAt) router.replace("/welcome");
  }, [loading, profile, router]);

  if (!profile) return null;

  const chooseMinutes = async (minutesPerDay: MinutesPerDay) => {
    if (!experience || !goal) return;
    const answers = { experience, goal, minutesPerDay };
    const starting = buildStartingProgram(answers);
    await saveProfile(completeOnboarding(profile, answers, starting.startingXp));
    track("onboarding_complete", { experience, goal, minutesPerDay });
    setProgram(starting);
    setStep(3);
  };

  const option = (selected: boolean) =>
    `w-full rounded-xl border px-4 py-4 text-left transition ${selected ? "border-accent bg-accent/10" : "border-surface-3 bg-surface hover:border-muted"}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-8">
      <ProgressBar value={step} max={3} />
      <p className="mt-2 text-xs text-muted">{step < 3 ? t("onboarding.step", { step: step + 1, total: 3 }) : t("onboarding.ready")}</p>

      {step === 0 && (
        <>
          <h1 className="mt-6 text-3xl font-black">{t("onboarding.experienceQuestion")}</h1>
          <div className="mt-6 space-y-3">
            {EXPERIENCE.map((e) => (
              <button
                key={e.value}
                type="button"
                className={option(experience === e.value)}
                onClick={() => {
                  setExperience(e.value);
                  setStep(1);
                }}
              >
                <span className="block font-bold">{t(e.label)}</span>
                <span className="text-sm text-muted">{t(e.hint)}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="mt-6 text-3xl font-black">{t("onboarding.goalQuestion")}</h1>
          <div className="mt-6 space-y-3">
            {GOALS.map((g) => (
              <button
                key={g.value}
                type="button"
                className={option(goal === g.value)}
                onClick={() => {
                  setGoal(g.value);
                  setStep(2);
                }}
              >
                <span className="font-bold">{t(g.label)}</span>
              </button>
            ))}
          </div>
          <Button variant="ghost" className="mt-4" onClick={() => setStep(0)}>
            {t("common.back")}
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="mt-6 text-3xl font-black">{t("onboarding.timeQuestion")}</h1>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {MINUTES.map((m) => (
              <button key={m} type="button" className={option(false)} onClick={() => chooseMinutes(m)}>
                <span className="text-2xl font-black">{m === 45 ? "45+" : m}</span>
                <span className="ml-1 text-sm text-muted">{t("common.minUnit")}</span>
              </button>
            ))}
          </div>
          <Button variant="ghost" className="mt-4" onClick={() => setStep(1)}>
            {t("common.back")}
          </Button>
        </>
      )}

      {step === 3 && program && (
        <>
          <h1 className="mt-6 text-3xl font-black">{t("onboarding.programReady", { name: profile.displayName })}</h1>
          <Card className="mt-6">
            <p className="text-lg">{t(program.welcomeMessage)}</p>
            {program.advisory && <p className="mt-4 rounded-xl bg-surface-2 p-4 text-sm text-muted">{t(program.advisory)}</p>}
          </Card>
          <Button className="mt-8 w-full" onClick={() => router.push("/")}>
            {t("onboarding.enterGym")}
          </Button>
        </>
      )}
    </main>
  );
}
