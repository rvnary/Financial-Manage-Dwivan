# 📈 Financial Planner & Investment Dashboard

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

## 📖 Tentang Proyek

**Financial Manage & Adviser** adalah aplikasi web modern yang dirancang untuk membantu pengguna dalam merencanakan keuangan pribadi dan memantau portofolio investasi secara _real-time_.

Proyek ini dibuat untuk memenuhi kebutuhan manajemen finansial yang interaktif dengan memanfaatkan data pasar saham aktual. Aplikasi ini mengintegrasikan visualisasi data yang intuitif untuk memudahkan pengambilan keputusan investasi.

### ✨ Fitur Utama

- **Financial Planner**: Alat bantu untuk menghitung dan merencanakan target keuangan jangka panjang.
- **Investment Dashboard**: Visualisasi grafik pergerakan saham dan aset menggunakan data pasar (Chart Analysis).
- **Smart Recommendations**: Sistem rekomendasi investasi berdasarkan profil risiko dan tren pasar.
- **Real-time Data Integration**: Terhubung langsung dengan **AlphaVantage** dan **Finnhub API** untuk data saham terkini.
- **Modern UI/UX**: Antarmuka responsif dan estetis yang dibangun menggunakan **Shadcn UI** dan **Tailwind CSS**.
- **Interactive Charts**: Grafik interaktif untuk membandingkan performa aset.

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan _tech stack_ modern untuk menjamin performa dan skalabilitas:

- **Frontend Framework**: [React.js](https://reactjs.org/) (dengan TypeScript)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Data APIs**:
  - Alpha Vantage API (Data Saham Historis)
  - Finnhub API (Data Pasar Real-time)
- **Icons**: Lucide React

## 📂 Struktur Folder

Berikut adalah gambaran umum struktur kode proyek ini:

```bash
financial-manage-dwivan/
├── src/
│   ├── app/
│   │   ├── components/       # Komponen UI (Charts, Planner, Landing Page)
│   │   │   ├── ui/           # Komponen Shadcn (Button, Card, Input, dll)
│   │   │   └── figma/        # Aset desain spesifik
│   │   └── utils/            # Logika API (AlphaVantage, Finnhub, Kalkulasi)
│   ├── styles/               # Konfigurasi Tailwind dan CSS Global
│   ├── main.tsx              # Entry point aplikasi
│   └── App.tsx               # Komponen utama
├── public/                   # Aset statis
├── .env                      # Variabel lingkungan (API Keys)
├── package.json              # Dependensi proyek
├── vite.config.ts            # Konfigurasi Vite
└── tsconfig.json             # Konfigurasi TypeScript
```
