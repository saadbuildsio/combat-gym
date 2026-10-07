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
  {
    id: "defensive",
    sport: "boxing",
    style: "defensive",
    name: "The Defensive Fighter",
    description: "Blocks and moves; hard to hit clean.",
    lesson: "Vary your targets and use combinations rather than single shots.",
    // Combinations and body shots are taught in Level 3.
    unlockLevel: 3,
    availableInMvp: true,
    scenarios: [
      {
        id: "def-1",
        situation: "They hold a tight high guard. Your single jabs only hit their gloves.",
        options: ["Keep throwing single jabs at the gloves", "Throw a jab to the head, then a cross to the body", "Wait for them to drop their hands"],
        bestIndex: 1,
        okIndexes: [2],
        explanation: "When the hands stay high, the body is open. Changing targets breaks a tight guard. Waiting is safe but gives them time.",
      },
      {
        id: "def-2",
        situation: "Every time you throw one punch, they step back out of range.",
        options: ["Lunge after them with a big hook", "Step in behind your jab and finish with a 1, 2, 3", "Give up and stand still"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "One punch is easy to escape. The jab closes the distance and the combination catches them.",
      },
      {
        id: "def-3",
        situation: "They cover up in front of you after your one-two.",
        options: ["Throw a lead hook around the guard, then move", "Stop and look at them", "Push them with both hands"],
        bestIndex: 0,
        okIndexes: [],
        explanation: "A covered guard protects the middle. The hook goes around the side, then you move before they answer.",
      },
    ],
  },
  {
    id: "pressure",
    sport: "boxing",
    style: "pressure",
    name: "The Pressure Fighter",
    description: "Cuts off the ring and works the body.",
    lesson: "Use angles and keep the fight in the centre.",
    // Defense comes in Level 4; pivots and angles in Level 5.
    unlockLevel: 5,
    availableInMvp: true,
    scenarios: [
      {
        id: "press-1",
        situation: "They walk you down towards the ropes, step by step.",
        options: ["Keep backing up in a straight line", "Pivot or side step back to the centre", "Turn around and run"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "Backing up in a line ends at the ropes. A pivot or side step takes you back to the centre.",
      },
      {
        id: "press-2",
        situation: "They come close, head low, throwing hooks to your body.",
        options: ["Drop both hands to your stomach", "Elbows in to cover the body, then uppercut as they come in", "Lean forward onto them"],
        bestIndex: 1,
        okIndexes: [0],
        explanation: "Tight elbows cover the body and keep your hands near your face. A low head walks into an uppercut. Dropping both hands stops the body shot but opens your head.",
      },
      {
        id: "press-3",
        situation: "You land a one-two, but they keep walking forward.",
        options: ["Stay in front of them and trade", "Punch, then step off to the side and turn to face them", "Cover up and wait"],
        bestIndex: 1,
        okIndexes: [2],
        explanation: "Punch and move off the line. They walk into empty space while you are ready again. Covering up survives but lets them keep the pressure on.",
      },
    ],
  },
  {
    id: "technician",
    sport: "boxing",
    style: "technician",
    name: "The Technician",
    description: "Balanced, patient, punishes mistakes.",
    lesson: "Every fundamental matters; there is no single trick.",
    // Distance, feints, counters and ring control are taught in Level 6.
    unlockLevel: 6,
    availableInMvp: true,
    scenarios: [
      {
        id: "tech-1",
        situation: "They stay just outside your range and wait.",
        options: ["Feint the jab and watch how they react", "Run in with a wild combination", "Drop your guard to tempt them"],
        bestIndex: 0,
        okIndexes: [],
        explanation: "A feint costs nothing and shows you how they react, so you can plan your real attack.",
      },
      {
        id: "tech-2",
        situation: "They throw a sharp jab whenever you step in.",
        options: ["Step in the same way again", "Slip right and counter with a cross", "Turn your head away and close your eyes"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "Their jab is predictable. Slip it and answer with your cross while their hand is out.",
      },
      {
        id: "tech-3",
        situation: "You have been throwing your one-two on the same beat all round, and they start countering it.",
        options: ["Keep the same rhythm", "Change your timing: feint, pause, then punch", "Stop punching completely"],
        bestIndex: 1,
        okIndexes: [],
        explanation: "A good fighter reads rhythm. Change your timing so they cannot guess when the punch comes.",
      },
    ],
  },
];

export function getOpponent(id: string): Opponent | undefined {
  return BOXING_OPPONENTS.find((o) => o.id === id);
}
