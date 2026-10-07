/** Date helpers working on plain YYYY-MM-DD strings (the user's local calendar day). */

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysBetween(fromKey: string, toKey: string): number {
  const from = Date.parse(fromKey + "T00:00:00Z");
  const to = Date.parse(toKey + "T00:00:00Z");
  return Math.round((to - from) / 86_400_000);
}

/** ISO week key such as "2026-W41". Used for the weekly streak rest day. */
export function isoWeekKey(dateKey: string): string {
  const date = new Date(dateKey + "T00:00:00Z");
  const day = date.getUTCDay() || 7; // Monday = 1 ... Sunday = 7
  date.setUTCDate(date.getUTCDate() + 4 - day); // Thursday of this week
  const yearStart = Date.UTC(date.getUTCFullYear(), 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart) / 86_400_000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}
