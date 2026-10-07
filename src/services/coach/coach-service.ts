import { coachNoteForSession, homeCoachLine, type CoachNote } from "@/domain/coach-rules";
import type { CompletedSession, SkillRatings } from "@/domain/types";

/**
 * The AI coach as the app sees it.
 * MVP: RuleBasedCoach, which is free, instant and works offline.
 * Phase 6: an LlmCoach that first runs the same rules, then asks Claude (through a server-only
 * API route, so the API key never reaches the browser) to reword the note in a coaching voice.
 */
export interface CoachService {
  sessionNote(session: CompletedSession, skillsBefore: SkillRatings, skillsAfter: SkillRatings): Promise<CoachNote>;
  homeLine(skills: SkillRatings, sessionsCompleted: number): Promise<string>;
}

export class RuleBasedCoach implements CoachService {
  async sessionNote(session: CompletedSession, skillsBefore: SkillRatings, skillsAfter: SkillRatings): Promise<CoachNote> {
    return coachNoteForSession(session, skillsBefore, skillsAfter);
  }

  async homeLine(skills: SkillRatings, sessionsCompleted: number): Promise<string> {
    return homeCoachLine(skills, sessionsCompleted);
  }
}
