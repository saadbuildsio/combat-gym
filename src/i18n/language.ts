/** Languages the app can show. "roman" is Roman Urdu: Urdu/Hindi words written in English letters. */
export type Language = "en" | "roman";

export const LANGUAGES: { id: Language; label: string; sample: string }[] = [
  { id: "en", label: "English", sample: "Let's train" },
  { id: "roman", label: "Roman Urdu", sample: "Chalo training karein" },
];

export const LANGUAGE_STORAGE_KEY = "combat-gym:language";

/** Fills {name} style placeholders. */
export function fill(template: string, values: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
