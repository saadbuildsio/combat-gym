import type { Language } from "@/i18n/language";
import type { Achievement, CurriculumLevel, Drill, Lesson, Opponent } from "@/domain/types";
import { ROMAN_CONTENT } from "./translations/roman";
import type { ContentTranslation } from "./translations/types";

/**
 * Content in the player's language. English content is the source of truth; translations only replace wording,
 * never ids, answers, timings or scores. Missing translations fall back to English.
 */
function table(language: Language): ContentTranslation | null {
  return language === "roman" ? ROMAN_CONTENT : null;
}

/** Uses the translated list only when it lines up with the English one. */
function sameLength<T>(english: T[], translated: T[] | undefined): T[] {
  return translated && translated.length === english.length ? translated : english;
}

export function localizeLesson(lesson: Lesson, language: Language): Lesson {
  const tr = table(language)?.lessons[lesson.id];
  if (!tr) return lesson;
  return {
    ...lesson,
    title: tr.title ?? lesson.title,
    summary: tr.summary ?? lesson.summary,
    whatItIs: tr.whatItIs ?? lesson.whatItIs,
    whenToUse: tr.whenToUse ?? lesson.whenToUse,
    mechanics: sameLength(lesson.mechanics, tr.mechanics),
    commonMistakes: sameLength(lesson.commonMistakes, tr.commonMistakes),
    safetyNotes: sameLength(lesson.safetyNotes, tr.safetyNotes),
    quiz: lesson.quiz.map((q) => {
      const tq = tr.quiz?.[q.id];
      return tq
        ? { ...q, question: tq.question ?? q.question, options: sameLength(q.options, tq.options), explanation: tq.explanation ?? q.explanation }
        : q;
    }),
  };
}

export function localizeLevel(level: CurriculumLevel, language: Language): CurriculumLevel {
  const tr = table(language)?.levels[level.level];
  return tr ? { ...level, title: tr.title ?? level.title, goal: tr.goal ?? level.goal } : level;
}

export function localizeDrill(drill: Drill, language: Language): Drill {
  const tr = table(language)?.drills[drill.id];
  return tr ? { ...drill, title: tr.title ?? drill.title, description: tr.description ?? drill.description } : drill;
}

export function localizeMove<T extends { id: string; name: string; cue: string }>(move: T, language: Language): T {
  const tr = table(language)?.moves[move.id];
  return tr ? { ...move, name: tr.name ?? move.name, cue: tr.cue ?? move.cue } : move;
}

/** A callout, warm-up step or other short phrase. */
export function localizePhrase(text: string, language: Language): string {
  return table(language)?.phrases[text] ?? text;
}

export function localizeOpponent(opponent: Opponent, language: Language): Opponent {
  const tr = table(language)?.opponents[opponent.id];
  if (!tr) return opponent;
  return {
    ...opponent,
    name: tr.name ?? opponent.name,
    description: tr.description ?? opponent.description,
    lesson: tr.lesson ?? opponent.lesson,
    scenarios: opponent.scenarios.map((s) => {
      const ts = tr.scenarios?.[s.id];
      return ts
        ? { ...s, situation: ts.situation ?? s.situation, options: sameLength(s.options, ts.options), explanation: ts.explanation ?? s.explanation }
        : s;
    }),
  };
}

export function localizeAchievement(achievement: Achievement, language: Language): Achievement {
  const tr = table(language)?.achievements[achievement.id];
  return tr ? { ...achievement, title: tr.title ?? achievement.title, description: tr.description ?? achievement.description } : achievement;
}

export function localizeSafety<K extends keyof ContentTranslation["safety"]>(
  key: K,
  english: NonNullable<ContentTranslation["safety"][K]>,
  language: Language,
): NonNullable<ContentTranslation["safety"][K]> {
  const tr = table(language)?.safety[key];
  if (tr === undefined) return english;
  if (Array.isArray(english)) return sameLength(english as string[], tr as string[]) as NonNullable<ContentTranslation["safety"][K]>;
  return tr as NonNullable<ContentTranslation["safety"][K]>;
}
