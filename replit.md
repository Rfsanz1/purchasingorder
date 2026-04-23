# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS

## Artifacts

- **event-registration** — Form Purchase Order + Registrasi Event (React + Vite, path `/`). Juga di-package menjadi APK Android via Capacitor (folder `android/`, package `com.gentongmas.po`).
- **api-server** — Express API server (path `/api`)

## APK Android (Capacitor)

- App ID: `com.gentongmas.po`, App name: "Purchase Order Gentong Mas"
- Strategi auto-update: APK adalah shell native yang load `https://gentongmaspurchasingorder.up.railway.app` via WebView. Setiap deploy ke Railway = update otomatis untuk semua user (tidak perlu install ulang APK kecuali ada perubahan native plugin / permissions).
- Plugin native: `@capacitor/camera`, `@capacitor-mlkit/barcode-scanning`, `@capacitor/push-notifications`, `@capacitor/app`. Wrapper di `src/lib/native.ts` (aman untuk web — fungsi return null jika bukan native).
- Push notification: Firebase (`google-services.json` ada di `android/app/`).
- Build APK: GitHub Actions (`.github/workflows/build-apk.yml`) auto-build debug APK setiap push ke main, hasil di tab Actions → Artifacts. Tag `v*` akan auto-create GitHub Release dengan APK.

## Features

- Form Purchase Order untuk tim marketing (integrasi WhatsApp via Fonnte, integrasi Kledo ERP)
- Form Registrasi Event
- Halaman Admin untuk melihat daftar order
- Database PostgreSQL dengan Drizzle ORM (tabel `orders`)
- Otomatis kirim invoice via WhatsApp ke pelanggan dan admin

## Environment Variables (Secrets)

- `SESSION_SECRET` — Secret untuk session
- `FONNTE_TOKEN` — Token API Fonnte untuk pengiriman WhatsApp
- `KLEDO_TOKEN` — Token API Kledo ERP
- `NAMA_TOKO` — Nama toko yang tampil di invoice WA
- `ADMIN_WA_NUMBER` — Nomor WA admin untuk notifikasi order baru

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/event-registration run dev` — run frontend locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
