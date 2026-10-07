import type { Opponent } from "@/domain/types";

/**
 * AI opponents for the Fight IQ decision game.
 * In the MVP an opponent is a set of situations; the user picks a response and learns
 * why it works against that style. No physics or animation needed.
 */
export const BOXING_OPPONENTS: Opponent[] = [
  {
    id: "aggressor",
    sport: "boxing",
    style: "aggressor",
    name: "The Aggressor",
    description: "Constant forward pressure and big punches.",
    lesson: "Do not stand still in front of pressure. Move off the line and punish them as they come in.",
    unlockLevel: 1,
    availableInMvp: true,
    scenarios: [
      {
        id: "agg-1",
        situation: "The Aggressor charges straight at you, throwing a wide rear hook.",
        options: ["Back straight up in a line", "Step off to the side and jab", "Drop your hands and trade"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "Backing up in a line lets pressure catch you. Moving off the line makes them miss and opens a jab.",
      },
      {
        id: "agg-2",
        situation: "They keep walking forward with their chin up after every combination.",
        options: ["Jab as they step in", "Turn your back", "Throw a slow uppercut from far away"],
        bestIndex: 0,
        okIndexes: [],
        explanation: "A sharp jab meets them as they step in and stops the forward momentum.",
      },
      {
        id: "agg-3",
        situation: "You are near the corner of the ring and they are closing fast.",
        options: ["Stay in the corner and cover up", "Pivot and move along the ropes to open space", "Rush straight forward"],
        bestIndex: 1,
        okIndexes: [0],
        explanation: "Covering up survives for a moment, but moving out of the corner gets you back to the centre.",
      },
    ],
  },
  {
    id: "counter-puncher",
    sport: "boxing",
    style: "counterPuncher",
    name: "The Counter Puncher",
    description: "Waits for you to attack, then hits back.",
    lesson: "Do not throw lazy single punches. Use feints and finish your combinations behind a solid guard.",
    unlockLevel: 2,
    availableInMvp: true,
    scenarios: [
      {
        id: "cp-1",
        situation: "Every time you throw a lazy jab, they slip and fire a cross back.",
        options: ["Throw the same jab harder", "Double the jab and keep your rear hand on your chin", "Stop punching completely"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "A sharper double jab with a tight guard makes their counter miss or land on gloves.",
      },
      {
        id: "cp-2",
        situation: "They stand still, waiting, hands high.",
        options: ["Feint the jab and watch their reaction", "Charge in with a wild hook", "Turn and walk away"],
        bestIndex: 0,
        okIndexes: [],
        explanation: "A feint draws out their counter so you can see it coming and plan around it.",
      },
      {
        id: "cp-3",
        situation: "You land a jab-cross. They start to counter with a lead hook.",
        options: ["Stay square and admire your punches", "Return to guard and move off the line", "Lower your hands"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "Against counter punchers, defense after your combination matters as much as the combination.",
      },
    ],
  },
  { id: "defensive", sport: "boxing", style: "defensive", name: "The Defensive Fighter", description: "Blocks and moves; hard to hit clean.", lesson: "Vary your targets and use combinations rather than single shots.", unlockLevel: 4, availableInMvp: false, scenarios: [] },
  { id: "pressure", sport: "boxing", style: "pressure", name: "The Pressure Fighter", description: "Cuts off the ring and works the body.", lesson: "Use angles and keep the fight in the centre.", unlockLevel: 5, availableInMvp: false, scenarios: [] },
  { id: "technician", sport: "boxing", style: "technician", name: "The Technician", description: "Balanced, patient, punishes mistakes.", lesson: "Every fundamental matters; there is no single trick.", unlockLevel: 6, availableInMvp: false, scenarios: [] },
];

export function getOpponent(id: string): Opponent | undefined {
  return BOXING_OPPONENTS.find((o) => o.id === id);
}
