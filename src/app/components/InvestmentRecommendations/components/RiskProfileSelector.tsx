import { allocationOptions, profileVisuals } from "../constants";
import type { RiskProfile } from "../types";

interface RiskProfileSelectorProps {
  selectedProfile: RiskProfile;
  onSelect: (profile: RiskProfile) => void;
}

export function RiskProfileSelector({
  selectedProfile,
  onSelect,
}: RiskProfileSelectorProps) {
  return (
    <div>
      <h4 className="font-medium text-white mb-3">Pilih Profil Risiko</h4>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {allocationOptions.map((option) => (
          <button
            key={option.profile}
            onClick={() => onSelect(option.profile)}
            className={`motion-card p-3 rounded-lg transition border text-left ${
              selectedProfile === option.profile
                ? profileVisuals[option.profile].active
                : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <div className="font-medium">{option.label}</div>
            <div className="text-xs mt-1">{option.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
