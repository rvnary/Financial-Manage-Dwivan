# 📈 Financial Manage Dwivan

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 📖 Tentang Proyek

**Financial Manage Dwivan** adalah platform berbasis web untuk **Smart Financial Planning** (Perencanaan Keuangan Cerdas). Aplikasi ini dirancang untuk membantu pengguna, khususnya mahasiswa dan profesional muda, dalam mengelola keuangan pribadi secara efektif.

Aplikasi ini tidak hanya mencatat pengeluaran, tetapi juga menghitung sisa anggaran bulanan serta memberikan **rekomendasi investasi** berdasarkan data pasar saham _real-time_.

> **Catatan:** Proyek ini dikembangkan sebagai bagian dari tugas kuliah / portofolio pemrograman web lanjut.

---

## ✨ Fitur Utama

- **💰 Expense Tracker**  
  Input gaji bulanan dan kategorisasi pengeluaran untuk memantau arus kas.

- **🧮 Budget Calculator**  
  Menghitung otomatis sisa uang (_remaining budget_) setelah kebutuhan pokok & tabungan.

- **📊 Investment Dashboard**  
  Visualisasi grafik harga saham dan aset berbasis data aktual (Alpha Vantage & Finnhub).

- **🤖 Smart Recommendations**  
  Rekomendasi alokasi investasi yang disesuaikan dengan kondisi keuangan pengguna.

- **🎨 Modern UI/UX**  
  Antarmuka responsif, _dark mode_, dan estetis.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Framework**: React (TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **External APIs**:
  - Alpha Vantage (Data Historis Saham)
  - Finnhub (Data Pasar Real-time)

---

## 📂 Struktur Folder

```bash
financial-manage-dwivan/
├── public/                 # Aset statis
├── src/
│   ├── app/
│   │   ├── components/     # Komponen React
│   │   │   ├── ui/         # Komponen Shadcn UI
│   │   │   └── figma/      # Aset desain
│   │   └── utils/          # API handler
│   ├── styles/             # Global styles & Tailwind config
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── .env                    # Environment variables
├── package.json
└── vite.config.ts
```

❤️ Dibuat oleh Dwivan / Jerryo Pradnatan / Filbert Matthew
