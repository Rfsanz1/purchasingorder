# 🛒 Gentong Mas ERP - Sistem Purchase Order

Sistem ERP berbasis Laravel untuk manajemen purchase order dengan integrasi Kledo dan WhatsApp.

## 🚀 Quick Start

### Lokal Development
```bash
# Clone repo
git clone https://github.com/Rfsanz1/purchasingorder.git
cd purchasingorder

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup database (PostgreSQL)
# Edit .env untuk DB connection

# Migrate & seed
php artisan migrate
php artisan db:seed

# Jalankan
php artisan serve
npm run dev
```

### 🚂 Deploy ke Railway
1. Fork repo ini
2. Connect ke Railway
3. Set Environment Variables:
   ```
   KLEDO_TOKEN = <token dari Kledo API>
   ADMIN_PASSWORD = admin123
   ```
4. Deploy otomatis

**Detail setup Railway:** [DEPLOY-RAILWAY.md](DEPLOY-RAILWAY.md)

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `KLEDO_TOKEN` | ✅ | Token API dari Kledo ERP |
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `ADMIN_PASSWORD` | ✅ | Password admin dashboard |
| `FONNTE_TOKEN` | ❌ | Token WhatsApp API (opsional) |

## 📱 Fitur Utama

- ✅ **Purchase Order Management** - Buat & kelola PO
- ✅ **Kledo Integration** - Sync produk, kontak, invoice
- ✅ **WhatsApp Notifications** - Kirim notifikasi via WA
- ✅ **Real-time Dashboard** - Monitoring penjualan
- ✅ **Multi-user Support** - Role-based access
- ✅ **Stock Management** - Tracking stok produk

## 🛠️ Tech Stack

- **Backend:** Laravel 12, PHP 8.2
- **Database:** PostgreSQL
- **Frontend:** Vue.js 3, Tailwind CSS
- **Deployment:** Docker, Railway
- **Integrations:** Kledo ERP, Fonnte WhatsApp

## 📊 API Endpoints

### Kledo Integration
- `GET /api/kledo/token-status` - Cek status koneksi Kledo
- `GET /api/kledo/products` - Ambil produk dari Kledo
- `POST /api/kledo/sync` - Sinkronisasi data penjualan

### Purchase Orders
- `GET /api/orders` - List semua PO
- `POST /api/orders` - Buat PO baru
- `GET /api/orders/{id}` - Detail PO

## 🔍 Troubleshooting

### Kledo Tidak Konek
```bash
# Cek status token
curl https://your-domain.railway.app/api/kledo/token-status
```

Response yang benar:
```json
{
  "valid": true,
  "status": "Token valid"
}
```

### Error Umum
- Pastikan `KLEDO_TOKEN` sudah di-set di Railway
- Redeploy setelah set environment variables
- Cek log Railway untuk error details

## 📝 License

MIT License - bebas digunakan untuk keperluan komersial & personal.

## 🤝 Contributing

PR welcome! Pastikan test pass dan kode readable.

---

**Dibuat dengan ❤️ untuk Gentong Mas**
