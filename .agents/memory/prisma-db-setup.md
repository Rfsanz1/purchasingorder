---
name: Prisma DB Setup
description: Langkah wajib agar NestJS backend bisa login — tabel Prisma harus di-push manual pertama kali.
---

Ketika container Replit fresh/restart dan DB kosong, NestJS backend gagal login dengan error `The table 'public.User' does not exist`.

**Langkah wajib:**
```bash
cd apps/backend
npx prisma db push --accept-data-loss
node --loader ts-node/esm prisma/seed.ts
```

**Why:** Workflow command sudah include `npx prisma db push` tapi kadang gagal silent (race condition atau DB belum ready). Seed otomatis membuat: admin user, 10 produk, 6 pelanggan, 4 supplier, 6 karyawan, 10 COA, POS config.

**Kredensial admin default:**
- Email: `admin@example.com`
- Password: `admin123` (atau env `ADMIN_PASSWORD`)

**How to apply:** Setiap kali login 500 error / tabel tidak ada, jalankan dua perintah di atas lalu restart NestJS Backend workflow.
