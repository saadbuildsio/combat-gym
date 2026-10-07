"use client";

import Link from "next/link";
import { use } from "react";
import { AppShell } from "@/components/app-shell";
import { LessonView } from "@/components/drills/lesson-view";
import { ButtonLink } from "@/components/ui";
import { getLesson } from "@/content/boxing/lessons";

/** Read any unlocked lesson again outside a session. */
export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lesson = getLesson(id);

  return (
    <AppShell>
      {() =>
        lesson ? (
          <div className="mx-auto max-w-lg">
            <Link href="/train" className="text-sm font-semibold text-muted hover:text-foreground">
              ‹ Boxing path
            </Link>
            <div className="mt-4">
              <LessonView lesson={lesson} />
            </div>
            <ButtonLink href="/train/session" className="mt-8 w-full">
              Practise in today&apos;s session
            </ButtonLink>
          </div>
        ) : (
          <p className="text-muted">Lesson not found.</p>
        )
      }
    </AppShell>
  );
}
