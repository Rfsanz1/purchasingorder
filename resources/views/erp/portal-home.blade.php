@extends('layouts.portal')
@section('title', 'Portal — Gentong Mas ERP')
@section('content')

<div x-data="portalHome()" x-init="init()" class="min-h-screen" style="background:#f0f2f5">

    {{-- ══════════════════════ SEARCH BAR ══════════════════════ --}}
    <div class="sticky top-0 z-20 px-4 py-3" style="background:#f0f2f5;border-bottom:1px solid #e4e6ea">
        <div class="max-w-2xl mx-auto relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
            <input x-model="search" @input.debounce.150ms="filterModules()" type="text"
                placeholder="Cari modul Odoo, fitur, atau menu..."
                class="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent">
            <button x-show="search" @click="search='';filterModules()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">✕</button>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {{-- NO RESULT --}}
        <div x-show="noResult" class="text-center py-20">
            <p class="text-5xl mb-3">🔍</p>
            <p class="text-gray-500 text-sm">Tidak ada modul yang cocok dengan "<span x-text="search" class="font-semibold text-gray-700"></span>"</p>
            <button @click="search='';filterModules()" class="mt-3 text-xs text-purple-600 hover:underline">Reset pencarian</button>
        </div>

        {{-- CATEGORY LOOP --}}
        <template x-for="cat in filteredCategories" :key="cat.id">
            <div x-show="cat.visible">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 text-lg"
                         :style="`background:${cat.color}`" x-html="cat.icon"></div>
                    <div class="flex-1 min-w-0">
                        <h2 class="font-bold text-gray-800 text-base leading-tight" x-text="cat.label"></h2>
                        <p class="text-xs text-gray-400 truncate" x-text="cat.desc"></p>
                    </div>
                    <span class="text-xs text-gray-400 shrink-0" x-text="cat.visibleCount + ' modul'"></span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    <template x-for="mod in cat.modules" :key="mod.url">
                        <a x-show="mod.visible" :href="mod.url"
                           class="portal-card group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white text-center relative"
                           style="min-height:100px;border:1px solid transparent;box-shadow:0 1px 4px rgba(0,0,0,.08)">
                            <span x-show="mod.badge"
                                class="absolute top-2 right-2 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
                                :style="`background:${mod.badgeColor||'#714fff'}`" x-text="mod.badge"></span>
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shrink-0 transition-transform duration-150 group-hover:scale-110"
                                 :style="`background:linear-gradient(135deg,${mod.c1},${mod.c2||mod.c1})`">
                                <span x-html="mod.icon"></span>
                            </div>
                            <span class="text-xs font-semibold text-gray-700 leading-tight group-hover:text-purple-700 transition-colors" x-text="mod.label"></span>
                            <span x-show="mod.sub" class="text-xs text-gray-400 leading-tight -mt-1" x-text="mod.sub"></span>
                        </a>
                    </template>
                </div>
            </div>
        </template>
    </div>
</div>

<style>
.portal-card { transition: box-shadow .15s, border-color .15s, transform .15s; }
.portal-card:hover { box-shadow: 0 6px 20px rgba(113,79,255,.18); border-color: rgba(113,79,255,.25); transform: translateY(-2px); }
</style>

<script>
function mod(label, url, icon, c1, c2, sub, badge, badgeColor) {
    return { label, url, icon, c1, c2: c2||c1, sub: sub||'', badge: badge||'', badgeColor: badgeColor||'#714fff', visible: true };
}

function portalHome() {
    return {
        search: '', noResult: false, filteredCategories: [],

        categories: [
            // ══════════════════════════════════════════
            // SALES
            // ══════════════════════════════════════════
            {
                id:'sales', color:'#00A09D',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
                label:'Sales', desc:'CRM, Penjualan, POS, Langganan, Sewa',
                modules:[
                    mod('CRM','/erp/crm','🤝','#875A7B','#9b6fa0','Pipeline'),
                    mod('Sales','/erp/sales','💼','#00A09D','#00b5b2','Order Penjualan'),
                    mod('Point of Sale','/pos','🖥️','#00A09D','#00cbc7','Kasir'),
                    mod('Subscriptions','/erp/subscriptions','🔁','#e5622c','#f0732e','Langganan'),
                    mod('Rental','/erp/rental','🏠','#5e9e6e','#6db57e','Penyewaan'),
                    mod('Buat Order (PO)','/po-form','➕','#0ea5e9','#38bdf8','Form Order'),
                    mod('Invoice','/erp/invoice','🧾','#6366f1','#818cf8','Tagihan'),
                    mod('Quotation','/erp/quotation','📄','#8b5cf6','#a78bfa','Penawaran'),
                    mod('Sales Order','/erp/sales-order','📦','#f59e0b','#fbbf24','SO'),
                    mod('Delivery Order','/erp/delivery-order','🚚','#10b981','#34d399','DO'),
                    mod('Riwayat Penjualan','/erp/riwayat-penjualan','📋','#3b82f6','#60a5fa','History'),
                    mod('Order Tracking','/erp/order-tracking','📍','#ef4444','#f87171','Lacak'),
                    mod('Sales Target','/erp/sales-target','🎯','#f97316','#fb923c','Target'),
                    mod('Komisi Sales','/erp/sales-commission','💰','#eab308','#facc15','Commission'),
                    mod('Piutang','/erp/sales-receivable','💳','#14b8a6','#2dd4bf','Receivable'),
                    mod('Retur','/erp/retur','↩️','#ef4444','#f87171','Return'),
                    mod('Diskon & Promo','/erp/discount','🏷️','#ec4899','#f472b6','Discount'),
                    mod('Membership','/erp/membership','⭐','#f59e0b','#fbbf24','Member'),
                    mod('Cicilan','/erp/installment','📅','#8b5cf6','#a78bfa','Installment'),
                    mod('Harga Khusus','/erp/price-types','💲','#0ea5e9','#38bdf8','Price Types'),
                ]
            },
            // ══════════════════════════════════════════
            // FINANCE / ACCOUNTING
            // ══════════════════════════════════════════
            {
                id:'finance', color:'#7C7BAD',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                label:'Finance & Akuntansi', desc:'Pembukuan, pengeluaran, dokumen, tanda tangan digital',
                modules:[
                    mod('Accounting','/erp/accounting','📊','#7C7BAD','#9b9acf','Pembukuan'),
                    mod('Invoicing','/erp/invoicing','🧾','#7C7BAD','#8e8dc0','Invoice'),
                    mod('Expenses','/erp/expenses','🧾','#00A09D','#00b5b2','Pengeluaran Karyawan'),
                    mod('Documents','/erp/documents','📁','#00A09D','#00c5c2','Dokumen'),
                    mod('Sign','/erp/sign','✍️','#16a085','#1abc9c','Tanda Tangan Digital'),
                    mod('Kas Masuk','/erp/cash-in','💵','#22c55e','#4ade80','Cash In'),
                    mod('Kas Keluar','/erp/cash-out','💸','#ef4444','#f87171','Cash Out'),
                    mod('Kas Utama','/erp/main-cash','🏦','#10b981','#34d399','Main Cash'),
                    mod('Kas Kecil','/erp/petty-cash','👛','#f59e0b','#fbbf24','Petty Cash'),
                    mod('Rekening Bank','/erp/bank-account','🏛️','#0ea5e9','#38bdf8','Bank'),
                    mod('Transfer Bank','/erp/bank-transfer','🔄','#6366f1','#818cf8','Transfer'),
                    mod('Laba Rugi','/erp/profit-loss','📉','#8b5cf6','#a78bfa','P&L'),
                    mod('Rekonsiliasi Bank','/erp/bank-reconciliation','⚖️','#14b8a6','#2dd4bf','Rekonsiliasi'),
                    mod('Arus Kas','/erp/cash-flow','🌊','#0ea5e9','#38bdf8','Cash Flow'),
                    mod('Chart of Accounts','/erp/chart-of-accounts','🗂️','#8b5cf6','#a78bfa','COA'),
                    mod('Jurnal','/erp/journal','📔','#6366f1','#818cf8','Journal'),
                    mod('Buku Besar','/erp/general-ledger','📚','#4f46e5','#6366f1','General Ledger'),
                    mod('Trial Balance','/erp/trial-balance','⚖️','#7c3aed','#8b5cf6','Neraca Saldo'),
                    mod('Neraca','/erp/balance-sheet','📊','#0ea5e9','#38bdf8','Balance Sheet'),
                    mod('Budgeting','/erp/budgeting','🎯','#22c55e','#4ade80','Anggaran'),
                    mod('Audit Transaksi','/erp/audit-transaction','🔎','#6366f1','#818cf8','Audit'),
                    mod('Multi Mata Uang','/erp/multi-currency','💱','#f59e0b','#fbbf24','Currency'),
                    mod('Pajak (Tax)','/erp/taxes','%','#ef4444','#f87171','Tax Setup'),
                    mod('PPN','/erp/vat','🏷️','#f97316','#fb923c','VAT'),
                    mod('PPh','/erp/pph','📄','#f59e0b','#fbbf24','Witholding'),
                    mod('e-Faktur','/erp/e-faktur','💻','#8b5cf6','#a78bfa','e-Faktur DJP'),
                    mod('Laporan Pajak','/erp/tax-report','📊','#10b981','#34d399','Tax Report'),
                ]
            },
            // ══════════════════════════════════════════
            // INVENTORY & MANUFACTURING
            // ══════════════════════════════════════════
            {
                id:'inventory', color:'#F06050',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
                label:'Inventory & Manufacturing', desc:'Stok, gudang, produksi, pembelian, kualitas, PLM',
                modules:[
                    mod('Inventory','/products','📦','#F06050','#f07060','Stok & Produk'),
                    mod('Manufacturing','/erp/manufacturing','🏭','#f59e0b','#fbbf24','Produksi'),
                    mod('Purchase','/erp/purchase-order','🛒','#f97316','#fb923c','Pembelian'),
                    mod('Maintenance','/erp/maintenance','🔧','#6b7280','#9ca3af','Perawatan Mesin'),
                    mod('PLM','/erp/plm','📐','#0ea5e9','#38bdf8','Product Lifecycle'),
                    mod('Quality','/erp/quality','✅','#22c55e','#4ade80','Kontrol Kualitas'),
                    mod('Stok Masuk','/erp/stock-in','⬆️','#22c55e','#4ade80','Stock In'),
                    mod('Stok Keluar','/erp/stock-out','⬇️','#ef4444','#f87171','Stock Out'),
                    mod('Stock Opname','/erp/stock-opname','🔍','#f59e0b','#fbbf24','Opname'),
                    mod('Gudang','/erp/warehouse','🏭','#6366f1','#818cf8','Warehouse'),
                    mod('Mutasi Stok','/erp/stock-mutation','🔄','#0ea5e9','#38bdf8','Mutation'),
                    mod('Transfer Gudang','/erp/warehouse-transfer','🔀','#8b5cf6','#a78bfa','Transfer'),
                    mod('Penyesuaian Stok','/erp/stock-adjustment','⚖️','#f97316','#fb923c','Adjustment'),
                    mod('Kartu Stok','/erp/stock-card','🃏','#14b8a6','#2dd4bf','Stock Card'),
                    mod('Min Stok','/erp/min-stock','⚠️','#ef4444','#f87171','Alert','!','#ef4444'),
                    mod('Kategori Produk','/erp/product-categories','🗂️','#6366f1','#818cf8','Kategori'),
                    mod('Brand','/erp/brands','🏷️','#ec4899','#f472b6','Merek'),
                    mod('Barcode','/erp/barcode','▦','#374151','#6b7280','Barcode'),
                    mod('Satuan','/erp/units','📏','#0ea5e9','#38bdf8','Units'),
                    mod('Fast Moving','/erp/fast-moving','⚡','#f59e0b','#fbbf24','Laris'),
                    mod('Bill of Materials','/erp/bom','📋','#8b5cf6','#a78bfa','BOM'),
                    mod('Work Orders','/erp/work-orders','⚙️','#f97316','#fb923c','Work Center'),
                    mod('Scraps','/erp/scraps','🗑️','#6b7280','#9ca3af','Sisa Produksi'),
                    mod('Lot & Serial No','/erp/lot-serial','🔢','#0ea5e9','#38bdf8','Lot/SN'),
                    mod('Inspeksi Kualitas','/erp/inspection','🔬','#22c55e','#4ade80','QC Inspection'),
                    mod('NCR','/erp/ncr','⚠️','#ef4444','#f87171','Non-Conformance'),
                ]
            },
            // ══════════════════════════════════════════
            // PURCHASE
            // ══════════════════════════════════════════
            {
                id:'purchase', color:'#F4A460',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
                label:'Purchase & Supplier', desc:'Pembelian, supplier, penerimaan barang, hutang usaha',
                modules:[
                    mod('Supplier','/erp/supplier','🤝','#F4A460','#f5b070','Pemasok'),
                    mod('Purchase Order','/erp/purchase-order','🛒','#f97316','#fb923c','PO'),
                    mod('Penerimaan Barang','/erp/goods-receipt','📥','#10b981','#34d399','GRN'),
                    mod('Purchase Request','/erp/purchase-request','📝','#6366f1','#818cf8','PR'),
                    mod('Approval','/erp/purchase-approval','✅','#22c55e','#4ade80','Persetujuan'),
                    mod('Invoice Supplier','/erp/supplier-invoice','🧾','#ef4444','#f87171','Supplier Inv'),
                    mod('Retur Pembelian','/erp/purchase-return','↩️','#8b5cf6','#a78bfa','Return'),
                    mod('Hutang Usaha','/erp/account-payable','💸','#dc2626','#ef4444','AP'),
                    mod('Jatuh Tempo','/erp/payable-due','📅','#ef4444','#f87171','Due Date','!','#ef4444'),
                    mod('Bayar Supplier','/erp/pay-supplier','💰','#14b8a6','#2dd4bf','Payment'),
                    mod('Analitik Supplier','/erp/supplier-analytics','📊','#0ea5e9','#38bdf8','Analytics'),
                    mod('Request for Quote','/erp/rfq','📨','#8b5cf6','#a78bfa','RFQ'),
                    mod('Vendor Pricelist','/erp/vendor-pricelist','💲','#f59e0b','#fbbf24','Harga Vendor'),
                ]
            },
            // ══════════════════════════════════════════
            // HUMAN RESOURCES
            // ══════════════════════════════════════════
            {
                id:'hr', color:'#00C09D',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
                label:'Human Resources', desc:'Karyawan, rekrutmen, cuti, penggajian, penilaian kinerja',
                modules:[
                    mod('Employees','/erp/employees','👤','#00C09D','#00d5ae','Karyawan'),
                    mod('Recruitment','/erp/recruitment','🎯','#875A7B','#9b6fa0','Rekrutmen'),
                    mod('Time Off / Cuti','/erp/time-off','🌴','#00A09D','#00b5b2','Cuti & Izin'),
                    mod('Appraisals','/erp/appraisals','⭐','#f59e0b','#fbbf24','Penilaian Kinerja'),
                    mod('Lunch','/erp/lunch','🍱','#e74c3c','#ec6457','Makan Siang'),
                    mod('Payroll','/erp/payroll','💰','#22c55e','#4ade80','Penggajian'),
                    mod('Referrals','/erp/referrals','🔗','#9b59b6','#a96bc6','Referral Karyawan'),
                    mod('Fleet','/erp/fleet','🚛','#f97316','#fb923c','Armada Kendaraan'),
                    mod('Absensi','/erp/attendance','🕐','#0ea5e9','#38bdf8','Attendance'),
                    mod('Insentif','/erp/incentive','🏅','#f59e0b','#fbbf24','Incentive'),
                    mod('Divisi','/erp/division','🏬','#6366f1','#818cf8','Division'),
                    mod('Jadwal Kerja','/erp/work-schedule','📅','#8b5cf6','#a78bfa','Schedule'),
                    mod('Roles & Akses','/erp/roles','🔒','#ef4444','#f87171','Roles'),
                    mod('Manajemen User','/erp/users','👥','#14b8a6','#2dd4bf','Users'),
                    mod('Audit Log','/erp/audit-log','📋','#6366f1','#818cf8','Log'),
                    mod('Login Activity','/erp/login-activity','🔑','#f59e0b','#fbbf24','Activity'),
                    mod('Kontrak Kerja','/erp/employee-contracts','📝','#22c55e','#4ade80','Contracts'),
                    mod('Struktur Gaji','/erp/salary-structure','💼','#8b5cf6','#a78bfa','Salary Structure'),
                ]
            },
            // ══════════════════════════════════════════
            // MARKETING
            // ══════════════════════════════════════════
            {
                id:'marketing', color:'#E05D00',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>',
                label:'Marketing', desc:'Email, SMS, sosial media, event, survei, live chat',
                modules:[
                    mod('Email Marketing','/erp/email-marketing','📧','#E05D00','#f06e10','Email Blast'),
                    mod('SMS Marketing','/erp/sms-marketing','📱','#00A09D','#00b5b2','SMS Blast'),
                    mod('Social Marketing','/erp/social-marketing','📣','#3b5998','#4a6bb5','Media Sosial'),
                    mod('Events','/erp/events','🎪','#e74c3c','#ec6457','Acara & Event'),
                    mod('Surveys','/erp/surveys','📊','#875A7B','#9b6fa0','Kuesioner'),
                    mod('Live Chat','/erp/live-chat','💬','#00C09D','#00d5ae','Chat Live','Live','#00C09D'),
                    mod('WhatsApp Blast','/erp/whatsapp-blast','📲','#22c55e','#4ade80','WA Marketing','WA','#22c55e'),
                    mod('Payment Reminder','/erp/payment-reminder','🔔','#ef4444','#f87171','Reminder'),
                    mod('Chatbot AI','/erp/chatbot-ai','🤖','#7c3aed','#8b5cf6','AI Chatbot','AI','#7c3aed'),
                    mod('Loyalitas','/erp/loyalty','🏆','#f59e0b','#fbbf24','Loyalty Points'),
                    mod('Referral Program','/erp/referral-program','🎁','#ec4899','#f472b6','Referral'),
                    mod('Push Notification','/erp/push-notification','🔔','#6366f1','#818cf8','Push Notif'),
                ]
            },
            // ══════════════════════════════════════════
            // WEBSITE & eCOMMERCE
            // ══════════════════════════════════════════
            {
                id:'website', color:'#30C0A0',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>',
                label:'Website & eCommerce', desc:'Toko online, blog, forum, eLearning, manajemen konten',
                modules:[
                    mod('Website','/erp/website','🌐','#30C0A0','#40d5b5','Builder Web'),
                    mod('eCommerce','/erp/ecommerce','🛍️','#e74c3c','#ec6457','Toko Online'),
                    mod('Toko Online','/erp/toko-online','🏪','#00A09D','#00b5b2','Bagisto/WC'),
                    mod('Blog','/erp/blog','✍️','#7C7BAD','#9b9acf','Konten Blog'),
                    mod('Forum','/erp/forum','💬','#00C09D','#00d5ae','Diskusi'),
                    mod('eLearning','/erp/elearning','🎓','#875A7B','#9b6fa0','Kursus Online'),
                    mod('Marketplace','/erp/marketplace-overview','🌐','#f97316','#fb923c','Multi-Platform'),
                    mod('Shopee','/marketplace/shopee','🛍️','#ff6633','#ff8855','Shopee'),
                    mod('TikTok Shop','/marketplace/tiktok','🎵','#010101','#374151','TikTok'),
                    mod('Tokopedia','/marketplace/tokopedia','🟢','#03ac0e','#05c610','Tokopedia'),
                    mod('Lazada','/marketplace/lazada','🔵','#0f3faf','#1e56c8','Lazada'),
                    mod('Sync Produk MP','/erp/marketplace-sync','🔄','#0ea5e9','#38bdf8','Sync'),
                    mod('Multi-Ch Order','/erp/multi-channel-order','📦','#6366f1','#818cf8','Orders'),
                    mod('Multi-Ch Chat','/erp/multi-channel-chat','💬','#22c55e','#4ade80','Chat'),
                    mod('SEO Manager','/erp/seo','🔍','#f59e0b','#fbbf24','SEO'),
                ]
            },
            // ══════════════════════════════════════════
            // SERVICES / PROJECT
            // ══════════════════════════════════════════
            {
                id:'services', color:'#00A0D0',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
                label:'Services & Project', desc:'Manajemen proyek, helpdesk, lapangan, timesheet, jadwal',
                modules:[
                    mod('Project','/erp/projects','📌','#00A0D0','#00b5e7','Manajemen Proyek'),
                    mod('Timesheets','/erp/timesheet','⏱️','#00A09D','#00b5b2','Pencatatan Waktu'),
                    mod('Field Service','/erp/field-service','🔧','#e74c3c','#ec6457','Servis Lapangan'),
                    mod('Helpdesk','/erp/helpdesk','🎫','#875A7B','#9b6fa0','Tiket Support'),
                    mod('Planning','/erp/planning','📅','#00C09D','#00d5ae','Perencanaan'),
                    mod('Appointments','/erp/appointments','📆','#f59e0b','#fbbf24','Jadwal Janji'),
                    mod('Project Tasks','/erp/project-tasks','✅','#6366f1','#818cf8','Task'),
                    mod('Milestones','/erp/project-milestones','🏁','#22c55e','#4ade80','Milestone'),
                    mod('Resource Alokasi','/erp/resource-allocation','👥','#8b5cf6','#a78bfa','Resources'),
                    mod('Project Costing','/erp/project-costing','💰','#f97316','#fb923c','Biaya Proyek'),
                    mod('Project Billing','/erp/project-billing','🧾','#0ea5e9','#38bdf8','Billing'),
                    mod('Servis','/erp/service','🔧','#6366f1','#818cf8','Service Order'),
                    mod('Garansi','/erp/warranty','🛡️','#10b981','#34d399','Warranty'),
                    mod('Sparepart','/erp/sparepart','⚙️','#f59e0b','#fbbf24','Parts'),
                    mod('Teknisi','/erp/technician','👨‍🔧','#0ea5e9','#38bdf8','Technician'),
                    mod('Jadwal Servis','/erp/service-schedule','📅','#8b5cf6','#a78bfa','Schedule'),
                ]
            },
            // ══════════════════════════════════════════
            // DELIVERY & LOGISTIK
            // ══════════════════════════════════════════
            {
                id:'delivery', color:'#14b8a6',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                label:'Delivery & Logistik', desc:'Admin pengiriman, driver, armada, surat jalan, tracking',
                modules:[
                    mod('Admin Pengiriman','/admin','🖥️','#14b8a6','#2dd4bf','Admin'),
                    mod('Dashboard Driver','/driver','🚗','#0ea5e9','#38bdf8','Driver'),
                    mod('Delivery Note','/erp/delivery-note','📋','#6366f1','#818cf8','Surat Jalan'),
                    mod('Tracking','/erp/tracking','📍','#ef4444','#f87171','Lacak'),
                    mod('Bukti Pengiriman','/erp/delivery-proof','📸','#10b981','#34d399','POD'),
                    mod('Jadwal Kirim','/erp/delivery-schedule','📅','#f59e0b','#fbbf24','Schedule'),
                    mod('Data Driver','/erp/drivers','👨‍✈️','#8b5cf6','#a78bfa','Drivers'),
                    mod('Laporan Driver','/erp/report-driver','📊','#0ea5e9','#38bdf8','Report'),
                    mod('Wilayah Driver','/erp/driver-areas','🗺️','#22c55e','#4ade80','Area'),
                    mod('Rute Pengiriman','/erp/delivery-routes','🛣️','#f97316','#fb923c','Routes'),
                    mod('Biaya Pengiriman','/erp/shipping-cost','💰','#14b8a6','#2dd4bf','Shipping Cost'),
                ]
            },
            // ══════════════════════════════════════════
            // PRODUCTIVITY / PRODUCTIVITY APPS
            // ══════════════════════════════════════════
            {
                id:'productivity', color:'#875A7B',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>',
                label:'Produktivitas', desc:'Pesan, tanda tangan, IoT, VoIP, dokumen, arsip',
                modules:[
                    mod('Discuss','/erp/discuss','💬','#875A7B','#9b6fa0','Pesan & Diskusi'),
                    mod('Sign','/erp/sign','✍️','#16a085','#1abc9c','Tanda Tangan Digital'),
                    mod('Documents','/erp/documents','📁','#00A09D','#00c5c2','Manajemen Dokumen'),
                    mod('IoT','/erp/iot','🔌','#2c3e50','#3d5166','Internet of Things'),
                    mod('VoIP','/erp/voip','📞','#27ae60','#2ecc71','Telepon IP'),
                    mod('Notes','/erp/notes','📝','#f59e0b','#fbbf24','Catatan'),
                    mod('Calendar','/erp/calendar','📆','#0ea5e9','#38bdf8','Kalender'),
                    mod('Kontak','/erp/contacts','👤','#6366f1','#818cf8','Address Book'),
                    mod('Arsip','/erp/archive','🗄️','#6b7280','#9ca3af','Archive'),
                    mod('Template Dokumen','/erp/document-templates','📄','#8b5cf6','#a78bfa','Templates'),
                    mod('Approval Workflow','/erp/approval-workflow','✅','#22c55e','#4ade80','Approval'),
                    mod('Webhook','/erp/webhook','🪝','#8b5cf6','#a78bfa','Webhook'),
                ]
            },
            // ══════════════════════════════════════════
            // CRM & PELANGGAN
            // ══════════════════════════════════════════
            {
                id:'crm', color:'#ec4899',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
                label:'CRM & Pelanggan', desc:'Pipeline, pelanggan, follow up, loyalty, keluhan',
                modules:[
                    mod('CRM Pipeline','/erp/crm','🤝','#875A7B','#9b6fa0','Pipeline Kanban'),
                    mod('Pelanggan','/erp/customers','👥','#ec4899','#f472b6','Customers'),
                    mod('Grup Pelanggan','/erp/customer-group','👨‍👩‍👧‍👦','#f97316','#fb923c','Groups'),
                    mod('Kredit Pelanggan','/erp/customer-credit','💳','#ef4444','#f87171','Credit Limit'),
                    mod('Riwayat Pelanggan','/erp/customer-history','📜','#8b5cf6','#a78bfa','History'),
                    mod('Follow Up','/erp/customer-followup','📞','#0ea5e9','#38bdf8','Follow Up'),
                    mod('Keluhan','/erp/customer-complaint','😟','#6366f1','#818cf8','Complaint'),
                    mod('Pipeline Leads','/erp/crm-leads','📊','#875A7B','#9b6fa0','Leads'),
                    mod('Peluang','/erp/crm-opportunities','💡','#f59e0b','#fbbf24','Opportunities'),
                    mod('Aktivitas CRM','/erp/crm-activities','📅','#10b981','#34d399','Activities'),
                    mod('Segmentasi','/erp/customer-segments','🎯','#ec4899','#f472b6','Segments'),
                ]
            },
            // ══════════════════════════════════════════
            // AI & AUTOMATION
            // ══════════════════════════════════════════
            {
                id:'ai', color:'#7c3aed',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
                label:'AI & Otomasi', desc:'Kecerdasan buatan, forecasting, workflow otomatis, auto-sync',
                modules:[
                    mod('AI Inventory','/erp/ai-inventory','🤖','#7c3aed','#8b5cf6','Smart Reorder','AI','#7c3aed'),
                    mod('AI Analytics','/erp/ai-analytics','🧠','#6366f1','#818cf8','Insights','AI','#6366f1'),
                    mod('Chatbot AI','/erp/chatbot','💬','#8b5cf6','#a78bfa','Chatbot','AI','#8b5cf6'),
                    mod('Forecasting','/erp/forecasting','🔮','#4f46e5','#6366f1','Prediksi','AI','#4f46e5'),
                    mod('Workflow Otomasi','/erp/workflow-automation','⚡','#f59e0b','#fbbf24','Automation'),
                    mod('Auto Reminder','/erp/auto-reminder','🔔','#ef4444','#f87171','Reminder'),
                    mod('Auto Sync','/erp/auto-sync','🔄','#10b981','#34d399','Sync Otomatis'),
                    mod('Approval Workflow','/erp/approval-workflow','✅','#22c55e','#4ade80','Approval'),
                    mod('AI Demand Planning','/erp/ai-demand','📈','#0ea5e9','#38bdf8','Demand Plan','AI','#0ea5e9'),
                    mod('Smart Pricing','/erp/smart-pricing','💲','#ec4899','#f472b6','Dynamic Price','AI','#ec4899'),
                    mod('OCR Dokumen','/erp/ocr','📷','#f97316','#fb923c','OCR Scan','AI','#f97316'),
                ]
            },
            // ══════════════════════════════════════════
            // ASSET MANAGEMENT
            // ══════════════════════════════════════════
            {
                id:'assets', color:'#2c3e50',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>',
                label:'Asset Management', desc:'Aset tetap, depresiasi, perawatan, mutasi, disposal',
                modules:[
                    mod('Asset Registry','/erp/asset-registry','🏗️','#2c3e50','#3d5166','Daftar Aset'),
                    mod('Asset Categories','/erp/asset-categories','🗂️','#0ea5e9','#38bdf8','Kategori'),
                    mod('Depresiasi','/erp/asset-depreciation','📉','#ef4444','#f87171','Depreciation'),
                    mod('Asset Maintenance','/erp/asset-maintenance','🔧','#f59e0b','#fbbf24','Maintenance'),
                    mod('Asset Transfer','/erp/asset-transfer','🔀','#6366f1','#818cf8','Transfer Aset'),
                    mod('Asset Disposal','/erp/asset-disposal','🗑️','#6b7280','#9ca3af','Disposal'),
                    mod('Audit Log Aset','/erp/asset-audit-log','📋','#8b5cf6','#a78bfa','Audit Log'),
                    mod('Maintenance','/erp/maintenance','⚙️','#10b981','#34d399','Perawatan Mesin'),
                ]
            },
            // ══════════════════════════════════════════
            // REPORTS & ANALYTICS
            // ══════════════════════════════════════════
            {
                id:'reports', color:'#0ea5e9',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
                label:'Laporan & Analytics', desc:'Semua laporan bisnis, export PDF/Excel, dashboard analytics',
                modules:[
                    mod('Dashboard Utama','/erp/dashboard','🏠','#4f46e5','#7c3aed','Overview'),
                    mod('Analytics','/erp/analytics','📊','#0ea5e9','#38bdf8','Grafik & Tren'),
                    mod('AI Analytics','/erp/ai-analytics','🧠','#8b5cf6','#a78bfa','AI Insight','AI','#7c3aed'),
                    mod('Multi Branch','/erp/multi-branch','🏢','#f59e0b','#fbbf24','Cabang'),
                    mod('Lap. Penjualan','/erp/laporan-penjualan','📈','#0ea5e9','#38bdf8','Sales Report'),
                    mod('Lap. Divisi','/erp/laporan-divisi','🗂️','#6366f1','#818cf8','Per Divisi'),
                    mod('Data Kledo','/erp/data-penjualan-kledo','🔗','#8b5cf6','#a78bfa','Kledo Sync'),
                    mod('Lap. Finance','/erp/report-finance','💰','#22c55e','#4ade80','Finance'),
                    mod('Lap. Driver','/erp/report-driver','🚚','#14b8a6','#2dd4bf','Driver'),
                    mod('Lap. Inventory','/erp/report-inventory','📦','#f59e0b','#fbbf24','Inventory'),
                    mod('Lap. Pajak','/erp/report-tax','%','#ef4444','#f87171','Tax'),
                    mod('Lap. Pembelian','/erp/report-purchase','🛒','#f97316','#fb923c','Purchase'),
                    mod('Profit per Produk','/erp/profit-product','💹','#10b981','#34d399','Margin'),
                    mod('Profit per Cabang','/erp/profit-branch','🏢','#f97316','#fb923c','Branch'),
                    mod('Tren Penjualan','/erp/sales-trend','📉','#0ea5e9','#38bdf8','Trend'),
                    mod('Export PDF','/erp/export-pdf','📄','#ef4444','#f87171','PDF'),
                    mod('Export Excel','/erp/export-excel','📊','#22c55e','#4ade80','Excel'),
                ]
            },
            // ══════════════════════════════════════════
            // SYSTEM & SETTINGS
            // ══════════════════════════════════════════
            {
                id:'system', color:'#6b7280',
                icon:'<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
                label:'Pengaturan Sistem', desc:'Konfigurasi, integrasi, backup, API, tema, notifikasi',
                modules:[
                    mod('Integrasi','/erp/integrasi','🔗','#6366f1','#818cf8','Integrations'),
                    mod('Kledo ERP','/erp/integrasi','🔑','#00A09D','#00b5b2','Kledo API'),
                    mod('Profil Perusahaan','/erp/company-profile','🏢','#0ea5e9','#38bdf8','Company'),
                    mod('Nomor Dokumen','/erp/document-numbering','#️⃣','#f59e0b','#fbbf24','Doc Number'),
                    mod('Sinkronisasi','/erp/sync','🔄','#10b981','#34d399','Sync'),
                    mod('Notifikasi','/erp/notifications','🔔','#ec4899','#f472b6','Notification'),
                    mod('Webhook','/erp/webhook','🪝','#8b5cf6','#a78bfa','Webhook'),
                    mod('Backup Data','/erp/backup','💾','#14b8a6','#2dd4bf','Backup'),
                    mod('Mobile Sync','/erp/mobile-sync','📱','#f97316','#fb923c','Mobile'),
                    mod('Payment Gateway','/erp/payment-gateway','💳','#6366f1','#818cf8','Payment GW'),
                    mod('Install App (PWA)','/erp/install-app','📲','#0ea5e9','#38bdf8','PWA Install'),
                    mod('API Public','/erp/api-public','⚙️','#374151','#6b7280','API'),
                    mod('Tema & UI','/erp/theme','🎨','#ec4899','#f472b6','Theme'),
                    mod('Multi Branch Setup','/erp/multi-branch-setup','🏢','#f59e0b','#fbbf24','Branch Setup'),
                    mod('Hak Akses Role','/erp/roles','🔒','#ef4444','#f87171','Roles'),
                    mod('Penomoran Otomatis','/erp/document-numbering','🔢','#6366f1','#818cf8','Autonumber'),
                ]
            },
        ],

        init() {
            this.filteredCategories = this.categories.map(cat => ({
                ...cat,
                visible: true,
                visibleCount: cat.modules.length,
                modules: cat.modules.map(m => ({ ...m, visible: true }))
            }));
        },

        filterModules() {
            const q = this.search.toLowerCase().trim();
            let any = false;
            this.filteredCategories = this.filteredCategories.map(cat => {
                if (!q) {
                    cat.modules.forEach(m => m.visible = true);
                    cat.visible = true;
                    cat.visibleCount = cat.modules.length;
                    return cat;
                }
                let cnt = 0;
                cat.modules.forEach(m => {
                    const hit = m.label.toLowerCase().includes(q)
                        || (m.sub||'').toLowerCase().includes(q)
                        || cat.label.toLowerCase().includes(q)
                        || cat.desc.toLowerCase().includes(q);
                    m.visible = hit;
                    if (hit) cnt++;
                });
                cat.visible = cnt > 0;
                cat.visibleCount = cnt;
                if (cnt) any = true;
                return cat;
            });
            this.noResult = !!q && !any;
        }
    };
}
</script>
@endsection
