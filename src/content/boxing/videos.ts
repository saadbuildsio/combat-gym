import type { DemoVideo } from "@/domain/types";

/**
 * Coach-checked: Saad had every video below reviewed by coaches (8 Oct 2026), so they show without the "not yet checked" note.
 *
 * Demo videos by lesson, drill or round id.
 *
 * For now these are existing YouTube videos (checked on 7 Oct 2026: each ID resolved through YouTube oEmbed,
 * which also confirms it can be embedded; the oEmbed title is in the comment on each line). They are
 * placeholders until our own coach-filmed clips exist (see docs/video-shot-list.md). Unreviewed YouTube
 * videos are shown with a "not yet checked by our coach" note; unreviewed uploaded files are never shown.
 *
 * Rule: male presenters only. Every video here is presented and demonstrated by a male coach, and that was
 * confirmed from a source (channel owner's bio, the video description naming him, or the coach's own site)
 * before the video was added; such entries carry presenter: "male". If the presenter cannot be confirmed
 * as male, the video is not used and the lesson shows "video coming soon" instead.
 *
 * skipTo: many videos open with an intro. The player starts at `skipTo` seconds and its "Skip intro" button
 * jumps there. It is set ONLY when the real start is known from evidence (chapter timestamps in the video
 * description); it is never guessed. No skipTo means the start is unknown and the video plays from 0.
 *
 * To replace one with our own clip: put the file in public/videos/ and change its line to
 *   { kind: "file", src: "/videos/boxing-jab.mp4", poster: "/videos/boxing-jab.jpg", credit: "Coach name", coachReviewed: true }
 */
export const DEMO_VIDEOS: Record<string, DemoVideo> = {
  // Level 1: fundamentals
  // "7 Steps to a Solid Boxing Stance - 90 Second Beginner Boxing Tips"
  "boxing-stance": { kind: "youtube", src: "Pe1dxJUaoyo", credit: "MyBoxingCoach (Fran Sands)", coachReviewed: true, presenter: "male" },
  // "How to Properly Hold Hands up in a Fight (in Guard)"
  "boxing-guard": { kind: "youtube", src: "edoOw4w3UN0", credit: "fightTIPS (Shane Fazen)", coachReviewed: true, presenter: "male" },
  // "Boxing Footwork Technique #1 - Step-drag" (chapter 00:05 "Footwork Technique #1 - Step-drag")
  "boxing-step-drag": { kind: "youtube", src: "dHUutXudf8o", credit: "Expert Boxing (Johnny N)", coachReviewed: true, skipTo: 5, presenter: "male" },
  // "Lateral Movement Close and Long - KILLER Boxing Footwork" (chapter 0:15 "Beginner Boxer Toolkit")
  "boxing-lateral": { kind: "youtube", src: "AYWOBZhSQAQ", credit: "MyBoxingCoach (Fran Sands)", coachReviewed: true, skipTo: 15, presenter: "male" },

  // Level 2: the six punches
  // "Boxing Basics with Tony Jeffries: How to throw a jab | SANABUL"
  "boxing-jab": { kind: "youtube", src: "odM78vAS86M", credit: "Tony Jeffries for Sanabul", coachReviewed: true, presenter: "male" },
  // "Boxing Basics with Tony Jeffries: How to throw a cross punch | SANABUL"
  "boxing-cross": { kind: "youtube", src: "4ps3eNnnGCM", credit: "Tony Jeffries for Sanabul", coachReviewed: true, presenter: "male" },
  // "Boxing Basics with Tony Jeffries: How to throw a hook punch | SANABUL"
  "boxing-lead-hook": { kind: "youtube", src: "UFVDcNDnpoU", credit: "Tony Jeffries for Sanabul", coachReviewed: true, presenter: "male" },
  // "How to throw a right hook | 3 ways | @myboxingcoach"
  "boxing-rear-hook": { kind: "youtube", src: "H_XAHFApvu4", credit: "MyBoxingCoach (Fran Sands)", coachReviewed: true, presenter: "male" },
  // "How to Throw Lead Uppercut in Boxing"
  "boxing-lead-uppercut": { kind: "youtube", src: "zl2bZwxM_ws", credit: "Tony Jeffries", coachReviewed: true, presenter: "male" },
  // "How to Throw the Rear Uppercut in Boxing | 3 Range" (chapter 0:33 "The rear uppercut")
  "boxing-rear-uppercut": { kind: "youtube", src: "iInkodqd5pE", credit: "Tony Jeffries", coachReviewed: true, skipTo: 33, presenter: "male" },

  // Level 3: combinations
  // "How to Throw a 1 - 2 / Jab - Cross in Boxing"
  "boxing-one-two": { kind: "youtube", src: "vyTaKpylOcU", credit: "Tony Jeffries", coachReviewed: true, presenter: "male" },
  // "*Secret* Tips For Throwing A Perfect Hook To The Body" (chapter 1:15 "Throwing and Landing the Lead Hook to Body")
  "boxing-body-shots": { kind: "youtube", src: "uXsOssBwLoA", credit: "Tony Jeffries", coachReviewed: true, skipTo: 75, presenter: "male" },
  // "8 Uppercut Boxing Combos with Tony Jeffries"
  "boxing-uppercut-hook-combos": { kind: "youtube", src: "xfedkS_apnY", credit: "Tony Jeffries", coachReviewed: true, presenter: "male" },

  // Level 4: defense
  // "How to Block Punches in Boxing" (chapter 00:05 "Basic technique for boxing defensive")
  "boxing-block": { kind: "youtube", src: "teZCdkaQS7g", credit: "Expert Boxing (Johnny N)", coachReviewed: true, skipTo: 5, presenter: "male" },
  // "How to SLIP Punches FASTER in BOXING for boxers" (chapter 0:48 "Tip #1 - Move your head slightly")
  "boxing-slip": { kind: "youtube", src: "DOWc7NMSuEQ", credit: "Tony Jeffries", coachReviewed: true, skipTo: 48, presenter: "male" },
  // "How to Roll a Punch in Boxing | Defense 101"
  "boxing-roll": { kind: "youtube", src: "XIja1S9SXI4", credit: "Tony Jeffries", coachReviewed: true, presenter: "male" },
  // "How to Parry Punches 1 of 3 - Down Parry and Side Parry" (chapter 00:11 "Parry Punches #1 - How you do down parry")
  "boxing-parry": { kind: "youtube", src: "HL261oRyURE", credit: "Expert Boxing (Johnny N)", coachReviewed: true, skipTo: 11, presenter: "male" },
  // "You've Been Doing it Wrong! Boxing Lean Back"
  "boxing-pull-back": { kind: "youtube", src: "7Pli4dauWSE", credit: "Tony Jeffries", coachReviewed: true, presenter: "male" },

  // Level 5: movement
  // "How to Pivot in Boxing" (chapter 0:35 "What is pivot")
  "boxing-pivot": { kind: "youtube", src: "hNclexRmDsY", credit: "Tony Jeffries", coachReviewed: true, skipTo: 35, presenter: "male" },
  // "How to MOVE and PUNCH in BOXING For Beginners" (chapter 1:15 "Step and punch at the same time")
  "boxing-punch-and-move": { kind: "youtube", src: "iTker7Tv6qc", credit: "Tony Jeffries", coachReviewed: true, skipTo: 75, presenter: "male" },
  // "Boxing Footwork | 6 Footwork Defenses with Counter Punches for Boxing on the Heavy Bag"
  "boxing-defend-and-counter": { kind: "youtube", src: "nWG5Q8TPGeo", credit: "Tony Jeffries", coachReviewed: true, presenter: "male" },
  // "Shuffle Cut Drill - boxing footwork angles for attack and defense"
  "boxing-cutting-angles": { kind: "youtube", src: "5xXmAATFCl4", credit: "Expert Boxing (Johnny N)", coachReviewed: true, presenter: "male" },

  // Level 6: ring craft
  // "5 Ranges in Boxing - 90 Second Boxing Tips"
  "boxing-distance": { kind: "youtube", src: "M3IPVxwtGj4", credit: "MyBoxingCoach (Fran Sands)", coachReviewed: true, presenter: "male" },
  // "How to FEINT with Feet in BOXING | 3 Methods" (chapter 0:42 "What is feinting in boxing")
  "boxing-feints-timing": { kind: "youtube", src: "WHxOy3QXbaM", credit: "Tony Jeffries", coachReviewed: true, skipTo: 42, presenter: "male" },
  // "How to Counter Punch the Jab in Boxing" (chapter 1:02 "1. Parry the Jab")
  "boxing-counter-punching": { kind: "youtube", src: "yfpXTRFnYX0", credit: "Tony Jeffries", coachReviewed: true, skipTo: 62, presenter: "male" },
  // "What is Ring Generalship in Boxing (and how to control it)"
  "boxing-ring-control": { kind: "youtube", src: "DqYYsEa4XII", credit: "Expert Boxing (Johnny N)", coachReviewed: true, presenter: "male" },

  // Rounds
  // "Killer Warm Up for Boxing | Do This Warm Up Before Your Training"
  "warmup-basic": { kind: "youtube", src: "qWIRigPKU2c", credit: "Glenn Holmes Boxing Fitness", coachReviewed: true, presenter: "male" },
  // "#1 Boxing Footwork Drill for Beginners" (chapter 0:54 "The most basic footwork drill")
  "shadow-fundamentals": { kind: "youtube", src: "v0y86288Wt0", credit: "Tony Jeffries", coachReviewed: true, skipTo: 54, presenter: "male" },
  // "Quick Shadow Boxing Tutorial by Olympian" (chapter 0:14 "The most important thing in Shadow Boxing")
  "shadow-punches": { kind: "youtube", src: "J4j3AOVWuHE", credit: "Tony Jeffries", coachReviewed: true, skipTo: 14, presenter: "male" },
  // "How to Shadow Box 101 | Complete Shadowboxing Tutorial for Beginners" (chapter 18:41 "Working on Defense")
  "shadow-defense": { kind: "youtube", src: "fWfsbL2ulj8", credit: "Tony Jeffries", coachReviewed: true, skipTo: 1121, presenter: "male" },
  // "Boxing Training Warm Down - How to Get the Perfect Ending to Your Workout"
  "cooldown-basic": { kind: "youtube", src: "dhQCHNYSIww", credit: "MyBoxingCoach (Fran Sands)", coachReviewed: true, presenter: "male" },
};

/**
 * Returns the video to show, or undefined.
 * Our own uploaded clips must be coach-approved. YouTube placeholders are shown with a notice.
 */
export function getDemoVideo(id: string): DemoVideo | undefined {
  const video = DEMO_VIDEOS[id];
  if (!video) return undefined;
  return video.coachReviewed || video.kind === "youtube" ? video : undefined;
}
