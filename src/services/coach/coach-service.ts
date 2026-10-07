import { coachNoteForSession, homeCoachLine, type CoachNote } from "@/domain/coach-rules";
import type { CompletedSession, SkillRatings } from "@/domain/types";
import type { Message } from "@/i18n/message";

/**
 * The AI coach as the app sees it.
 * MVP: RuleBasedCoach, which is free, instant and works offline.
 * Phase 6: an LlmCoach that first runs the same rules, then asks Claude (through a server-only
 * API route, so the API key never reaches the browser) to reword the note in a coaching voice.
 * Notes come back as Messages (dictionary key + values); the screen turns them into the player's language with t().
 */
export interface CoachService {
  sessionNote(session: CompletedSession, skillsBefore: SkillRatings, skillsAfter: SkillRatings): Promise<CoachNote>;
  homeLine(skills: SkillRatings, sessionsCompleted: number): Promise<Message>;
}

export class RuleBasedCoach implements CoachService {
  async sessionNote(session: CompletedSession, skillsBefore: SkillRatings, skillsAfter: SkillRatings): Promise<CoachNote> {
    return coachNoteForSession(session, skillsBefore, skillsAfter);
  }

  async homeLine(skills: SkillRatings, sessionsCompleted: number): Promise<Message> {
    return homeCoachLine(skills, sessionsCompleted);
  }
}
