import type { LucideIcon } from "lucide-react";
import type { AllocationOption, RiskProfile } from "../types";
import { profileVisuals } from "../constants";

interface ProfileRationaleCardProps {
  selectedProfile: RiskProfile;
  selectedAllocation: AllocationOption;
  icon: LucideIcon;
}

const FIELD_LABELS = ["Tesis", "Alasan", "Cocok untuk", "Perilaku yang diharapkan"];

export function ProfileRationaleCard({
  selectedProfile,
  selectedAllocation,
  icon: Icon,
}: ProfileRationaleCardProps) {
  const visual = profileVisuals[selectedProfile];
  const fields = [
    selectedAllocation.thesis,
    selectedAllocation.reason,
    selectedAllocation.bestFor,
    selectedAllocation.behavior,
  ];

  return (
    <div
      className="motion-card rounded-2xl border bg-gray-900/70 p-5"
      style={{ borderColor: `${visual.accent}55` }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="motion-pulse-soft rounded-2xl p-3"
          style={{ backgroundColor: `${visual.accent}20` }}
        >
          <Icon className="h-5 w-5" style={{ color: visual.accent }} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
            {visual.label}
          </p>
          <h4 className="text-lg font-semibold text-white">
            Alasan profil {selectedAllocation.label} dipilih
          </h4>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((text, index) => (
          <div
            key={text}
            className="rounded-xl border bg-black/20 p-3 text-sm leading-relaxed text-gray-300"
            style={{ borderColor: `${visual.accent}33` }}
          >
            <span
              className="mb-1 block text-xs font-semibold"
              style={{ color: visual.accent }}
            >
              {FIELD_LABELS[index]}
            </span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}
