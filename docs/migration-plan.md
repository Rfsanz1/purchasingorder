# Migration Plan

## Fase 1 - Foundation modern
1. Buat monorepo modern di `apps/` dan `packages/`
2. Siapkan backend API NestJS dengan skeleton modul auth, role, notification, health
3. Siapkan frontend Next.js dengan layout ERP modern, sidebar, topbar, dashboard
4. Implementasikan `legacy bridge` untuk membaca data dari Laravel existing
5. Tetapkan shared types dan design system

## Fase 2 - Inventory & Warehouse
- Modul produk, warehouse, stock movement
- Domain modern di backend; dual-read dari legacy saat diperlukan
- UI inventory grid, stock status, warehouse overview

## Fase 3 - Sales & Purchasing
- Sales order, purchase order, delivery, invoice
- Integrasi historis data dari Laravel table existing
- Workflow approval awal pada backend

## Fase 4 - Reporting & Accounting
- Modul akuntansi, analytics, approval workflow
- Audit log dan reporting dashboard
- Tambahkan real-time notification untuk approval dan event

## Fase 5 - Integrasi & PWA
- Marketplace, WhatsApp, POS, PWA
- Modular integration adapters dalam backend
- Mobile-ready UI, offline-aware shell

## Ketentuan Data
- Pertahankan database lama sebagai source of truth selama fase transisi
- Buat schema baru secara incremental tanpa menghapus tabel lama
- Gunakan `legacy bridge` untuk dual-write/double-read jika diperlukan
- Rencanakan migrasi data ke database modern setelah backend matang

## Target Struktur Monorepo
- `laravel/` tetap sebagai legacy system, backup business logic, dan fallback route
- `apps/backend/` untuk API modern NestJS modular
- `apps/frontend/` untuk ERP UI modern Next.js
- `packages/ui/` untuk design system dan komponen reusable
- `packages/shared/` untuk helper, auth adapters, API client
- `packages/types/` untuk contract tipe domain bersama
- `database/` tetap mengelola migration dan seed legacy
- `docs/` untuk dokumentasi arsitektur dan fase migrasi

## Prioritas Development Fase 1
1. Stabilkan backend auth modern: JWT, refresh token, RBAC, audit log, rate limit
2. Stabilkan frontend layout: ERP shell, sidebar, topbar, dashboard, dark mode
3. Implementasi notifikasi realtime dengan Socket.IO
4. Definisikan shared API contract antara frontend dan backend
5. Pastikan legacy Laravel tetap berjalan tanpa perubahan destruktif

## Prioritas Development Fase 2
- Modul inventory, warehouse, product, stock movement
- Dual-read legacy data saat modul modern belum sepenuhnya siap
- Desain API-first untuk UI inventory modern

## Prioritas Development Fase 3
- Modul sales, purchasing, delivery, invoice
- Kembangkan workflow approval sederhana pada backend
- Sinkronisasi historis order dan invoice dari legacy database

## Risiko yang Harus Dihindari
- Menghapus atau menimpa kode legacy sebelum fase migrasi selesai
- Membuat database baru tanpa kebutuhan migrasi yang jelas
- Memecah sistem menjadi microservice terlalu cepat sebelum stabilisasi
- Mengubah route legacy sebelum fitur modern memiliki fallback
- Menjalankan cutover penuh sebelum data master valid

## Langkah Operasional Berikutnya
1. Audit struktur schema dan tabel existing di `database/`
2. Perkuat `apps/backend` dengan guard RBAC dan modul keamanan
3. Perkuat `apps/frontend` dengan layout dan state auth yang stabil
4. Hubungkan legacy Laravel ke backend modern menggunakan bridge API
5. Dokumentasikan setiap fase secara bertahap di `docs/migration-plan.md`
