@extends('layouts.erp')
@section('title', 'Dashboard Owner')
@section('content')
<div x-data="ownerDash()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h1 class="text-2xl font-bold text-gray-900">Dashboard Owner</h1><p class="text-gray-500 mt-1 text-sm">Ringkasan eksekutif bisnis Gentong Mas</p></div>
        <div class="flex gap-2">
            <select x-model="period" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                <option value="today">Hari Ini</option>
                <option value="week">7 Hari Terakhir</option>
                <option value="month" selected>Bulan Ini</option>
                <option value="year">Tahun Ini</option>
            </select>
            <button @click="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">↻ Refresh</button>
        </div>
    </div>

    {{-- KPI Row --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Omzet</p>
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="rp(kpi.omzet)"></p>
            <p class="text-xs mt-1" :class="kpi.omzet_growth>=0?'text-green-600':'text-red-500'" x-text="(kpi.omzet_growth>=0?'+':'')+kpi.omzet_growth+'% vs periode lalu'"></p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Gross Profit</p>
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg></div>
            </div>
            <p class="text-xl font-bold text-green-600" x-text="rp(kpi.profit)"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="'Margin '+kpi.margin+'%'"></p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Pesanan</p>
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
            </div>
            <p class="text-xl font-bold text-gray-900" x-text="kpi.total_order"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="'AOV ' + rp(kpi.aov)"></p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Pengeluaran</p>
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg></div>
            </div>
            <p class="text-xl font-bold text-red-500" x-text="rp(kpi.expense)"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="kpi.expense_count+' transaksi'"></p>
        </div>
    </div>

    {{-- Row 2: Piutang, Hutang, Karyawan, Produk --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <p class="text-xs text-gray-500">Piutang Belum Lunas</p>
            <p class="text-lg font-bold text-orange-500 mt-1" x-text="rp(kpi.piutang)"></p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <p class="text-xs text-gray-500">Hutang ke Supplier</p>
            <p class="text-lg font-bold text-red-500 mt-1" x-text="rp(kpi.hutang)"></p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <p class="text-xs text-gray-500">Total Karyawan</p>
            <p class="text-lg font-bold text-blue-600 mt-1" x-text="kpi.total_karyawan+' orang'"></p>
        </div>
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <p class="text-xs text-gray-500">Total Produk Aktif</p>
            <p class="text-lg font-bold text-gray-900 mt-1" x-text="kpi.total_produk+' SKU'"></p>
        </div>
    </div>

    {{-- Row 3: Top Sales + Recent Orders + Alerts --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {{-- Top Sales --}}
        <div class="bg-white rounded-xl border shadow-sm">
            <div class="p-4 border-b"><h3 class="font-semibold text-gray-900 text-sm">Top Sales Bulan Ini</h3></div>
            <div class="p-4 space-y-3">
                <template x-if="topSales.length === 0"><p class="text-gray-400 text-sm text-center py-4">Belum ada data</p></template>
                <template x-for="(s, i) in topSales" :key="i">
                    <div class="flex items-center gap-3">
                        <div class="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold" x-text="i+1"></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate" x-text="s.sales||s.nama||'Sales '+i"></p>
                            <p class="text-xs text-gray-400" x-text="rp(s.total||0)"></p>
                        </div>
                        <div class="text-xs font-semibold text-green-600" x-text="s.order_count+' order'"></div>
                    </div>
                </template>
            </div>
        </div>

        {{-- Recent Orders --}}
        <div class="bg-white rounded-xl border shadow-sm">
            <div class="p-4 border-b flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 text-sm">Pesanan Terbaru</h3>
                <a href="/sales-dashboard" class="text-xs text-blue-600 hover:underline">Lihat semua</a>
            </div>
            <div class="divide-y divide-gray-50">
                <template x-if="recentOrders.length === 0"><p class="text-gray-400 text-sm text-center py-8">Belum ada pesanan</p></template>
                <template x-for="o in recentOrders.slice(0,5)" :key="o.id">
                    <div class="px-4 py-3 flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-900" x-text="o.nama_toko||o.customer||'Order #'+o.id"></p>
                            <p class="text-xs text-gray-400" x-text="o.nama_sales||''"></p>
                        </div>
                        <div class="text-right">
                            <p class="text-sm font-semibold text-gray-900" x-text="rp(o.total_harga||0)"></p>
                            <span :class="statusClass(o.status_pesanan||o.status)" class="text-xs px-1.5 py-0.5 rounded" x-text="o.status_pesanan||o.status||'—'"></span>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        {{-- Alerts --}}
        <div class="bg-white rounded-xl border shadow-sm">
            <div class="p-4 border-b"><h3 class="font-semibold text-gray-900 text-sm">Alert & Notifikasi</h3></div>
            <div class="p-4 space-y-3">
                <template x-if="alerts.length === 0"><p class="text-gray-400 text-sm text-center py-4">Tidak ada alert aktif</p></template>
                <template x-for="a in alerts" :key="a.id">
                    <div :class="a.level==='high'?'bg-red-50 border-red-200':'a.level===medium?bg-yellow-50 border-yellow-200':'bg-blue-50 border-blue-200'"
                         class="flex items-start gap-3 p-3 rounded-lg border">
                        <div :class="a.level==='high'?'text-red-500':'a.level===medium?text-yellow-500':'text-blue-500'" class="mt-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div>
                            <p class="text-xs font-semibold text-gray-900" x-text="a.title"></p>
                            <p class="text-xs text-gray-500 mt-0.5" x-text="a.message"></p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    {{-- Quick Links --}}
    <div class="bg-white rounded-xl border shadow-sm p-5">
        <h3 class="font-semibold text-gray-900 text-sm mb-4">Akses Cepat</h3>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
            @foreach([
                ['/po-form','Buat Order','bg-blue-50 text-blue-600'],
                ['/erp/purchase-order','Purchase Order','bg-purple-50 text-purple-600'],
                ['/erp/supplier','Supplier','bg-green-50 text-green-600'],
                ['/erp/expense','Pengeluaran','bg-red-50 text-red-600'],
                ['/erp/employees','Karyawan','bg-yellow-50 text-yellow-600'],
                ['/erp/report-finance','Laporan','bg-gray-50 text-gray-600'],
            ] as [$href,$label,$cls])
            <a href="{{ $href }}" class="flex flex-col items-center gap-2 p-3 rounded-xl {{ $cls }} hover:opacity-80 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <span class="text-xs font-medium text-center">{{ $label }}</span>
            </a>
            @endforeach
        </div>
    </div>
</div>

<script>
function ownerDash() { return {
    period: 'month', kpi: {omzet:0,omzet_growth:0,profit:0,margin:0,total_order:0,aov:0,expense:0,expense_count:0,piutang:0,hutang:0,total_karyawan:0,total_produk:0},
    topSales: [], recentOrders: [], alerts: [],

    async init() { await this.load(); },

    async load() {
        try {
            const [a, b, c] = await Promise.all([
                fetch(`/api/erp/analytics/summary?period=${this.period}`).then(r=>r.json()).catch(()=>({})),
                fetch(`/api/orders?per_page=5&sort=desc`).then(r=>r.json()).catch(()=>({})),
                fetch(`/api/erp/analytics/summary?period=${this.period}`).then(r=>r.json()).catch(()=>({top_sales:[]})),
            ]);
            const s = a.summary || a || {};
            this.kpi = {
                omzet: s.total_revenue || s.omzet || 0,
                omzet_growth: s.revenue_growth || s.omzet_growth || 0,
                profit: s.gross_profit || s.profit || 0,
                margin: s.margin || 0,
                total_order: s.total_orders || s.total_order || 0,
                aov: s.avg_order_value || s.aov || 0,
                expense: s.total_expense || s.expense || 0,
                expense_count: s.expense_count || 0,
                piutang: s.piutang || 0,
                hutang: s.hutang || 0,
                total_karyawan: s.total_karyawan || s.employees || 0,
                total_produk: s.total_produk || s.products || 0,
            };
            this.topSales = (a.top_sales || c.top_sales || []).slice(0, 5);
            this.recentOrders = Array.isArray(b) ? b.slice(0,5) : (b.data||[]).slice(0,5);
            this.alerts = [
                ...(s.stok_rendah > 0 ? [{id:1,level:'high',title:'Stok Menipis',message:`${s.stok_rendah} produk perlu restock`}] : []),
                ...(s.piutang_jatuh_tempo > 0 ? [{id:2,level:'medium',title:'Piutang Jatuh Tempo',message:`${s.piutang_jatuh_tempo} invoice perlu ditagih`}] : []),
                ...(s.po_pending > 0 ? [{id:3,level:'low',title:'PO Menunggu Approval',message:`${s.po_pending} purchase order pending`}] : []),
            ];
        } catch {}
    },

    rp(n) { return 'Rp '+Number(n||0).toLocaleString('id-ID'); },
    statusClass(s) {
        const m = {'Selesai':'bg-green-100 text-green-700','Menunggu':'bg-yellow-100 text-yellow-700','Diproses':'bg-blue-100 text-blue-700','Dibatalkan':'bg-red-100 text-red-700'};
        return m[s] || 'bg-gray-100 text-gray-600';
    }
};}
</script>
@endsection
