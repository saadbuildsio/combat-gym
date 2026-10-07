import type { PlayerProfile } from "@/domain/types";

/**
 * Where the player's profile is saved.
 * MVP: the browser on this device (LocalProfileRepository).
 * Later: Supabase, by adding a SupabaseProfileRepository with the same two methods.
 * Screens only ever talk to this interface, so switching needs no screen changes.
 */
export interface ProfileRepository {
  load(): Promise<PlayerProfile | null>;
  save(profile: PlayerProfile): Promise<void>;
  clear(): Promise<void>;
}
