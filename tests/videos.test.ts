import { describe, expect, it } from "vitest";
import { DEMO_VIDEOS, getDemoVideo } from "@/content/boxing/videos";

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

describe("demo videos", () => {
  it("only use videos with a confirmed male presenter", () => {
    for (const [id, video] of Object.entries(DEMO_VIDEOS)) expect(video.presenter, id).toBe("male");
  });

  it("use well-formed YouTube video IDs", () => {
    for (const [id, video] of Object.entries(DEMO_VIDEOS)) {
      if (video.kind === "youtube") expect(video.src, id).toMatch(YOUTUBE_ID);
    }
  });

  it("only set skipTo to a whole, non-negative number of seconds", () => {
    for (const [id, video] of Object.entries(DEMO_VIDEOS)) {
      if (video.skipTo === undefined) continue;
      expect(Number.isInteger(video.skipTo), id).toBe(true);
      expect(video.skipTo, id).toBeGreaterThanOrEqual(0);
    }
  });

  it("use each video for one entry only", () => {
    const seen = new Map<string, string>();
    for (const [id, video] of Object.entries(DEMO_VIDEOS)) {
      expect(seen.get(video.src), `${id} repeats ${seen.get(video.src)}`).toBeUndefined();
      seen.set(video.src, id);
    }
  });

  it("hide our own clips until a coach approves them, but show YouTube placeholders", () => {
    DEMO_VIDEOS["recall-combos"] = { kind: "file", src: "/videos/recall.mp4", coachReviewed: false };
    expect(getDemoVideo("recall-combos")).toBeUndefined();
    DEMO_VIDEOS["recall-combos"].coachReviewed = true;
    expect(getDemoVideo("recall-combos")?.src).toBe("/videos/recall.mp4");
    delete DEMO_VIDEOS["recall-combos"];
    expect(getDemoVideo("boxing-jab")?.kind).toBe("youtube");
    expect(getDemoVideo("no-such-lesson")).toBeUndefined();
  });
});
