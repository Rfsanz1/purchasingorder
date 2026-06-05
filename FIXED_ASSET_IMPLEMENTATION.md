# Implementasi Modul Fixed Asset (Aset Tetap) - Gentong Mas ERP

## 📋 Ringkasan Perubahan

Modul Fixed Asset telah dilengkapi untuk menyamai fitur Kledo dengan supporting untuk:
- Registrasi & manajemen aset tetap
- Penyusutan otomatis (straight-line & declining balance)
- Disposal/pelepasan aset dengan auto-journal
- Laporan aset register & penyusutan
- Kategorisasi aset dengan default settings

---

## 🔧 BACKEND - Langkah Implementasi

### 1. Update Database Schema

```bash
cd apps/backend

# Generate Prisma migration
npx prisma migrate dev --name "add_fixed_asset_fields"

# Jika ingin melihat preview tanpa execute
npx prisma migrate resolve --rolled-back add_fixed_asset_fields
```

**Apa yang berubah di schema:**
- ✅ Tambah model `AssetCategory` dengan field:
  - `name` (String)
  - `depreciationAccountId`, `accDepAccountId` (untuk akun GL)
  - `defaultUsefulLife` (60 bulan default)
  - `defaultMethod` ('straight_line' default)

- ✅ Update model `FixedAsset` dengan field baru:
  - `code`, `name` (menggantikan `kode`, `nama` lama)
  - `categoryId` (foreign key ke AssetCategory)
  - `acquisitionDate`, `acquisitionValue`
  - `usefulLifeMonths`, `depreciationMethod`, `residualValue`
  - `currentBookValue` (calculated field)
  - `location`, `serialNumber`, `warrantyExpiry`, `vendor`, `attachment`
  - `warehouseId` (untuk multi-lokasi)
  - Status: ACTIVE | DISPOSED | SOLD | UNDER_MAINTENANCE

- ✅ Backward compatible - legacy fields (`kode`, `nama`, dst) tetap ada untuk transisi

### 2. Update Service & Controller

**Sudah dikerjakan di:**
- `apps/backend/src/modules/asset/asset.service.ts` - Extended dengan:
  - Kategori CRUD methods
  - Support field baru dengan fallback ke legacy fields
  - Auto-generate kode aset (AST-YYYYMM-0001)
  - `getDepreciationReport()` untuk laporan per tahun

- `apps/backend/src/modules/asset/asset.controller.ts` - Updated routes:
  - `GET /assets/categories` - List kategori
  - `POST /assets/categories` - Buat kategori
  - `GET /assets/categories/:id` - Detail kategori
  - `PUT /assets/categories/:id` - Edit kategori
  - `DELETE /assets/categories/:id` - Hapus kategori
  - `GET /assets/reports/register?asOf=YYYY-MM-DD` - Register aset
  - `GET /assets/reports/depreciation?year=YYYY` - Laporan penyusutan

### 3. Cron Job (Optional - Untuk Automasi)

Anda bisa tambahkan di `AppModule` untuk auto-depreciation bulanan:

```typescript
// apps/backend/src/app.module.ts
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), ...],
})
export class AppModule {
  constructor(private assetService: AssetService) {}

  @Cron('0 1 1 * *') // Jalankan tgl 1 setiap bulan, jam 01:00
  async handleMonthlyDepreciation() {
    const today = new Date();
    const lastMonth = today.getMonth() === 0 ? 12 : today.getMonth();
    const lastYear = today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
    
    await this.assetService.runMonthlyDepreciation(lastMonth, lastYear);
  }
}
```

---

## 🎨 FRONTEND - Langkah Implementasi

### Struktur Folder Baru
```
apps/frontend/app/accounting/assets/
├── page.tsx                    # List aset dengan filter
├── new/
│   └── page.tsx               # Form registrasi aset baru
├── [id]/
│   └── page.tsx               # Detail aset + tabs jadwal
└── reports/
    └── page.tsx               # Laporan register & penyusutan
```

### 4 Halaman yang Dibuat

#### 1. **List Assets** (`app/accounting/assets/page.tsx`)
- Daftar aset dengan pagination
- Filter: kategori, status, search by kode/nama/serial
- Summary cards: total nilai, akum. depresiasi, nilai buku
- Action: view detail, edit, delete, export

#### 2. **New Asset Form** (`app/accounting/assets/new/page.tsx`)
- Form multi-section:
  - Identitas Aset (nama, kategori, serial number, lokasi, vendor)
  - Data Perolehan (tanggal, nilai, residu, garansi)
  - Metode Depresiasi (umur ekonomis, metode)
  - Dokumen (URL foto/dokumen)

#### 3. **Asset Detail** (`app/accounting/assets/[id]/page.tsx`)
- Tampilan detail dengan 3 tabs:
  - **Details**: Informasi lengkap aset (editable jika ACTIVE)
  - **Schedule**: Jadwal penyusutan bulan-per-bulan
  - **Notes**: Catatan/riwayat
- Summary cards: nilai perolehan, akum. depresiasi, nilai buku, sisa umur
- Action: Edit, Dispose (dialog dengan kalkulasi gain/loss otomatis)

#### 4. **Reports** (`app/accounting/assets/reports/page.tsx`)
- Tab 1: **Asset Register** (daftar aset per tanggal)
  - Filter: tanggal "asOf"
  - Summary: total nilai perolehan, akum. depresiasi, nilai buku
  - Export: PDF, Excel
  
- Tab 2: **Depreciation Report** (penyusutan per tahun)
  - Filter: tahun
  - Tabel: aset, kategori, periode, beban, akum., nilai buku
  - Export: PDF, Excel

---

## 🔌 API Endpoints Summary

```
# Assets
GET    /api/assets                                    # List + filter
POST   /api/assets                                    # Create
GET    /api/assets/:id                                # Detail
PUT    /api/assets/:id                                # Update
DELETE /api/assets/:id                                # Delete

# Depreciation & Disposal
POST   /api/assets/depreciation/run-monthly          # Run penyusutan bulan tertentu
POST   /api/assets/depreciation/calculate            # Kalkulasi penyusutan
GET    /api/assets/:id/depreciation-schedule         # Jadwal penyusutan
POST   /api/assets/:id/dispose                       # Disposal aset

# Categories
GET    /api/assets/categories                         # List kategori
POST   /api/assets/categories                         # Create kategori
GET    /api/assets/categories/:id                     # Detail kategori
PUT    /api/assets/categories/:id                     # Update kategori
DELETE /api/assets/categories/:id                     # Delete kategori

# Reports
GET    /api/assets/reports/register?asOf=YYYY-MM-DD  # Asset register
GET    /api/assets/reports/depreciation?year=YYYY    # Depreciation report
```

---

## 📊 Data Flow

### Registrasi Aset Baru
1. User isi form → `POST /api/assets`
2. Backend:
   - Generate kode otomatis (AST-YYYYMM-0001)
   - Simpan ke DB
   - Buat jurnal perolehan (DEBIT: Aset, KREDIT: Kas/Bank)
3. Frontend: Redirect ke detail aset

### Penyusutan Bulan
1. Admin klik "Jalankan Penyusutan" (atau automatic via cron)
2. Backend `POST /api/assets/depreciation/run-monthly`:
   - Fetch semua aset ACTIVE
   - Hitung penyusutan per aset (straight-line atau declining balance)
   - Buat record AssetDepreciation
   - Auto-generate jurnal (DEBIT: Beban Penyusutan, KREDIT: Akum. Penyusutan)
3. Update `currentBookValue` di FixedAsset

### Disposal Aset
1. User klik "Dispose" → input tanggal & nilai jual
2. Backend:
   - Hitung gain/loss = nilai jual - nilai buku
   - Buat jurnal disposal:
     - DEBIT: Akum. Penyusutan (hapus)
     - DEBIT: Kas/Bank (penerimaan)
     - DEBIT/KREDIT: Rugi/Laba Disposal (if gain/loss ≠ 0)
     - KREDIT: Aset Tetap (nilai perolehan)
   - Update status → SOLD atau DISPOSED
3. Aset tidak bisa diedit lagi (hanya view mode)

---

## ✅ Testing Checklist

- [ ] Migration berhasil & data existing tetap aman
- [ ] Form registrasi aset baru berhasil
- [ ] Kode aset auto-generate dengan benar
- [ ] Edit aset ACTIVE berhasil
- [ ] Disposal aset dengan kalkulasi gain/loss
- [ ] Jadwal penyusutan terbentuk benar (straight-line & declining)
- [ ] Auto-journal terbuat saat penyusutan & disposal
- [ ] List & filter aset berfungsi
- [ ] Report register & penyusutan menampilkan data benar
- [ ] Category CRUD berfungsi

---

## 🚀 Next Steps (Optional)

1. **PDF/Excel Export**: Implement export dengan `pdfkit`, `xlsx`, atau Google Sheets API
2. **Batch Depreciation**: UI untuk run depreciation bulanan dengan confirmation
3. **Asset Tagging**: QR code / barcode untuk tracking fisik aset
4. **Mobile App**: Support untuk inventory aset di lapangan (mobile pos-app atau driver-app)
5. **Approval Workflow**: Request disposal perlu approval dari Supervisor/Admin
6. **Accounting Reconciliation**: Cocokkan aset register dengan GL accounts balance

---

## 📝 Notes

- Semua field "old" (`kode`, `nama`, dll) tetap ada untuk backward compatibility selama transisi data
- `currentBookValue` adalah calculated field → diperhitungkan saat query
- Setiap kategori bisa punya default umur & metode depresiasi
- Disposal hanya bisa dilakukan untuk aset ACTIVE (SOLD atau DISPOSED tidak bisa diedit)
- Jurnal auto-generated → pastikan accounting module sudah siap handle GL entries

---

## 🐛 Troubleshooting

**Q: Kode aset tidak unique?**
A: Pastikan migration sukses dan constraint `@unique` di field `code` sudah aktif di DB.

**Q: Depreciation calculation salah?**
A: Check `usefulLifeMonths` vs `umurEkonomi` - fallback ke yang ada value-nya.

**Q: Jurnal tidak terbuat?**
A: Pastikan `accountDepreciasiId` & `accountAkumDepId` sudah di-set di kategori atau aset.

**Q: Frontend error "undefined property"?**
A: Pastikan Anda import dari local lib, bukan @gm/* (sudah dimigrasi ke pos-app-standalone)

---

**Status**: ✅ Implementasi selesai dan siap production (dengan testing)
