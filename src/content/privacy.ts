import type { Language } from "@/i18n/language";

/**
 * Privacy policy shown at /privacy (Google Play needs a public URL for it).
 * DRAFT: written to match how the app works today. Have it checked before launch, and fill in the contact email.
 */

export const PRIVACY_CONTACT_EMAIL = "privacy@example.com"; // TODO(Saad): replace with the support email for Combat Gym.
export const PRIVACY_UPDATED = "7 October 2026";

interface Section {
  heading: string;
  body: string[];
}

const EN: Section[] = [
  {
    heading: "Who we are",
    body: ["Combat Gym is a home boxing training app for people aged 16 and over."],
  },
  {
    heading: "What stays on your phone",
    body: [
      "Your name, training answers, progress, XP and settings are saved on your device only. We do not upload them to our own servers.",
      "Deleting the app, or using “Reset all progress” in your profile, removes them.",
    ],
  },
  {
    heading: "Ads (free version)",
    body: [
      "The free version shows ads from Google AdMob. Google may collect your device's advertising ID, approximate location from your IP address and how you interact with ads, to show and measure ads.",
      "Where the law requires it, we ask for your consent first. You can reset your advertising ID or opt out of personalised ads in your phone's settings.",
      "We never show ads during a lesson, round or fight.",
      "Google's privacy policy: https://policies.google.com/privacy",
    ],
  },
  {
    heading: "Pro subscription",
    body: [
      "Payments are handled by Google Play. We never see your card or payment details.",
      "We use RevenueCat to check whether your subscription is active. RevenueCat receives an anonymous app user ID and your purchase receipt from Google Play. RevenueCat's privacy policy: https://www.revenuecat.com/privacy",
      "You can cancel any time in Google Play → Payments & subscriptions.",
    ],
  },
  {
    heading: "Videos",
    body: ["Demo videos are played from YouTube in privacy-enhanced mode (youtube-nocookie.com). YouTube's own privacy policy applies when you play them."],
  },
  {
    heading: "Children",
    body: ["Combat Gym is not meant for anyone under 16, and we do not knowingly collect data from children."],
  },
  {
    heading: "Contact",
    body: [`Questions or deletion requests: ${PRIVACY_CONTACT_EMAIL}`],
  },
];

const ROMAN: Section[] = [
  {
    heading: "Hum kaun hain",
    body: ["Combat Gym ghar par boxing training ki app hai, 16 saal ya us se bare logon ke liye."],
  },
  {
    heading: "Kya aap ke phone par hi rehta hai",
    body: [
      "Aap ka naam, training ke jawab, progress, XP aur settings sirf aap ke phone par save hote hain. Hum inhein apne servers par upload nahi karte.",
      "App delete karne se, ya profile mein “Saari progress reset karein” se, ye sab mit jaata hai.",
    ],
  },
  {
    heading: "Ads (free version)",
    body: [
      "Free version mein Google AdMob ke ads dikhte hain. Ads dikhane aur unka hisaab rakhne ke liye Google aap ke phone ki advertising ID, IP address se andazan location, aur ads ke saath aap ka interaction collect kar sakta hai.",
      "Jahan qanoon zaroori kehta hai, hum pehle aap ki ijazat maangte hain. Aap phone ki settings mein advertising ID reset kar sakte hain ya personalised ads band kar sakte hain.",
      "Lesson, round ya fight ke dauran hum kabhi ad nahi dikhate.",
      "Google ki privacy policy: https://policies.google.com/privacy",
    ],
  },
  {
    heading: "Pro subscription",
    body: [
      "Payment Google Play karta hai. Hum aap ka card ya payment ki details kabhi nahi dekhte.",
      "Subscription active hai ya nahi, ye check karne ke liye hum RevenueCat use karte hain. RevenueCat ko ek anonymous app user ID aur Google Play ki purchase receipt milti hai. RevenueCat ki privacy policy: https://www.revenuecat.com/privacy",
      "Aap kabhi bhi Google Play → Payments & subscriptions mein ja kar cancel kar sakte hain.",
    ],
  },
  {
    heading: "Videos",
    body: ["Demo videos YouTube se privacy-enhanced mode (youtube-nocookie.com) mein chalti hain. Video chalane par YouTube ki apni privacy policy laagu hoti hai."],
  },
  {
    heading: "Bachche",
    body: ["Combat Gym 16 saal se kam umar walon ke liye nahi hai, aur hum jaan boojh kar bachchon ka data collect nahi karte."],
  },
  {
    heading: "Rabta",
    body: [`Sawal ya data delete karwane ke liye: ${PRIVACY_CONTACT_EMAIL}`],
  },
];

export function privacySections(language: Language): Section[] {
  return language === "roman" ? ROMAN : EN;
}
