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
