/**
 * Shape of a content translation. Every field is optional: anything missing falls back to English.
 * Lists (mechanics, options...) must keep the same length and order as the English, because answers are checked by position.
 */
export interface LessonTranslation {
  title?: string;
  summary?: string;
  whatItIs?: string;
  whenToUse?: string;
  mechanics?: string[];
  commonMistakes?: string[];
  safetyNotes?: string[];
  /** By quiz question id. */
  quiz?: Record<string, { question?: string; options?: string[]; explanation?: string }>;
}

export interface ContentTranslation {
  lessons: Record<string, LessonTranslation>;
  /** By level number. */
  levels: Record<number, { title?: string; goal?: string }>;
  /** By drill id. */
  drills: Record<string, { title?: string; description?: string }>;
  /** By move id. */
  moves: Record<string, { name?: string; cue?: string }>;
  /** By the exact English callout or step text (warm-up steps, movement callouts, direction names). */
  phrases: Record<string, string>;
  /** By opponent id. Scenarios by scenario id. */
  opponents: Record<
    string,
    {
      name?: string;
      description?: string;
      lesson?: string;
      scenarios?: Record<string, { situation?: string; options?: string[]; explanation?: string }>;
    }
  >;
  /** By achievement id. */
  achievements: Record<string, { title?: string; description?: string }>;
  safety: {
    disclaimer?: string;
    checklist?: string[];
    tips?: string[];
    painStop?: string;
    equipment?: string[];
  };
}
