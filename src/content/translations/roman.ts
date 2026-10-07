import {
  COMBINATION_CALLOUTS,
  COMBINED_CALLOUTS,
  DEFENSE_CALLOUTS,
  DEFENSE_MIXED_CALLOUTS,
  FIGHT_IQ_CALLOUTS,
  MOVEMENT_CALLOUTS,
  PUNCH_COMBOS,
  PUNCH_COMBOS_BY_LESSON,
} from "../boxing/callouts";
import { calloutName } from "../boxing/moves";
import type { ContentTranslation } from "./types";

/**
 * Roman Urdu content: lessons, drills, moves, opponents, achievements and safety text.
 * Boxing terms (jab, cross, hook, uppercut, guard, stance, round, combo) stay in English, as boxers in Pakistan and India say them.
 */

const GENERAL_SAFETY = "Pehle warm-up karein aur movement control mein rakhein.";
const SOLO_DEFENSE =
  "Ye akele, shadowboxing ki tarah practice karein. Kisi dost ko kabhi apne upar punch maarne ko na kahein; uske liye coach aur sahi gear chahiye.";
const CLEAR_SPACE = "Apne aas paas jagah khali karein aur farsh check karein. Phislan wale farsh par jurabon mein training na karein.";

/**
 * Words that make up a callout, in lower case, as calloutName() writes them ("jab, cross, slip left").
 * Punch names stay in English: that is how boxers call them.
 */
const CALLOUT_WORDS: Record<string, string> = {
  jab: "jab",
  cross: "cross",
  "lead hook": "lead hook",
  "rear hook": "rear hook",
  "lead uppercut": "lead uppercut",
  "rear uppercut": "rear uppercut",
  "body jab": "body jab",
  "body cross": "body cross",
  "body lead hook": "body lead hook",
  "step forward": "aage step",
  "step back": "peeche step",
  "step left": "left step",
  "step right": "right step",
  "guard check": "guard check",
  "reset your stance": "stance reset karein",
  block: "block",
  "slip left": "slip left",
  "slip right": "slip right",
  roll: "roll",
  parry: "parry",
  "pull back": "pull back",
  pivot: "pivot",
  feint: "feint",
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Translates a named callout part by part; returns undefined if any part is unknown. */
function translateCallout(name: string): string | undefined {
  const parts = name.split(",").map((p) => p.trim().toLowerCase());
  if (!parts.every((p) => p in CALLOUT_WORDS)) return undefined;
  return capitalize(parts.map((p) => CALLOUT_WORDS[p]).join(", "));
}

/** Every callout part on its own (both "Slip left" and "slip left") and every full callout as the round screen shows it. */
function calloutPhrases(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [english, roman] of Object.entries(CALLOUT_WORDS)) {
    out[english] = roman;
    out[capitalize(english)] = capitalize(roman);
  }
  const tables = [PUNCH_COMBOS_BY_LESSON, COMBINATION_CALLOUTS, DEFENSE_CALLOUTS, DEFENSE_MIXED_CALLOUTS, COMBINED_CALLOUTS, FIGHT_IQ_CALLOUTS];
  const callouts = [...MOVEMENT_CALLOUTS, ...PUNCH_COMBOS, ...tables.flatMap((t) => Object.values(t).flat())];
  for (const callout of callouts) {
    const name = calloutName(callout);
    const roman = translateCallout(name);
    if (roman) out[name] = roman;
  }
  return out;
}

const STEP_PHRASES: Record<string, string> = {
  // Warm-up
  "Neck circles, slow and gentle": "Gardan ko gol ghumayein, aahista aur aaram se",
  "Shoulder rolls forward and back": "Kandhon ko aage aur peeche ghumayein",
  "Arm circles, small then big": "Baazuon ke circles, pehle chhote phir bade",
  "Hip circles": "Kamar (hips) ko gol ghumayein",
  "Light bounce on the balls of your feet": "Panjon par halka halka uchhlein",
  "Easy step forward and back in stance": "Stance mein aaram se aage aur peeche step karein",
  // Cool-down
  "Slow breathing: in for 4, out for 6": "Aahista saans lein: 4 tak andar, 6 tak bahar",
  "Shoulder and chest stretch": "Kandhon aur seene ka stretch",
  "Shake out your arms and legs": "Baazu aur taangein dheeli kar ke jhatkein",
  // Direction names
  Left: "Left",
  Forward: "Aage",
  Back: "Peeche",
  Right: "Right",
  // Punch names
  Jab: "Jab",
  Cross: "Cross",
  "Lead hook": "Lead hook",
  "Rear hook": "Rear hook",
  "Lead uppercut": "Lead uppercut",
  "Rear uppercut": "Rear uppercut",
  // Round words
  "Get in your stance": "Apne stance mein aa jaayein",
  Time: "Time",
};

export const ROMAN_CONTENT: ContentTranslation = {
  lessons: {
    // ---------------- LEVEL 1 ----------------
    "boxing-stance": {
      title: "Fighting Stance",
      summary: "Har punch aur har step isi base se nikalta hai.",
      whatItIs: "Ek balanced, thoda side par khada position, jis se aap attack, defend aur move kar sakein, balance khoye baghair.",
      whenToUse: "Har waqt. Har punch aur har step ke baad wapas apne stance mein aayein.",
      mechanics: [
        "Pair kandhon jitne khule, lead foot aage (right-handed hain to left foot).",
        "Peeche wala pair taqreeban 45 degree bahar ki taraf, peeche ki aedi thodi upar.",
        "Ghutne halke se mor kar rakhein, wazan dono pairon par barabar.",
        "Jism thoda side par mora hua, taake lead shoulder target ki taraf ho.",
      ],
      commonMistakes: [
        "Dono pair ek seedhi line mein, is se koi bhi aasani se dhakka de kar gira sakta hai.",
        "Seedha saamne khade hona, dono pair barabar.",
        "Ghutne bilkul seedhe aur lock.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Agar stance mein ghutnon ya hips mein dard ho to stance thoda khula karein aur ghutne kam moren."],
      quiz: {
        "stance-q1": {
          question: "Orthodox stance mein kaunsa pair aage hota hai?",
          options: ["Right foot", "Left foot", "Dono barabar"],
          explanation: "Orthodox boxer left foot aage rakhte hain. Southpaw right foot aage rakhte hain.",
        },
        "stance-q2": {
          question: "Pair ek seedhi line mein kyun nahi hone chahiye?",
          options: ["Dekhne mein ghalat lagta hai", "Balance aasani se kho jaata hai", "Jab slow ho jaata hai"],
          explanation: "Ek line mein pair hon to koi base nahi hota, halka sa dhakka ya step bhi aap ko gira sakta hai.",
        },
      },
    },
    "boxing-guard": {
      title: "Guard",
      summary: "Jab punch nahi maar rahe, to haath yahan rehte hain.",
      whatItIs: "Haath aur kohniyon ki position jo sar aur jism ko bachati hai, aur aap ko punch ke liye tayyar rakhti hai.",
      whenToUse: "Hamesha. Har punch guard se shuru hota hai aur wapas guard mein aata hai.",
      mechanics: [
        "Peeche wali muthi gaal ya thodi (chin) ko chhoo rahi ho.",
        "Aage wali muthi aankhon ki seedh mein, chehre se thoda aage.",
        "Kohniyan andar, pasliyon ko cover karti hui.",
        "Chin neeche, aankhen upar target par.",
      ],
      commonMistakes: ["Thakne par haath neeche gira dena.", "Chin upar hawa mein.", "Kohniyan bahar ki taraf khuli hui."],
      safetyNotes: [GENERAL_SAFETY, "Kandhe dheele rakhein; guard ko akra kar pakadne se gardan par zor parta hai."],
      quiz: {
        "guard-q1": {
          question: "Guard mein peeche wali muthi kahan honi chahiye?",
          options: ["Hip par", "Gaal ya chin ko chhooti hui", "Aage ki taraf phaili hui"],
          explanation: "Peeche wala haath chin ko bachata hai aur cross ke liye tayyar rehta hai.",
        },
      },
    },
    "boxing-step-drag": {
      title: "Aage aur Peeche Movement",
      summary: "Step aur drag: pair cross kiye baghair move karein.",
      whatItIs: "Boxing ka basic step. Jis taraf jaana hai us taraf wala pair pehle chalta hai, doosra utna hi peeche aata hai.",
      whenToUse: "Attack ke liye faasla kam karna, ya safe rehne ke liye faasla banana.",
      mechanics: [
        "Aage: peeche wale pair se push karein, lead foot thoda sa aage rakhein, phir peeche wala pair utna hi aage layein.",
        "Peeche: lead foot se push karein, peeche wala pair peeche rakhein, phir lead foot wapas layein.",
        "Step se pehle aur baad stance ki chaurai ek jaisi rakhein.",
        "Chhote steps. Guard upar rahe.",
      ],
      commonMistakes: ["Pair cross karna ya dono pair mila dena.", "Bade bade lambe steps.", "Upar neeche uchhalna."],
      safetyNotes: [GENERAL_SAFETY, "Peeche step lene se pehle peeche ka farsh check karein."],
      quiz: {
        "step-q1": {
          question: "Aage jaate waqt kaunsa pair pehle chalta hai?",
          options: ["Peeche wala pair", "Lead foot", "Koi bhi"],
          explanation: "Jis taraf ja rahe hain, us taraf wala pair pehle chalta hai.",
        },
      },
    },
    "boxing-lateral": {
      title: "Side Movement",
      summary: "Balance mein reh kar left aur right move karna.",
      whatItIs: "Side steps jo aap ko center line se hata dete hain, pair cross kiye baghair.",
      whenToUse: "Aage aate pressure se hatne ke liye aur naye angle dhoondne ke liye.",
      mechanics: [
        "Left ki taraf: pehle lead foot left jaata hai, phir peeche wala pair.",
        "Right ki taraf: pehle peeche wala pair right jaata hai, phir lead foot.",
        "Panjon par rahein aur ghutne mude hue.",
      ],
      commonMistakes: ["Pair cross karna.", "Pair chalane ke bajaye sirf sar ko side par jhukana."],
      safetyNotes: [GENERAL_SAFETY],
      quiz: {
        "lateral-q1": {
          question: "Orthodox stance mein right ki taraf jaate waqt kaunsa pair pehle chalta hai?",
          options: ["Lead (left) foot", "Peeche wala (right) foot"],
          explanation: "Jis taraf ja rahe hain, us taraf wala pair pehle chalta hai.",
        },
      },
    },

    // ---------------- LEVEL 2 ----------------
    "boxing-jab": {
      title: "Jab (1)",
      summary: "Aap ka sab se tez aur sab se safe punch, aage wale haath se.",
      whatItIs: "Aage wale haath ka seedha punch. Is se faasla naapte hain, doosre punch set karte hain aur opponent ko door rakhte hain.",
      whenToUse: "Combo shuru karne, faasla samajhne aur aage aate opponent ko rokne ke liye.",
      mechanics: [
        "Guard se, aage wala haath chin se seedha bahar nikaalein.",
        "Aakhir mein muthi ghumayein taake hatheli neeche ho.",
        "Peeche wala haath chin par rahe.",
        "Haath usi line par seedha wapas guard mein layein.",
      ],
      commonMistakes: [
        "Punch se pehle ya baad haath neeche gira dena.",
        "Peeche wala haath chin se hata lena.",
        "Poora phaila kar kohni lock kar dena.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Shadowboxing mein kohni bachane ke liye haath poora seedha hone se zara pehle rok lein."],
      quiz: {
        "jab-q1": {
          question: "Boxing callouts mein jab ka number kya hai?",
          options: ["1", "2", "3"],
          explanation: "Jab = 1, cross = 2, lead hook = 3, rear hook = 4, lead uppercut = 5, rear uppercut = 6.",
        },
      },
    },
    "boxing-cross": {
      title: "Cross (2)",
      summary: "Peeche wale haath ka seedha power punch.",
      whatItIs: "Peeche wale haath ka seedha punch, jis ki taaqat peeche wala pair, hip aur kandha ghumane se aati hai.",
      whenToUse: "Jab ke baad, ya counter ke taur par jab opponent ka guard khule.",
      mechanics: [
        "Peeche wale pair ke panje par ghoomein, aedi bahar ki taraf.",
        "Hips aur peeche wala kandha aage ghumayein.",
        "Peeche wala haath chin se seedha bahar; aakhir mein hatheli neeche.",
        "Aage wala haath chehre ki hifazat ke liye upar rahe, phir peeche wala haath wapas chin par.",
      ],
      commonMistakes: ["Sirf baazu se punch, hip nahi ghumana.", "Bahut zyada aage jhuk jaana.", "Aage wala haath gir jaana."],
      safetyNotes: [GENERAL_SAFETY, "Ghutne ko zyada na ghumayein; ghoomna pair aur hip se ek saath aata hai."],
      quiz: {
        "cross-q1": {
          question: "Cross ki zyada taaqat kahan se aati hai?",
          options: ["Baazu se", "Peeche wala pair aur hips ghumane se", "Aage chhalaang lagane se"],
          explanation: "Taaqat peeche wale pair se shuru hoti hai aur hips aur kandhe se guzarti hai.",
        },
      },
    },
    "boxing-lead-hook": {
      title: "Lead Hook (3)",
      summary: "Aage wale haath ka chhota, gol ghoomta punch.",
      whatItIs: "Aage wale haath ka hook, jism ghuma kar maara jaata hai taake baazu aap ke saamne se guzre.",
      whenToUse: "Qareeb se, aksar jab-cross ke baad jab opponent beech ko cover kare.",
      mechanics: [
        "Kohni taqreeban kandhe ki oonchai tak, baazu lagbhag 90 degree mura hua.",
        "Lead foot ghumayein aur hips aur kandhe ghumayein.",
        "Baazu jism ke saath chalta hai; akela nahi jhoolta.",
        "Peeche wala haath chin par rahe.",
      ],
      commonMistakes: ["Pehle baazu peeche kheench kar load karna.", "Seedhe baazu se chaura jhoolna.", "Lead foot na ghumana."],
      safetyNotes: [GENERAL_SAFETY, "Ghutne ki hifazat ke liye punch ke saath lead foot ghumayein."],
      quiz: {
        "lhook-q1": {
          question: "Lead hook ke dauran aage wala pair kya kare?",
          options: ["Seedha aur ruka rahe", "Hips ke saath ghoome", "Aage step kare"],
          explanation: "Pair ghumane se jism ghoom paata hai aur ghutna safe rehta hai.",
        },
      },
    },
    "boxing-rear-hook": {
      title: "Rear Hook (4)",
      summary: "Peeche wale haath ka hook.",
      whatItIs: "Peeche wali side ka hook, peeche wala pair aur hips ghuma kar.",
      whenToUse: "Qareeb se, aksar lead hook ke baad ya jab opponent aap ki peeche wali side jhuke.",
      mechanics: [
        "Peeche wala pair ghumayein aur hips aage ghumayein.",
        "Peeche wali kohni upar uthe aur baazu mura rahe.",
        "Aage wala haath wapas aa kar chin ko bachaye.",
      ],
      commonMistakes: ["Zyada jhool kar balance kho dena.", "Aage wala haath gir jaana."],
      safetyNotes: [GENERAL_SAFETY],
      quiz: {
        "rhook-q1": {
          question: "Rear hook maarte waqt kaunsa haath chin bachata hai?",
          options: ["Aage wala haath", "Koi nahi", "Peeche wala haath"],
          explanation: "Jab peeche wala haath punch maarta hai, aage wala haath chehra cover karta hai.",
        },
      },
    },
    "boxing-lead-uppercut": {
      title: "Lead Uppercut (5)",
      summary: "Aage wale haath ka neeche se upar jaata punch.",
      whatItIs: "Aage wale haath ka chhota upar uthta punch: thoda neeche jhuk kar taangon se upar push karein.",
      whenToUse: "Qareeb se, jab opponent aage jhuke ya upar se cover kare.",
      mechanics: [
        "Ghutne mor kar thoda sa lead side ki taraf neeche aayein.",
        "Taangon se upar push karein aur hips ghumayein.",
        "Muthi upar jaaye, hatheli aap ki taraf, kohni mudi hui.",
      ],
      commonMistakes: ["Punch se pehle haath bahut neeche gira dena.", "Bahut door se maarna."],
      safetyNotes: [GENERAL_SAFETY, "Neeche jhukna chhota rakhein; gehri squat ki zaroorat nahi."],
      quiz: {
        "luc-q1": {
          question: "Uppercut ki taaqat kahan se shuru hoti hai?",
          options: ["Taangon aur hips se", "Kalai se", "Gardan se"],
          explanation: "Har punch ki tarah, ye bhi zameen se upar ki taraf shuru hota hai.",
        },
      },
    },
    "boxing-rear-uppercut": {
      title: "Rear Uppercut (6)",
      summary: "Peeche wale haath ka neeche se upar jaata punch.",
      whatItIs: "Peeche wale haath ka chhota upar uthta punch, peeche wali hip aage ghuma kar.",
      whenToUse: "Qareeb se, aksar lead hook ke baad.",
      mechanics: [
        "Thoda sa peeche wali side neeche aayein.",
        "Upar uthte hue peeche wala pair aur hip aage ghumayein.",
        "Muthi upar jaaye, kohni mudi hui; aage wala haath chin bachaye.",
      ],
      commonMistakes: ["Pehle baazu neeche le ja kar load karna.", "Punch maarte waqt peeche jhuk jaana."],
      safetyNotes: [GENERAL_SAFETY],
      quiz: {
        "ruc-q1": {
          question: "Callouts mein rear uppercut ka number kya hai?",
          options: ["4", "5", "6"],
          explanation: "Rear uppercut = 6.",
        },
      },
    },

    // ---------------- LEVEL 3 ----------------
    "boxing-one-two": {
      title: "One-Two (1, 2)",
      summary: "Jab phir cross: boxing ka sab se zaroori combo.",
      whatItIs: "Jab ke foran baad cross. Jab target dhoondta hai aur cross uske peeche jaata hai.",
      whenToUse: "Attack shuru karne, saaf points lene aur lambe combos set karne ke liye.",
      mechanics: [
        "Guard se ek tez jab maarein.",
        "Jab wapas aate hi cross bahar jaaye. Ek haath wapas aata hai jab doosra bahar jaata hai.",
        "Cross par peeche wala pair aur hip ghumayein, bilkul cross wale lesson ki tarah.",
        "Poora waqt chin neeche aur khaali haath chehre par.",
        "Dono haath wapas guard mein, phir peeche ya side par step karein.",
      ],
      commonMistakes: [
        "Jab aur cross ke beech lamba waqfa.",
        "Cross maarte waqt jab wala haath gira dena.",
        "Cross ke saath aage jhuk kar haath lamba karna.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Hawa mein punch maarte waqt kohniyan lock na karein. Poora phailne se zara pehle rok lein."],
      quiz: {
        "onetwo-q1": {
          question: "One-two mein cross kab bahar jaata hai?",
          options: ["Lambe waqfe ke baad", "Jab wapas aate hi", "Jab se pehle"],
          explanation: "Ek haath wapas aata hai jab doosra bahar jaata hai. Is se combo tez rehta hai aur ek haath chehre ke paas rehta hai.",
        },
        "onetwo-q2": {
          question: "One-two ke baad kya karna chahiye?",
          options: ["Khade ho kar dekhte rahein", "Aaraam ke liye haath gira dein", "Haath wapas guard mein, phir move karein"],
          explanation: "Punch ke baad guard mein wapas aayein aur move karein taake aap aasaan target na banein.",
        },
      },
    },
    "boxing-jab-cross-hook": {
      title: "Jab, Cross, Lead Hook (1, 2, 3)",
      summary: "One-two ke saath lead hook jorein.",
      whatItIs: "Teen punch ka combo: jab, cross, phir chhota lead hook.",
      whenToUse: "Jab one-two ke baad opponent beech ko cover kare, to hook guard ke side se ghoom kar jaata hai.",
      mechanics: [
        "Ek saaf one-two maarein.",
        "Cross aap ke hips ko left ghumata hai. Unhein wapas right ghumane se lead hook mein taaqat aati hai.",
        "Hook lagne se pehle peeche wala haath wapas chin par.",
        "Hook chhota rakhein: kohni upar, baazu mura, aage wale pair par ghoomein.",
      ],
      commonMistakes: [
        "Hook load karne ke liye aage wala baazu peeche kheenchna.",
        "Seedhe baazu se hook chaura jhoolna.",
        "Cross ke baad aage wale pair par jhuk jaana, jis se balance kho jaata hai.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Ghutne ki hifazat ke liye hook ke saath aage wala pair ghumayein."],
      quiz: {
        "jch-q1": {
          question: "Cross ke baad lead hook aasani se kyun nikalta hai?",
          options: ["Cross hips ghumata hai, aur wapas ghoomna hook ko taaqat deta hai", "Hook sab se slow punch hai", "Hook ke liye ghoomna zaroori nahi"],
          explanation: "Har punch hips ko ek taraf ghumata hai; agla punch wapas ghoomne ko istemal karta hai.",
        },
      },
    },
    "boxing-body-shots": {
      title: "Body Shots",
      summary: "Ghutne mor kar body par punch.",
      whatItIs: "Pet aur pasliyon par punch. Aap poora jism ghutne mor kar neeche laate hain, aage jhuk kar nahi.",
      whenToUse:
        "Jab opponent haath upar rakhe. Body shots opponent ko thakaate hain aur haath neeche le aate hain. Callouts mein \"body 2\" ka matlab hai body par cross.",
      mechanics: [
        "Ghutne mor kar kandhon ko target tak neeche layein.",
        "Kamar kaafi had tak seedhi aur aankhen upar.",
        "Body jab aur body cross: seedhe punch, bilkul sar wale jaise.",
        "Body hook: kohni neeche, jism ghuma kar maarein.",
        "Khaali haath chin par rahe. Baad mein wapas apne normal stance mein upar aayein.",
      ],
      commonMistakes: [
        "Kamar se aage jhukna, sar aage nikla hua.",
        "Khaali haath chehre se gira dena.",
        "Bahut der tak neeche rehna.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Ghutne utne hi moren jitna aaraam se ho sake. Thoda sa neeche aana kaafi hai."],
      quiz: {
        "body-q1": {
          question: "Body shot ke liye neeche kaise aate hain?",
          options: ["Kamar se aage jhuk kar", "Ghutne mor kar", "Haath gira kar"],
          explanation: "Ghutne morne se balance rehta hai aur sar khatre se bahar rehta hai.",
        },
        "body-q2": {
          question: "Callout \"body 2\" ka kya matlab hai?",
          options: ["Do jab", "Body par cross", "Body hook"],
          explanation: "2 cross hai, is liye \"body 2\" body par cross hai.",
        },
      },
    },
    "boxing-uppercut-hook-combos": {
      title: "Uppercut aur Hook Combos",
      summary: "Qareeb ki range ke liye chhote punch.",
      whatItIs: "Hooks aur uppercuts ke combos, jaise 6, 3 (rear uppercut, lead hook) ya 5, 6, 3.",
      whenToUse: "Qareeb se, jab opponent aap ke paas ho aur cover kar raha ho.",
      mechanics: [
        "Haath badlein: peeche wale haath ka punch aage wale haath ka punch set karta hai, aur ulta bhi.",
        "Har punch hips ko ek taraf ghumata hai; agla punch unhein wapas ghumata hai.",
        "Har punch chhota rakhein. Kohniyan mudi rahein.",
        "Khaali haath chin ko bachaye.",
        "Combo haath upar rakh kar khatam karein, phir move karein.",
      ],
      commonMistakes: [
        "Uppercut ko hip se neeche le ja kar load karna.",
        "Itna chaura jhoolna ke haath chehre se hat jaayein.",
        "Itna andar jhukna ke balance kho jaaye.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Neeche jhukna chhota rakhein. Gehri squat ki zaroorat nahi."],
      quiz: {
        "uphook-q1": {
          question: "\"6, 3\" ka kya matlab hai?",
          options: ["Rear uppercut, phir lead hook", "Lead uppercut, phir cross", "Rear hook, phir jab"],
          explanation: "6 rear uppercut hai aur 3 lead hook.",
        },
        "uphook-q2": {
          question: "Hooks aur uppercuts kis range par sab se acha kaam karte hain?",
          options: ["Door ki range", "Qareeb ki range", "Range se bahar"],
          explanation: "Ye chhote punch hain. Door se ye miss ho jaate hain ya aap ko haath lamba karna parta hai.",
        },
      },
    },

    // ---------------- LEVEL 4 ----------------
    "boxing-block": {
      title: "Block (High Guard)",
      summary: "Cover karein taake punch gloves aur baazuon par lagein.",
      whatItIs: "Dono gloves maathe tak upar aate hain aur kohniyan aapas mein mil jaati hain, taake punch gloves aur baazuon par lagein.",
      whenToUse: "Jab punch tez aa rahe hon aur aap slip ya move na kar sakein. Block karein, phir wapas punch maarein ya hat jaayein.",
      mechanics: [
        "Dono gloves maathe tak upar layein, gloves sar ko chhoote hue.",
        "Kohniyan andar, aapas mein qareeb, taake body cover ho.",
        "Chin neeche. Aankhen khuli, gloves ke beech ya upar se dekhte hue.",
        "Ghutne thode mor kar apne stance mein mazboot rahein.",
        "Jaise hi punch rukein, wapas punch maarein ya move karein.",
      ],
      commonMistakes: [
        "Aankhen band kar lena ya farsh ko dekhna.",
        "Gloves sar se door rakhna, jis se punch unhein aap ke chehre par maar deta hai.",
        "Cover mein hi rehna aur kabhi wapas punch na maarna.",
      ],
      safetyNotes: [GENERAL_SAFETY, SOLO_DEFENSE],
      quiz: {
        "block-q1": {
          question: "Block karte waqt aankhen kahan honi chahiye?",
          options: ["Band", "Farsh par", "Opponent par, gloves ke beech se"],
          explanation: "Aap ko dekhna hai ke aage kya aa raha hai, is liye aankhen khuli aur upar rakhein.",
        },
        "block-q2": {
          question: "Block ke baad kya karna chahiye?",
          options: ["Der tak cover mein rahein", "Wapas punch maarein ya move karein", "Peeth mor lein"],
          explanation: "Block aakhri cheez nahi. Punch se jawab dein ya kisi safe jagah move karein.",
        },
      },
    },
    "boxing-slip": {
      title: "Slip",
      summary: "Seedhe punch ki line se sar thoda sa hata lein.",
      whatItIs: "Sar ki ek chhoti, tez harkat left ya right, taake seedha punch aap ke paas se guzar jaaye.",
      whenToUse: "Seedhe punches ke khilaaf: jab aur cross. Aksar jab ke khilaaf slip right aur cross ke khilaaf slip left.",
      mechanics: [
        "Ghutne thode moren aur kandhe ghumayein. Kamar se na jhukein.",
        "Slip left: peeche wala kandha thoda aage ghumayein, taake sar aage wale ghutne ke upar aa jaaye.",
        "Slip right: aage wala kandha thoda andar ghumayein, taake sar zara sa right chala jaaye.",
        "Chhota rakhein: bas itna ke punch miss ho jaaye, phir wapas guard mein.",
        "Haath upar aur aankhen opponent par.",
      ],
      commonMistakes: [
        "Sar bahut zyada hilana, jis se balance kho jaata hai.",
        "Kamar se aage jhuk kar neeche dekhna.",
        "Slip karte waqt haath gira dena.",
      ],
      safetyNotes: [GENERAL_SAFETY, SOLO_DEFENSE],
      quiz: {
        "slip-q1": {
          question: "Kaunse punch slip kiye jaate hain?",
          options: ["Seedhe punch jaise jab aur cross", "Uppercuts", "Body hooks"],
          explanation: "Slip sar ko us seedhi line se hata deta hai jis par jab ya cross aata hai.",
        },
        "slip-q2": {
          question: "Slip kitna bada hona chahiye?",
          options: ["Jitna bada ho sake", "Bas itna ke punch miss ho jaaye", "Side par poora ek step"],
          explanation: "Chhota slip aap ko balance mein aur wapas punch maarne ke liye qareeb rakhta hai.",
        },
      },
    },
    "boxing-roll": {
      title: "Roll (Bob and Weave)",
      summary: "Ghutne mor kar hook ke neeche se nikal jaayein.",
      whatItIs: "Aap ghutne morte hain aur sar ko neeche, side se, phir upar le jaate hain, angrezi harf U ki tarah, taake hook sar ke upar se guzar jaaye.",
      whenToUse: "Hooks aur doosre chaure punches ke khilaaf. Ye uppercuts ke khilaaf kaam nahi karta.",
      mechanics: [
        "Neeche jaane ke liye ghutne moren. Kamar kaafi had tak seedhi rakhein.",
        "Sar ko U shape mein le jaayein: neeche, side se, phir doosri taraf upar.",
        "Haath upar aur aankhen saamne, farsh par nahi.",
        "Apne stance mein upar aayein, wapas punch ke liye tayyar.",
      ],
      commonMistakes: [
        "Kamar se jhuk kar farsh ko dekhna.",
        "Bahut zyada neeche chale jaana, jis se upar aane mein der lagti hai.",
        "Roll ke dauran haath gira dena.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Sirf utna neeche jaayein jitna ghutnon ke liye aaraam se ho. Chhota roll kaafi hai.", SOLO_DEFENSE],
      quiz: {
        "roll-q1": {
          question: "Kis punch ke neeche roll kiya jaata hai?",
          options: ["Hook", "Uppercut", "Body par jab"],
          explanation: "Hook side se sar ki oonchai par aata hai, is liye aap uske neeche ja sakte hain. Uppercut mein roll karna khatarnak hai.",
        },
        "roll-q2": {
          question: "Roll mein zyada kaam kaun karta hai?",
          options: ["Gardan", "Kamar", "Ghutne"],
          explanation: "Ghutne moren taake sar upar rahe aur aankhen opponent par rahein.",
        },
      },
    },
    "boxing-parry": {
      title: "Parry",
      summary: "Peeche wale haath se jab ko halka sa tap kar ke hata dein.",
      whatItIs: "Glove se ek chhota tap jo seedhe punch ko uski line se hata deta hai, taake wo aap ke chehre ko miss kare.",
      whenToUse: "Jab ke khilaaf. Aap ka peeche wala haath opponent ka jab pakadta ya tap karta hai.",
      mechanics: [
        "Peeche wala haath istemal karein. Harkat chhoti aur chehre ke qareeb rakhein.",
        "Punch ko thoda side par ya neeche tap karein. Usse milne ke liye haath aage na barhayein.",
        "Aage wala haath upar rahe, punch ke liye tayyar.",
        "Peeche wala haath seedha wapas chin par layein.",
      ],
      commonMistakes: [
        "Punch se milne ke liye haath door tak barhana.",
        "Bada sa jhatka jo chehra khula chhor de.",
        "Har chhoti harkat par react karna, jis se fake punch aap ko bewaqoof bana dete hain.",
      ],
      safetyNotes: [GENERAL_SAFETY, SOLO_DEFENSE],
      quiz: {
        "parry-q1": {
          question: "Opponent ke jab ko aam taur par kaunsa haath parry karta hai?",
          options: ["Aap ka peeche wala haath", "Aap ka aage wala haath", "Dono haath"],
          explanation: "Peeche wala haath unke jab ke saamne hota hai aur chhoti si harkat se use tap kar ke hata sakta hai.",
        },
      },
    },
    "boxing-pull-back": {
      title: "Pull Back",
      summary: "Reach se zara bahar peeche jhukein, phir wapas punch maarein.",
      whatItIs: "Aap wazan peeche wale pair par le aate hain taake sar peeche ho jaaye, punch ki pahunch se zara bahar.",
      whenToUse: "Jab ya cross ke khilaaf, jab aap opponent ki pahunch ke kinare par hon. Phir cross ke saath aage aayein.",
      mechanics: [
        "Wazan peeche wale pair par le jaayein aur peeche wala ghutna moren.",
        "Sar thoda peeche jaaye, lekin peeche wale pair ke upar hi rahe.",
        "Chin neeche, haath upar.",
        "Peeche wale pair se push karein aur counter ke saath aage aayein, jaise cross.",
      ],
      commonMistakes: [
        "Itna peeche jhukna ke sar peeche wale pair se bhi peeche chala jaaye.",
        "Jhukte waqt chin upar utha dena.",
        "Baar baar seedhi line mein peeche hatna.",
      ],
      safetyNotes: [GENERAL_SAFETY, "Itna peeche na jhukein ke gir sakein. Dono pair farsh par rakhein.", SOLO_DEFENSE],
      quiz: {
        "pullback-q1": {
          question: "Pull back mein wazan kahan jaata hai?",
          options: ["Aage wale pair par", "Peeche wale pair par", "Panjon par"],
          explanation: "Peeche wale pair par wazan se sar peeche jaata hai aur aap balance mein rehte hain.",
        },
      },
    },

    // ---------------- LEVEL 5 ----------------
    "boxing-pivot": {
      title: "Pivot",
      summary: "Direction badalne ke liye aage wale pair par ghoomein.",
      whatItIs: "Aap aage wale pair ke panje par rehte hain aur peeche wala pair ghumate hain, taake poora jism ghoom jaaye, jaise qabze par darwaza.",
      whenToUse: "Aage aate opponent ke raaste se hatne, corner se nikalne aur naya angle dhoondne ke liye.",
      mechanics: [
        "Wazan aage wale pair ke panje par rakhein.",
        "Peeche wala pair chauthai gol (quarter circle) mein ghumayein. Hips aur kandhe saath ghoomein.",
        "Stance ki chaurai aur guard upar rakhein.",
        "Aakhir mein phir se target ki taraf mooh, achhe stance mein.",
        "Pehle ek taraf quarter turn practice karein, phir doosri taraf.",
      ],
      commonMistakes: [
        "Panje ke bajaye aedi par ghoomna.",
        "Pair bahut qareeb aa jaana ya cross ho jaana.",
        "Ghoomte waqt haath gira dena.",
      ],
      safetyNotes: [GENERAL_SAFETY, CLEAR_SPACE],
      quiz: {
        "pivot-q1": {
          question: "Pivot pair ke kis hisse par hota hai?",
          options: ["Peeche wale pair ki aedi", "Aage wale pair ka panja", "Poora seedha pair"],
          explanation: "Aage wale pair ka panja aasani se ghoomta hai aur ghutna safe rakhta hai.",
        },
      },
    },
    "boxing-punch-and-move": {
      title: "Punch aur Move",
      summary: "Combo ke baad kabhi khade na rahein.",
      whatItIs: "Aap combo maarte hain aur foran move karte hain: peeche, ya side par.",
      whenToUse: "Har attack ke baad. Punch ke baad move karne se opponent ka counter miss hota hai.",
      mechanics: [
        "Combo achhe form ke saath maarein.",
        "Pehle haath wapas guard mein.",
        "Phir step aur drag se move karein: peeche, left ya right.",
        "Chhote steps. Stance mein rahein aur aankhen target par.",
      ],
      commonMistakes: [
        "Punch ke baad opponent ke saamne khade rehna.",
        "Haath neeche kar ke move karna.",
        "Move karte waqt pair cross karna.",
      ],
      safetyNotes: [GENERAL_SAFETY, CLEAR_SPACE],
      quiz: {
        "punchmove-q1": {
          question: "Combo ke foran baad kya karna chahiye?",
          options: ["Use dekh kar khush hona", "Move: peeche ya side par", "Aaraam ke liye haath gira dena"],
          explanation: "Punch ke baad move karne se aap wapas maar khaane se bachte hain.",
        },
      },
    },
    "boxing-defend-and-counter": {
      title: "Defend aur Counter",
      summary: "Defend karein, phir foran wapas punch maarein.",
      whatItIs: "Aap defense ki harkat karte hain aur foran wapas punch maarte hain, jab tak opponent abhi khula hai.",
      whenToUse:
        "Har baar jab aap defend karein. Achhe jode: slip right phir cross, slip left phir lead hook, roll phir 3, 2, block phir 3, 2, parry ya pull back phir cross.",
      mechanics: [
        "Defense chhota rakhein, taake aap punch maarne jitne qareeb rahein.",
        "Foran wapas punch maarein. Intezaar na karein.",
        "Defense counter ko load karta hai: slip left lead hook ko load karta hai, slip right cross ko.",
        "Counter ke baad wapas guard mein aur move karein.",
      ],
      commonMistakes: [
        "Defend karne ke baad bahut der intezaar karna.",
        "Badi harkat se defend karna, jis se aap punch maarne ke liye bahut door ho jaate hain.",
        "Counter ke baad defense bhool jaana.",
      ],
      safetyNotes: [GENERAL_SAFETY, SOLO_DEFENSE],
      quiz: {
        "defcounter-q1": {
          question: "Slip left ke baad kaunsa punch tayyar hota hai?",
          options: ["Lead hook (3)", "Rear uppercut (6)", "Koi nahi"],
          explanation: "Slip left se wazan aage wali side par aata hai, jo lead hook ko load karta hai.",
        },
        "defcounter-q2": {
          question: "Counter kab aana chahiye?",
          options: ["Kuch second baad", "Defense ke foran baad", "Sirf do defense ke baad"],
          explanation: "Mauqa sirf ek pal ke liye hota hai, jab unka punch bahar ho ya wapas aa raha ho.",
        },
      },
    },
    "boxing-cutting-angles": {
      title: "Angles Banana",
      summary: "Side par step karein taake aap maar sakein aur maar na khayein.",
      whatItIs: "Aap apne aur opponent ke beech ki seedhi line se hat jaate hain, side step ya pivot se, taake unhein aap ko dhoondne ke liye ghoomna pare.",
      whenToUse: "Combo ke baad, ya jab opponent seedha aap par aaye.",
      mechanics: [
        "Combo ke baad ek chhota side step ya pivot lein.",
        "Stance mein rahein. Pair cross na karein.",
        "Foran phir se target ki taraf mooh karein.",
        "Jab tak opponent aap ko dhoondne ke liye ghoom raha ho, punch maarein.",
      ],
      commonMistakes: [
        "Bade steps jo balance bigaar dein.",
        "Side par step karna lekin phir target ki taraf mooh na karna.",
        "Hamesha ek hi taraf jaana, jis se aap ko parhna aasaan ho jaata hai.",
      ],
      safetyNotes: [GENERAL_SAFETY, CLEAR_SPACE],
      quiz: {
        "angles-q1": {
          question: "Combo ke baad side par step kyun karein?",
          options: ["Aaraam karne ke liye", "Taake opponent ko aap ko dhoondne ke liye ghoomna pare", "Ropes ke qareeb jaane ke liye"],
          explanation: "Naye angle se aap punch maar sakte hain jab ke unke counter ko pehle ghoomna parta hai.",
        },
      },
    },

    // ---------------- LEVEL 6 ----------------
    "boxing-distance": {
      title: "Faasla (Distance)",
      summary: "Jaanein kab aap range mein hain aur kab nahi.",
      whatItIs: "Distance aap ke aur opponent ke beech ka faasla hai. Door ki range jab aur cross ke liye, qareeb ki range hooks aur uppercuts ke liye.",
      whenToUse: "Har waqt. Punch ke liye andar step karein, jab punch na maar rahe hon to bahar step karein.",
      mechanics: [
        "Faasla naapne ke liye jab istemal karein.",
        "Jab punch na maar rahe hon, to opponent ki pahunch se zara bahar rahein.",
        "Punch ke liye andar step karein, phir bahar step karein.",
        "Range ke hisaab se punch chunein: door se seedhe punch, qareeb se hooks aur uppercuts.",
      ],
      commonMistakes: [
        "Range mein khade ho kar kuch na karna.",
        "Bahut door se haath lamba karna ya chhalaang laga kar andar aana.",
        "Door ki range se hooks maarna.",
      ],
      safetyNotes: [GENERAL_SAFETY, CLEAR_SPACE],
      quiz: {
        "distance-q1": {
          question: "Door ki range par kaunsa punch sab se acha hai?",
          options: ["Jab", "Lead uppercut", "Rear hook"],
          explanation: "Jab aap ka sab se lamba punch hai aur faasla naapne ka sab se safe tareeqa.",
        },
      },
    },
    "boxing-feints-timing": {
      title: "Feints aur Timing",
      summary: "Fake punch karein, reaction parhein, sahi waqt par punch maarein.",
      whatItIs: "Feint ek fake punch hai jo opponent se reaction karwata hai. Timing ka matlab hai sahi waqt par punch maarna, misaal ke taur par jab haath neeche girein.",
      whenToUse: "Mohtaat opponents aur counter punchers ke khilaaf, taake wo khulein ya react karein.",
      mechanics: [
        "Chhoti harkat se feint karein: kandhe ka halka jhatka ya aadha jab.",
        "Haath tezi se wapas guard mein layein.",
        "Reaction dekhein: kya haath hilte hain, kya opponent peeche hatta hai?",
        "Jo jagah khuli dikhe wahan punch maarein.",
        "Apna rhythm badlein. Har baar ek hi beat par punch na maarein.",
      ],
      commonMistakes: [
        "Badi harkat se feint karna jo aap ko khula chhor de.",
        "Baghair plan ke feint karna ke aage kya karna hai.",
        "Hamesha ek hi rhythm, jis se aap ko parhna aasaan ho jaata hai.",
      ],
      safetyNotes: [GENERAL_SAFETY],
      quiz: {
        "feint-q1": {
          question: "Feint kya hai?",
          options: ["Fake punch jo opponent se reaction karwaye", "Bahut zor ka punch", "Block karne ka tareeqa"],
          explanation: "Feint ek reaction nikalta hai jise aap istemal kar sakte hain.",
        },
      },
    },
    "boxing-counter-punching": {
      title: "Counter Punching",
      summary: "Unhein miss karwayein, phir unhein saza dein.",
      whatItIs: "Aap opponent ko attack karne dete hain, chhoti harkat se defend karte hain, aur jab wo khule hon to wapas maarte hain.",
      whenToUse: "Un opponents ke khilaaf jo bahut attack karte hain. Achhe counters: slip right phir cross, pull back phir cross, parry phir cross, roll phir 3, 2.",
      mechanics: [
        "Pur sukoon rahein, aankhen opponent par.",
        "Punch dekhein aur chhoti harkat se defend karein.",
        "Jab unka punch miss ho ya wapas aa raha ho, counter maarein.",
        "Counter ke baad wapas guard mein, dobara defend karne ke liye tayyar.",
      ],
      commonMistakes: [
        "Sirf intezaar karna aur khud kabhi attack na karna.",
        "Defend karna lekin counter na maarna.",
        "Bade, bekaaboo counters jo aap ko khula chhor dein.",
      ],
      safetyNotes: [GENERAL_SAFETY, SOLO_DEFENSE],
      quiz: {
        "counter-q1": {
          question: "Counter ka sab se acha waqt kab hai?",
          options: ["Unke move karne se pehle", "Jab unka punch miss ho ya wapas aa raha ho", "Unke guard theek karne ke baad"],
          explanation: "Jab unka haath bahar ho ya wapas aa raha ho, wo side khuli hoti hai.",
        },
      },
    },
    "boxing-ring-control": {
      title: "Ring Control",
      summary: "Beech mein rahein aur ropes se door.",
      whatItIs: "Footwork se ring ke beech ke qareeb rehna aur ropes aur corners se door rehna.",
      whenToUse: "Poore round mein. Ghar par apni jagah ke gird ring ke kinare imagine karein.",
      mechanics: [
        "Beech ke qareeb rehne ki koshish karein.",
        "Jab peeth ropes ke qareeb ho, side step ya pivot se bahar niklein, seedha peeche nahi.",
        "Zyada der seedhi line mein peeche na hatein.",
        "Beech wapas lene ke liye jab ke peeche aage barhein.",
      ],
      commonMistakes: [
        "Seedha peeche ropes ya corner mein chale jaana.",
        "Pair cross kar ke gol ghoomna.",
        "Opponent ke peeche bekaaboo bhaagna.",
      ],
      safetyNotes: [GENERAL_SAFETY, CLEAR_SPACE],
      quiz: {
        "ring-q1": {
          question: "Aap ki peeth ropes ke qareeb hai. Aap kya karenge?",
          options: ["Peeche hatte rahein", "Side step ya pivot kar ke bahar niklein", "Khade ho kar cover karein"],
          explanation: "Side par jaana ya pivot karna aap ko wapas beech mein le aata hai. Peeche hatna aap ko phansa deta hai.",
        },
      },
    },
  },

  levels: {
    1: { title: "Fundamentals", goal: "Boxer ki tarah khade hon, guard rakhein aur move karein." },
    2: { title: "Basic Punches", goal: "Chhe (6) punch achhe form ke saath maarein." },
    3: { title: "Combinations", goal: "Punches ko jor kar rawaan combos banayein." },
    4: { title: "Defense", goal: "High guard, slip, roll, parry aur pull back." },
    5: { title: "Combined Training", goal: "Move, punch aur defend, sab ek saath." },
    6: { title: "Fight IQ", goal: "Distance, timing, counters aur opponent ko parhna." },
  },

  drills: {
    "warmup-basic": { title: "Warm-up", description: "Joints ghumana, halka uchhalna aur baazu jhulana, taake aap safe tareeqe se tayyar hon." },
    "shadow-fundamentals": {
      title: "Stance aur Movement Round",
      description: "Bolay gaye callouts follow karein: aage, peeche, left, right step. Guard upar rakhein.",
    },
    "shadow-punches": { title: "Punch Callout Round", description: "Jo punch number sunein (1 se 6) wo maarein aur wapas guard mein aayein." },
    "shadow-combos": {
      title: "Combo Round",
      description: "Lambe combos aur body shots follow karein. Har combo ke baad haath wapas guard mein.",
    },
    "shadow-defense": {
      title: "Defense Round",
      description: "Call par block, slip, roll, parry aur pull back karein, phir wapas punch maarein. Chhoti harkatein, haath upar.",
    },
    "shadow-combined": {
      title: "Move, Punch, Defend Round",
      description: "Ek hi round mein punch, move, defend aur counter. Combos ke baad pivot karein aur line se hat jaayein.",
    },
    "shadow-ring-iq": {
      title: "Ring IQ Round",
      description: "Feints, counters, distance aur ring control. Saamne ek opponent imagine karein.",
    },
    "reaction-punch-numbers": { title: "Quick Reaction", description: "Ek cue chamakta hai. Jitni jaldi ho sake milta hua button dabayein." },
    "recall-combos": { title: "Combo Yaad Karein", description: "Ek combo 2 second dekhein, phir yaad se enter karein." },
    "quiz-lesson": { title: "Lesson Check", description: "Abhi jo seekha us par chhote sawal." },
    "fightiq-opponent": { title: "Opponent ko Parhein", description: "Aap ka opponent ek move karta hai. Sab se samajhdaar jawab chunein." },
    "cooldown-basic": { title: "Cool-down", description: "Aahista saans aur halke stretches." },
  },

  moves: {
    guard: { name: "Guard", cue: "Haath gaalon par, kohniyan andar, chin neeche." },
    jab: { name: "Jab", cue: "Chin se seedha bahar, jhatke se wapas." },
    cross: { name: "Cross", cue: "Peeche wali hip aur aedi ghumayein, peeche wala haath seedha bahar." },
    "lead-hook": { name: "Lead hook", cue: "Kohni muthi ke barabar upar, aage wale pair par ghoomein." },
    "rear-hook": { name: "Rear hook", cue: "Peeche wali hip poori ghumayein, kohni upar rakhein." },
    "lead-uppercut": { name: "Lead uppercut", cue: "Thoda neeche aayein, phir taangon se upar push karein." },
    "rear-uppercut": { name: "Rear uppercut", cue: "Neeche aayein, phir peeche wali hip se upar uthayein, hatheli aap ki taraf." },
    "step-forward": { name: "Aage step", cue: "Pehle aage wala pair, peeche wala utna hi peeche aaye." },
    "step-back": { name: "Peeche step", cue: "Pehle peeche wala pair, phir aage wala. Guard upar rahe." },
    "step-left": { name: "Left step", cue: "Pehle left pair, phir right pair. Pair kabhi cross na karein." },
    "step-right": { name: "Right step", cue: "Pehle right pair, phir left pair. Pair kabhi cross na karein." },
    "guard-check": { name: "Guard check", cue: "Haath gaalon tak upar, kohniyan andar, chin neeche." },
    reset: { name: "Stance reset karein", cue: "Pair kandhon jitne khule, aage wala pair aage, halka uchhaal." },
    "body-jab": { name: "Body jab", cue: "Ghutne mor kar neeche aayein, phir body par seedha jab." },
    "body-cross": { name: "Body cross", cue: "Ghutne moren, peeche wali hip ghumayein, body par cross." },
    "body-hook": { name: "Body hook", cue: "Ghutne moren, kohni neeche, jism ghuma kar hook maarein." },
    block: { name: "Block", cue: "Gloves maathe par, kohniyan andar, chin neeche. Aankhen khuli." },
    "slip-left": { name: "Slip left", cue: "Chhota sa ghoomein, ghutne moren, sar aage wale ghutne ke upar." },
    "slip-right": { name: "Slip right", cue: "Doosri taraf chhota sa ghoomein, sar zara sa right." },
    roll: { name: "Roll", cue: "Ghutne moren, kamar nahi. Sar U ki shakal mein le jaayein." },
    parry: { name: "Parry", cue: "Peeche wale haath se chhota tap, phir seedha wapas chin par." },
    "pull-back": { name: "Pull back", cue: "Wazan peeche wale pair par, sar pahunch se zara bahar. Chin neeche." },
    pivot: { name: "Pivot", cue: "Aage wale pair ke panje par rahein. Peeche wala pair ghumayein." },
    feint: { name: "Feint", cue: "Ek chhota fake jab. Haath tezi se wapas. Reaction dekhein." },
  },

  phrases: { ...calloutPhrases(), ...STEP_PHRASES },

  opponents: {
    aggressor: {
      name: "The Aggressor",
      description: "Lagataar aage ka pressure aur bade punch.",
      lesson: "Pressure ke saamne khade na rahein. Line se hatein aur jab wo andar aayein to unhein saza dein.",
      scenarios: {
        "agg-1": {
          situation: "Aggressor seedha aap par charge karta hai, chaura rear hook maarte hue.",
          options: ["Seedhi line mein peeche hatein", "Side par step karein aur jab maarein", "Haath gira kar punch ka badla punch"],
          explanation: "Seedhi line mein peeche hatne se pressure aap ko pakad leta hai. Line se hatne se wo miss karte hain aur jab ka mauqa banta hai.",
        },
        "agg-2": {
          situation: "Wo har combo ke baad chin upar kar ke aage chalte rehte hain.",
          options: ["Jab wo andar aayein to jab maarein", "Peeth mor lein", "Door se slow uppercut maarein"],
          explanation: "Tez jab unhein andar aate hi milta hai aur unka aage ka zor rok deta hai.",
        },
        "agg-3": {
          situation: "Aap ring ke corner ke qareeb hain aur wo tezi se qareeb aa rahe hain.",
          options: ["Corner mein reh kar cover karein", "Pivot karein aur ropes ke saath saath khuli jagah ki taraf jaayein", "Seedha aage bhaagein"],
          explanation: "Cover karne se thodi der bach jaate hain, lekin corner se nikalna aap ko wapas beech mein le aata hai.",
        },
      },
    },
    "counter-puncher": {
      name: "The Counter Puncher",
      description: "Aap ke attack ka intezaar karta hai, phir wapas maarta hai.",
      lesson: "Sust akele punch na maarein. Feints istemal karein aur mazboot guard ke peeche combos poore karein.",
      scenarios: {
        "cp-1": {
          situation: "Jab bhi aap sust jab maarte hain, wo slip kar ke wapas cross maarte hain.",
          options: ["Wahi jab aur zor se maarein", "Double jab maarein aur peeche wala haath chin par rakhein", "Punch maarna bilkul band kar dein"],
          explanation: "Tight guard ke saath tez double jab se unka counter miss hota hai ya gloves par lagta hai.",
        },
        "cp-2": {
          situation: "Wo khade intezaar kar rahe hain, haath upar.",
          options: ["Jab ka feint karein aur unka reaction dekhein", "Bekaaboo hook ke saath andar ghus jaayein", "Mur kar chale jaayein"],
          explanation: "Feint unka counter bahar nikalta hai taake aap use aata dekh sakein aur uske hisaab se plan karein.",
        },
        "cp-3": {
          situation: "Aap ka jab-cross lagta hai. Wo lead hook se counter shuru karte hain.",
          options: ["Seedhe khade ho kar apne punch dekh kar khush hon", "Wapas guard mein aayein aur line se hatein", "Haath neeche kar dein"],
          explanation: "Counter punchers ke khilaaf, combo ke baad ka defense utna hi zaroori hai jitna combo.",
        },
      },
    },
    defensive: {
      name: "The Defensive Fighter",
      description: "Block karta hai aur move karta hai; saaf maarna mushkil.",
      lesson: "Target badalte rahein aur akele punch ke bajaye combos istemal karein.",
      scenarios: {
        "def-1": {
          situation: "Unka high guard tight hai. Aap ke akele jab sirf gloves par lagte hain.",
          options: ["Gloves par akele jab maarte rahein", "Sar par jab, phir body par cross", "Intezaar karein ke wo haath neeche karein"],
          explanation: "Jab haath upar rehte hain, to body khuli hoti hai. Target badalne se tight guard toot jaata hai. Intezaar safe hai lekin unhein waqt deta hai.",
        },
        "def-2": {
          situation: "Jab bhi aap ek punch maarte hain, wo peeche step kar ke range se bahar ho jaate hain.",
          options: ["Bada hook le kar unke peeche lapkein", "Jab ke peeche andar step karein aur 1, 2, 3 se khatam karein", "Haar maan kar khade ho jaayein"],
          explanation: "Ek punch se bachna aasaan hai. Jab faasla kam karta hai aur combo unhein pakad leta hai.",
        },
        "def-3": {
          situation: "Aap ke one-two ke baad wo aap ke saamne cover kar lete hain.",
          options: ["Guard ke side se lead hook maarein, phir move karein", "Ruk kar unhein dekhein", "Dono haathon se dhakka dein"],
          explanation: "Cover wala guard beech ko bachata hai. Hook side se ghoom kar jaata hai, phir unke jawab se pehle aap move karte hain.",
        },
      },
    },
    pressure: {
      name: "The Pressure Fighter",
      description: "Ring ka raasta band karta hai aur body par kaam karta hai.",
      lesson: "Angles istemal karein aur fight ko ring ke beech mein rakhein.",
      scenarios: {
        "press-1": {
          situation: "Wo aap ko qadam ba qadam ropes ki taraf le ja rahe hain.",
          options: ["Seedhi line mein peeche hatte rahein", "Pivot ya side step kar ke wapas beech mein aayein", "Mur kar bhaag jaayein"],
          explanation: "Seedhi line mein peeche hatna ropes par khatam hota hai. Pivot ya side step aap ko wapas beech mein le aata hai.",
        },
        "press-2": {
          situation: "Wo qareeb aate hain, sar neeche, aap ki body par hooks maarte hue.",
          options: ["Dono haath pet par gira dein", "Kohniyan andar kar ke body cover karein, phir andar aate hi uppercut", "Unke upar aage jhuk jaayein"],
          explanation:
            "Tight kohniyan body cover karti hain aur haath chehre ke paas rehte hain. Neeche sar seedha uppercut mein aata hai. Dono haath girane se body shot to rukta hai lekin sar khul jaata hai.",
        },
        "press-3": {
          situation: "Aap ka one-two lagta hai, lekin wo aage chalte rehte hain.",
          options: ["Unke saamne reh kar punch ka badla punch", "Punch maarein, phir side par step kar ke unki taraf mur jaayein", "Cover kar ke intezaar karein"],
          explanation:
            "Punch maarein aur line se hatein. Wo khaali jagah mein chale jaate hain jab ke aap phir se tayyar hote hain. Cover karne se bach to jaate hain lekin wo pressure jaari rakhte hain.",
        },
      },
    },
    technician: {
      name: "The Technician",
      description: "Balanced, sabr wala, ghaltiyon ki saza deta hai.",
      lesson: "Har fundamental zaroori hai; koi ek trick nahi hoti.",
      scenarios: {
        "tech-1": {
          situation: "Wo aap ki range se zara bahar reh kar intezaar karte hain.",
          options: ["Jab ka feint karein aur dekhein wo kaise react karte hain", "Bekaaboo combo ke saath andar bhaagein", "Unhein lalchane ke liye guard gira dein"],
          explanation: "Feint ka koi nuqsaan nahi aur ye dikhata hai ke wo kaise react karte hain, taake aap apna asal attack plan kar sakein.",
        },
        "tech-2": {
          situation: "Jab bhi aap andar step karte hain wo tez jab maarte hain.",
          options: ["Phir usi tarah andar step karein", "Slip right karein aur cross se counter karein", "Sar pher kar aankhen band kar lein"],
          explanation: "Unka jab pehle se pata hai. Use slip karein aur jab tak unka haath bahar hai, cross se jawab dein.",
        },
        "tech-3": {
          situation: "Aap poore round ek hi beat par one-two maar rahe hain, aur wo uska counter karne lage hain.",
          options: ["Wahi rhythm rakhein", "Timing badlein: feint, ruk kar, phir punch", "Punch maarna bilkul band kar dein"],
          explanation: "Acha fighter rhythm parhta hai. Apni timing badlein taake wo andaaza na laga sakein ke punch kab aayega.",
        },
      },
    },
  },

  achievements: {
    first_session: { title: "Pehla Session", description: "Apna pehla training session poora karein." },
    stance_ready: { title: "Stance Ready", description: "Level 1 ke saare lessons poore karein." },
    six_punches: { title: "Chhe ke Chhe", description: "Level 2 ke saare punch lessons poore karein." },
    streak_3: { title: "Lagataar Teen", description: "Lagataar 3 din training karein." },
    streak_7: { title: "7 Din ki Streak", description: "Lagataar 7 din training karein." },
    quick_hands: { title: "Tez Haath", description: "Reaction drill mein average 600 ms se kam." },
    perfect_recall: { title: "Perfect Yaaddasht", description: "Combo recall drill mein 100 score karein." },
    ring_iq: { title: "Ring IQ", description: "Fight IQ opponent ko 80 ya us se zyada se haraayein." },
    ten_sessions: { title: "Das Sessions", description: "10 training sessions poore karein." },
  },

  safety: {
    disclaimer:
      "Combat Gym ek taleemi aur fitness app hai. Ye qualified coach se aamne saamne training ya doctor ke mashware ka mutabadil nahi hai. " +
      "Koi naya exercise program shuru karne se pehle doctor se zaroor poochein, khaas taur par agar aap ko koi bimaari ya chot hai.",
    checklist: [
      "Taqreeban 2 x 2 meter jagah khali karein, jahan koi aisi cheez na ho jis se aap takra sakein ya thokar kha sakein.",
      "Phislan na hone wale farsh par trainers mein ya nange pair training karein, jurabon mein nahi.",
      "Angoothiyan, ghari aur jebon mein jo kuch hai sab nikaal dein.",
      "Paani paas rakhein, aur chakkar aayein, saans phoole ya tabiyat kharab lage to ruk jaayein.",
      "Sirf shadowboxing karein. Qualified coach ki maujoodgi ke baghair kabhi kisi doosre insaan par punch ki practice na karein.",
    ],
    tips: [
      "Punch ke aakhir mein kohni lock na karein. Poora seedha hone se zara pehle rok lein.",
      "Harkatein control mein rakhein. Speed achhe form ke baad aati hai.",
      "Har punch ke saath saans bahar nikaalein.",
      "Agar kahin bhi dard ho (sirf thakan nahi, balke dard), to session rok dein.",
    ],
    painStop:
      "Humne aap ka session rok diya hai. Training se tez ya der tak rehne wala dard nahi hona chahiye. " +
      "Aaraam karein, aur agar dard jaari rahe to dobara training se pehle kisi doctor ya medical professional se baat karein. " +
      "Ab tak ki aap ki progress save hai.",
    equipment: [
      "Zaroori: kuch nahi. MVP ki saari training shadowboxing hai.",
      "Optional: hand wraps aur 12-16 oz gloves, agar baad mein heavy bag par training karein.",
      "Kabhi deewar, darwaze ya ghar ke bane bag par punch na maarein. Sahi equipment istemal karein ya shadowboxing karein.",
    ],
  },
};
