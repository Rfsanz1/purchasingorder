# ERP Modern Architecture

## Tujuan
Menjadikan repo legacy Laravel menjadi monorepo modern bertahap dengan:
- `apps/backend`: NestJS API modular
- `apps/frontend`: Next.js SaaS ERP UI
- `packages/ui`: shared design system
- `packages/shared`: helper integrasi, auth, API client
- `packages/types`: shared domain contract
- `frontend/`: legacy frontend tetap dipertahankan sebagai transitional asset
- `root/`: legacy Laravel app sebagai fallback, bridge, dan sumber business logic

## Prinsip Utama
- Incremental migration
- Modular architecture
- Backward compatibility
- API-first
- Enterprise-grade

## Lapisan Sistem
1. Legacy layer
   - Laravel monolith di root
   - route, view, database existing tetap utuh
2. Modern backend
   - NestJS modular API
   - Prisma schema untuk domain baru
   - auth JWT, RBAC, audit log, queue, realtime
3. Modern frontend
   - Next.js 14+ app router
   - Tailwind CSS, dark mode, responsive UI
   - ERP shell, sidebar, topbar, dashboard
4. Shared packages
   - `packages/types` untuk tipe kuat
   - `packages/ui` untuk komponen reusable
   - `packages/shared` untuk helper cross-app
