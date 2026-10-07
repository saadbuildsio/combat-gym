import type { Lesson } from "@/domain/types";

/**
 * Boxing lessons for Levels 1 and 2.
 * Written for an orthodox (left foot forward) boxer; southpaws mirror everything.
 * DRAFT: must be reviewed by a qualified boxing coach before public launch.
 */

const GENERAL_SAFETY = "Warm up first and keep the movement controlled.";

export const BOXING_LESSONS: Lesson[] = [
  // ---------------- LEVEL 1: FUNDAMENTALS ----------------
  {
    id: "boxing-stance",
    sport: "boxing",
    level: 1,
    title: "Fighting Stance",
    summary: "The base every punch and step comes from.",
    whatItIs: "A balanced, side-on position that lets you attack, defend and move without falling off balance.",
    whenToUse: "All the time. You return to your stance after every punch and every step.",
    mechanics: [
      "Feet about shoulder-width apart, lead foot forward (left foot if you are right-handed).",
      "Rear foot turned out about 45 degrees, rear heel slightly raised.",
      "Knees softly bent, weight spread evenly between both feet.",
      "Body turned slightly side-on so your lead shoulder points at the target.",
    ],
    commonMistakes: [
      "Feet in one straight line, which makes you easy to push over.",
      "Standing square with both feet level.",
      "Locked, straight knees.",
    ],
    safetyNotes: [GENERAL_SAFETY, "If your knees or hips hurt in the stance, widen it slightly and reduce the bend."],
    quiz: [
      {
        id: "stance-q1",
        question: "In an orthodox stance, which foot is in front?",
        options: ["Right foot", "Left foot", "Both level"],
        correctIndex: 1,
        explanation: "Orthodox boxers lead with the left foot. Southpaws lead with the right.",
      },
      {
        id: "stance-q2",
        question: "Why should your feet not be in one straight line?",
        options: ["It looks wrong", "You lose balance easily", "It slows your jab"],
        correctIndex: 1,
        explanation: "Feet on one line give you no base, so a small push or step can tip you over.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-guard",
    sport: "boxing",
    level: 1,
    title: "The Guard",
    summary: "Where your hands live when you are not punching.",
    whatItIs: "Hand and elbow positions that protect your head and body while keeping you ready to punch.",
    whenToUse: "Always. Every punch starts from the guard and returns to it.",
    mechanics: [
      "Rear fist touches your cheek or chin.",
      "Lead fist at eye level, slightly in front of your face.",
      "Elbows tucked in to cover the ribs.",
      "Chin tucked down, eyes looking up at the target.",
    ],
    commonMistakes: ["Dropping the hands when tired.", "Chin up in the air.", "Elbows flaring out wide."],
    safetyNotes: [GENERAL_SAFETY, "Relax your shoulders; holding the guard tense causes neck strain."],
    quiz: [
      {
        id: "guard-q1",
        question: "Where should your rear fist be in guard?",
        options: ["At your hip", "Touching your cheek or chin", "Stretched forward"],
        correctIndex: 1,
        explanation: "The rear hand protects the chin and is loaded for the cross.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-step-drag",
    sport: "boxing",
    level: 1,
    title: "Forward and Backward Movement",
    summary: "Step and drag: move without crossing your feet.",
    whatItIs: "The basic boxing step. The foot nearest the direction moves first, the other follows the same distance.",
    whenToUse: "Closing distance to attack or creating distance to stay safe.",
    mechanics: [
      "Forward: push off the rear foot, step the lead foot forward a small amount, then bring the rear foot the same amount.",
      "Backward: push off the lead foot, step the rear foot back, then bring the lead foot back.",
      "Keep the stance width the same before and after the step.",
      "Small steps. Guard stays up.",
    ],
    commonMistakes: ["Crossing or bringing the feet together.", "Big lunging steps.", "Bouncing up and down."],
    safetyNotes: [GENERAL_SAFETY, "Check the floor behind you before stepping backward."],
    quiz: [
      {
        id: "step-q1",
        question: "Moving forward, which foot steps first?",
        options: ["Rear foot", "Lead foot", "Either"],
        correctIndex: 1,
        explanation: "The foot nearest the direction you are going moves first.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-lateral",
    sport: "boxing",
    level: 1,
    title: "Lateral Movement",
    summary: "Moving left and right while staying balanced.",
    whatItIs: "Side steps that move you off the centre line without crossing your feet.",
    whenToUse: "Getting out of the way of forward pressure and finding new angles.",
    mechanics: [
      "To your left: lead foot steps left first, rear foot follows.",
      "To your right: rear foot steps right first, lead foot follows.",
      "Stay on the balls of your feet with knees bent.",
    ],
    commonMistakes: ["Crossing the feet.", "Leaning the head to the side instead of moving the feet."],
    safetyNotes: [GENERAL_SAFETY],
    quiz: [
      {
        id: "lateral-q1",
        question: "Moving to your right in an orthodox stance, which foot moves first?",
        options: ["Lead (left) foot", "Rear (right) foot"],
        correctIndex: 1,
        explanation: "The foot nearest the direction of travel moves first.",
      },
    ],
    minutes: 3,
  },

  // ---------------- LEVEL 2: BASIC STRIKES ----------------
  {
    id: "boxing-jab",
    sport: "boxing",
    level: 2,
    title: "Jab (1)",
    summary: "Your fastest, safest punch, thrown with the lead hand.",
    whatItIs: "A straight punch with the lead hand. It measures distance, sets up other punches and keeps opponents back.",
    whenToUse: "To start combinations, to judge distance and to interrupt an opponent who is moving in.",
    mechanics: [
      "From guard, extend the lead hand straight out from the chin.",
      "Rotate the fist so the palm faces down at the end.",
      "Rear hand stays on the chin.",
      "Bring the hand straight back to guard along the same line.",
    ],
    commonMistakes: [
      "Dropping the hand before or after the punch.",
      "Pulling the rear hand away from the chin.",
      "Locking the elbow at full extension.",
    ],
    safetyNotes: [GENERAL_SAFETY, "Stop just short of full extension to protect your elbow when shadowboxing."],
    quiz: [
      {
        id: "jab-q1",
        question: "What number is the jab in boxing callouts?",
        options: ["1", "2", "3"],
        correctIndex: 0,
        explanation: "Jab = 1, cross = 2, lead hook = 3, rear hook = 4, lead uppercut = 5, rear uppercut = 6.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-cross",
    sport: "boxing",
    level: 2,
    title: "Cross (2)",
    summary: "The straight power punch from the rear hand.",
    whatItIs: "A straight punch from the rear hand, powered by turning the rear foot, hip and shoulder.",
    whenToUse: "After a jab, or as a counter when the opponent's guard opens.",
    mechanics: [
      "Pivot on the ball of the rear foot, turning the heel out.",
      "Rotate the hips and rear shoulder forward.",
      "Extend the rear hand straight from the chin; palm down at the end.",
      "Lead hand stays up to protect your face, then the rear hand returns to the chin.",
    ],
    commonMistakes: ["Arm-only punching with no hip turn.", "Leaning too far forward.", "Lead hand dropping."],
    safetyNotes: [GENERAL_SAFETY, "Do not over-rotate the knee; the turn comes from the foot and hip together."],
    quiz: [
      {
        id: "cross-q1",
        question: "Where does most of the cross's power come from?",
        options: ["The arm", "Turning the rear foot and hips", "Jumping forward"],
        correctIndex: 1,
        explanation: "Power starts at the rear foot and travels through the hips and shoulder.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-lead-hook",
    sport: "boxing",
    level: 2,
    title: "Lead Hook (3)",
    summary: "A short, curved punch with the lead hand.",
    whatItIs: "A hooking punch thrown with the lead hand, turning the body so the arm travels across in front of you.",
    whenToUse: "At close range, often after a jab-cross when the opponent covers the middle.",
    mechanics: [
      "Elbow raised to about shoulder height, arm bent near 90 degrees.",
      "Pivot the lead foot and turn the hips and shoulders.",
      "The arm moves with the body; it does not swing on its own.",
      "Rear hand stays on the chin.",
    ],
    commonMistakes: ["Winding up (pulling the arm back first).", "Swinging wide with a straight arm.", "Not turning the lead foot."],
    safetyNotes: [GENERAL_SAFETY, "Turn the lead foot with the punch to protect the knee."],
    quiz: [
      {
        id: "lhook-q1",
        question: "What should your lead foot do during a lead hook?",
        options: ["Stay flat and still", "Pivot with the hips", "Step forward"],
        correctIndex: 1,
        explanation: "Pivoting lets the body turn and protects the knee.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-rear-hook",
    sport: "boxing",
    level: 2,
    title: "Rear Hook (4)",
    summary: "The hook from the rear hand.",
    whatItIs: "A hooking punch from the rear side, turning through the rear foot and hips.",
    whenToUse: "At close range, often after a lead hook or when the opponent leans to your rear side.",
    mechanics: [
      "Pivot the rear foot and turn the hips forward.",
      "Rear elbow lifts and the arm stays bent.",
      "Lead hand comes back to protect the chin.",
    ],
    commonMistakes: ["Over-swinging and losing balance.", "Lead hand dropping."],
    safetyNotes: [GENERAL_SAFETY],
    quiz: [
      {
        id: "rhook-q1",
        question: "Which hand guards your chin while you throw the rear hook?",
        options: ["The lead hand", "Neither", "The rear hand"],
        correctIndex: 0,
        explanation: "When the rear hand punches, the lead hand covers the face.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-lead-uppercut",
    sport: "boxing",
    level: 2,
    title: "Lead Uppercut (5)",
    summary: "An upward punch with the lead hand.",
    whatItIs: "A short rising punch thrown with the lead hand by dipping slightly and driving up through the legs.",
    whenToUse: "At close range when the opponent leans forward or covers up high.",
    mechanics: [
      "Dip slightly toward the lead side by bending the knees.",
      "Drive up through the legs and turn the hips.",
      "Fist travels upward, palm facing you, elbow bent.",
    ],
    commonMistakes: ["Dropping the hand low before punching.", "Throwing from too far away."],
    safetyNotes: [GENERAL_SAFETY, "Keep the dip small; deep squats are not needed."],
    quiz: [
      {
        id: "luc-q1",
        question: "Where does an uppercut's power start?",
        options: ["The legs and hips", "The wrist", "The neck"],
        correctIndex: 0,
        explanation: "Like every punch, it starts from the ground up.",
      },
    ],
    minutes: 3,
  },
  {
    id: "boxing-rear-uppercut",
    sport: "boxing",
    level: 2,
    title: "Rear Uppercut (6)",
    summary: "An upward punch with the rear hand.",
    whatItIs: "A short rising punch from the rear hand, turning the rear hip forward.",
    whenToUse: "At close range, often after a lead hook.",
    mechanics: [
      "Dip slightly to the rear side.",
      "Turn the rear foot and hip forward as you rise.",
      "Fist travels upward with the elbow bent; lead hand guards the chin.",
    ],
    commonMistakes: ["Winding the arm down first.", "Leaning back as you throw."],
    safetyNotes: [GENERAL_SAFETY],
    quiz: [
      {
        id: "ruc-q1",
        question: "What is the rear uppercut's number in callouts?",
        options: ["4", "5", "6"],
        correctIndex: 2,
        explanation: "Rear uppercut = 6.",
      },
    ],
    minutes: 3,
  },
];

export function getLesson(id: string): Lesson | undefined {
  return BOXING_LESSONS.find((l) => l.id === id);
}
