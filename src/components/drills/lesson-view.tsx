import type { Lesson } from "@/domain/types";
import { DemoVideo } from "../demo-video";

/** The LEARN step: what it is, when to use it, how to do it, mistakes to avoid, safety. */
export function LessonView({ lesson }: { lesson: Lesson }) {
  return (
    <article className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">Level {lesson.level} lesson</p>
        <h2 className="mt-1 text-3xl font-black">{lesson.title}</h2>
        <p className="mt-2 text-lg">{lesson.whatItIs}</p>
      </div>
      <DemoVideo id={lesson.id} title={lesson.title} />
      <Section title="When to use it">
        <p>{lesson.whenToUse}</p>
      </Section>
      <Section title="How to do it">
        <ol className="list-decimal space-y-2 pl-5">
          {lesson.mechanics.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ol>
      </Section>
      <Section title="Common mistakes">
        <ul className="space-y-2">
          {lesson.commonMistakes.map((m) => (
            <li key={m} className="flex gap-2">
              <span aria-hidden className="text-danger">
                ✕
              </span>
              {m}
            </li>
          ))}
        </ul>
      </Section>
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
        <p className="font-bold">Safety</p>
        <ul className="mt-1 space-y-1">
          {lesson.safetyNotes.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
      <p className="text-xs text-muted">Southpaw (right foot forward)? Mirror every instruction.</p>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted">{title}</h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
