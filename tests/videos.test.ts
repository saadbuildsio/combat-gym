import { describe, expect, it } from "vitest";
import { BOXING_DRILLS } from "@/content/boxing/drills";
import { BOXING_LESSONS } from "@/content/boxing/lessons";
import { DEMO_VIDEOS, getDemoVideo } from "@/content/boxing/videos";

describe("demo videos", () => {
  it("only point at real lessons or drills", () => {
    const ids = new Set([...BOXING_LESSONS.map((l) => l.id), ...BOXING_DRILLS.map((d) => d.id)]);
    for (const key of Object.keys(DEMO_VIDEOS)) expect(ids.has(key), key).toBe(true);
  });

  it("hide clips a coach has not approved", () => {
    DEMO_VIDEOS["boxing-jab"] = { kind: "file", src: "/videos/jab.mp4", coachReviewed: false };
    expect(getDemoVideo("boxing-jab")).toBeUndefined();
    DEMO_VIDEOS["boxing-jab"].coachReviewed = true;
    expect(getDemoVideo("boxing-jab")?.src).toBe("/videos/jab.mp4");
    delete DEMO_VIDEOS["boxing-jab"];
  });
});
