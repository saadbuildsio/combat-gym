import type { Language } from "@/i18n/language";

/**
 * Roman Urdu read by an Urdu or Hindi voice sounds natural; English voices mangle it.
 * Preferred voice languages, best first. With none installed we fall back to the default (English) voice.
 */
const ROMAN_VOICE_LANGS = ["ur-PK", "ur-IN", "ur", "hi-IN", "hi"];

// Some browsers load their voice list lazily; asking once early means it is ready by the first callout.
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  try {
    window.speechSynthesis.getVoices();
  } catch {
    // ignore
  }
}

function romanVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | undefined {
  const voices = synth.getVoices();
  for (const lang of ROMAN_VOICE_LANGS) {
    const found = voices.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(lang.toLowerCase()));
    if (found) return found;
  }
  return undefined;
}

/**
 * Speaks a callout with the browser's built-in voice. Silently does nothing where unsupported.
 * With language "roman" it uses an Urdu or Hindi voice when the device has one.
 */
export function speak(text: string, language: Language = "en"): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    if (language === "roman") {
      const voice = romanVoice(synth);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = "en-US";
      }
    }
    synth.speak(utterance);
  } catch {
    // Voice is a nice-to-have; the callout is also shown on screen.
  }
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}
