import type { MessageKey } from "./messages/en";

/**
 * A piece of wording as data: a dictionary key plus values for its {placeholders}.
 * The domain layer returns these instead of English sentences, so screens can show them in any language.
 * A value can itself be a Message (for example a skill name or a coaching tip), which is translated first.
 */
export type MessageValue = string | number | Message;

export interface Message {
  key: MessageKey;
  values?: Record<string, MessageValue>;
}

export function msg(key: MessageKey, values?: Record<string, MessageValue>): Message {
  return values ? { key, values } : { key };
}
