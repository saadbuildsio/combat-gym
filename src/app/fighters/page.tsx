"use client";

import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { Card, Pill } from "@/components/ui";
import { BOXING_OPPONENTS } from "@/content/boxing/opponents";
import type { PlayerProfile } from "@/domain/types";
import { levelForXp } from "@/domain/xp";

export default function FightersPage() {
  return <AppShell>{(profile) => <Fighters profile={profile} />}</AppShell>;
}

/** AI opponents: each style teaches a different strategy. */
function Fighters({ profile }: { profile: PlayerProfile }) {
  const level = levelForXp(profile.totalXp);

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted">Fighters</p>
        <h1 className="text-3xl font-black">🤖 AI opponents</h1>
        <p className="mt-1 text-muted">Different styles need different answers. Read the opponent, choose your response.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {BOXING_OPPONENTS.map((o) => {
          const open = o.availableInMvp && level >= o.unlockLevel;
          const body = (
            <Card className={`h-full ${open ? "hover:ring-1 hover:ring-accent" : "opacity-60"}`}>
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-black">{o.name}</h2>
                {open ? <Pill tone="accent">Fight</Pill> : <Pill>{o.availableInMvp ? `🔒 Level ${o.unlockLevel}` : "🔒 Coming soon"}</Pill>}
              </div>
              <p className="mt-2 text-muted">{o.description}</p>
              <p className="mt-3 text-sm">
                <span className="font-bold">Teaches: </span>
                {o.lesson}
              </p>
            </Card>
          );
          return open ? (
            <Link key={o.id} href={`/fighters/${o.id}`} className="block">
              {body}
            </Link>
          ) : (
            <div key={o.id}>{body}</div>
          );
        })}
      </div>
    </div>
  );
}
