import { describe, expect, it } from "vitest";
import { BOXING_LESSONS } from "@/content/boxing/lessons";
import { BOXING_LEVELS } from "@/content/boxing/levels";
import { BOXING_DRILLS } from "@/content/boxing/drills";
import { BOXING_OPPONENTS } from "@/content/boxing/opponents";
import { ALL_MOVE_IDS, calloutName, getMove } from "@/content/boxing/moves";
import { COOLDOWN_STEPS, DIRECTION_NAMES, MOVEMENT_CALLOUTS, PUNCH_NAMES, WARMUP_STEPS } from "@/content/boxing/callouts";
import { shadowRoundCallouts } from "@/content/boxing/round-callouts";
import { ACHIEVEMENTS } from "@/content/achievements";
import { EQUIPMENT_GUIDANCE, PAIN_STOP_MESSAGE, SAFETY_CHECKLIST, SAFETY_DISCLAIMER, SAFETY_TIPS } from "@/content/safety";
import { ROMAN_CONTENT } from "@/content/translations/roman";
import {
  localizeAchievement,
  localizeDrill,
  localizeLesson,
  localizeLevel,
  localizeMove,
  localizeOpponent,
  localizePhrase,
  localizeSafety,
} from "@/content/localize";

const R = ROMAN_CONTENT;
const filled = (s: string | undefined) => typeof s === "string" && s.trim().length > 0;
const allFilled = (list: string[] | undefined) => Array.isArray(list) && list.every(filled);

describe("Roman Urdu lessons", () => {
  it.each(BOXING_LESSONS.map((l) => [l.id, l] as const))("%s is fully translated with matching lists", (id, lesson) => {
    const tr = R.lessons[id];
    expect(tr, id).toBeDefined();
    for (const key of ["title", "summary", "whatItIs", "whenToUse"] as const) expect(filled(tr[key]), `${id}.${key}`).toBe(true);
    for (const key of ["mechanics", "commonMistakes", "safetyNotes"] as const) {
      expect(tr[key]?.length, `${id}.${key}`).toBe(lesson[key].length);
      expect(allFilled(tr[key]), `${id}.${key}`).toBe(true);
    }
    expect(Object.keys(tr.quiz ?? {}).sort()).toEqual(lesson.quiz.map((q) => q.id).sort());
    for (const q of lesson.quiz) {
      const tq = tr.quiz![q.id];
      expect(filled(tq.question) && filled(tq.explanation), q.id).toBe(true);
      expect(tq.options?.length, `${q.id}.options`).toBe(q.options.length);
      expect(allFilled(tq.options), `${q.id}.options`).toBe(true);
    }

    // The localized lesson actually uses the translation, keeps answers and ids.
    const local = localizeLesson(lesson, "roman");
    expect(local.title).toBe(tr.title);
    expect(local.mechanics).toBe(tr.mechanics);
    expect(local.commonMistakes).toBe(tr.commonMistakes);
    expect(local.safetyNotes).toBe(tr.safetyNotes);
    local.quiz.forEach((q, i) => {
      expect(q.id).toBe(lesson.quiz[i].id);
      expect(q.correctIndex).toBe(lesson.quiz[i].correctIndex);
      expect(q.options).toBe(tr.quiz![q.id].options);
    });
    expect(localizeLesson(lesson, "en")).toBe(lesson);
  });

  it("has no translations for unknown lessons or quiz ids", () => {
    const ids = new Set(BOXING_LESSONS.map((l) => l.id));
    for (const id of Object.keys(R.lessons)) expect(ids.has(id), id).toBe(true);
  });
});

describe("Roman Urdu levels, drills, moves, achievements", () => {
  it("translates every level", () => {
    for (const level of BOXING_LEVELS) {
      const tr = R.levels[level.level];
      expect(filled(tr?.title) && filled(tr?.goal), `level ${level.level}`).toBe(true);
      expect(localizeLevel(level, "roman").goal).toBe(tr.goal);
    }
  });

  it("translates every drill", () => {
    for (const drill of BOXING_DRILLS) {
      const tr = R.drills[drill.id];
      expect(filled(tr?.title) && filled(tr?.description), drill.id).toBe(true);
      expect(localizeDrill(drill, "roman").description).toBe(tr.description);
    }
    expect(Object.keys(R.drills).sort()).toEqual(BOXING_DRILLS.map((d) => d.id).sort());
  });

  it("translates every move", () => {
    for (const id of ALL_MOVE_IDS) {
      const tr = R.moves[id];
      expect(filled(tr?.name) && filled(tr?.cue), id).toBe(true);
      expect(localizeMove(getMove(id), "roman").cue).toBe(tr.cue);
    }
    expect(Object.keys(R.moves).sort()).toEqual([...ALL_MOVE_IDS].sort());
  });

  it("translates every achievement", () => {
    for (const a of ACHIEVEMENTS) {
      const tr = R.achievements[a.id];
      expect(filled(tr?.title) && filled(tr?.description), a.id).toBe(true);
      expect(localizeAchievement(a, "roman").description).toBe(tr.description);
    }
  });
});

describe("Roman Urdu opponents", () => {
  it.each(BOXING_OPPONENTS.map((o) => [o.id, o] as const))("%s and every scenario are translated", (id, opponent) => {
    const tr = R.opponents[id];
    expect(filled(tr?.name) && filled(tr?.description) && filled(tr?.lesson), id).toBe(true);
    expect(Object.keys(tr.scenarios ?? {}).sort()).toEqual(opponent.scenarios.map((s) => s.id).sort());
    for (const s of opponent.scenarios) {
      const ts = tr.scenarios![s.id];
      expect(filled(ts.situation) && filled(ts.explanation), s.id).toBe(true);
      expect(ts.options?.length, `${s.id}.options`).toBe(s.options.length);
      expect(allFilled(ts.options), `${s.id}.options`).toBe(true);
    }
    const local = localizeOpponent(opponent, "roman");
    local.scenarios.forEach((s, i) => {
      expect(s.options).toBe(tr.scenarios![s.id].options);
      expect(s.bestIndex).toBe(opponent.scenarios[i].bestIndex);
      expect(s.okIndexes).toEqual(opponent.scenarios[i].okIndexes);
    });
  });
});

describe("Roman Urdu safety", () => {
  it("translates every safety text and keeps list lengths", () => {
    const s = R.safety;
    expect(filled(s.disclaimer) && filled(s.painStop)).toBe(true);
    expect(s.checklist?.length).toBe(SAFETY_CHECKLIST.length);
    expect(s.tips?.length).toBe(SAFETY_TIPS.length);
    expect(s.equipment?.length).toBe(EQUIPMENT_GUIDANCE.length);
    expect(allFilled(s.checklist) && allFilled(s.tips) && allFilled(s.equipment)).toBe(true);

    expect(localizeSafety("disclaimer", SAFETY_DISCLAIMER, "roman")).toBe(s.disclaimer);
    expect(localizeSafety("painStop", PAIN_STOP_MESSAGE, "roman")).toBe(s.painStop);
    expect(localizeSafety("checklist", SAFETY_CHECKLIST, "roman")).toBe(s.checklist);
    expect(localizeSafety("tips", SAFETY_TIPS, "roman")).toBe(s.tips);
    expect(localizeSafety("equipment", EQUIPMENT_GUIDANCE, "roman")).toBe(s.equipment);
  });
});

describe("Roman Urdu phrases", () => {
  const has = (text: string) => Object.prototype.hasOwnProperty.call(R.phrases, text) && filled(R.phrases[text]);
  const allLessons = BOXING_LESSONS.map((l) => l.id);
  const shadowDrills = BOXING_DRILLS.filter((d) => d.kind === "shadowRound").map((d) => d.id);
  const roundCallouts = [...new Set([...shadowDrills.flatMap((id) => shadowRoundCallouts(id, allLessons).callouts), ...MOVEMENT_CALLOUTS])];

  it("covers every warm-up and cool-down step", () => {
    for (const step of [...WARMUP_STEPS, ...COOLDOWN_STEPS]) expect(has(step), step).toBe(true);
  });

  it("covers direction names, punch names and the round words", () => {
    for (const name of [...Object.values(DIRECTION_NAMES), ...Object.values(PUNCH_NAMES), "Get in your stance", "Time"]) {
      expect(has(name), name).toBe(true);
    }
  });

  it("covers every callout a shadow round can show, whole and part by part", () => {
    expect(roundCallouts.length).toBeGreaterThan(20);
    for (const callout of roundCallouts) {
      const name = calloutName(callout);
      // The round screen looks up the whole named callout.
      expect(has(name), name).toBe(true);
      expect(localizePhrase(name, "roman")).toBe(R.phrases[name]);
      // And each non-numeric part is translated on its own too.
      for (const part of name.split(",").map((p) => p.trim())) {
        if (/^\d+$/.test(part)) continue;
        expect(has(part), `${name} -> ${part}`).toBe(true);
      }
    }
  });

  it("translates the movement and defense words, not just copies them", () => {
    expect(localizePhrase("Step forward", "roman")).not.toBe("Step forward");
    expect(localizePhrase("Reset your stance", "roman")).not.toBe("Reset your stance");
    expect(localizePhrase("Forward", "roman")).not.toBe("Forward");
    expect(localizePhrase(calloutName("1, 2, step back"), "roman")).toBe("Jab, cross, peeche step");
    expect(localizePhrase("Step forward", "en")).toBe("Step forward");
  });
});
