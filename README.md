# 🏢 Gentong Mas ERP Ecosystem

Gentong Mas kini bertransformasi menjadi sistem multi-aplikasi modern dengan satu database dan satu backend API bersama.

## 🌐 Arsitektur Sistem

Semua aplikasi menggunakan:
- **Single Database** (PostgreSQL)
- **Single Backend API** (NestJS + Prisma)
- **Role-Based Access Control** (RBAC)
- **Responsive UI** untuk mobile dan desktop
- **Realtime data sync** via Socket.IO
- **Notifikasi real-time** untuk Sales, Gudang, Driver, Owner, Admin

### Aplikasi dalam ekosistem

- `ERP Core` - untuk **Owner** dan **Admin**
- `Sales App` - aplikasi khusus penjualan mobile-first
- `Gudang App` - aplikasi khusus operasional gudang mobile-first
- `Driver App` - aplikasi khusus pengiriman mobile-first

## 👥 Role System

Role utama:
- `Super Admin`
- `Owner`
- `Admin`
- `Sales`
- `Gudang`
- `Driver`

Setiap role akan mengakses tampilan dan fitur sesuai tugasnya.

## 🚀 Cara Menjalankan Lokal

### 1. Install dependensi

Pastikan sudah terpasang `pnpm`.

```bash
cd c:/Users/Asus/purchasingorder
pnpm install
```

### 2. Siapkan environment backend

```bash
cd apps/backend
cp .env.example .env
```

Edit `apps/backend/.env` jika perlu:
- `DATABASE_PROVIDER` = postgresql
- `DATABASE_URL` = `postgresql://user:password@localhost:5432/erp_modern`
- `JWT_SECRET` = `replace-with-strong-secret`
- `PORT` = `4000`

Opsional:
- `JWT_REFRESH_SECRET`
- `FONNTE_TOKEN`

### 3. Jalankan database schema

```bash
cd apps/backend
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### 4. Jalankan backend API

Dari root workspace:

```bash
pnpm dev:backend
```

Backend akan berjalan di:

```bash
http://localhost:4000
```

API prefix default:

```bash
http://localhost:4000/api
```

### 5. Jalankan frontend

Dari root workspace:

```bash
pnpm dev:frontend
```

Frontend akan berjalan di:

```bash
http://localhost:3000
```

## 🧭 Cara Mengakses 3 Aplikasi

Setelah login, gunakan halaman launcher utama di `http://localhost:3000`.

### ERP Core (Owner + Admin)

- `http://localhost:3000/dashboard`
- Menu untuk laporan, inventory, accounting, HR, settings, user management, dan audit log.

### Sales App

- `http://localhost:3000/sales`
- `http://localhost:3000/sales/smart-order`
- Fitur utama: Smart Order Input, Customer, Quotation, Sales Order, CRM, Target, Riwayat.

### Gudang App

- `http://localhost:3000/gudang`
- `http://localhost:3000/gudang/picking`
- `http://localhost:3000/gudang/inbound`
- `http://localhost:3000/gudang/outbound`
- `http://localhost:3000/gudang/transfer`
- `http://localhost:3000/gudang/stock-opname`
- `http://localhost:3000/gudang/history`

### Driver App

- `http://localhost:3000/driver`

Driver akan melihat tugas pengiriman, maps, upload bukti, tanda tangan, dan riwayat.

## ⚙️ Jalankan hanya bagian tertentu

Jika hanya ingin menjalankan backend:

```bash
pnpm --filter @erp-modern/backend start:dev
```

Jika hanya ingin menjalankan frontend:

```bash
pnpm --filter @erp-modern/frontend dev
```

## 📌 Catatan penting

- Backend dan frontend **menggunakan satu API dan database yang sama**.
- Login adalah **role-based**, sehingga Sales/Gudang/Driver tidak akan melihat menu Admin/Accounting/Payroll yang tidak relevan.
- Realtime notifikasi bekerja melalui koneksi Socket.IO ke backend.

## 📦 Struktur Project

- `apps/backend` — NestJS backend API + Prisma
- `apps/frontend` — Next.js frontend multi-app
- `frontend/artifacts/pos-app` — aplikasi POS terpisah

## 🔧 Environment Variables Backend

- `DATABASE_PROVIDER`
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `JWT_REFRESH_SECRET` (opsional)
- `FONNTE_TOKEN` (opsional)

---

Jika kamu ingin, saya bisa juga memperbarui README dengan petunjuk `pnpm` khusus untuk Windows PowerShell dan contoh login role-based. 
### ERP Coming Soon Routes
All ERP features are accessible via `/erp/*` routes with placeholder UI

## 🔍 Troubleshooting

### Kledo Connection Issues
```bash
# Check token status
curl https://your-domain.railway.app/api/kledo/token-status
```

Expected response:
```json
{
  "valid": true,
  "status": "Token valid"
}
```

### Common Issues
- Ensure `KLEDO_TOKEN` is set in Railway environment
- Check database connection in `.env`
- Verify PHP 8.2+ compatibility

## 📋 Development Roadmap

### Phase 1 ✅ (Current)
- Basic PO management
- Kledo integration
- WhatsApp notifications
- Core dashboard

### Phase 2 🚧 (Coming Soon)
- Complete ERP modules implementation
- Marketplace integrations
- Advanced analytics
- Mobile app development

### Phase 3 📅 (Future)
- AI-powered insights
- Advanced automation
- Multi-company support
- Enterprise features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check [DEPLOY-RAILWAY.md](DEPLOY-RAILWAY.md) for deployment guides
- Review [menu-structure.txt](menu-structure.txt) for complete feature list

---

**Built with ❤️ for Indonesian businesses**
- Redeploy setelah set environment variables
- Cek log Railway untuk error details

## 📝 License

MIT License - bebas digunakan untuk keperluan komersial & personal.

## 🤝 Contributing

PR welcome! Pastikan test pass dan kode readable.

---

**Dibuat dengan ❤️ untuk Gentong Mas**
