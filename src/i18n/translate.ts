import { fill, type Language } from "./language";
import type { Message, MessageValue } from "./message";
import { en, type MessageKey } from "./messages/en";
import { roman } from "./messages/roman";

const MESSAGES = { en, roman } as const;

/** Wording for a key (or a Message from the domain) in the given language. Missing wording falls back to English. */
export function translate(language: Language, keyOrMessage: MessageKey | Message, values?: Record<string, MessageValue>): string {
  const message: Message = typeof keyOrMessage === "string" ? { key: keyOrMessage, values } : keyOrMessage;
  const resolved: Record<string, string | number> = {};
  for (const [name, value] of Object.entries(message.values ?? {})) {
    resolved[name] = typeof value === "object" ? translate(language, value) : value;
  }
  return fill(MESSAGES[language][message.key] ?? en[message.key], resolved);
}
