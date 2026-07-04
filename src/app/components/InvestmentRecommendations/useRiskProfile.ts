import { useEffect, useState } from "react";
import { toExternal, toInternal } from "./constants";
import type { ExternalRiskProfile, RiskProfile } from "./types";

interface UseRiskProfileArgs {
  externalRiskProfile?: ExternalRiskProfile;
  onRiskProfileChange?: (profile: ExternalRiskProfile) => void;
}

/**
 * Resolve the effective risk profile: when an external (controlled) profile is
 * provided it wins, otherwise an internal `useState` is used. Syncs internal
 * state when the external value changes and forwards changes upward.
 */
export function useRiskProfile({
  externalRiskProfile,
  onRiskProfileChange,
}: UseRiskProfileArgs) {
  const [internalProfile, setInternalProfile] = useState<RiskProfile>("medium");

  // Sync internal state when external changes
  useEffect(() => {
    if (externalRiskProfile) {
      setInternalProfile(toInternal(externalRiskProfile));
    }
  }, [externalRiskProfile]);

  const selectedProfile: RiskProfile = externalRiskProfile
    ? toInternal(externalRiskProfile)
    : internalProfile;

  const setSelectedProfile = (profile: RiskProfile) => {
    setInternalProfile(profile);
    if (onRiskProfileChange) {
      onRiskProfileChange(toExternal(profile));
    }
  };

  return { selectedProfile, setSelectedProfile };
}
