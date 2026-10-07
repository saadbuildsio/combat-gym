/**
 * Core types for the whole game.
 * Every sport, lesson, drill and score in the app is described with these shapes,
 * so adding Kickboxing later means adding content, not changing types.
 */

// ---------- Sports ----------

export type SportId = "boxing" | "kickboxing" | "wrestling" | "mma";

export type SportStatus = "available" | "coming_soon";

export interface Sport {
  id: SportId;
  name: string;
  emoji: string;
  status: SportStatus;
  tagline: string;
}

// ---------- Skills ----------

/**
 * Skills the MVP can honestly measure without a camera.
 * See docs: reaction = tap timing, comboRecall = sequence memory, etc.
 */
export type MeasuredSkill =
  | "reaction"
  | "comboRecall"
  | "fightIQ"
  | "knowledge"
  | "consistency"
  | "conditioning";

/** Skills that need camera analysis. Shown as locked until vision ships. */
export type CameraSkill = "technique" | "accuracy" | "footwork" | "defenseForm";

export type SkillRatings = Record<MeasuredSkill, number>; // each 0-100

export const MEASURED_SKILLS: MeasuredSkill[] = [
  "reaction",
  "comboRecall",
  "fightIQ",
  "knowledge",
  "consistency",
  "conditioning",
];

export const CAMERA_SKILLS: CameraSkill[] = ["technique", "accuracy", "footwork", "defenseForm"];

// ---------- Curriculum ----------

export interface Lesson {
  id: string;
  sport: SportId;
  level: number;
  title: string;
  /** One-line summary for cards. */
  summary: string;
  whatItIs: string;
  whenToUse: string;
  mechanics: string[];
  commonMistakes: string[];
  safetyNotes: string[];
  /** Quiz questions used by the knowledge drill. */
  quiz: QuizQuestion[];
  /** Approximate minutes to complete learn + practice. */
  minutes: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CurriculumLevel {
  sport: SportId;
  level: number;
  title: string;
  goal: string;
  lessonIds: string[];
  /** XP needed in this sport before the level unlocks. */
  unlockXp: number;
  /** True when lessons are fully written. Levels without content show as "coming soon". */
  contentReady: boolean;
}

// ---------- Drills (the scored part of training) ----------

export type DrillKind =
  | "warmup" // timed, follow-along, safety-led
  | "shadowRound" // timed follow-along with spoken callouts; completion only
  | "reaction" // tap the right defense/punch when a callout flashes
  | "comboRecall" // remember and enter a punch sequence
  | "quiz" // knowledge check from a lesson
  | "fightIQ" // pick the right response to an opponent situation
  | "cooldown";

export interface Drill {
  id: string;
  kind: DrillKind;
  title: string;
  description: string;
  minutes: number;
  /** Lessons this drill practises. Empty for generic drills like warm-up. */
  lessonIds: string[];
  /** Skills this drill produces a score for. */
  trains: MeasuredSkill[];
}

/** Result of one finished drill. Scores are 0-100 for each skill the drill trains. */
export interface DrillResult {
  drillId: string;
  kind: DrillKind;
  completed: boolean;
  scores: Partial<SkillRatings>;
  /** Optional raw stats, e.g. average reaction ms, for history screens. */
  stats?: Record<string, number>;
  /** User-reported effort 1-5 for conditioning rounds. */
  effort?: number;
  /** User reported pain/discomfort. Triggers the safety stop flow. */
  reportedPain?: boolean;
}

// ---------- Sessions ----------

export type SessionBlockType = "warmup" | "learn" | "practice" | "test" | "challenge" | "cooldown";

export interface SessionBlock {
  type: SessionBlockType;
  title: string;
  minutes: number;
  drillId?: string;
  lessonId?: string;
}

export interface TrainingSessionPlan {
  id: string;
  date: string; // YYYY-MM-DD
  sport: SportId;
  focus: MeasuredSkill;
  blocks: SessionBlock[];
  totalMinutes: number;
}

export interface CompletedSession {
  planId: string;
  date: string; // YYYY-MM-DD
  sport: SportId;
  results: DrillResult[];
  xpEarned: number;
  minutes: number;
}

// ---------- Opponents ----------

export type OpponentStyle = "aggressor" | "counterPuncher" | "defensive" | "pressure" | "technician";

export interface Opponent {
  id: string;
  sport: SportId;
  style: OpponentStyle;
  name: string;
  description: string;
  /** What this opponent teaches the user. */
  lesson: string;
  unlockLevel: number;
  availableInMvp: boolean;
  scenarios: FightScenario[];
}

/** One decision in the Fight IQ game: the opponent does something, the user picks a response. */
export interface FightScenario {
  id: string;
  situation: string;
  options: string[];
  bestIndex: number;
  /** Partly-correct answers earn half credit. */
  okIndexes: number[];
  explanation: string;
}

// ---------- Onboarding & player ----------

export type ExperienceLevel = "complete_beginner" | "beginner" | "intermediate" | "advanced";
export type TrainingGoal = "learn_boxing" | "fitness" | "improve_technique" | "competition_prep" | "fun";
export type MinutesPerDay = 5 | 10 | 15 | 30 | 45;

export interface OnboardingAnswers {
  experience: ExperienceLevel;
  goal: TrainingGoal;
  minutesPerDay: MinutesPerDay;
}

export type Plan = "free" | "pro";

export interface PlayerProfile {
  id: string;
  displayName: string;
  createdAt: string; // ISO timestamp
  onboarding: OnboardingAnswers | null;
  safetyAcknowledgedAt: string | null;
  favoriteSport: SportId;
  plan: Plan;
  totalXp: number;
  skills: SkillRatings;
  streak: StreakState;
  achievements: string[]; // achievement ids
  completedLessonIds: string[];
  history: CompletedSession[];
}

export interface StreakState {
  current: number;
  longest: number;
  lastTrainingDate: string | null; // YYYY-MM-DD
  /** Week key (YYYY-Www) when the free rest day was last used. */
  restDayUsedWeek: string | null;
}

// ---------- Achievements ----------

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
}
