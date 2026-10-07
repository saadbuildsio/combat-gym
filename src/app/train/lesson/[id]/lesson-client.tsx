"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { LessonView } from "@/components/drills/lesson-view";
import { useT } from "@/components/language-provider";
import { ButtonLink } from "@/components/ui";
import { getLesson } from "@/content/boxing/lessons";

/** Read any unlocked lesson again outside a session. */
export function LessonClient({ id }: { id: string }) {
  const lesson = getLesson(id);
  const t = useT();

  return (
    <AppShell>
      {() =>
        lesson ? (
          <div className="mx-auto max-w-lg">
            <Link href="/train" className="text-sm font-semibold text-muted hover:text-foreground">
              {t("train.backToPath")}
            </Link>
            <div className="mt-4">
              <LessonView lesson={lesson} />
            </div>
            <ButtonLink href="/train/session" className="mt-8 w-full">
              {t("lesson.practise")}
            </ButtonLink>
          </div>
        ) : (
          <p className="text-muted">{t("lesson.notFound")}</p>
        )
      }
    </AppShell>
  );
}
