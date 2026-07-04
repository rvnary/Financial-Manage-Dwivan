import { Loader2 } from "lucide-react";

interface ChartsLoadingStateProps {
  loadingProgress: string;
}

export function ChartsLoadingState({ loadingProgress }: ChartsLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2
        className="w-12 h-12 animate-spin"
        style={{ color: "#70e000" }}
      />
      <span className="text-lg text-white mt-4 font-medium">
        Memuat Data Langsung...
      </span>
      <span className="text-gray-400 mt-2">
        {loadingProgress || "Menghubungkan ke Yahoo Finance..."}
      </span>
      <div className="mt-4 bg-gray-800 rounded-lg p-4 max-w-md">
        <p className="text-sm text-gray-400 text-center">
          📊 Mengambil data real-time untuk semua profil risiko
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          Data langsung dari Yahoo Finance
        </p>
      </div>
    </div>
  );
}
