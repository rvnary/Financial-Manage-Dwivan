import { Button } from "./ui/button";
import {
  ArrowRight,
  TrendingUp,
  PiggyBank,
  DollarSign,
  BarChart3,
  ClipboardList,
  Calculator,
  ShieldCheck,
  Wallet,
  CheckCircle2,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: PiggyBank,
      title: "Catat Pengeluaran",
      description:
        "Masukkan gaji, kebutuhan utama, pengeluaran sekunder, tabungan, dan uang saku dalam satu alur.",
      accent: "#70e000",
    },
    {
      icon: DollarSign,
      title: "Cek Sisa Budget",
      description:
        "Pantau persentase alokasi secara langsung agar cepat tahu ruang budget yang masih aman.",
      accent: "#70e000",
    },
    {
      icon: BarChart3,
      title: "Rekomendasi Investasi",
      description:
        "Lihat simulasi awal dan portofolio edukatif berdasarkan sisa dana serta profil risiko.",
      accent: "#38bdf8",
    },
  ];

  const steps = [
    {
      icon: ClipboardList,
      title: "Isi Data",
      description: "Masukkan nominal gaji dan alokasi pengeluaran utama Anda.",
    },
    {
      icon: Calculator,
      title: "Hitung Budget",
      description:
        "Sistem menghitung sisa uang, rasio tabungan, dan status budget.",
    },
    {
      icon: ShieldCheck,
      title: "Evaluasi Rencana",
      description:
        "Gunakan dashboard, simulator, dan portofolio sebagai bahan evaluasi awal.",
    },
  ];

  return (
    <div className="motion-page min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(112,224,0,0.14),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.12),transparent_26%),linear-gradient(135deg,#030712,#111827_48%,#020617)]">
      <div className="motion-layer container mx-auto px-4 py-8 sm:py-12">
        {/* Hero Section */}
        <section className="motion-stagger grid min-h-[calc(100vh-7rem)] items-center gap-10 lg:grid-cols-[1.04fr_0.96fr]">
          <div className="max-w-3xl text-center lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-200 shadow-lg shadow-green-950/30">
              <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_16px_rgba(112,224,0,0.8)]" />
              Perencana keuangan personal
            </div>

            <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
              Rencanakan budget tanpa kehilangan arah.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
              Dwivan mengubah data bulanan menjadi ringkasan budget, skor
              kesehatan finansial, dan simulasi investasi yang mudah dibaca.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                onClick={onGetStarted}
                size="lg"
                className="motion-card group px-7 py-6 text-base text-white transition duration-300 hover:-translate-y-1 hover:opacity-95 hover:shadow-xl hover:shadow-green-900/40"
                style={{ backgroundColor: "#007200" }}
                aria-label="Mulai mengisi detail keuangan"
              >
                Mulai Sekarang
                <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
              </Button>

              <span className="rounded-full border border-yellow-700/50 bg-yellow-950/30 px-3 py-1 text-xs text-yellow-200">
                Simulasi edukasi, bukan nasihat keuangan profesional.
              </span>
            </div>
          </div>

          <div className="motion-card motion-glow dwivan-card relative mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] p-5">
            <div className="absolute right-6 top-6 rounded-full border border-green-400/30 bg-green-400/10 px-3 py-1 text-xs font-semibold text-green-200">
              Cek Langsung
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-500/15 p-3 text-green-300">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Sisa budget bulan ini</p>
                <p className="font-display text-3xl font-semibold text-white">
                  Rp 1.250.000
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["Teralokasi", "87%", "#70e000"],
                ["Tabungan", "20%", "#38bdf8"],
                ["Status", "Aman", "#70e000"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-2xl bg-black/25 p-4">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="mt-1 text-lg font-semibold" style={{ color }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {[
                ["Kebutuhan utama", "50%", "w-1/2", "#70e000"],
                ["Tabungan", "20%", "w-1/5", "#38bdf8"],
                ["Ruang investasi", "12%", "w-[12%]", "#70e000"],
              ].map(([label, value, width, color]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm text-gray-300">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className={`motion-bar h-full rounded-full ${width}`}
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-300" />
                <p className="text-sm leading-relaxed text-gray-200">
                  Tabungan sudah memenuhi rasio dasar. Fokus berikutnya:
                  pisahkan dana darurat dan jadwalkan investasi rutin.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <div id="fitur" className="motion-stagger grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={feature.title}
                className="motion-card motion-glow dwivan-card rounded-2xl p-7"
              >
                <div
                  className="motion-pulse-soft mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${feature.accent}22` }}
                  aria-hidden="true"
                >
                  <FeatureIcon
                    className="h-7 w-7"
                    style={{ color: feature.accent }}
                  />
                </div>
                <h3 className="mb-3 text-xl text-white">{feature.title}</h3>
                <p className="leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* How It Works Section */}
        <section id="cara-kerja" className="motion-stagger mt-20">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-green-300">
              Cara Kerja
            </p>
            <h2 className="mt-3 text-3xl text-white sm:text-4xl">
              Dari data bulanan menjadi ringkasan yang mudah dipahami
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.title}
                  className="motion-card dwivan-card relative overflow-hidden rounded-2xl p-6"
                >
                  <span className="font-display absolute right-5 top-3 text-6xl font-semibold leading-none text-white/5">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="relative">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-300">
                      <StepIcon className="h-6 w-6" />
                    </div>
                    <div className="mb-2 inline-flex rounded-full border border-green-500/30 px-2 py-0.5 text-xs font-semibold text-green-200">
                      Langkah {index + 1}
                    </div>
                    <h3 className="mb-2 text-lg text-white">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="motion-layer border-t border-gray-800 bg-black/25 px-4 py-8 text-sm text-gray-400">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500/15 text-green-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-base font-semibold text-white">
                Dwivan
              </p>
              <p className="text-xs text-gray-500">
                Simulasi budget dan investasi edukatif.
              </p>
            </div>
          </div>
          <div className="flex gap-4 text-xs uppercase tracking-[0.16em] text-gray-500">
            <a href="#fitur" className="transition hover:text-green-300">
              Fitur
            </a>
            <a href="#cara-kerja" className="transition hover:text-green-300">
              Cara Kerja
            </a>
            <span>Keputusan finansial tetap tanggung jawab pengguna.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
