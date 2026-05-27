# 🏢 Gentong Mas ERP

Gentong Mas sekarang adalah sistem multi-aplikasi modern dengan satu backend dan database bersama.

## Ringkasan

Project ini terdiri dari:
- `apps/backend` — API NestJS + Prisma
- `apps/frontend` — frontend Next.js multi-aplikasi
- `frontend/artifacts/pos-app` — POS app terpisah

Semua aplikasi menggunakan:
- **Single Database**
- **Single Backend API**
- **Role-Based Access Control (RBAC)**
- **Responsive UI** untuk mobile dan desktop
- **Realtime data sync**

> Catatan: `composer` tidak digunakan untuk menjalankan `apps/backend` atau `apps/frontend`. `composer` hanya relevan jika kamu menggunakan `laravel/` bagian legacy.

## Persyaratan

- Node.js 20+ atau kompatibel
- pnpm
- PostgreSQL

## Setup Lokal

1. Install dependensi di root:

```powershell
cd C:\Users\Asus\purchasingorder
pnpm install
```

2. Siapkan environment backend:

```powershell
cd apps/backend
copy .env.example .env
```

3. Edit `apps/backend/.env` jika perlu:

- `DATABASE_PROVIDER=postgresql`
- `DATABASE_URL=postgresql://user:password@localhost:5432/erp_modern`
- `JWT_SECRET=replace-with-strong-secret`
- `PORT=4000`

Opsional:
- `JWT_REFRESH_SECRET`
- `FONNTE_TOKEN`

4. Jalankan Prisma:

```powershell
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init
```

## Menjalankan Aplikasi

### Backend

Dari root workspace:

```powershell
pnpm dev:backend
```

Backend akan berjalan di:

```text
http://localhost:4000
```

### Frontend

Dari root workspace:

```powershell
pnpm dev:frontend
```

Frontend akan berjalan di:

```text
http://localhost:3000
```

## Aplikasi yang Tersedia

Setelah login, gunakan launcher di `http://localhost:3000`.

### ERP Core
- `http://localhost:3000/dashboard`
- Untuk role: `Owner`, `Admin`, `Super Admin`
- Fitur: laporan, inventory, purchasing, accounting, HR, payroll, user management, audit.

### Sales App
- `http://localhost:3000/sales`
- `http://localhost:3000/sales/smart-order`
- Untuk role: `Sales`
- Fitur: Smart Order Input, Customer, Quotation, Sales Order, CRM, Target, Riwayat.

### Gudang App
- `http://localhost:3000/gudang`
- `http://localhost:3000/gudang/picking`
- `http://localhost:3000/gudang/inbound`
- `http://localhost:3000/gudang/outbound`
- `http://localhost:3000/gudang/transfer`
- `http://localhost:3000/gudang/stock-opname`
- `http://localhost:3000/gudang/history`
- Untuk role: `Gudang`

### Driver App
- `http://localhost:3000/driver`
- Untuk role: `Driver`

## Menjalankan Bagian Tertentu

Jika hanya ingin menjalankan backend:

```powershell
pnpm --filter @erp-modern/backend start:dev
```

Jika hanya ingin menjalankan frontend:

```powershell
pnpm --filter @erp-modern/frontend dev
```

## Troubleshooting

- Jika `pnpm dev:backend` gagal, periksa:
  - file `apps/backend/.env`
  - `DATABASE_URL`
  - koneksi PostgreSQL
  - apakah `pnpm install` sudah sukses
- Jika frontend tidak bisa terhubung ke backend, pastikan API berjalan di `http://localhost:4000`.
- Jika ada error token, periksa `JWT_SECRET` dan `JWT_REFRESH_SECRET`.

## Struktur Project

- `apps/backend` — backend NestJS + Prisma
- `apps/frontend` — frontend Next.js
- `frontend/artifacts/pos-app` — POS app terpisah
- `laravel/` — kode Laravel legacy, bukan jalur utama untuk `apps/backend` dan `apps/frontend`

## Catatan Penting

- `composer` tidak diperlukan untuk menjalankan aplikasi utama di root repository.
- Gunakan `pnpm` untuk development di `apps/backend` dan `apps/frontend`.
- Semua aplikasi kini menggunakan satu backend dan database yang sama.

---

Jika kamu ingin, saya bisa tambahkan contoh `pnpm` command untuk Windows PowerShell atau format penulisan environment di `.env`.

## 📝 License

MIT License - bebas digunakan untuk keperluan komersial & personal.

## 🤝 Contributing

PR welcome! Pastikan test pass dan kode readable.

---

**Dibuat dengan ❤️ untuk Gentong Mas**
