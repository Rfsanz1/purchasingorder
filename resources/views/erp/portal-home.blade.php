@extends('layouts.portal')
@section('title', 'Portal — Gentong Mas ERP')
@section('content')

<div x-data="portalHome()" x-init="init()" class="min-h-screen" style="background:#f0f2f5">

    {{-- ═══════════════════════════════════════════════════════════
         TOP SEARCH BAR
    ═══════════════════════════════════════════════════════════ --}}
    <div class="sticky top-0 z-20 px-4 py-3" style="background:#f0f2f5;border-bottom:1px solid #e4e6ea">
        <div class="max-w-2xl mx-auto relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/>
            </svg>
            <input
                x-model="search"
                @input="filterModules()"
                type="text"
                placeholder="Cari modul, fitur, atau menu..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style="focus:ring-color:#714fff"
            >
            <span x-show="search" @click="search='';filterModules()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xs">✕</span>
        </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-6 space-y-8">

        {{-- ─── NO RESULT ──────────────────────────────────── --}}
        <div x-show="noResult" class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500 text-sm">Tidak ada modul yang cocok dengan "<span x-text="search" class="font-semibold"></span>"</p>
            <button @click="search='';filterModules()" class="mt-3 text-xs text-purple-600 hover:underline">Reset pencarian</button>
        </div>

        {{-- ═══════════════════════════════════════════════════════════
             LOOP CATEGORIES
        ═══════════════════════════════════════════════════════════ --}}
        <template x-for="cat in filteredCategories" :key="cat.id">
            <div x-show="cat.visible">

                {{-- Category Header --}}
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
                         :style="`background:${cat.color}`">
                        <span x-html="cat.icon"></span>
                    </div>
                    <div>
                        <h2 class="font-bold text-gray-800 text-base leading-tight" x-text="cat.label"></h2>
                        <p class="text-xs text-gray-400" x-text="cat.desc"></p>
                    </div>
                    <div class="ml-auto flex items-center gap-2">
                        <span class="text-xs text-gray-400" x-text="cat.visibleCount + ' modul'"></span>
                    </div>
                </div>

                {{-- Module Cards Grid --}}
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    <template x-for="mod in cat.modules" :key="mod.url">
                        <a x-show="mod.visible"
                           :href="mod.url"
                           class="group portal-card flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white text-center transition-all duration-150 hover:-translate-y-0.5 relative"
                           style="box-shadow:0 1px 4px rgba(0,0,0,.08);min-height:100px">

                            {{-- Badge --}}
                            <span x-show="mod.badge"
                                  class="absolute top-2 right-2 text-white text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
                                  :style="`background:${mod.badgeColor||'#714fff'}`"
                                  x-text="mod.badge"></span>

                            {{-- Icon --}}
                            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xl shrink-0 transition-transform duration-150 group-hover:scale-110"
                                 :style="`background:linear-gradient(135deg,${mod.color},${mod.color2||mod.color})`">
                                <span x-html="mod.icon"></span>
                            </div>

                            {{-- Label --}}
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
.portal-card:hover {
    box-shadow: 0 6px 20px rgba(113,79,255,.15);
    border-color: rgba(113,79,255,.2);
}
.portal-card { border: 1px solid transparent; }
</style>

<script>
function portalHome() {
    return {
        search: '',
        noResult: false,
        categories: [
            {
                id: 'dashboard',
                label: 'Dashboard & Analytics',
                desc: 'Ringkasan bisnis, laporan visual, dan insight AI',
                color: '#4f46e5',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
                modules: [
                    { label:'Dashboard Utama', url:'/erp/dashboard', icon:'🏠', color:'#4f46e5', color2:'#7c3aed', sub:'Overview' },
                    { label:'Analytics', url:'/erp/analytics', icon:'📊', color:'#0ea5e9', color2:'#38bdf8', sub:'Grafik & Tren' },
                    { label:'AI Analytics', url:'/erp/ai-analytics', icon:'🤖', color:'#8b5cf6', color2:'#a78bfa', badge:'AI', badgeColor:'#7c3aed', sub:'Insight Cerdas' },
                    { label:'Multi Branch', url:'/erp/multi-branch', icon:'🏢', color:'#f59e0b', color2:'#fbbf24', sub:'Cabang' },
                    { label:'Laporan Penjualan', url:'/erp/laporan-penjualan', icon:'📈', color:'#10b981', color2:'#34d399', sub:'Sales Report' },
                    { label:'Laporan Divisi', url:'/erp/laporan-divisi', icon:'🗂️', color:'#6366f1', color2:'#818cf8', sub:'Per Divisi' },
                ]
            },
            {
                id: 'sales',
                label: 'Sales',
                desc: 'Kelola pesanan, invoice, quotation, dan penjualan',
                color: '#0ea5e9',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>',
                modules: [
                    { label:'Buat Order (PO)', url:'/po-form', icon:'➕', color:'#0ea5e9', color2:'#38bdf8', sub:'Form Order', badge:'', badgeColor:'' },
                    { label:'Riwayat Penjualan', url:'/erp/riwayat-penjualan', icon:'📋', color:'#3b82f6', color2:'#60a5fa', sub:'History' },
                    { label:'Invoice', url:'/erp/invoice', icon:'🧾', color:'#6366f1', color2:'#818cf8', sub:'Tagihan' },
                    { label:'Quotation', url:'/erp/quotation', icon:'📄', color:'#8b5cf6', color2:'#a78bfa', sub:'Penawaran' },
                    { label:'Sales Order', url:'/erp/sales-order', icon:'📦', color:'#f59e0b', color2:'#fbbf24', sub:'SO' },
                    { label:'Delivery Order', url:'/erp/delivery-order', icon:'🚚', color:'#10b981', color2:'#34d399', sub:'DO' },
                    { label:'Order Tracking', url:'/erp/order-tracking', icon:'📍', color:'#ef4444', color2:'#f87171', sub:'Lacak Pesanan' },
                    { label:'Sales Target', url:'/erp/sales-target', icon:'🎯', color:'#f97316', color2:'#fb923c', sub:'Target' },
                    { label:'Komisi Sales', url:'/erp/sales-commission', icon:'💰', color:'#eab308', color2:'#facc15', sub:'Commission' },
                    { label:'Piutang', url:'/erp/sales-receivable', icon:'💳', color:'#14b8a6', color2:'#2dd4bf', sub:'Receivable' },
                    { label:'Retur', url:'/erp/retur', icon:'↩️', color:'#ef4444', color2:'#f87171', sub:'Return' },
                    { label:'Diskon & Promo', url:'/erp/discount', icon:'🏷️', color:'#ec4899', color2:'#f472b6', sub:'Discount' },
                    { label:'Membership', url:'/erp/membership', icon:'⭐', color:'#f59e0b', color2:'#fbbf24', sub:'Member' },
                    { label:'Cicilan', url:'/erp/installment', icon:'📅', color:'#8b5cf6', color2:'#a78bfa', sub:'Installment' },
                    { label:'Harga Khusus', url:'/erp/price-types', icon:'💲', color:'#0ea5e9', color2:'#38bdf8', sub:'Price Types' },
                    { label:'Data Kledo', url:'/erp/data-penjualan-kledo', icon:'🔗', color:'#6366f1', color2:'#818cf8', sub:'Kledo Sync' },
                ]
            },
            {
                id: 'inventory',
                label: 'Inventory & Gudang',
                desc: 'Stok, produk, gudang, dan manajemen barang',
                color: '#10b981',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
                modules: [
                    { label:'Produk & Stok', url:'/products', icon:'📦', color:'#10b981', color2:'#34d399', sub:'Katalog' },
                    { label:'Stok Masuk', url:'/erp/stock-in', icon:'⬆️', color:'#22c55e', color2:'#4ade80', sub:'Stock In' },
                    { label:'Stok Keluar', url:'/erp/stock-out', icon:'⬇️', color:'#ef4444', color2:'#f87171', sub:'Stock Out' },
                    { label:'Stock Opname', url:'/erp/stock-opname', icon:'🔍', color:'#f59e0b', color2:'#fbbf24', sub:'Opname' },
                    { label:'Gudang', url:'/erp/warehouse', icon:'🏭', color:'#6366f1', color2:'#818cf8', sub:'Warehouse' },
                    { label:'Mutasi Stok', url:'/erp/stock-mutation', icon:'🔄', color:'#0ea5e9', color2:'#38bdf8', sub:'Mutation' },
                    { label:'Transfer Gudang', url:'/erp/warehouse-transfer', icon:'🔀', color:'#8b5cf6', color2:'#a78bfa', sub:'Transfer' },
                    { label:'Penyesuaian Stok', url:'/erp/stock-adjustment', icon:'⚖️', color:'#f97316', color2:'#fb923c', sub:'Adjustment' },
                    { label:'Stok Card', url:'/erp/stock-card', icon:'🃏', color:'#14b8a6', color2:'#2dd4bf', sub:'Kartu Stok' },
                    { label:'Min Stok', url:'/erp/min-stock', icon:'⚠️', color:'#ef4444', color2:'#f87171', sub:'Min Stock', badge:'Alert', badgeColor:'#ef4444' },
                    { label:'Kategori Produk', url:'/erp/product-categories', icon:'🗂️', color:'#6366f1', color2:'#818cf8', sub:'Kategori' },
                    { label:'Brand', url:'/erp/brands', icon:'🏷️', color:'#ec4899', color2:'#f472b6', sub:'Merek' },
                    { label:'Barcode', url:'/erp/barcode', icon:'▦', color:'#374151', color2:'#6b7280', sub:'Barcode' },
                    { label:'Satuan', url:'/erp/units', icon:'📏', color:'#0ea5e9', color2:'#38bdf8', sub:'Units' },
                    { label:'Fast Moving', url:'/erp/fast-moving', icon:'⚡', color:'#f59e0b', color2:'#fbbf24', sub:'Laris' },
                    { label:'Produksi', url:'/erp/production', icon:'🏗️', color:'#8b5cf6', color2:'#a78bfa', sub:'Manufacturing' },
                ]
            },
            {
                id: 'purchase',
                label: 'Purchase & Supplier',
                desc: 'Pembelian, supplier, dan hutang usaha',
                color: '#f59e0b',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
                modules: [
                    { label:'Supplier', url:'/erp/supplier', icon:'🤝', color:'#f59e0b', color2:'#fbbf24', sub:'Pemasok' },
                    { label:'Purchase Order', url:'/erp/purchase-order', icon:'🛒', color:'#f97316', color2:'#fb923c', sub:'PO' },
                    { label:'Penerimaan Barang', url:'/erp/goods-receipt', icon:'📥', color:'#10b981', color2:'#34d399', sub:'GRN' },
                    { label:'Purchase Request', url:'/erp/purchase-request', icon:'📝', color:'#6366f1', color2:'#818cf8', sub:'PR' },
                    { label:'Approval', url:'/erp/purchase-approval', icon:'✅', color:'#22c55e', color2:'#4ade80', sub:'Persetujuan' },
                    { label:'Invoice Supplier', url:'/erp/supplier-invoice', icon:'🧾', color:'#ef4444', color2:'#f87171', sub:'Supplier Inv' },
                    { label:'Retur Pembelian', url:'/erp/purchase-return', icon:'↩️', color:'#8b5cf6', color2:'#a78bfa', sub:'Return' },
                    { label:'Hutang Usaha', url:'/erp/account-payable', icon:'💸', color:'#dc2626', color2:'#ef4444', sub:'AP' },
                    { label:'Jatuh Tempo', url:'/erp/payable-due', icon:'📅', color:'#ef4444', color2:'#f87171', sub:'Due Date', badge:'!', badgeColor:'#ef4444' },
                    { label:'Bayar Supplier', url:'/erp/pay-supplier', icon:'💰', color:'#14b8a6', color2:'#2dd4bf', sub:'Payment' },
                    { label:'Analitik Supplier', url:'/erp/supplier-analytics', icon:'📊', color:'#0ea5e9', color2:'#38bdf8', sub:'Analytics' },
                ]
            },
            {
                id: 'finance',
                label: 'Finance & Kas',
                desc: 'Kas, bank, pengeluaran, dan arus keuangan',
                color: '#22c55e',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
                modules: [
                    { label:'Kas Masuk', url:'/erp/cash-in', icon:'💵', color:'#22c55e', color2:'#4ade80', sub:'Cash In' },
                    { label:'Kas Keluar', url:'/erp/cash-out', icon:'💸', color:'#ef4444', color2:'#f87171', sub:'Cash Out' },
                    { label:'Kas Utama', url:'/erp/main-cash', icon:'🏦', color:'#10b981', color2:'#34d399', sub:'Main Cash' },
                    { label:'Kas Kecil', url:'/erp/petty-cash', icon:'👛', color:'#f59e0b', color2:'#fbbf24', sub:'Petty Cash' },
                    { label:'Rekening Bank', url:'/erp/bank-account', icon:'🏛️', color:'#0ea5e9', color2:'#38bdf8', sub:'Bank' },
                    { label:'Transfer Bank', url:'/erp/bank-transfer', icon:'🔄', color:'#6366f1', color2:'#818cf8', sub:'Transfer' },
                    { label:'Pengeluaran', url:'/erp/expense', icon:'🧾', color:'#f97316', color2:'#fb923c', sub:'Expense' },
                    { label:'Laba Rugi', url:'/erp/profit-loss', icon:'📉', color:'#8b5cf6', color2:'#a78bfa', sub:'P&L' },
                    { label:'Rekonsiliasi Bank', url:'/erp/bank-reconciliation', icon:'⚖️', color:'#14b8a6', color2:'#2dd4bf', sub:'Rekonsiliasi' },
                    { label:'Arus Kas', url:'/erp/cash-flow', icon:'🌊', color:'#0ea5e9', color2:'#38bdf8', sub:'Cash Flow' },
                    { label:'Laporan Finance', url:'/erp/report-finance', icon:'📊', color:'#10b981', color2:'#34d399', sub:'Report' },
                ]
            },
            {
                id: 'accounting',
                label: 'Accounting',
                desc: 'Jurnal, buku besar, neraca, dan akuntansi',
                color: '#8b5cf6',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
                modules: [
                    { label:'Chart of Accounts', url:'/erp/chart-of-accounts', icon:'🗂️', color:'#8b5cf6', color2:'#a78bfa', sub:'COA' },
                    { label:'Jurnal', url:'/erp/journal', icon:'📔', color:'#6366f1', color2:'#818cf8', sub:'Journal' },
                    { label:'Buku Besar', url:'/erp/general-ledger', icon:'📚', color:'#4f46e5', color2:'#6366f1', sub:'General Ledger' },
                    { label:'Trial Balance', url:'/erp/trial-balance', icon:'⚖️', color:'#7c3aed', color2:'#8b5cf6', sub:'Neraca Saldo' },
                    { label:'Neraca', url:'/erp/balance-sheet', icon:'📊', color:'#0ea5e9', color2:'#38bdf8', sub:'Balance Sheet' },
                    { label:'Saldo Awal', url:'/erp/opening-balance', icon:'🔑', color:'#f59e0b', color2:'#fbbf24', sub:'Opening Bal' },
                    { label:'Periode Akuntansi', url:'/erp/accounting-period', icon:'📅', color:'#10b981', color2:'#34d399', sub:'Period' },
                    { label:'Departemen', url:'/erp/departments', icon:'🏬', color:'#ef4444', color2:'#f87171', sub:'Dept' },
                    { label:'Proyek', url:'/erp/projects', icon:'📌', color:'#f97316', color2:'#fb923c', sub:'Projects' },
                    { label:'Budgeting', url:'/erp/budgeting', icon:'🎯', color:'#22c55e', color2:'#4ade80', sub:'Anggaran' },
                    { label:'Audit Transaksi', url:'/erp/audit-transaction', icon:'🔎', color:'#6366f1', color2:'#818cf8', sub:'Audit' },
                    { label:'Approval System', url:'/erp/approval-system', icon:'✅', color:'#14b8a6', color2:'#2dd4bf', sub:'Approval' },
                ]
            },
            {
                id: 'tax',
                label: 'Pajak & Tax',
                desc: 'PPN, PPh, e-Faktur, dan laporan pajak',
                color: '#ef4444',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>',
                modules: [
                    { label:'Pajak', url:'/erp/taxes', icon:'%', color:'#ef4444', color2:'#f87171', sub:'Tax Setup' },
                    { label:'Multi Tax', url:'/erp/multi-tax', icon:'⊕', color:'#dc2626', color2:'#ef4444', sub:'Gabungan' },
                    { label:'PPN', url:'/erp/vat', icon:'🏷️', color:'#f97316', color2:'#fb923c', sub:'VAT 11%' },
                    { label:'PPh', url:'/erp/pph', icon:'📄', color:'#f59e0b', color2:'#fbbf24', sub:'Witholding' },
                    { label:'Faktur Pajak', url:'/erp/tax-invoice', icon:'🧾', color:'#6366f1', color2:'#818cf8', sub:'Tax Invoice' },
                    { label:'e-Faktur', url:'/erp/e-faktur', icon:'💻', color:'#8b5cf6', color2:'#a78bfa', sub:'e-Faktur DJP' },
                    { label:'Laporan Pajak', url:'/erp/tax-report', icon:'📊', color:'#10b981', color2:'#34d399', sub:'Tax Report' },
                    { label:'Akuntansi Pajak', url:'/erp/tax-accounting', icon:'📒', color:'#0ea5e9', color2:'#38bdf8', sub:'Tax Acct' },
                ]
            },
            {
                id: 'crm',
                label: 'CRM & Pelanggan',
                desc: 'Kelola pelanggan, loyalitas, dan komunikasi',
                color: '#ec4899',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
                modules: [
                    { label:'Pelanggan', url:'/erp/customers', icon:'👥', color:'#ec4899', color2:'#f472b6', sub:'Customers' },
                    { label:'Grup Pelanggan', url:'/erp/customer-group', icon:'👨‍👩‍👧‍👦', color:'#f97316', color2:'#fb923c', sub:'Groups' },
                    { label:'Kredit Pelanggan', url:'/erp/customer-credit', icon:'💳', color:'#ef4444', color2:'#f87171', sub:'Credit Limit' },
                    { label:'Riwayat Pelanggan', url:'/erp/customer-history', icon:'📜', color:'#8b5cf6', color2:'#a78bfa', sub:'History' },
                    { label:'Program Loyalitas', url:'/erp/loyalty', icon:'🏆', color:'#f59e0b', color2:'#fbbf24', sub:'Loyalty' },
                    { label:'Follow Up', url:'/erp/customer-followup', icon:'📞', color:'#0ea5e9', color2:'#38bdf8', sub:'Follow Up' },
                    { label:'WhatsApp Blast', url:'/erp/whatsapp-blast', icon:'💬', color:'#22c55e', color2:'#4ade80', sub:'WA Blast', badge:'WA', badgeColor:'#22c55e' },
                    { label:'Payment Reminder', url:'/erp/payment-reminder', icon:'🔔', color:'#ef4444', color2:'#f87171', sub:'Reminder' },
                    { label:'Keluhan', url:'/erp/customer-complaint', icon:'😟', color:'#6366f1', color2:'#818cf8', sub:'Complaint' },
                    { label:'Chatbot AI', url:'/erp/chatbot-ai', icon:'🤖', color:'#7c3aed', color2:'#8b5cf6', sub:'AI Chatbot', badge:'AI', badgeColor:'#7c3aed' },
                ]
            },
            {
                id: 'delivery',
                label: 'Delivery & Pengiriman',
                desc: 'Admin pengiriman, driver, armada, dan tracking',
                color: '#14b8a6',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 17h2a2 2 0 000-4H8v4zm0 0H6a2 2 0 010-4h2m0 4v1a2 2 0 002 2h4a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v14"/></svg>',
                modules: [
                    { label:'Admin Pengiriman', url:'/admin', icon:'🖥️', color:'#14b8a6', color2:'#2dd4bf', sub:'Admin' },
                    { label:'Dashboard Driver', url:'/driver', icon:'🚗', color:'#0ea5e9', color2:'#38bdf8', sub:'Driver' },
                    { label:'Delivery Note', url:'/erp/delivery-note', icon:'📋', color:'#6366f1', color2:'#818cf8', sub:'Surat Jalan' },
                    { label:'Tracking', url:'/erp/tracking', icon:'📍', color:'#ef4444', color2:'#f87171', sub:'Lacak' },
                    { label:'Bukti Pengiriman', url:'/erp/delivery-proof', icon:'📸', color:'#10b981', color2:'#34d399', sub:'POD' },
                    { label:'Jadwal Kirim', url:'/erp/delivery-schedule', icon:'📅', color:'#f59e0b', color2:'#fbbf24', sub:'Schedule' },
                    { label:'Armada', url:'/erp/fleet', icon:'🚛', color:'#f97316', color2:'#fb923c', sub:'Fleet' },
                    { label:'Data Driver', url:'/erp/drivers', icon:'👨‍✈️', color:'#8b5cf6', color2:'#a78bfa', sub:'Drivers' },
                    { label:'Laporan Driver', url:'/erp/report-driver', icon:'📊', color:'#0ea5e9', color2:'#38bdf8', sub:'Report' },
                ]
            },
            {
                id: 'marketplace',
                label: 'Marketplace',
                desc: 'Kelola toko online multi-platform dari satu tempat',
                color: '#f97316',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
                modules: [
                    { label:'Overview', url:'/erp/marketplace-overview', icon:'🌐', color:'#f97316', color2:'#fb923c', sub:'Semua Platform' },
                    { label:'Sync Produk', url:'/erp/marketplace-sync', icon:'🔄', color:'#0ea5e9', color2:'#38bdf8', sub:'Sync' },
                    { label:'Multi-Channel Order', url:'/erp/multi-channel-order', icon:'📦', color:'#6366f1', color2:'#818cf8', sub:'Orders' },
                    { label:'Multi-Channel Chat', url:'/erp/multi-channel-chat', icon:'💬', color:'#22c55e', color2:'#4ade80', sub:'Chat' },
                    { label:'Analytics MP', url:'/erp/multi-channel-analytics', icon:'📊', color:'#8b5cf6', color2:'#a78bfa', sub:'Analytics' },
                    { label:'Shopee', url:'/marketplace/shopee', icon:'🛍️', color:'#ff6633', color2:'#ff8855', sub:'Shopee' },
                    { label:'TikTok Shop', url:'/marketplace/tiktok', icon:'🎵', color:'#010101', color2:'#374151', sub:'TikTok' },
                    { label:'Tokopedia', url:'/marketplace/tokopedia', icon:'🟢', color:'#03ac0e', color2:'#05c610', sub:'Tokopedia' },
                    { label:'Lazada', url:'/marketplace/lazada', icon:'🔵', color:'#0f3faf', color2:'#1e56c8', sub:'Lazada' },
                ]
            },
            {
                id: 'service',
                label: 'Service & Garansi',
                desc: 'Servis, garansi, teknisi, dan jadwal perawatan',
                color: '#6366f1',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
                modules: [
                    { label:'Service Order', url:'/erp/service', icon:'🔧', color:'#6366f1', color2:'#818cf8', sub:'Service' },
                    { label:'Garansi', url:'/erp/warranty', icon:'🛡️', color:'#10b981', color2:'#34d399', sub:'Warranty' },
                    { label:'Tracking Service', url:'/erp/service-tracking', icon:'📍', color:'#ef4444', color2:'#f87171', sub:'Tracking' },
                    { label:'Sparepart', url:'/erp/sparepart', icon:'⚙️', color:'#f59e0b', color2:'#fbbf24', sub:'Parts' },
                    { label:'Teknisi', url:'/erp/technician', icon:'👨‍🔧', color:'#0ea5e9', color2:'#38bdf8', sub:'Technician' },
                    { label:'Jadwal Service', url:'/erp/service-schedule', icon:'📅', color:'#8b5cf6', color2:'#a78bfa', sub:'Schedule' },
                    { label:'Riwayat Service', url:'/erp/service-history', icon:'📜', color:'#14b8a6', color2:'#2dd4bf', sub:'History' },
                ]
            },
            {
                id: 'reports',
                label: 'Laporan & Export',
                desc: 'Laporan lengkap, export PDF/Excel, dan analisis data',
                color: '#0ea5e9',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
                modules: [
                    { label:'Laporan Penjualan', url:'/erp/laporan-penjualan', icon:'📈', color:'#0ea5e9', color2:'#38bdf8', sub:'Sales Report' },
                    { label:'Laporan Divisi', url:'/erp/laporan-divisi', icon:'🗂️', color:'#6366f1', color2:'#818cf8', sub:'Per Divisi' },
                    { label:'Data Penjualan Kledo', url:'/erp/data-penjualan-kledo', icon:'🔗', color:'#8b5cf6', color2:'#a78bfa', sub:'Kledo' },
                    { label:'Laporan Finance', url:'/erp/report-finance', icon:'💰', color:'#22c55e', color2:'#4ade80', sub:'Finance' },
                    { label:'Laporan Driver', url:'/erp/report-driver', icon:'🚚', color:'#14b8a6', color2:'#2dd4bf', sub:'Driver' },
                    { label:'Laporan Inventory', url:'/erp/report-inventory', icon:'📦', color:'#f59e0b', color2:'#fbbf24', sub:'Inventory' },
                    { label:'Laporan Pajak', url:'/erp/report-tax', icon:'%', color:'#ef4444', color2:'#f87171', sub:'Tax' },
                    { label:'Profit per Produk', url:'/erp/profit-product', icon:'💹', color:'#10b981', color2:'#34d399', sub:'Margin' },
                    { label:'Profit per Cabang', url:'/erp/profit-branch', icon:'🏢', color:'#f97316', color2:'#fb923c', sub:'Branch' },
                    { label:'Tren Penjualan', url:'/erp/sales-trend', icon:'📉', color:'#0ea5e9', color2:'#38bdf8', sub:'Trend' },
                    { label:'Export PDF', url:'/erp/export-pdf', icon:'📄', color:'#ef4444', color2:'#f87171', sub:'PDF' },
                    { label:'Export Excel', url:'/erp/export-excel', icon:'📊', color:'#22c55e', color2:'#4ade80', sub:'Excel' },
                ]
            },
            {
                id: 'ai',
                label: 'AI & Otomasi',
                desc: 'Kecerdasan buatan, forecasting, dan workflow otomatis',
                color: '#7c3aed',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>',
                modules: [
                    { label:'AI Inventory', url:'/erp/ai-inventory', icon:'🤖', color:'#7c3aed', color2:'#8b5cf6', badge:'AI', badgeColor:'#7c3aed', sub:'Smart Reorder' },
                    { label:'AI Analytics', url:'/erp/ai-analytics', icon:'🧠', color:'#6366f1', color2:'#818cf8', badge:'AI', badgeColor:'#6366f1', sub:'Insights' },
                    { label:'Chatbot AI', url:'/erp/chatbot', icon:'💬', color:'#8b5cf6', color2:'#a78bfa', badge:'AI', badgeColor:'#8b5cf6', sub:'Chatbot' },
                    { label:'Forecasting', url:'/erp/forecasting', icon:'🔮', color:'#4f46e5', color2:'#6366f1', badge:'AI', badgeColor:'#4f46e5', sub:'Prediksi' },
                    { label:'Workflow Otomasi', url:'/erp/workflow-automation', icon:'⚡', color:'#f59e0b', color2:'#fbbf24', sub:'Automation' },
                    { label:'Auto Reminder', url:'/erp/auto-reminder', icon:'🔔', color:'#ef4444', color2:'#f87171', sub:'Reminder' },
                    { label:'Auto Sync', url:'/erp/auto-sync', icon:'🔄', color:'#10b981', color2:'#34d399', sub:'Sync Otomatis' },
                    { label:'Approval Workflow', url:'/erp/approval-workflow', icon:'✅', color:'#22c55e', color2:'#4ade80', sub:'Approval' },
                ]
            },
            {
                id: 'hrd',
                label: 'HRD & SDM',
                desc: 'Karyawan, absensi, payroll, dan manajemen pengguna',
                color: '#f97316',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>',
                modules: [
                    { label:'Karyawan', url:'/erp/employees', icon:'👤', color:'#f97316', color2:'#fb923c', sub:'Employees' },
                    { label:'Absensi', url:'/erp/attendance', icon:'🕐', color:'#0ea5e9', color2:'#38bdf8', sub:'Attendance' },
                    { label:'Payroll', url:'/erp/payroll', icon:'💰', color:'#22c55e', color2:'#4ade80', sub:'Gaji' },
                    { label:'Insentif', url:'/erp/incentive', icon:'🏅', color:'#f59e0b', color2:'#fbbf24', sub:'Incentive' },
                    { label:'Divisi', url:'/erp/division', icon:'🏬', color:'#6366f1', color2:'#818cf8', sub:'Division' },
                    { label:'Jadwal Kerja', url:'/erp/work-schedule', icon:'📅', color:'#8b5cf6', color2:'#a78bfa', sub:'Schedule' },
                    { label:'Roles & Hak Akses', url:'/erp/roles', icon:'🔒', color:'#ef4444', color2:'#f87171', sub:'Roles' },
                    { label:'Manajemen User', url:'/erp/users', icon:'👥', color:'#14b8a6', color2:'#2dd4bf', sub:'Users' },
                    { label:'Audit Log', url:'/erp/audit-log', icon:'📋', color:'#6366f1', color2:'#818cf8', sub:'Log' },
                    { label:'Login Activity', url:'/erp/login-activity', icon:'🔑', color:'#f59e0b', color2:'#fbbf24', sub:'Activity' },
                ]
            },
            {
                id: 'pos',
                label: 'Point of Sale (POS)',
                desc: 'Kasir, penjualan langsung, dan laporan POS',
                color: '#10b981',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
                modules: [
                    { label:'Dashboard POS', url:'/pos', icon:'🖥️', color:'#10b981', color2:'#34d399', sub:'Overview' },
                    { label:'Kasir', url:'/pos/kasir', icon:'💰', color:'#22c55e', color2:'#4ade80', sub:'Transaksi' },
                    { label:'Produk POS', url:'/pos/produk', icon:'📦', color:'#0ea5e9', color2:'#38bdf8', sub:'Products' },
                    { label:'Pelanggan POS', url:'/pos/pelanggan', icon:'👥', color:'#ec4899', color2:'#f472b6', sub:'Customers' },
                    { label:'Supplier POS', url:'/pos/supplier', icon:'🤝', color:'#f59e0b', color2:'#fbbf24', sub:'Supplier' },
                    { label:'Riwayat Penjualan POS', url:'/pos/penjualan', icon:'📋', color:'#6366f1', color2:'#818cf8', sub:'History' },
                    { label:'Pembelian POS', url:'/pos/pembelian', icon:'🛒', color:'#f97316', color2:'#fb923c', sub:'Purchase' },
                    { label:'Stok POS', url:'/pos/stok', icon:'📊', color:'#8b5cf6', color2:'#a78bfa', sub:'Stock' },
                    { label:'Laporan POS', url:'/pos/laporan', icon:'📈', color:'#ef4444', color2:'#f87171', sub:'Report' },
                ]
            },
            {
                id: 'system',
                label: 'Pengaturan Sistem',
                desc: 'Konfigurasi, integrasi, backup, dan pengaturan aplikasi',
                color: '#6b7280',
                icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
                modules: [
                    { label:'Integrasi', url:'/erp/integrasi', icon:'🔗', color:'#6366f1', color2:'#818cf8', sub:'Integrations' },
                    { label:'Profil Perusahaan', url:'/erp/company-profile', icon:'🏢', color:'#0ea5e9', color2:'#38bdf8', sub:'Company' },
                    { label:'Nomor Dokumen', url:'/erp/document-numbering', icon:'#️⃣', color:'#f59e0b', color2:'#fbbf24', sub:'Doc Number' },
                    { label:'Sinkronisasi', url:'/erp/sync', icon:'🔄', color:'#10b981', color2:'#34d399', sub:'Sync' },
                    { label:'Notifikasi', url:'/erp/notifications', icon:'🔔', color:'#ec4899', color2:'#f472b6', sub:'Notification' },
                    { label:'Webhook', url:'/erp/webhook', icon:'🪝', color:'#8b5cf6', color2:'#a78bfa', sub:'Webhook' },
                    { label:'Backup Data', url:'/erp/backup', icon:'💾', color:'#14b8a6', color2:'#2dd4bf', sub:'Backup' },
                    { label:'Mobile Sync', url:'/erp/mobile-sync', icon:'📱', color:'#f97316', color2:'#fb923c', sub:'Mobile' },
                    { label:'Payment Gateway', url:'/erp/payment-gateway', icon:'💳', color:'#6366f1', color2:'#818cf8', sub:'Payment GW' },
                    { label:'Install App', url:'/erp/install-app', icon:'📲', color:'#0ea5e9', color2:'#38bdf8', sub:'PWA Install' },
                    { label:'API Public', url:'/erp/api-public', icon:'⚙️', color:'#374151', color2:'#6b7280', sub:'API' },
                ]
            },
        ],

        filteredCategories: [],
        noResult: false,

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
            let anyVisible = false;

            this.filteredCategories = this.filteredCategories.map(cat => {
                if (!q) {
                    cat.modules.forEach(m => m.visible = true);
                    cat.visible = true;
                    cat.visibleCount = cat.modules.length;
                    return cat;
                }
                let count = 0;
                cat.modules.forEach(m => {
                    const match = m.label.toLowerCase().includes(q) ||
                                  (m.sub || '').toLowerCase().includes(q) ||
                                  cat.label.toLowerCase().includes(q) ||
                                  cat.desc.toLowerCase().includes(q);
                    m.visible = match;
                    if (match) count++;
                });
                cat.visible = count > 0;
                cat.visibleCount = count;
                if (count > 0) anyVisible = true;
                return cat;
            });

            if (q && !anyVisible) {
                this.noResult = true;
            } else {
                this.noResult = false;
            }
        }
    };
}
</script>

@endsection
