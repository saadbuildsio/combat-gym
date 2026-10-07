"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PlayerProfile } from "@/domain/types";
import { LocalProfileRepository } from "@/services/storage/local-profile-repository";

interface ProfileContextValue {
  profile: PlayerProfile | null;
  loading: boolean;
  saveProfile: (profile: PlayerProfile) => Promise<void>;
  resetProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

/** Loads the player's profile once and makes it available to every screen. */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [repository] = useState(() => new LocalProfileRepository());
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    repository.load().then((loaded) => {
      if (!active) return;
      setProfile(loaded);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [repository]);

  const saveProfile = useCallback(
    async (next: PlayerProfile) => {
      setProfile(next);
      await repository.save(next);
    },
    [repository],
  );

  const resetProfile = useCallback(async () => {
    setProfile(null);
    await repository.clear();
  }, [repository]);

  const value = useMemo(() => ({ profile, loading, saveProfile, resetProfile }), [profile, loading, saveProfile, resetProfile]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const context = useContext(ProfileContext);
  if (!context) throw new Error("useProfile must be used inside ProfileProvider");
  return context;
}
