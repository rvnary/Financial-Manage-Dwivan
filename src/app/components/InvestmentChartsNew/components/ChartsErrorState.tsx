interface ChartsErrorStateProps {
  error: string;
}

export function ChartsErrorState({ error }: ChartsErrorStateProps) {
  return (
    <div className="bg-red-950 border border-red-800 rounded-lg p-4">
      <h4 className="font-medium text-red-400 mb-2">Data gagal dimuat</h4>
      <p className="text-red-300 text-sm">{error}</p>
      <p className="text-red-400 text-sm mt-2">
        Coba muat ulang halaman atau cek koneksi API.
      </p>
    </div>
  );
}
