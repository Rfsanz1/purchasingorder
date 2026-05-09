# 🏢 Gentong Mas ERP - Complete Business Management System

Sistem ERP komprehensif berbasis Laravel untuk manajemen bisnis lengkap dengan integrasi marketplace dan otomasi proses bisnis.

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

## 📊 Fitur Utama

### ✅ ACTIVE FEATURES (15+)
- **Purchase Order Management** - Buat & kelola PO
- **Kledo Integration** - Sync produk, kontak, invoice
- **WhatsApp Notifications** - Kirim notifikasi via WA
- **Real-time Dashboard** - Monitoring penjualan
- **Multi-user Support** - Role-based access
- **Stock Management** - Tracking stok produk
- **Customer Management** - Database pelanggan
- **Driver Management** - Dashboard driver & tracking
- **Sales Reports** - Laporan penjualan detail
- **Stock Opname** - Inventarisasi stok
- **Multi-branch Support** - Dukungan multi-cabang

### 🆕 ERP MODULES - COMING SOON (105+ Features)

#### 🏷️ MASTER DATA (8 Features)
- **Kategori Produk** - Manajemen kategori produk
- **Brand Produk** - Database brand & merek
- **Satuan Barang** - Konfigurasi unit produk
- **Tipe Harga** - Multiple pricing tiers
- **Pajak** - Konfigurasi pajak kompleks
- **Data Cabang** - Multi-branch management
- **Data Salesman** - Sales team management
- **Metode Pembayaran** - Payment method setup

#### 💰 AKUNTANSI (8 Features)
- **Chart of Accounts (COA)** - Struktur akun lengkap
- **Jurnal Umum** - General journal entries
- **Buku Besar** - General ledger reports
- **Neraca** - Balance sheet reports
- **Arus Kas** - Cash flow statements
- **Hutang Supplier** - Accounts payable
- **Piutang Customer** - Accounts receivable
- **Rekonsiliasi Bank** - Bank reconciliation

#### 📦 MANAJEMEN STOK (6 Features)
- **Mutasi Stok** - Stock movement tracking
- **Transfer Antar Gudang** - Warehouse transfers
- **Minimum Stock Alert** - Low stock notifications
- **Serial Number / IMEI** - Product serial tracking
- **Batch Produk** - Batch & expiry management
- **History Pergerakan Barang** - Stock movement history

#### 🛒 PURCHASE FLOW (4 Features)
- **Permintaan Pembelian** - Purchase requests
- **Approval Purchase** - Multi-level approvals
- **Invoice Supplier** - Supplier invoice management
- **Hutang Jatuh Tempo** - Due payable tracking

#### 📈 SALES FLOW (5 Features)
- **Quotation / Penawaran** - Sales quotations
- **Sales Target** - Sales target management
- **Komisi Sales** - Commission calculations
- **Piutang Penjualan** - Sales receivable
- **Tracking Status Order** - Order status tracking

#### 👥 HR / KARYAWAN (5 Features)
- **Data Karyawan** - Employee database
- **Absensi** - Attendance management
- **Gaji** - Payroll processing
- **Role & Hak Akses** - User roles & permissions
- **Audit Log** - User activity tracking

#### 📊 DASHBOARD ANALYTICS (1 Feature)
- **Analytics Dashboard** - Comprehensive analytics

#### 🔧 FITUR TOKO ELEKTRONIK (5 Features)
- **Servis Barang** - Product service management
- **Klaim Garansi** - Warranty claims
- **Tracking Perbaikan** - Service tracking
- **Kredit Customer** - Customer installment
- **Jatuh Tempo Cicilan** - Installment due dates

#### 🌐 OMNICHANNEL / MARKETPLACE (40+ Features)

##### 🛍️ Shopee Integration (10 Features)
- Dashboard Shopee - Overview & monitoring
- Pesanan Shopee - Order management
- Produk Shopee - Product sync
- Stok Shopee - Inventory sync
- Chat Shopee - Customer communication
- Pengiriman Shopee - Shipping management
- Voucher Shopee - Voucher management
- Customer Shopee - Customer data
- Analytics Shopee - Performance analytics
- Pengaturan API Shopee - API configuration

##### 📱 TikTok Shop Integration (10 Features)
- Dashboard TikTok Shop
- Pesanan TikTok Shop
- Produk TikTok Shop
- Stok TikTok Shop
- Chat TikTok Shop
- Pengiriman TikTok Shop
- Voucher TikTok Shop
- Customer TikTok Shop
- Analytics TikTok Shop
- Pengaturan API TikTok Shop

##### 🏪 Tokopedia Integration (10 Features)
- Dashboard Tokopedia
- Pesanan Tokopedia
- Produk Tokopedia
- Stok Tokopedia
- Chat Tokopedia
- Pengiriman Tokopedia
- Voucher Tokopedia
- Customer Tokopedia
- Analytics Tokopedia
- Pengaturan API Tokopedia

##### 🛒 Lazada Integration (10 Features)
- Dashboard Lazada
- Pesanan Lazada
- Produk Lazada
- Stok Lazada
- Chat Lazada
- Pengiriman Lazada
- Voucher Lazada
- Customer Lazada
- Analytics Lazada
- Pengaturan API Lazada

#### 🏢 FITUR ENTERPRISE (10 Features)
- **Approval System** - Multi-level approval workflows
- **Workflow Automation** - Business process automation
- **Export PDF/Excel** - Advanced export capabilities
- **Template Invoice** - Customizable invoice templates
- **Multi Currency** - Multi-currency support
- **Multi Pajak** - Complex tax configurations
- **Backup System** - Automated backup system
- **API Public** - Public API access
- **Webhook** - Real-time integrations
- **Activity Timeline** - System activity tracking

## 🛠️ Tech Stack

- **Backend:** Laravel 12, PHP 8.2
- **Database:** PostgreSQL
- **Frontend:** Vue.js 3, Tailwind CSS, Alpine.js
- **Deployment:** Docker, Railway
- **Integrations:** Kledo ERP, Fonnte WhatsApp, Multiple Marketplaces
- **UI/UX:** Modern responsive design, Dark mode support

## 📊 System Statistics

- **Total Menu Items:** 120+
- **Active Features:** 15
- **Coming Soon Features:** 105+
- **ERP Modules:** 9 categories
- **Marketplace Integrations:** 4 platforms
- **Code Quality:** Clean, scalable, maintainable

## 📱 API Endpoints

### Kledo Integration
- `GET /api/kledo/token-status` - Check Kledo connection status
- `GET /api/kledo/products` - Get products from Kledo
- `POST /api/kledo/sync` - Sync sales data

### Purchase Orders
- `GET /api/orders` - List all POs
- `POST /api/orders` - Create new PO
- `GET /api/orders/{id}` - Get PO details

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
