# Andi Irham | Developer Portfolio & Showcase

[![GitHub Release](https://img.shields.io/github/v/release/Andi-IM/vue-portfolio?style=flat-square)](https://github.com/Andi-IM/vue-portfolio/releases)
[![CI/CD Pipeline](https://github.com/Andi-IM/vue-portfolio/actions/workflows/pipeline.yml/badge.svg)](https://github.com/Andi-IM/vue-portfolio/actions/workflows/pipeline.yml)
[![codecov](https://codecov.io/github/andi-im/vue-portfolio/graph/badge.svg?token=QRVAHQY6L9)](https://codecov.io/github/andi-im/vue-portfolio)
[![Vue](https://img.shields.io/badge/Vue.js-v3.5.22-35495E?style=flat-square&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Quasar](https://img.shields.io/badge/Quasar-v2.18.6-1976D2?style=flat-square&logo=quasar&logoColor=white)](https://quasar.dev/)

Welcome to the repository for **Andi Irham's Professional Developer Portfolio**. This website showcases software engineering expertise in Android, mobile development (Kotlin, Flutter), and backend web solutions, alongside professional certifications and production-grade projects.

---

## 🚀 Key Features

*   **Premium & Minimalist UI**: Clean, modern aesthetics using Outfit (headings) and Inter (body) typography, following a strict "content-first" contrast rule.
*   **Adaptive Theme System**: Real-time Light & Dark mode support that transitions smoothly.
*   **Multi-language Support (i18n)**: Fully localized translation interface managed with `vue-i18n`.
*   **Dynamic Showcase Modal**: Interactive, detailed modals for exploring the tech stack, key features, and source repositories of each project.
*   **Credentials Validation**: Integrates verified AWS and Cisco certification badges with interactive tooltips linked directly to public verification pages on Credly.
*   **Performance-Optimized Asset Loading**: Asynchronous loading of below-the-fold components and preloading of high-priority hero elements for faster FCP (First Contentful Paint).

---

## 🛠️ Technology Stack

*   **Framework**: Vue 3 (Composition API script setup)
*   **Components & Utilities**: Quasar Framework (v2.x)
*   **Build Tool**: Vite & TypeScript
*   **Styles**: Tailwind CSS & Sass
*   **Testing**: Vitest (Unit) & Playwright (End-to-End)
*   **Deployment**: Cloudflare Pages / Wrangler

---

## 💼 Featured Projects

1.  **SIAAS (Sistem Informasi Administrasi Akademik Siswa)**: Offline-native academic records administration desktop application built with Next.js, Tauri (Rust bridge), SQLite, and Vanilla CSS.
2.  **FinTrack SaaS**: Localized financial tracking and analytics platform with OCR statement/receipt parsing, BNI/Bank Jago integrations, and net worth analytics (Next.js, Supabase, Tailwind, Gemini AI).
3.  **VisiFlow**: Google Cloud-native receipt management system parsing invoices with AI Vision and syncing data to Google Sheets (React, Node.js, Google OAuth).
4.  **Lokapandu**: AI-assisted travel itinerary builder and off-the-beaten-path Indonesian destination guide (Flutter, Supabase, Gemini AI).
5.  **Nutrivision**: Instant food nutrition detection and recipe generator from photos (Flutter, Firebase, Gemini AI).
6.  **DeretSolver**: Smart math sequence solver predicting pattern configurations in seconds (React, Firebase, Gemini AI).

---

## 🏆 Verified Credentials

The certifications section in the Hero panel features interactive Credly badges for:
*   **AWS Certified Cloud Practitioner**
*   **AWS re/Start Graduate**
*   **Cisco Networking Basics**
*   **Cisco Networking Devices and Initial Configuration**

*Clicking any badge navigates directly to its respective verification credential page on Credly.*

---

## 📦 Project Setup

Ensure you have [Bun](https://bun.sh/) installed.

### 1. Install Dependencies
```sh
bun install
```

### 2. Compile and Hot-Reload for Development
```sh
bun run dev
```

### 3. Type-Check, Build, and Minify for Production
```sh
bun run build
```

### 4. Run Unit Tests (Vitest)
```sh
bun run test
```

### 5. Run Linter (ESLint & Oxlint)
```sh
bun run lint
```

---

## ⛓️ CI/CD Pipeline Configuration

The CI/CD pipeline is orchestrated in [.github/workflows/pipeline.yml](file:///.github/workflows/pipeline.yml). To save actions runner minutes and speed up development, the pipeline is configured with **codebase-only triggers**. 

The workflow is **only** triggered when changes are pushed or requested to merge on paths affecting:
*   Application sources (`src/**`, `functions/**`, `public/**`, `index.html`)
*   Configuration files (`package.json`, `bun.lock`, `tsconfig*.json`, `quasar.config.ts`, `vite*.config.ts`, `wrangler.toml`)
*   CI/CD definitions (`.github/workflows/**`, `.github/actions/**`)

Changes to plain markdown files (e.g., `.md`) or local formatting profiles (e.g., `.editorconfig`, `.prettierrc.json`) will not trigger test execution.
