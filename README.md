````markdown
# 📈 Financial Manage Dwivan

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📖 Tentang Proyek

**Financial Manage Dwivan** adalah platform berbasis web untuk **Smart Financial Planning** (Perencanaan Keuangan Cerdas). Aplikasi ini dirancang untuk membantu pengguna, khususnya mahasiswa dan profesional muda, dalam mengelola keuangan pribadi mereka dengan lebih efektif.

Aplikasi ini tidak hanya mencatat pengeluaran, tetapi juga membantu menghitung sisa anggaran bulanan dan memberikan **rekomendasi investasi** yang dipersonalisasi berdasarkan data pasar saham _real-time_.

> **Catatan:** Proyek ini dikembangkan sebagai bagian dari tugas kuliah/portofolio pemrograman web lanjut.

### ✨ Fitur Utama

- **💰 Expense Tracker**: Input gaji bulanan dan kategorisasi pengeluaran untuk memantau arus kas dengan mudah.
- **🧮 Budget Calculator**: Menghitung otomatis sisa uang (_remaining budget_) setelah dikurangi kebutuhan pokok dan tabungan.
- **📊 Investment Dashboard**: Visualisasi grafik pergerakan harga saham dan aset menggunakan data pasar aktual (via Alpha Vantage & Finnhub API).
- **🤖 Smart Recommendations**: Memberikan saran alokasi investasi cerdas untuk memaksimalkan pertumbuhan aset pengguna.
- **🎨 Modern UI/UX**: Antarmuka yang responsif, gelap (_dark mode_), dan estetis dibangun dengan komponen modern.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan _tech stack_ modern untuk memastikan performa tinggi dan kemudahan pengembangan:

- **Frontend Framework**: [React](https://react.dev/) (dengan TypeScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (dibangun di atas Radix UI)
- **Charts**: [Recharts](https://recharts.org/) untuk visualisasi data
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: Framer Motion (`motion`)
- **External APIs**:
  - Alpha Vantage (Data Historis Saham)
  - Finnhub (Data Pasar Real-time)

## 📂 Struktur Folder

Berikut adalah gambaran struktur direktori proyek ini:

```bash
financial-manage-dwivan/
├── public/                 # Aset statis
├── src/
│   ├── app/
│   │   ├── components/     # Komponen React (LandingPage, Planner, Charts)
│   │   │   ├── ui/         # Komponen Shadcn (Button, Card, Input, dll)
│   │   │   └── figma/      # Aset desain spesifik
│   │   └── utils/          # Logika API (AlphaVantage, Finnhub)
│   ├── styles/             # CSS Global & Tailwind config
│   ├── App.tsx             # Komponen Utama
│   └── main.tsx            # Entry Point
├── .env                    # Variabel Lingkungan (API Keys)
├── package.json            # Dependensi Proyek
└── vite.config.ts          # Konfigurasi Vite
```
````

##🚀 Instalasi & Cara MenjalankanIkuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

###1. Kloning Repository```bash
git clone [https://github.com/username-kamu/financial-manage-dwivan.git](https://github.com/username-kamu/financial-manage-dwivan.git)
cd financial-manage-dwivan

````

###2. Install DependenciesPastikan Node.js sudah terinstall.

```bash
npm install
# atau
yarn install

````

###3. Konfigurasi Environment VariablesBuat file bernama `.env` di root folder proyek (sejajar dengan `package.json`). Salin konfigurasi berikut dan isi dengan API Key Anda (bisa didapatkan gratis di website AlphaVantage dan Finnhub):

```env
VITE_ALPHAVANTAGE_API_KEY=masukkan_api_key_disini
VITE_FINNHUB_API_KEY=masukkan_api_key_disini

```

###4. Jalankan Server Development```bash
npm run dev

```

Buka browser dan akses alamat lokal yang muncul (biasanya `http://localhost:5173`).

##📸 Tangkapan Layar (Screenshots)*(Tempatkan screenshot aplikasi di folder `public` dan sesuaikan nama filenya)*

| Halaman Utama | Dashboard Investasi |
| --- | --- |
|  |  |

##🤝 KontribusiKontribusi sangat diterima! Langkah-langkah untuk berkontribusi:

1. Fork repository ini.
2. Buat Branch fitur baru (`git checkout -b fitur-keren`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`).
4. Push ke branch (`git push origin fitur-keren`).
5. Buat Pull Request.

##📄 LisensiDidistribusikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk informasi lebih lanjut.

---

**Dibuat dengan ❤️ oleh [Dwivan/Jerryo Pradnatan/Filbert Matthew]**

```

```

```
