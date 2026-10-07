import { SPORTS } from "@/content/sports";
import { BOXING_LEVELS } from "@/content/boxing/levels";
import { SAFETY_DISCLAIMER } from "@/content/safety";

/**
 * Phase 1 placeholder: proves content and architecture are wired together.
 * The real Home dashboard is designed and built in Phase 2.
 */
export default function Home() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-widest text-accent">Combat Gym</p>
      <h1 className="mt-2 text-3xl font-black">Learn to box from home.</h1>
      <p className="mt-2 text-muted">Phase 1 build: architecture and content. The full dashboard arrives in Phase 2.</p>

      <h2 className="mt-8 text-lg font-bold">Sports</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {SPORTS.map((sport) => (
          <li key={sport.id} className="rounded-xl bg-surface p-4">
            <p className="text-2xl" aria-hidden>{sport.emoji}</p>
            <p className="mt-1 font-bold">{sport.name}</p>
            <p className={sport.status === "available" ? "text-sm text-accent" : "text-sm text-muted"}>
              {sport.status === "available" ? "Available" : "Coming soon"}
            </p>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-lg font-bold">Boxing path</h2>
      <ol className="mt-3 space-y-2">
        {BOXING_LEVELS.map((level) => (
          <li key={level.level} className="flex items-center justify-between rounded-xl bg-surface p-4">
            <div>
              <p className="font-bold">Level {level.level}: {level.title}</p>
              <p className="text-sm text-muted">{level.goal}</p>
            </div>
            <span className="text-sm text-muted">{level.contentReady ? `${level.lessonIds.length} lessons` : "Locked"}</span>
          </li>
        ))}
      </ol>

      <p className="mt-10 text-xs text-muted">{SAFETY_DISCLAIMER}</p>
    </main>
  );
}
