import type { ExternalRiskProfile } from "../types";
import {
  profileButtonStyles,
  profileHints,
  profileLabels,
} from "../constants";

interface RiskProfileSelectorProps {
  selectedProfile: ExternalRiskProfile;
  onSelect: (profile: ExternalRiskProfile) => void;
  variant?: "full" | "compact";
}

const PROFILES: readonly ExternalRiskProfile[] = [
  "conservative",
  "balanced",
  "aggressive",
] as const;

/**
 * Unified risk-profile button group.
 * - `full`: card wrapper with colored active buttons (blue/green/red) + hint row.
 * - `compact`: plain flex row with green-only active state, using profileLabels.
 */
export function RiskProfileSelector({
  selectedProfile,
  onSelect,
  variant = "full",
}: RiskProfileSelectorProps) {
  if (variant === "compact") {
    return (
      <div className="mb-6 flex gap-2">
        {PROFILES.map((profile) => (
          <button
            key={profile}
            onClick={() => onSelect(profile)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
              selectedProfile === profile
                ? "bg-green-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {profileLabels[profile]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="motion-card motion-glow bg-gray-800/90 border border-gray-700 rounded-lg p-4 backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium">Pilih Profil Risiko</h3>
          <p className="text-sm text-gray-400">
            Pilih gaya investasi untuk melihat saham yang sesuai.
          </p>
        </div>
        <div className="flex gap-2">
          {PROFILES.map((profile) => (
            <button
              key={profile}
              onClick={() => onSelect(profile)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 hover:-translate-y-0.5 ${
                selectedProfile === profile
                  ? profileButtonStyles[profile].activeBg
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {profileButtonStyles[profile].label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 text-xs text-gray-500">
        {profileHints[selectedProfile]}
      </div>
    </div>
  );
}
