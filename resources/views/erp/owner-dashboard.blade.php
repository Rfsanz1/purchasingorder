@extends('layouts.erp')
@section('title', 'Dashboard Utama')
@section('content')
<div x-data="ownerDash()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">

    {{-- Header --}}
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard Utama</h1>
            <p class="text-gray-500 mt-0.5 text-sm">Sumber data: <span class="font-medium text-blue-600">Kledo ERP</span> — live realtime</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
            <select x-model="period" @change="load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
                <option value="today">Hari Ini</option>
                <option value="week">7 Hari Terakhir</option>
                <option value="month" selected>Bulan Ini</option>
                <option value="year">Tahun Ini</option>
            </select>
            <button @click="syncNow()" :disabled="syncing"
                class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-60 transition">
                <svg :class="syncing?'animate-spin':''" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                <span x-text="syncing?'Sync...':'Sync Kledo'"></span>
            </button>
            <button @click="load()" :disabled="loading"
                class="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 transition">
                <svg :class="loading?'animate-spin':''" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Refresh
            </button>
        </div>
    </div>

    {{-- Status bar --}}
    <div class="mb-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span class="flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" :class="sumber==='kledo_api'?'bg-green-400 animate-pulse':sumber==='cache_db'?'bg-blue-400':'bg-gray-300'"></span>
            <span x-text="sumber==='kledo_api'?'Langsung dari Kledo API':sumber==='cache_db'?'Dari cache DB (sync terakhir)':'Menghubungkan...'"></span>
        </span>
        <span x-show="lastSync">|</span>
        <span x-show="lastSync" x-text="'Terakhir sync: '+lastSyncLabel"></span>
        <span class="ml-auto text-gray-400" x-text="'Auto-refresh dalam '+countdown+'s'"></span>
    </div>

    {{-- Banner: Token Kledo belum dikonfigurasi --}}
    <div x-show="tokenMissing" class="mb-5 p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <div class="flex-1">
            <p class="font-semibold text-amber-800 text-sm">Token Kledo Belum Dikonfigurasi</p>
            <p class="text-amber-700 text-xs mt-0.5">Data tidak akan muncul sampai KLEDO_TOKEN diset. Pergi ke halaman Integrasi untuk memasukkan token API Kledo Anda.</p>
        </div>
        <a href="/erp/integrasi" class="flex-shrink-0 px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700">
            Konfigurasi →
        </a>
    </div>

    {{-- Alert error --}}
    <div x-show="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2">
        <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        <span x-text="errorMsg"></span>
    </div>

    {{-- Akses Cepat (di atas sebelum KPI) --}}
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5">
        <h3 class="font-semibold text-gray-900 text-sm mb-3">⚡ Akses Cepat</h3>
        <div class="grid grid-cols-3 sm:grid-cols-6 gap-3">
            @foreach([
                ['/po-form','Buat Order','bg-blue-50 text-blue-600','M12 4v16m8-8H4'],
                ['/erp/purchase-order','Purchase Order','bg-purple-50 text-purple-600','M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'],
                ['/erp/supplier','Supplier','bg-green-50 text-green-600','M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'],
                ['/erp/account-receivable','Piutang','bg-orange-50 text-orange-600','M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'],
                ['/erp/cash-flow','Arus Kas','bg-teal-50 text-teal-600','M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z'],
                ['/erp/report-purchase','Laporan','bg-gray-50 text-gray-600','M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'],
            ] as [$href,$label,$cls,$icon])
            <a href="{{ $href }}" class="flex flex-col items-center gap-2 p-3 rounded-xl {{ $cls }} hover:opacity-80 transition">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $icon }}"/></svg>
                <span class="text-xs font-medium text-center">{{ $label }}</span>
            </a>
            @endforeach
        </div>
    </div>

    {{-- KPI Row --}}
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {{-- Omzet --}}
        <div class="bg-white rounded-xl border p-4 shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Omzet</p>
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
            <template x-if="loading && kpi.omzet===0">
                <div class="h-7 bg-gray-100 rounded animate-pulse mb-2"></div>
            </template>
            <p class="text-xl font-bold text-gray-900" x-show="!loading||kpi.omzet>0" x-text="rp(kpi.omzet)"></p>
            <p class="text-xs mt-1" :class="kpi.omzet_growth>=0?'text-green-600':'text-red-500'"
               x-text="(kpi.omzet_growth>=0?'+':'')+kpi.omzet_growth+'% vs periode lalu'"></p>
        </div>
        {{-- Invoice --}}
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Invoice</p>
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                </div>
            </div>
            <template x-if="loading && kpi.total_invoice===0">
                <div class="h-7 bg-gray-100 rounded animate-pulse mb-2"></div>
            </template>
            <p class="text-xl font-bold text-gray-900" x-show="!loading||kpi.total_invoice>0" x-text="kpi.total_invoice+' invoice'"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="'AOV '+rp(kpi.aov)"></p>
        </div>
        {{-- Piutang --}}
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Piutang Belum Lunas</p>
                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
            </div>
            <template x-if="loading && kpi.piutang===0">
                <div class="h-7 bg-gray-100 rounded animate-pulse mb-2"></div>
            </template>
            <p class="text-xl font-bold text-orange-500" x-show="!loading||kpi.piutang>=0" x-text="rp(kpi.piutang)"></p>
            <p class="text-xs text-gray-400 mt-1">Unpaid / Partial</p>
        </div>
        {{-- Pengeluaran (dari expense lokal) --}}
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
                <p class="text-xs text-gray-500 font-medium">Total Pengeluaran</p>
                <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"/></svg>
                </div>
            </div>
            <template x-if="loading && kpi.expense===0">
                <div class="h-7 bg-gray-100 rounded animate-pulse mb-2"></div>
            </template>
            <p class="text-xl font-bold text-red-500" x-show="!loading||kpi.expense>=0" x-text="rp(kpi.expense)"></p>
            <p class="text-xs text-gray-400 mt-1" x-text="kpi.expense_count+' transaksi'"></p>
        </div>
    </div>

    {{-- Row 3: Top Sales + Recent Invoices + Grafik --}}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">

        {{-- Top Sales --}}
        <div class="bg-white rounded-xl border shadow-sm">
            <div class="p-4 border-b flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 text-sm">🏆 Top Sales</h3>
                <span class="text-xs text-gray-400" x-text="periodeLabel"></span>
            </div>
            <div class="p-4 space-y-3">
                <template x-if="topSales.length===0">
                    <div class="text-center py-6">
                        <p class="text-gray-400 text-sm mb-2">Belum ada data</p>
                        <button @click="syncNow()" class="text-xs text-blue-600 underline">Sync dari Kledo</button>
                    </div>
                </template>
                <template x-for="(s,i) in topSales" :key="i">
                    <div class="flex items-center gap-3">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                             :class="i===0?'bg-yellow-100 text-yellow-700':i===1?'bg-gray-100 text-gray-600':'bg-blue-50 text-blue-600'"
                             x-text="i+1"></div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate" x-text="s.sales"></p>
                            <div class="mt-1 h-1.5 bg-gray-100 rounded-full">
                                <div class="h-1.5 bg-blue-500 rounded-full"
                                     :style="'width:'+Math.min(100,(s.total/(topSales[0]?.total||1)*100))+'%'"></div>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-semibold text-gray-900" x-text="rp(s.total)"></p>
                            <p class="text-xs text-gray-400" x-text="s.order_count+' inv'"></p>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        {{-- Recent Invoices --}}
        <div class="bg-white rounded-xl border shadow-sm lg:col-span-2">
            <div class="p-4 border-b flex items-center justify-between">
                <h3 class="font-semibold text-gray-900 text-sm">📋 Invoice Terbaru (Kledo)</h3>
                <a href="/erp/account-receivable" class="text-xs text-blue-600 hover:underline">Lihat semua →</a>
            </div>
            <div class="overflow-x-auto">
                <template x-if="recentOrders.length===0">
                    <div class="text-center py-8">
                        <p class="text-gray-400 text-sm mb-2">Belum ada invoice dari Kledo</p>
                        <button @click="syncNow()" class="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ↻ Sync Sekarang
                        </button>
                    </div>
                </template>
                <table x-show="recentOrders.length>0" class="w-full text-sm">
                    <thead>
                        <tr class="text-xs text-gray-500 border-b">
                            <th class="px-4 py-2 text-left font-medium">No Invoice</th>
                            <th class="px-4 py-2 text-left font-medium">Customer</th>
                            <th class="px-4 py-2 text-left font-medium">Sales</th>
                            <th class="px-4 py-2 text-left font-medium">Tanggal</th>
                            <th class="px-4 py-2 text-right font-medium">Total</th>
                            <th class="px-4 py-2 text-center font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <template x-for="o in recentOrders" :key="o.id||o.ref">
                            <tr class="hover:bg-gray-50 transition">
                                <td class="px-4 py-2.5 font-mono text-xs text-blue-600" x-text="o.ref||o.ref_number||('#'+o.id)"></td>
                                <td class="px-4 py-2.5 font-medium text-gray-900 truncate max-w-[150px]" x-text="o.customer||o.contact_name||'-'"></td>
                                <td class="px-4 py-2.5 text-gray-500 text-xs" x-text="o.sales||'-'"></td>
                                <td class="px-4 py-2.5 text-gray-500 text-xs" x-text="o.tanggal||o.trans_date||''"></td>
                                <td class="px-4 py-2.5 text-right font-semibold text-gray-900" x-text="rp(o.total||0)"></td>
                                <td class="px-4 py-2.5 text-center">
                                    <span :class="statusClass(o.status)" class="text-xs px-2 py-0.5 rounded-full" x-text="statusLabel(o.status)"></span>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

</div>

<script>
function ownerDash() {
    return {
        period: 'month',
        loading: false,
        syncing: false,
        sumber: '',
        lastSync: null,
        errorMsg: '',
        tokenMissing: false,
        countdown: 60,
        _timer: null,
        _countdownTimer: null,

        kpi: { omzet:0, omzet_growth:0, total_invoice:0, aov:0, piutang:0, expense:0, expense_count:0 },
        topSales: [],
        recentOrders: [],

        get periodeLabel() {
            return { today:'Hari Ini', week:'7 Hari', month:'Bulan Ini', year:'Tahun Ini' }[this.period] || '';
        },
        get lastSyncLabel() {
            if (!this.lastSync) return '';
            try {
                const d = new Date(this.lastSync);
                return d.toLocaleDateString('id-ID',{day:'2-digit',month:'short'}) + ' ' +
                       d.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'});
            } catch { return this.lastSync; }
        },

        init() {
            // Non-blocking: halaman langsung tampil, data load di background
            setTimeout(() => this.load(), 0);
            this.startAutoRefresh();
        },

        startAutoRefresh() {
            // Countdown visual
            this._countdownTimer = setInterval(() => {
                this.countdown--;
                if (this.countdown <= 0) {
                    this.countdown = 60;
                    this.load();
                }
            }, 1000);
        },

        async load() {
            this.loading = true;
            this.errorMsg = '';
            try {
                const [dash, exp] = await Promise.all([
                    fetch(`/api/kledo/dashboard?period=${this.period}`).then(r=>r.json()),
                    fetch(`/api/erp/expenses?per_page=200`).then(r=>r.json()).catch(()=>({data:[]})),
                ]);

                // KPI dari Kledo
                this.tokenMissing = dash.token_missing || false;
                this.sumber       = dash.sumber || '';
                this.lastSync     = dash.last_sync || null;
                this.kpi.omzet        = dash.omzet || 0;
                this.kpi.omzet_growth = dash.omzet_growth || 0;
                this.kpi.total_invoice= dash.total_invoice || 0;
                this.kpi.aov          = dash.aov || 0;
                this.kpi.piutang      = dash.piutang || 0;

                // Pengeluaran dari local (jika ada)
                const expData = exp.data || exp || [];
                this.kpi.expense       = Array.isArray(expData) ? expData.reduce((s,e)=>s+(+e.jumlah||0),0) : 0;
                this.kpi.expense_count = Array.isArray(expData) ? expData.length : 0;

                // Top sales & recent dari Kledo
                this.topSales    = (dash.top_sales || []).slice(0,5);
                this.recentOrders = (dash.recent || []).slice(0,10);

                this.countdown = 60;
            } catch(e) {
                this.errorMsg = 'Gagal memuat data: ' + e.message;
            } finally {
                this.loading = false;
            }
        },

        async syncNow() {
            this.syncing = true;
            this.errorMsg = '';
            try {
                const r = await fetch('/api/kledo/sync-now', {
                    method: 'POST',
                    headers: { 'Content-Type':'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' },
                    body: JSON.stringify({ period: this.period }),
                });
                const data = await r.json();
                if (data.error) { this.errorMsg = data.error; return; }

                // Update langsung dari hasil sync
                this.sumber       = data.sumber || '';
                this.lastSync     = data.last_sync || new Date().toISOString();
                this.kpi.omzet        = data.omzet || 0;
                this.kpi.omzet_growth = data.omzet_growth || 0;
                this.kpi.total_invoice= data.total_invoice || 0;
                this.kpi.aov          = data.aov || 0;
                this.kpi.piutang      = data.piutang || 0;
                this.topSales     = (data.top_sales || []).slice(0,5);
                this.recentOrders = (data.recent || []).slice(0,10);
                this.countdown = 60;
            } catch(e) {
                this.errorMsg = 'Sync gagal: ' + e.message;
            } finally {
                this.syncing = false;
            }
        },

        rp(n) { return 'Rp ' + Number(n||0).toLocaleString('id-ID'); },

        statusClass(s) {
            const m = {
                paid:'bg-green-100 text-green-700', settled:'bg-green-100 text-green-700',
                unpaid:'bg-red-100 text-red-600', overdue:'bg-red-100 text-red-700',
                partial:'bg-yellow-100 text-yellow-700', draft:'bg-gray-100 text-gray-600',
                '3':'bg-green-100 text-green-700','1':'bg-red-100 text-red-600','2':'bg-yellow-100 text-yellow-700',
            };
            return m[String(s).toLowerCase()] || 'bg-gray-100 text-gray-600';
        },
        statusLabel(s) {
            const m = { paid:'Lunas', settled:'Lunas', unpaid:'Belum Lunas', overdue:'Jatuh Tempo',
                        partial:'Sebagian', draft:'Draft', '3':'Lunas','1':'Belum Lunas','2':'Sebagian' };
            return m[String(s).toLowerCase()] || s || '-';
        },
    };
}
</script>
@endsection
