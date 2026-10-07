import type { PlayerProfile } from "@/domain/types";
import type { ProfileRepository } from "./profile-repository";

/** Bump when the saved shape changes, and add a migration in `migrate`. */
const SCHEMA_VERSION = 1;
const STORAGE_KEY = "combat-gym:profile";

interface StoredProfile {
  version: number;
  profile: PlayerProfile;
}

/** Saves the profile in the browser. Fails safely (returns null) in private mode or when storage is blocked. */
export class LocalProfileRepository implements ProfileRepository {
  constructor(private readonly storage: Storage | null = typeof window !== "undefined" ? window.localStorage : null) {}

  async load(): Promise<PlayerProfile | null> {
    if (!this.storage) return null;
    try {
      const raw = this.storage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return migrate(JSON.parse(raw) as StoredProfile);
    } catch (error) {
      console.warn("Could not read saved profile", error);
      return null;
    }
  }

  async save(profile: PlayerProfile): Promise<void> {
    if (!this.storage) return;
    try {
      const stored: StoredProfile = { version: SCHEMA_VERSION, profile };
      this.storage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.warn("Could not save profile", error);
    }
  }

  async clear(): Promise<void> {
    try {
      this.storage?.removeItem(STORAGE_KEY);
    } catch {
      // Storage unavailable: nothing to clear.
    }
  }
}

function migrate(stored: StoredProfile): PlayerProfile | null {
  if (!stored || typeof stored !== "object" || !stored.profile) return null;
  if (stored.version === SCHEMA_VERSION) return stored.profile;
  // Future: transform older versions here. Unknown versions are dropped rather than crashing the app.
  return null;
}
