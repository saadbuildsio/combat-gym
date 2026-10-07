import type { Achievement } from "@/domain/types";

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first_session", title: "First Session", description: "Finish your first training session.", emoji: "🏆", xpReward: 50 },
  { id: "stance_ready", title: "Stance Ready", description: "Complete every Level 1 lesson.", emoji: "🧍", xpReward: 100 },
  { id: "six_punches", title: "All Six", description: "Complete every Level 2 punch lesson.", emoji: "🥊", xpReward: 150 },
  { id: "streak_3", title: "Three in a Row", description: "Train 3 days in a row.", emoji: "🔥", xpReward: 50 },
  { id: "streak_7", title: "7 Day Streak", description: "Train 7 days in a row.", emoji: "🔥", xpReward: 150 },
  { id: "quick_hands", title: "Quick Hands", description: "Average under 600 ms in a reaction drill.", emoji: "⚡", xpReward: 75 },
  { id: "perfect_recall", title: "Perfect Recall", description: "Score 100 in a combo recall drill.", emoji: "🧠", xpReward: 75 },
  { id: "ring_iq", title: "Ring IQ", description: "Beat a Fight IQ opponent with 80 or more.", emoji: "🎯", xpReward: 100 },
  { id: "ten_sessions", title: "Ten Sessions", description: "Finish 10 training sessions.", emoji: "💪", xpReward: 200 },
];

export function getAchievement(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
