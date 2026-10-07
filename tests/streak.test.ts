import { describe, expect, it } from "vitest";
import { emptyStreak, recordTrainingDay, visibleStreak } from "@/domain/streak";

describe("streak", () => {
  it("grows on consecutive days and ignores a second session the same day", () => {
    let s = recordTrainingDay(emptyStreak(), "2026-10-05");
    s = recordTrainingDay(s, "2026-10-06");
    s = recordTrainingDay(s, "2026-10-06");
    expect(s.current).toBe(2);
  });

  it("forgives one missed day per week", () => {
    let s = recordTrainingDay(emptyStreak(), "2026-10-05"); // Monday
    s = recordTrainingDay(s, "2026-10-07"); // skipped Tuesday
    expect(s.current).toBe(2);
    s = recordTrainingDay(s, "2026-10-09"); // skipped again same week
    expect(s.current).toBe(1);
    expect(s.longest).toBe(2);
  });

  it("shows 0 once the streak has lapsed", () => {
    const s = recordTrainingDay(emptyStreak(), "2026-10-01");
    expect(visibleStreak(s, "2026-10-02")).toBe(1);
    expect(visibleStreak(s, "2026-10-06")).toBe(0);
  });
});
