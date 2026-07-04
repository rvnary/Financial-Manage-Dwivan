import { profileNarratives } from "../constants";
import type { ExternalRiskProfile } from "../types";

interface ThesisCardProps {
  selectedProfile: ExternalRiskProfile;
}

export function ThesisCard({ selectedProfile }: ThesisCardProps) {
  const narrative = profileNarratives[selectedProfile];

  return (
    <div
      className="motion-card rounded-2xl border bg-gray-900/70 p-5"
      style={{
        borderColor: `${narrative.accent}55`,
      }}
    >
      <p className="text-xs uppercase tracking-[0.24em] text-gray-500">
        Tesis portofolio
      </p>
      <h3 className="mt-1 text-xl font-semibold text-white">
        {narrative.label}: {narrative.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-300">
        {narrative.reason}
      </p>
    </div>
  );
}
