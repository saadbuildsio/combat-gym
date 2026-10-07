import { describe, expect, it } from "vitest";
import { scoreFightIQ, scoreReaction } from "@/domain/scoring";
import { updateSkills, emptySkills, weakestSkill } from "@/domain/skills";
import { BOXING_OPPONENTS } from "@/content/boxing/opponents";

describe("scoring", () => {
  it("rewards fast and correct reactions", () => {
    expect(scoreReaction([350, 350], 2)).toBe(100);
    expect(scoreReaction([1200], 1)).toBe(0);
    expect(scoreReaction([350], 2)).toBe(50); // fast but half wrong
    expect(scoreReaction([], 5)).toBe(0);
  });

  it("gives half credit for acceptable fight IQ answers", () => {
    const aggressor = BOXING_OPPONENTS[0];
    expect(scoreFightIQ(aggressor.scenarios, [1, 0, 1])).toBe(100);
    expect(scoreFightIQ(aggressor.scenarios, [1, 0, 0])).toBe(83);
    expect(scoreFightIQ(aggressor.scenarios, [0, 1, 2])).toBe(0);
  });
});

describe("skills", () => {
  it("takes the first score directly, then smooths", () => {
    let s = updateSkills(emptySkills(), { reaction: 80 });
    expect(s.reaction).toBe(80);
    s = updateSkills(s, { reaction: 40 });
    expect(s.reaction).toBe(68);
  });

  it("targets unmeasured skills first", () => {
    const s = { ...emptySkills(), reaction: 70, comboRecall: 60, knowledge: 90, conditioning: 50 };
    expect(weakestSkill(s)).toBe("fightIQ");
  });
});
