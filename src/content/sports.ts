import type { Sport, SportId } from "@/domain/types";

/** Boxing ships first. The others are visible but locked so users see where the app is going. */
export const SPORTS: Sport[] = [
  { id: "boxing", name: "Boxing", emoji: "🥊", status: "available", tagline: "Stance, punches, defense and fight IQ." },
  { id: "kickboxing", name: "Kickboxing", emoji: "🦵", status: "coming_soon", tagline: "Punches plus kicks and knees." },
  { id: "wrestling", name: "Wrestling", emoji: "🤼", status: "coming_soon", tagline: "Stance, level changes and sprawls." },
  { id: "mma", name: "MMA", emoji: "🥋", status: "coming_soon", tagline: "Striking and grappling combined." },
];

export function getSport(id: SportId): Sport {
  const sport = SPORTS.find((s) => s.id === id);
  if (!sport) throw new Error(`Unknown sport: ${id}`);
  return sport;
}

export function isSportAvailable(id: SportId): boolean {
  return getSport(id).status === "available";
}
