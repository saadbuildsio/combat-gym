import { describe, expect, it } from "vitest";
import { BOXING_DRILLS } from "@/content/boxing/drills";
import { BOXING_LESSONS } from "@/content/boxing/lessons";
import { DEMO_VIDEOS, getDemoVideo } from "@/content/boxing/videos";

describe("demo videos", () => {
  it("only point at real lessons or drills", () => {
    const ids = new Set([...BOXING_LESSONS.map((l) => l.id), ...BOXING_DRILLS.map((d) => d.id)]);
    for (const key of Object.keys(DEMO_VIDEOS)) expect(ids.has(key), key).toBe(true);
  });

  it("hide our own clips until a coach approves them, but show YouTube placeholders", () => {
    DEMO_VIDEOS["recall-combos"] = { kind: "file", src: "/videos/recall.mp4", coachReviewed: false };
    expect(getDemoVideo("recall-combos")).toBeUndefined();
    DEMO_VIDEOS["recall-combos"].coachReviewed = true;
    expect(getDemoVideo("recall-combos")?.src).toBe("/videos/recall.mp4");
    delete DEMO_VIDEOS["recall-combos"];
    expect(getDemoVideo("boxing-jab")?.kind).toBe("youtube");
  });

  it("cover every Level 1-2 lesson", () => {
    for (const lesson of BOXING_LESSONS) expect(getDemoVideo(lesson.id), lesson.id).toBeDefined();
  });
});
