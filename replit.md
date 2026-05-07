# ERP System — Gentong Mas

Sistem ERP berbasis Laravel 12 untuk sales, admin, driver, inventory, finance & CRM — dengan sidebar navigasi lengkap. Backend API + frontend Blade dalam satu server.

## Run & Operate

```bash
# Dev (Replit):
PORT=5000 bash start.sh              # Laravel dari root, PostgreSQL via DATABASE_URL

# Production (Railway / Replit Autoscale):
bash start-production.sh             # PostgreSQL via DATABASE_URL, port 8080

# Frontend dev (opsional):
cd frontend && pnpm --filter @workspace/event-registration run dev
cd frontend && pnpm --filter @workspace/api-server run dev

# Artisan utils:
php artisan route:list
php artisan migrate
php artisan config:clear
php artisan tinker
```

**Required env vars:**
- `DATABASE_URL` — PostgreSQL connection string (Replit native DB / Railway) ✅ sudah dikonfigurasi
- `KLEDO_TOKEN` — Token API Kledo ERP (wajib untuk semua fitur Kledo)
- `FONNTE_TOKEN` — Token Fonnte untuk WhatsApp (opsional)
- `FONNTE_TOKEN_GROUP` — Token Fonnte grup (opsional)
- `FONNTE_TOKEN_CUSTOMER` — Token Fonnte customer (opsional)
- `ADMIN_PASSWORD` — Password admin (default: admin123)
- `ADMIN_PASSWORD` — Password admin (default: admin123)
- `FONNTE_GROUP_INVOICE` — ID grup WA notifikasi invoice
- `FONNTE_GROUP_BUKTI_TF` — ID grup WA bukti transfer

## Stack

- **PHP**: 8.2
- **Framework**: Laravel 12
- **ORM**: Eloquent (Order, AppSetting, DriverArea, Product)
- **Frontend Laravel**: Blade + Tailwind CSS CDN + Alpine.js CDN
- **Frontend React**: React 19, Vite, TanStack Query, Radix UI (di `frontend/`)
- **DB**: PostgreSQL (Replit native DB + Railway via `DATABASE_URL`)
- **Mobile**: Capacitor (Android) — `frontend/artifacts/event-registration/`
- **Port**: 5000 (dev), 8080 (production)

## Where things live

```
/                          ← Laravel root (backend utama)
  app/Http/Controllers/    ← AuthController, OrderController, SettingsController,
                             DriverAreaController, KledoController, PageController,
                             SalesController, ProductController
  app/Services/            ← KledoService.php (SPM logic, margin, HTTP)
  app/Models/              ← Order.php, AppSetting.php, DriverArea.php, Product.php
  app/Helpers/             ← FonnteHelper.php (WhatsApp)
  database/migrations/     ← orders, app_settings, driver_areas, products (+brand, kledo_product_id)
  resources/views/         ← landing, po-form, admin, driver, location + layouts/app
  routes/web.php           ← 5 halaman Blade (/, /po-form, /admin, /driver, /loc/{token})
  routes/api.php           ← semua /api/* endpoints
  start.sh                 ← Dev: PostgreSQL via DATABASE_URL
  start-production.sh      ← Prod: PostgreSQL via DATABASE_URL, PORT=8080
  Dockerfile               ← PHP 8.2, untuk Railway/Replit Autoscale
  railway.toml             ← build: Dockerfile, start: start-production.sh

frontend/                  ← pnpm workspace untuk semua JS/TS
  artifacts/
    event-registration/    ← React + Capacitor (mobile app Android)
    api-server/            ← Express/Node.js API server (sekunder)
    driver-app/            ← React driver dashboard
    mockup-sandbox/        ← Dev UI preview
  lib/
    db/                    ← Drizzle ORM schema + client
    api-spec/              ← OpenAPI YAML + Orval codegen
    api-zod/               ← Zod schemas dari API spec
    api-client-react/      ← React Query hooks
  scripts/
    post-merge.sh          ← pnpm install + db push setelah merge
```

## Architecture decisions

- **Laravel di root** — Laravel adalah root project; frontend JS/TS dipisah ke `frontend/` sebagai consumer API
- **PostgreSQL di semua env** — Replit native DB (dev) + Railway PostgreSQL (prod), keduanya via `DATABASE_URL`
- **SESSION/CACHE = file, QUEUE = sync** — tidak butuh tabel tambahan
- **Blade + Alpine.js + fetch API** — semua state management di frontend, bukan server-side session
- **pnpm workspace di `frontend/`** — isolasi total antara PHP dan Node.js ecosystem
- **SalesController sebagai single source of truth** — daftar sales (SALES_LIST) didefinisikan di sini, digunakan AuthController + API `/api/sales`
- **KledoService** (`app/Services/KledoService.php`) — semua logika Kledo API dipusatkan: HTTP helper, transformProduct, margin 15%, SPM_BRAND_PIC mapping, isSpmBrand/getPicForBrand/getBrandsForSales
- **SPM_BRAND_PIC mapping** — brand → PIC didefinisikan di KledoService::SPM_BRAND_PIC; dipakai di backend (validasi) dan frontend (via `GET /api/kledo/spm-brands`)
- **Harga = Kledo × 1.15** — KledoService::withMargin() di backend; po-form menampilkan harga asli + harga jual (+15%) setelah produk dipilih
- **Stok SPM vs Kledo** — SPM brand → stok dari DB internal (`products.stok`); non-SPM → stok real dari Kledo (`kledoStok`); keduanya disatukan di `getProductsWithStock()`
- **Searchable dropdown pure Alpine.js** — tidak ada library eksternal; combobox dengan keyboard nav (↑↓ Enter Esc) di po-form dan products page

## Product

| Path | Role | Keterangan |
|------|------|------------|
| `/` | Semua | Landing page + role picker |
| `/po-form` | Sales | Form buat PO — searchable sales dropdown, cari produk dari Kledo |
| `/products` | Sales | Kelola Produk & Stok (SPM) — katalog Kledo + stok internal per brand |
| `/admin` | Admin | Dashboard pesanan, pengiriman, wilayah, pengaturan |
| `/driver` | Driver | Dashboard pengiriman driver |
| `/loc/{token}` | Publik | Share lokasi GPS customer |

## User preferences

- Bahasa Indonesia untuk semua UI dan komentar
- Laravel sebagai root project, frontend di `frontend/`
- Database = PostgreSQL di semua environment (lokal Replit + Railway), keduanya via `DATABASE_URL`

## Gotchas

- Jangan pakai `useCurrentOnUpdate()` di migrasi — tidak support PostgreSQL
- `start.sh` dan `start-production.sh` ada di ROOT (bukan di `laravel/` lagi)
- `cd frontend` sebelum menjalankan perintah `pnpm`
- `attached_assets/` ada di root — path alias di vite config pakai `../../../attached_assets` dari `frontend/artifacts/*/`
- File SQLite tidak digunakan — semua env pakai PostgreSQL via `DATABASE_URL`

## Pointers

- API endpoints: `routes/api.php`
- DB schema (Laravel): `database/migrations/`
- DB schema (Drizzle): `frontend/lib/db/`
- Skills: `.local/skills/`
