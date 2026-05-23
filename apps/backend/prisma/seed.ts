import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);

  // ─── ROLE & PERMISSIONS ───────────────────────────────────────────────
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: { description: 'Administrator role with full access' },
    create: { name: 'admin', description: 'Administrator role with full access' },
  });

  for (const p of [
    { name: 'dashboard.view', description: 'View dashboard summary' },
    { name: 'notifications.view', description: 'View notifications' },
    { name: 'notifications.update', description: 'Mark notifications as read' },
    { name: 'notifications.create', description: 'Send notifications' },
    { name: 'roles.view', description: 'View roles' },
    { name: 'permissions.view', description: 'View permissions' },
  ]) {
    const perm = await prisma.permission.upsert({ where: { name: p.name }, update: {}, create: p });
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  // ─── ADMIN USER ───────────────────────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: { name: 'Administrator', password, roleId: adminRole.id, active: true },
    create: { email: 'admin@example.com', name: 'Administrator', password, active: true, roleId: adminRole.id },
  });

  // ─── WAREHOUSE (unique: code) ─────────────────────────────────────────
  const gudang = await prisma.warehouse.upsert({
    where: { code: 'GDG-001' },
    update: {},
    create: { code: 'GDG-001', name: 'Gudang Utama', address: 'Jl. Industri No. 1, Surabaya', active: true },
  });

  // ─── PRODUCT CATEGORIES (unique: code) ───────────────────────────────
  const catSpr = await prisma.productCategory.upsert({ where: { code: 'CAT-SPR' }, update: {}, create: { code: 'CAT-SPR', name: 'Sparepart Motor' } });
  const catOli = await prisma.productCategory.upsert({ where: { code: 'CAT-OLI' }, update: {}, create: { code: 'CAT-OLI', name: 'Pelumas & Oli' } });

  // ─── PRODUCT UNITS (unique: name) ─────────────────────────────────────
  const uPcs = await prisma.productUnit.upsert({ where: { name: 'Pcs' }, update: {}, create: { name: 'Pcs', symbol: 'pcs' } });
  const uLtr = await prisma.productUnit.upsert({ where: { name: 'Liter' }, update: {}, create: { name: 'Liter', symbol: 'L' } });

  // ─── PRODUCTS (unique: sku) ────────────────────────────────────────────
  for (const p of [
    { sku: 'HDA-001', name: 'Rantai Motor Honda Aspira', hargaBeli: 45000, hargaJual: 55000, stok: 150, stokMinimum: 20, categoryId: catSpr.id, unitId: uPcs.id, brand: 'ASPIRA' },
    { sku: 'FED-001', name: 'Kampas Rem Depan Federal', hargaBeli: 35000, hargaJual: 42000, stok: 200, stokMinimum: 30, categoryId: catSpr.id, unitId: uPcs.id, brand: 'FEDERAL' },
    { sku: 'YMH-001', name: 'Filter Udara Yamaha', hargaBeli: 25000, hargaJual: 32000, stok: 80, stokMinimum: 15, categoryId: catSpr.id, unitId: uPcs.id, brand: 'YAMAHA' },
    { sku: 'NGK-001', name: 'Busi NGK Racing', hargaBeli: 18000, hargaJual: 25000, stok: 300, stokMinimum: 50, categoryId: catSpr.id, unitId: uPcs.id, brand: 'HONDA' },
    { sku: 'CAS-001', name: 'Oli Mesin Castrol 10W-40 1L', hargaBeli: 55000, hargaJual: 65000, stok: 120, stokMinimum: 20, categoryId: catOli.id, unitId: uLtr.id, brand: 'SUZUKI' },
    { sku: 'AHM-001', name: 'Oli Gardan AHM SPX', hargaBeli: 22000, hargaJual: 28000, stok: 90, stokMinimum: 15, categoryId: catOli.id, unitId: uLtr.id, brand: 'HONDA' },
    { sku: 'KWS-001', name: 'Kampas Kopling Kawasaki', hargaBeli: 48000, hargaJual: 58000, stok: 45, stokMinimum: 10, categoryId: catSpr.id, unitId: uPcs.id, brand: 'KAWASAKI' },
    { sku: 'HDB-001', name: 'Gear Set Honda Beat', hargaBeli: 85000, hargaJual: 99000, stok: 60, stokMinimum: 10, categoryId: catSpr.id, unitId: uPcs.id, brand: 'HONDA' },
    { sku: 'VBY-001', name: 'V-Belt Yamaha Mio', hargaBeli: 55000, hargaJual: 68000, stok: 40, stokMinimum: 10, categoryId: catSpr.id, unitId: uPcs.id, brand: 'YAMAHA' },
    { sku: 'AKY-001', name: 'Aki Yuasa 12V 5Ah', hargaBeli: 185000, hargaJual: 220000, stok: 25, stokMinimum: 5, categoryId: catSpr.id, unitId: uPcs.id, brand: 'HONDA' },
  ]) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: { stok: p.stok },
      create: { ...p, warehouseId: gudang.id, active: true },
    });
  }

  // ─── CUSTOMERS (no unique except id — use findFirst guard) ─────────────
  for (const c of [
    { name: 'Bengkel Maju Jaya', email: 'maju@gmail.com', phone: '08111222333', city: 'Surabaya', address: 'Jl. Raya Darmo 10', active: true },
    { name: 'UD Sumber Rejeki', email: 'sumber@gmail.com', phone: '08222333444', city: 'Sidoarjo', address: 'Jl. Veteran 5', active: true },
    { name: 'Toko Bintang Motor', email: 'bintang@gmail.com', phone: '08333444555', city: 'Gresik', address: 'Jl. Harun Tohir 20', active: true },
    { name: 'CV Karya Mandiri', email: 'karya@gmail.com', phone: '08444555666', city: 'Surabaya', address: 'Jl. Ahmad Yani 99', active: true },
    { name: 'Bengkel Santoso', email: 'santoso@gmail.com', phone: '08555666777', city: 'Malang', address: 'Jl. Semeru 15', active: true },
    { name: 'PT Cakra Motor', email: 'cakra@gmail.com', phone: '08666777888', city: 'Surabaya', address: 'Jl. Dupak 55', active: true },
  ]) {
    const exists = await prisma.customer.findFirst({ where: { name: c.name } });
    if (!exists) await prisma.customer.create({ data: c });
  }

  // ─── SUPPLIERS (unique: code) ─────────────────────────────────────────
  for (const s of [
    { code: 'SUP-001', name: 'PT Aspira Indonesia', email: 'aspira@supplier.com', phone: '02111111111', city: 'Jakarta', address: 'Jl. MT Haryono Kav. 1', active: true },
    { code: 'SUP-002', name: 'PT Federal Parts', email: 'federal@supplier.com', phone: '02222222222', city: 'Jakarta', address: 'Jl. Casablanca 88', active: true },
    { code: 'SUP-003', name: 'CV Yamaha Distributor', email: 'yamaha@supplier.com', phone: '02333333333', city: 'Surabaya', address: 'Jl. Rungkut Industri 5', active: true },
    { code: 'SUP-004', name: 'PT Global Spare Nusantara', email: 'gsn@supplier.com', phone: '02444444444', city: 'Surabaya', address: 'Jl. Margomulyo Ind. 3', active: true },
  ]) {
    await prisma.supplier.upsert({ where: { code: s.code }, update: {}, create: s });
  }

  // ─── EMPLOYEES (unique: nik) ───────────────────────────────────────────
  for (const e of [
    { nik: 'EMP001', name: 'Budi Santoso', jabatan: 'Sales Manager', departemen: 'Sales', gapok: 8000000, status: 'aktif', tanggalMasuk: new Date('2020-01-15') },
    { nik: 'EMP002', name: 'Dewi Lestari', jabatan: 'Admin', departemen: 'Admin', gapok: 5500000, status: 'aktif', tanggalMasuk: new Date('2021-03-01') },
    { nik: 'EMP003', name: 'Eko Prasetyo', jabatan: 'Driver', departemen: 'Operasional', gapok: 4500000, status: 'aktif', tanggalMasuk: new Date('2019-07-20') },
    { nik: 'EMP004', name: 'Fitri Handayani', jabatan: 'Kasir', departemen: 'Finance', gapok: 5000000, status: 'aktif', tanggalMasuk: new Date('2022-01-10') },
    { nik: 'EMP005', name: 'Gunawan Susilo', jabatan: 'Staf Gudang', departemen: 'Logistik', gapok: 4800000, status: 'aktif', tanggalMasuk: new Date('2020-06-01') },
    { nik: 'EMP006', name: 'Hendra Wijaya', jabatan: 'Sales', departemen: 'Sales', gapok: 6000000, status: 'aktif', tanggalMasuk: new Date('2021-08-15') },
  ]) {
    await prisma.employee.upsert({ where: { nik: e.nik }, update: {}, create: e });
  }

  // ─── COA (unique: code) ────────────────────────────────────────────────
  for (const coa of [
    { code: '1-1001', name: 'Kas', type: 'aset' },
    { code: '1-1002', name: 'Bank BCA', type: 'aset' },
    { code: '1-1003', name: 'Piutang Dagang', type: 'aset' },
    { code: '1-2001', name: 'Persediaan Barang', type: 'aset' },
    { code: '2-1001', name: 'Hutang Dagang', type: 'kewajiban' },
    { code: '3-1001', name: 'Modal Disetor', type: 'ekuitas' },
    { code: '4-1001', name: 'Pendapatan Penjualan', type: 'pendapatan' },
    { code: '5-1001', name: 'Beban Pokok Penjualan', type: 'beban' },
    { code: '5-1002', name: 'Beban Gaji', type: 'beban' },
    { code: '5-1003', name: 'Beban Operasional', type: 'beban' },
  ]) {
    await prisma.chartOfAccount.upsert({ where: { code: coa.code }, update: {}, create: { ...coa, active: true } });
  }

  // ─── BANK ACCOUNTS (no unique — use findFirst guard) ──────────────────
  for (const ba of [
    { bankName: 'BCA', accountName: 'Gentong Mas', accountNo: 'BCA-1234567890', balance: 120000000, active: true },
    { bankName: 'Mandiri', accountName: 'Gentong Mas', accountNo: 'MDR-0987654321', balance: 45000000, active: true },
  ]) {
    const exists = await prisma.bankAccount.findFirst({ where: { accountNo: ba.accountNo } });
    if (!exists) await prisma.bankAccount.create({ data: ba });
  }

  // ─── DRIVER AREAS (fields: name, areas JSON) ──────────────────────────
  for (const da of [
    { name: 'Eko Prasetyo', areas: [{ wilayah: 'Surabaya Pusat', jadwal: 'Senin-Jumat' }] },
    { name: 'Ahmad Fauzi', areas: [{ wilayah: 'Surabaya Selatan', jadwal: 'Senin-Sabtu' }] },
    { name: 'Bambang Wibowo', areas: [{ wilayah: 'Sidoarjo', jadwal: 'Selasa-Sabtu' }] },
    { name: 'Slamet Riyadi', areas: [{ wilayah: 'Gresik', jadwal: 'Senin-Jumat' }] },
    { name: 'Ridwan Efendi', areas: [{ wilayah: 'Surabaya Utara', jadwal: 'Senin-Sabtu' }] },
  ]) {
    const exists = await prisma.driverArea.findFirst({ where: { name: da.name } });
    if (!exists) await prisma.driverArea.create({ data: da });
  }

  // ─── APP SETTINGS ─────────────────────────────────────────────────────
  for (const s of [
    { key: 'company_name', value: 'Gentong Mas' },
    { key: 'company_address', value: 'Jl. Industri No. 1, Surabaya 60123' },
    { key: 'company_phone', value: '031-1234567' },
    { key: 'company_email', value: 'info@gentongmas.com' },
    { key: 'company_npwp', value: '01.234.567.8-901.000' },
    { key: 'currency', value: 'IDR' },
    { key: 'timezone', value: 'Asia/Jakarta' },
  ]) {
    await prisma.appSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  // ─── POS CATEGORIES ───────────────────────────────────────────────────
  for (const cat of [
    { name: 'Sparepart', active: true },
    { name: 'Oli & Pelumas', active: true },
    { name: 'Aksesoris', active: true },
  ]) {
    const exists = await prisma.posCategory.findFirst({ where: { name: cat.name } });
    if (!exists) await prisma.posCategory.create({ data: cat });
  }

  // ─── POS USER (unique: username) ──────────────────────────────────────
  await prisma.posUser.upsert({
    where: { username: 'kasir1' },
    update: {},
    create: { username: 'kasir1', password: await bcrypt.hash('kasir123', 10), name: 'Fitri Handayani', role: 'kasir', active: true },
  });

  // ─── DEMO ORDER ───────────────────────────────────────────────────────
  const prod1 = await prisma.product.findFirst({ where: { sku: 'HDA-001' } });
  const cust1 = await prisma.customer.findFirst({ where: { name: 'Bengkel Maju Jaya' } });
  if (prod1 && cust1) {
    const existingOrder = await prisma.order.findFirst({ where: { customerId: cust1.id } });
    if (!existingOrder) {
      await prisma.order.create({
        data: {
          namaCustomer: cust1.name,
          salesName: 'Budi Santoso',
          status: 'confirmed',
          totalHarga: Number(prod1.hargaJual) * 5,
          alamat: cust1.address ?? '',
          items: [{ productId: prod1.id, qty: 5, harga: Number(prod1.hargaJual) }],
          customerId: cust1.id,
          orderItems: {
            create: [{ productId: prod1.id, nama: prod1.name, qty: 5, harga: prod1.hargaJual, subtotal: Number(prod1.hargaJual) * 5 }],
          },
        },
      });
    }
  }

  // ─── NOTIFICATIONS (recipient = admin user id) ────────────────────────
  const adminUser = await prisma.user.findFirst({ where: { email: 'admin@example.com' } });
  if (adminUser) {
    for (const n of [
      { recipient: adminUser.id, title: 'Stok Menipis', message: 'Stok Kampas Kopling Kawasaki tersisa 45 pcs', status: 'unread' },
      { recipient: adminUser.id, title: 'Order Baru', message: 'Order baru dari Bengkel Maju Jaya senilai Rp 275.000', status: 'unread' },
      { recipient: adminUser.id, title: 'Sync Kledo Berhasil', message: 'Sinkronisasi produk Kledo selesai: 24 produk diperbarui', status: 'read' },
    ]) {
      const exists = await prisma.notification.findFirst({ where: { title: n.title, recipient: adminUser.id } });
      if (!exists) await prisma.notification.create({ data: n });
    }
  }

  console.log('✅ Seed selesai: admin, 10 produk, 6 pelanggan, 4 supplier, 6 karyawan, 10 COA, 5 area driver, settings, POS, notifikasi');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
