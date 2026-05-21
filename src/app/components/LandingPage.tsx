import { Button } from "./ui/button";
import {
  TrendingUp,
  PiggyBank,
  DollarSign,
  BarChart3,
  ClipboardList,
  Calculator,
  ShieldCheck,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="motion-page min-h-screen bg-[radial-gradient(circle_at_top,rgba(112,224,0,0.12),transparent_32%),linear-gradient(135deg,#030712,#111827_48%,#020617)]">
      {/* Hero Section */}
      <div className="motion-layer container mx-auto px-4 py-12 sm:py-16">
        <div className="motion-stagger max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div
              className="motion-card motion-glow motion-pulse-soft p-4 rounded-full shadow-2xl shadow-green-950/40"
              style={{ backgroundColor: "#007200" }}
              aria-hidden="true"
            >
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>

          <p className="mb-3 text-sm font-medium uppercase tracking-[0.28em] text-green-300">
            Perencana Keuangan Personal
          </p>

          <h1 className="text-4xl sm:text-5xl mb-6 text-white">
            Rencanakan Budget dan Investasi dengan Lebih Tenang
          </h1>

          <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Hitung sisa uang bulanan, cek alokasi pengeluaran, dan dapatkan
            rekomendasi investasi awal berdasarkan kondisi keuangan Anda.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="motion-card text-lg px-8 py-6 text-white transition duration-300 hover:-translate-y-1 hover:opacity-95 hover:shadow-xl hover:shadow-green-900/40"
              style={{ backgroundColor: "#007200" }}
              aria-label="Mulai mengisi detail keuangan"
            >
              Mulai Sekarang
            </Button>

            <span className="rounded-full border border-yellow-700/50 bg-yellow-950/30 px-3 py-1 text-xs text-yellow-200">
              Disclaimer: simulasi edukasi, bukan nasihat keuangan profesional.
            </span>
          </div>
        </div>

        {/* Features Section */}
        <div className="motion-stagger grid md:grid-cols-3 gap-8 mt-20 max-w-5xl mx-auto">
          <div className="motion-card motion-glow bg-gray-800/90 p-8 rounded-xl shadow-lg border border-gray-700 backdrop-blur">
            <div
              className="motion-pulse-soft w-14 h-14 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "#9ef01a30" }}
              aria-hidden="true"
            >
              <PiggyBank className="w-7 h-7" style={{ color: "#9ef01a" }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Catat Pengeluaran</h3>
            <p className="text-gray-400">
              Masukkan gaji, pengeluaran utama, pengeluaran sekunder, tabungan,
              dan uang saku untuk melihat arus kas bulanan.
            </p>
          </div>

          <div className="motion-card motion-glow bg-gray-800/90 p-8 rounded-xl shadow-lg border border-gray-700 backdrop-blur">
            <div
              className="motion-pulse-soft w-14 h-14 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "#70e00030" }}
              aria-hidden="true"
            >
              <DollarSign className="w-7 h-7" style={{ color: "#70e000" }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Cek Sisa Budget</h3>
            <p className="text-gray-400">
              Pantau persentase alokasi secara langsung agar lebih mudah tahu
              apakah budget masih aman atau perlu dikurangi.
            </p>
          </div>

          <div className="motion-card motion-glow bg-gray-800/90 p-8 rounded-xl shadow-lg border border-gray-700 backdrop-blur">
            <div
              className="motion-pulse-soft w-14 h-14 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: "#38b00030" }}
              aria-hidden="true"
            >
              <BarChart3 className="w-7 h-7" style={{ color: "#38b000" }} />
            </div>
            <h3 className="text-xl mb-3 text-white">Rekomendasi Investasi</h3>
            <p className="text-gray-400">
              Lihat opsi simulasi dan rekomendasi awal berdasarkan sisa uang
              serta profil risiko yang Anda pilih.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <section className="motion-stagger mt-20 max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-green-300">
              Cara Kerja
            </p>
            <h2 className="mt-3 text-3xl text-white">
              Dari data bulanan menjadi ringkasan yang mudah dipahami
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 backdrop-blur">
              <ClipboardList className="mb-4 h-8 w-8 text-green-300" />
              <h3 className="mb-2 text-lg text-white">1. Isi Data</h3>
              <p className="text-sm text-gray-400">
                Masukkan nominal gaji dan alokasi pengeluaran utama Anda.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 backdrop-blur">
              <Calculator className="mb-4 h-8 w-8 text-green-300" />
              <h3 className="mb-2 text-lg text-white">2. Hitung Budget</h3>
              <p className="text-sm text-gray-400">
                Sistem menghitung sisa uang, rasio tabungan, dan status budget.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-700 bg-gray-900/60 p-6 backdrop-blur">
              <ShieldCheck className="mb-4 h-8 w-8 text-green-300" />
              <h3 className="mb-2 text-lg text-white">3. Evaluasi Rencana</h3>
              <p className="text-sm text-gray-400">
                Gunakan dashboard, simulator, dan portofolio sebagai bahan
                evaluasi awal.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-800 bg-black/20 px-4 py-6 text-center text-sm text-gray-500">
        <p>
          Dwivan Financial Planner — dibuat untuk simulasi edukasi. Keputusan
          finansial tetap menjadi tanggung jawab pengguna.
        </p>
      </footer>
    </div>
  );
}
