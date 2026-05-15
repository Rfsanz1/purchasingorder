@extends('layouts.erp')
@section('title', ($app['title'] ?? 'Modul') . ' — ERP')
@section('content')
<?php $app = $app ?? []; $menus = $app['menus'] ?? []; $appColor = $app['color'] ?? '#4f46e5'; ?>

<div x-data="odooApp(@js($app))" x-init="init()" class="min-h-screen" style="background:#f5f5f9">

    {{-- ══ TOP NAV (sub-menus) ══ --}}
    <div class="bg-white border-b sticky top-0 z-20 shadow-sm">
        <div class="max-w-screen-2xl mx-auto px-4">
            {{-- Breadcrumb --}}
            <div class="flex items-center gap-2 py-2 text-xs text-gray-400 border-b border-gray-100">
                <a href="/portal" class="hover:text-purple-600 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                    Portal Home
                </a>
                <span>›</span>
                <span class="font-medium" style="color:{{ $appColor }}">{{ $app['title'] ?? 'Modul' }}</span>
                <span>›</span>
                <span x-text="menus[currentMenuIdx]?.label" class="text-gray-600"></span>
            </div>
            {{-- Sub-menu tabs --}}
            <div class="flex gap-0 overflow-x-auto scrollbar-hide">
                <template x-for="(menu, i) in menus" :key="i">
                    <button @click="switchMenu(i)"
                        class="px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all duration-150 flex items-center gap-1.5"
                        :class="currentMenuIdx === i
                            ? 'border-purple-600 text-purple-700 bg-purple-50/60'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'">
                        <span x-text="menu.icon || ''"></span>
                        <span x-text="menu.label"></span>
                    </button>
                </template>
            </div>
        </div>
    </div>

    <div class="max-w-screen-2xl mx-auto px-4 py-5">

        {{-- ══ STATS ROW ══ --}}
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5" x-show="computedStats.length > 0">
            <template x-for="s in computedStats" :key="s.label">
                <div class="bg-white rounded-xl p-4 border shadow-sm flex items-center gap-3">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm shrink-0"
                         :style="`background:${s.color||'#4f46e5'}`" x-html="s.icon||'📊'"></div>
                    <div>
                        <p class="text-xs text-gray-400 leading-tight" x-text="s.label"></p>
                        <p class="font-bold text-gray-800 text-base leading-tight" x-text="s.value"></p>
                    </div>
                </div>
            </template>
        </div>

        {{-- ══ TOOLBAR ══ --}}
        <div class="bg-white rounded-xl border shadow-sm p-3 mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <div class="flex-1 flex gap-2">
                <div class="relative flex-1 max-w-xs">
                    <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
                    <input x-model="search" @input.debounce.250ms="page=1;applyFilter()" type="text"
                           :placeholder="'Cari ' + (menus[currentMenuIdx]?.label || 'data') + '...'"
                           class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none">
                </div>
                <template x-if="menus[currentMenuIdx]?.filterOptions?.length">
                    <select x-model="filterVal" @change="page=1;applyFilter()"
                            class="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-purple-400 focus:outline-none">
                        <option value="">Semua Status</option>
                        <template x-for="opt in menus[currentMenuIdx].filterOptions" :key="opt">
                            <option :value="opt" x-text="opt"></option>
                        </template>
                    </select>
                </template>
                <button @click="search='';filterVal='';page=1;applyFilter()" class="border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">↺ Reset</button>
            </div>
            <div class="flex items-center gap-2">
                {{-- View toggle --}}
                <div class="flex rounded-lg border border-gray-200 overflow-hidden" x-show="menus[currentMenuIdx]?.hasKanban">
                    <button @click="view='list'" :class="view==='list'?'bg-purple-600 text-white':'text-gray-500 hover:bg-gray-50'"
                            class="px-3 py-2 text-xs font-medium transition-colors">
                        ☰ List
                    </button>
                    <button @click="view='kanban'" :class="view==='kanban'?'bg-purple-600 text-white':'text-gray-500 hover:bg-gray-50'"
                            class="px-3 py-2 text-xs font-medium transition-colors">
                        ⊞ Kanban
                    </button>
                </div>
                <button @click="openAdd()"
                        class="text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                        style="background:#714fff"
                        :style="{background:'{{ $appColor }}'}">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    <span x-text="menus[currentMenuIdx]?.addLabel || 'Tambah'"></span>
                </button>
            </div>
        </div>

        {{-- ══ LIST VIEW ══ --}}
        <div x-show="view === 'list'" class="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-sm">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase w-8">#</th>
                            <template x-for="(f, fi) in (menus[currentMenuIdx]?.tableFields || [])" :key="fi">
                                <th class="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase cursor-pointer hover:bg-gray-100"
                                    @click="sortBy(f.name)"
                                    :class="fi > 2 ? 'hidden lg:table-cell' : (fi > 1 ? 'hidden md:table-cell' : '')">
                                    <span x-text="f.label"></span>
                                    <span x-show="sortField===f.name" x-text="sortDir==='asc'?'↑':'↓'" class="ml-1 text-purple-500"></span>
                                </th>
                            </template>
                            <th class="px-4 py-3 text-right text-xs font-bold text-gray-400 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <template x-if="loading">
                            <tr><td :colspan="(menus[currentMenuIdx]?.tableFields?.length||0)+2" class="py-16 text-center text-gray-300 text-sm">Memuat...</td></tr>
                        </template>
                        <template x-if="!loading && items.length === 0">
                            <tr><td :colspan="(menus[currentMenuIdx]?.tableFields?.length||0)+2" class="py-16 text-center">
                                <div class="flex flex-col items-center gap-3">
                                    <div class="text-5xl opacity-20">📋</div>
                                    <p class="text-gray-400 text-sm" x-text="'Belum ada data ' + (menus[currentMenuIdx]?.label||'')"></p>
                                    <button @click="openAdd()" class="text-white px-5 py-2 rounded-lg text-xs font-semibold" style="background:#714fff">+ Tambah Sekarang</button>
                                </div>
                            </td></tr>
                        </template>
                        <template x-for="(item, rowIdx) in items" :key="item._id">
                            <tr class="hover:bg-purple-50/30 cursor-pointer transition-colors" @click="openDetail(item)">
                                <td class="px-4 py-3 text-xs text-gray-300" x-text="((page-1)*perPage)+rowIdx+1"></td>
                                <template x-for="(f, fi) in (menus[currentMenuIdx]?.tableFields || [])" :key="fi">
                                    <td class="px-4 py-3"
                                        :class="fi > 2 ? 'hidden lg:table-cell' : (fi > 1 ? 'hidden md:table-cell' : '')">
                                        <template x-if="f.badge">
                                            <span :class="badgeClass(item[f.name])"
                                                  class="px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap"
                                                  x-text="item[f.name] || '-'"></span>
                                        </template>
                                        <template x-if="!f.badge && fi === 0">
                                            <div>
                                                <div class="font-semibold text-gray-800 text-sm" x-text="item[f.name] || '-'"></div>
                                                <div class="text-xs text-gray-400 mt-0.5" x-text="item[menus[currentMenuIdx]?.tableFields[1]?.name] || ''" x-show="menus[currentMenuIdx]?.tableFields[1]"></div>
                                            </div>
                                        </template>
                                        <template x-if="!f.badge && fi > 0">
                                            <span class="text-gray-600 text-xs" x-text="cellVal(item, f)"></span>
                                        </template>
                                    </td>
                                </template>
                                <td class="px-4 py-3 text-right" @click.stop>
                                    <div class="flex items-center justify-end gap-2">
                                        <button @click="editItem(item)" class="text-xs text-blue-600 hover:text-blue-800 hover:underline font-medium">Edit</button>
                                        <button @click="delItem(item)" class="text-xs text-red-500 hover:text-red-700 hover:underline font-medium">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>
            {{-- Pagination --}}
            <div class="px-4 py-3 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-400">
                <span>Menampilkan <span class="font-semibold text-gray-600" x-text="items.length"></span> dari <span class="font-semibold text-gray-600" x-text="total"></span> data</span>
                <div class="flex gap-1">
                    <button @click="page=Math.max(1,page-1);applyFilter()" :disabled="page<=1"
                            class="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-white">← Prev</button>
                    <span class="px-3 py-1.5 font-medium text-gray-600" x-text="'Hal '+page+' / '+Math.max(1,Math.ceil(total/perPage))"></span>
                    <button @click="page++;applyFilter()" :disabled="page*perPage>=total"
                            class="px-3 py-1.5 border rounded-lg disabled:opacity-40 hover:bg-white">Next →</button>
                </div>
            </div>
        </div>

        {{-- ══ KANBAN VIEW ══ --}}
        <div x-show="view === 'kanban'" class="overflow-x-auto pb-4">
            <div class="flex gap-4 min-w-max">
                <template x-for="stage in kanbanStages" :key="stage">
                    <div class="w-72 shrink-0">
                        <div class="flex items-center justify-between mb-2 px-1">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider" x-text="stage"></span>
                            <span class="text-xs bg-gray-100 text-gray-500 rounded-full px-2 py-0.5"
                                  x-text="kanbanItems(stage).length"></span>
                        </div>
                        <div class="space-y-2">
                            <template x-for="item in kanbanItems(stage)" :key="item._id">
                                <div class="bg-white rounded-xl border p-3 shadow-sm hover:shadow-md cursor-pointer transition-shadow"
                                     @click="openDetail(item)">
                                    <div class="font-semibold text-gray-800 text-sm mb-1" x-text="item[menus[currentMenuIdx]?.tableFields[0]?.name] || 'Item'"></div>
                                    <div class="text-xs text-gray-400" x-text="item[menus[currentMenuIdx]?.tableFields[1]?.name] || ''"></div>
                                    <template x-if="menus[currentMenuIdx]?.tableFields[2]">
                                        <div class="text-xs text-purple-600 font-medium mt-1" x-text="cellVal(item, menus[currentMenuIdx].tableFields[2])"></div>
                                    </template>
                                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                                        <span :class="badgeClass(item[menus[currentMenuIdx]?.filterField||'status'])"
                                              class="px-2 py-0.5 text-xs font-semibold rounded-full"
                                              x-text="item[menus[currentMenuIdx]?.filterField||'status'] || stage"></span>
                                        <div class="flex gap-1">
                                            <button @click.stop="editItem(item)" class="text-xs text-blue-500 hover:underline">Edit</button>
                                            <button @click.stop="delItem(item)" class="text-xs text-red-400 hover:underline">Hapus</button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <button @click="openAddInStage(stage)"
                                    class="w-full py-2 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-purple-300 hover:text-purple-500 transition-colors">
                                + Tambah di sini
                            </button>
                        </div>
                    </div>
                </template>
            </div>
        </div>

    </div>

    {{-- ══ DETAIL DRAWER (slide-in from right) ══ --}}
    <div x-show="showDetail" x-cloak class="fixed inset-0 z-40" @click.self="showDetail=false">
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto"
             x-transition:enter="transition ease-out duration-200" x-transition:enter-start="translate-x-full"
             x-transition:enter-end="translate-x-0" x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="translate-x-0" x-transition:leave-end="translate-x-full"
             @click.stop>
            <div class="p-5">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="font-bold text-gray-800 text-base" x-text="detailItem?.[menus[currentMenuIdx]?.tableFields?.[0]?.name] || 'Detail'"></h3>
                    <div class="flex gap-2">
                        <button @click="editItem(detailItem);showDetail=false"
                                class="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">Edit</button>
                        <button @click="showDetail=false" class="text-gray-400 hover:text-gray-600">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>
                </div>
                <div class="space-y-3">
                    <template x-for="f in (menus[currentMenuIdx]?.formFields || [])" :key="f.name">
                        <div class="flex flex-col gap-0.5">
                            <span class="text-xs text-gray-400 font-medium" x-text="f.label"></span>
                            <template x-if="f.badge">
                                <span :class="badgeClass(detailItem?.[f.name])"
                                      class="px-2 py-0.5 text-xs font-semibold rounded-full w-fit"
                                      x-text="detailItem?.[f.name] || '-'"></span>
                            </template>
                            <template x-if="!f.badge">
                                <span class="text-sm font-medium text-gray-700" x-text="detailItem?.[f.name] || '-'"></span>
                            </template>
                        </div>
                    </template>
                </div>
                <div class="mt-6 pt-4 border-t">
                    <p class="text-xs text-gray-300">ID: <span x-text="detailItem?._id"></span></p>
                    <p class="text-xs text-gray-300">Dibuat: <span x-text="detailItem?._created ? new Date(detailItem._created).toLocaleString('id-ID') : '-'"></span></p>
                </div>
            </div>
        </div>
    </div>

    {{-- ══ FORM MODAL ══ --}}
    <div x-show="showModal" x-cloak @click.self="showModal=false"
         class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto" @click.stop
             x-transition:enter="transition ease-out duration-200" x-transition:enter-start="scale-95 opacity-0"
             x-transition:enter-end="scale-100 opacity-100">
            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <div>
                        <h3 class="text-lg font-bold text-gray-900" x-text="editMode ? 'Edit ' + (menus[currentMenuIdx]?.label||'') : (menus[currentMenuIdx]?.addLabel || 'Tambah Data')"></h3>
                        <p class="text-xs text-gray-400 mt-0.5" x-text="menus[currentMenuIdx]?.label + ' — ' + '{{ $app['title'] ?? '' }}'"></p>
                    </div>
                    <button @click="showModal=false" class="text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 p-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <template x-for="f in (menus[currentMenuIdx]?.formFields || [])" :key="f.name">
                            <div :class="f.span === 2 || f.type === 'textarea' ? 'sm:col-span-2' : ''">
                                <label class="block text-sm font-medium text-gray-700 mb-1">
                                    <span x-text="f.label"></span>
                                    <span x-show="f.required" class="text-red-500 ml-0.5">*</span>
                                </label>
                                <template x-if="f.type === 'textarea'">
                                    <textarea x-model="form[f.name]" rows="3" :required="f.required"
                                              :placeholder="f.placeholder || ''"
                                              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"></textarea>
                                </template>
                                <template x-if="f.type === 'select'">
                                    <select x-model="form[f.name]" :required="f.required"
                                            class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                                        <option value="">— Pilih —</option>
                                        <template x-for="opt in (f.options || [])" :key="opt">
                                            <option :value="opt" x-text="opt"></option>
                                        </template>
                                    </select>
                                </template>
                                <template x-if="f.type === 'number'">
                                    <input x-model="form[f.name]" type="number" :step="f.step || 'any'"
                                           :required="f.required" :placeholder="f.placeholder || '0'"
                                           class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                                </template>
                                <template x-if="f.type === 'date'">
                                    <input x-model="form[f.name]" type="date" :required="f.required"
                                           class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                                </template>
                                <template x-if="f.type === 'email'">
                                    <input x-model="form[f.name]" type="email" :required="f.required"
                                           :placeholder="f.placeholder || ''"
                                           class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                                </template>
                                <template x-if="!['textarea','select','number','date','email'].includes(f.type)">
                                    <input x-model="form[f.name]" :type="f.type || 'text'" :required="f.required"
                                           :placeholder="f.placeholder || ''"
                                           class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none">
                                </template>
                            </div>
                        </template>
                    </div>
                    <div class="flex justify-end gap-3 pt-3 border-t">
                        <button type="button" @click="showModal=false"
                                class="px-5 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">Batal</button>
                        <button type="submit" :disabled="saving"
                                class="px-6 py-2 text-sm text-white rounded-lg font-semibold disabled:opacity-50 transition-opacity"
                                style="background:#714fff" :style="{background:'{{ $appColor }}'}">
                            <span x-show="saving">Menyimpan...</span>
                            <span x-show="!saving" x-text="editMode ? '💾 Update' : '✓ Simpan'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    {{-- Toast --}}
    <div x-show="toast.show" x-cloak x-transition
         :class="toast.type==='error' ? 'bg-red-600' : 'bg-green-600'"
         class="fixed bottom-6 right-6 z-[60] text-white px-5 py-3 rounded-xl shadow-xl text-sm font-medium flex items-center gap-2">
        <span x-text="toast.type==='error' ? '✗' : '✓'"></span>
        <span x-text="toast.msg"></span>
    </div>

</div>

<script>
function odooApp(app) {
    return {
        app,
        menus: app.menus || [],
        currentMenuIdx: 0,
        view: 'list',
        loading: false,
        allData: [],    // all records for current menu (from localStorage)
        items: [],      // current page slice
        total: 0,
        page: 1, perPage: 20,
        search: '', filterVal: '',
        sortField: '', sortDir: 'asc',
        showModal: false, editMode: false, form: {}, saving: false,
        showDetail: false, detailItem: null,
        toast: { show: false, msg: '', type: 'success' },

        // ── KEY ──────────────────────────────────────────────────────────
        storageKey() {
            return 'erp_v2_' + (this.menus[this.currentMenuIdx]?.module || 'default');
        },

        // ── INIT ─────────────────────────────────────────────────────────
        init() {
            this.switchMenu(0);
        },

        // ── SWITCH MENU ───────────────────────────────────────────────────
        switchMenu(idx) {
            this.currentMenuIdx = idx;
            this.search = ''; this.filterVal = ''; this.page = 1;
            this.sortField = ''; this.sortDir = 'asc';
            const m = this.menus[idx];
            if (m?.hasKanban) this.view = 'kanban'; else this.view = 'list';
            this.loadFromStorage();
        },

        // ── LOAD & PERSIST ────────────────────────────────────────────────
        loadFromStorage() {
            this.loading = true;
            const raw = localStorage.getItem(this.storageKey());
            if (raw) {
                try { this.allData = JSON.parse(raw); }
                catch { this.allData = []; }
            } else {
                this.allData = this.generateSamples();
                this.persist();
            }
            setTimeout(() => { this.applyFilter(); this.loading = false; }, 80);
        },

        persist() {
            localStorage.setItem(this.storageKey(), JSON.stringify(this.allData));
        },

        // ── FILTER / SORT / PAGE ─────────────────────────────────────────
        applyFilter() {
            const m = this.menus[this.currentMenuIdx];
            const ff = m?.tableFields || [];
            let data = [...this.allData];

            if (this.search) {
                const q = this.search.toLowerCase();
                data = data.filter(r => ff.some(f => String(r[f.name]||'').toLowerCase().includes(q)));
            }
            if (this.filterVal && m?.filterField) {
                data = data.filter(r => r[m.filterField] === this.filterVal);
            }
            if (this.sortField) {
                data.sort((a, b) => {
                    const va = a[this.sortField] || '', vb = b[this.sortField] || '';
                    return this.sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
                });
            }
            this.total = data.length;
            const start = (this.page - 1) * this.perPage;
            this.items = data.slice(start, start + this.perPage);
        },

        sortBy(field) {
            if (this.sortField === field) this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
            else { this.sortField = field; this.sortDir = 'asc'; }
            this.applyFilter();
        },

        // ── KANBAN ────────────────────────────────────────────────────────
        get kanbanStages() {
            const m = this.menus[this.currentMenuIdx];
            return m?.filterOptions || m?.kanbanStages || ['Baru','Proses','Selesai'];
        },
        kanbanItems(stage) {
            const m = this.menus[this.currentMenuIdx];
            const field = m?.filterField || 'status';
            return this.allData.filter(r => r[field] === stage);
        },

        // ── STATS ─────────────────────────────────────────────────────────
        get computedStats() {
            const m = this.menus[this.currentMenuIdx];
            if (!m?.stats) return [];
            return m.stats.map(s => {
                let value = '-';
                if (s.type === 'count') value = this.allData.length;
                else if (s.type === 'count_where') {
                    value = this.allData.filter(r => r[s.field] === s.value).length;
                } else if (s.type === 'sum') {
                    const total = this.allData.reduce((acc, r) => acc + Number(r[s.field]||0), 0);
                    value = s.format === 'currency' ? 'Rp '+total.toLocaleString('id-ID') : total;
                }
                return { ...s, value };
            });
        },

        // ── ADD / EDIT ────────────────────────────────────────────────────
        openAdd() {
            this.editMode = false;
            this.form = {};
            const m = this.menus[this.currentMenuIdx];
            (m?.formFields || []).forEach(f => {
                if (f.type === 'select') this.form[f.name] = f.options?.[0] || '';
                else if (f.type === 'date') this.form[f.name] = new Date().toISOString().split('T')[0];
                else if (f.type === 'number') this.form[f.name] = f.default ?? '';
                else this.form[f.name] = f.default ?? '';
            });
            this.showModal = true;
        },

        openAddInStage(stage) {
            this.openAdd();
            const m = this.menus[this.currentMenuIdx];
            if (m?.filterField) this.form[m.filterField] = stage;
        },

        editItem(item) {
            this.editMode = true;
            this.form = { ...item };
            this.showModal = true;
        },

        openDetail(item) {
            this.detailItem = item;
            this.showDetail = true;
        },

        // ── SAVE ──────────────────────────────────────────────────────────
        save() {
            this.saving = true;
            const m = this.menus[this.currentMenuIdx];
            // Basic required validation
            for (const f of (m?.formFields || [])) {
                if (f.required && !this.form[f.name]) {
                    this.showToast(f.label + ' wajib diisi', 'error');
                    this.saving = false;
                    return;
                }
            }
            if (this.editMode) {
                const idx = this.allData.findIndex(r => r._id === this.form._id);
                if (idx >= 0) this.allData[idx] = { ...this.allData[idx], ...this.form };
                this.showToast('Data berhasil diupdate', 'success');
            } else {
                const newItem = { _id: Date.now() + Math.random(), _created: new Date().toISOString(), ...this.form };
                this.allData.unshift(newItem);
                this.showToast('Data berhasil ditambahkan', 'success');
            }
            this.persist();
            this.applyFilter();
            this.saving = false;
            this.showModal = false;
        },

        // ── DELETE ────────────────────────────────────────────────────────
        delItem(item) {
            if (!confirm('Hapus data ini? Tindakan tidak bisa dibatalkan.')) return;
            this.allData = this.allData.filter(r => r._id !== item._id);
            this.persist();
            this.total = Math.max(0, this.total - 1);
            if (this.page > 1 && this.items.length <= 1) this.page--;
            this.applyFilter();
            if (this.showDetail && this.detailItem?._id === item._id) this.showDetail = false;
            this.showToast('Data dihapus', 'success');
        },

        // ── FORMAT ────────────────────────────────────────────────────────
        cellVal(item, f) {
            const v = item[f.name];
            if (v === null || v === undefined || v === '') return '-';
            if (f.format === 'currency') return 'Rp ' + Number(v||0).toLocaleString('id-ID');
            if (f.format === 'date') {
                try { return new Date(v).toLocaleDateString('id-ID', {day:'2-digit',month:'short',year:'numeric'}); }
                catch { return v; }
            }
            if (f.format === 'percent') return v + '%';
            if (f.format === 'number') return Number(v).toLocaleString('id-ID');
            return String(v);
        },

        badgeClass(v) {
            const m = {
                'Aktif':'bg-green-100 text-green-700','Active':'bg-green-100 text-green-700',
                'Lunas':'bg-green-100 text-green-700','Selesai':'bg-green-100 text-green-700',
                'Done':'bg-green-100 text-green-700','Won':'bg-green-100 text-green-700',
                'Approved':'bg-blue-100 text-blue-700','Confirmed':'bg-blue-100 text-blue-700',
                'Published':'bg-blue-100 text-blue-700','Disetujui':'bg-blue-100 text-blue-700',
                'Posted':'bg-blue-100 text-blue-700','Contract Signed':'bg-blue-100 text-blue-700',
                'Pending':'bg-yellow-100 text-yellow-800','Menunggu':'bg-yellow-100 text-yellow-800',
                'In Progress':'bg-orange-100 text-orange-700','Proses':'bg-orange-100 text-orange-700',
                'Draft':'bg-gray-100 text-gray-600','New':'bg-gray-100 text-gray-600',
                'Baru':'bg-gray-100 text-gray-600','Qualification':'bg-yellow-100 text-yellow-700',
                'Proposal':'bg-blue-100 text-blue-700','Negotiation':'bg-purple-100 text-purple-700',
                'Non-Aktif':'bg-gray-100 text-gray-500','Tidak Aktif':'bg-gray-100 text-gray-500',
                'Ditolak':'bg-red-100 text-red-700','Refused':'bg-red-100 text-red-700',
                'Cancelled':'bg-red-100 text-red-700','Lost':'bg-red-100 text-red-700',
                'Dibatalkan':'bg-red-100 text-red-700','Overdue':'bg-red-100 text-red-700',
                'High':'bg-orange-100 text-orange-700','Urgent':'bg-red-100 text-red-700',
                'Low':'bg-gray-100 text-gray-500','Normal':'bg-green-100 text-green-700',
                'Belum Lunas':'bg-red-100 text-red-700','Solved':'bg-green-100 text-green-700',
            };
            return m[v] || 'bg-gray-100 text-gray-500';
        },

        showToast(msg, type) {
            this.toast = { show: true, msg, type };
            setTimeout(() => this.toast.show = false, 3000);
        },

        // ── SAMPLE DATA GENERATOR ─────────────────────────────────────────
        generateSamples() {
            const m = this.menus[this.currentMenuIdx];
            const ff = m?.formFields || [];
            const n = Math.floor(Math.random() * 3) + 2; // 2-4 samples
            const samples = [];
            const names = ['Ahmad Santoso','Budi Pratama','CV Maju Jaya','PT Sumber Makmur','Dewi Lestari','Eko Wijaya','Fajar Nugroho','PT Karya Utama'];
            const statuses = m?.filterOptions || ['Aktif','Pending','Selesai'];
            for (let i = 0; i < n; i++) {
                const item = { _id: Date.now() + i, _created: new Date(Date.now() - i * 86400000).toISOString() };
                ff.forEach(f => {
                    if (f.type === 'select') item[f.name] = statuses[i % statuses.length] || f.options?.[0] || '';
                    else if (f.type === 'number') item[f.name] = Math.floor(Math.random() * 10000000) + 100000;
                    else if (f.type === 'date') item[f.name] = new Date(Date.now() - i * 7 * 86400000).toISOString().split('T')[0];
                    else if (f.type === 'email') item[f.name] = 'example' + (i+1) + '@email.com';
                    else if (f.type === 'textarea') item[f.name] = 'Deskripsi ' + f.label.toLowerCase() + ' ' + (i+1);
                    else {
                        // try to generate contextual value
                        const label = f.label.toLowerCase();
                        if (label.includes('nama') || label.includes('pelanggan') || label.includes('karyawan') || label.includes('customer') || label.includes('supplier')) {
                            item[f.name] = names[i % names.length];
                        } else if (label.includes('nomor') || label.includes('number') || label.includes('no.') || label.includes('kode')) {
                            item[f.name] = (m.module?.toUpperCase().slice(0,3) || 'DOC') + '/' + String(2025) + '/' + String(1000+i).padStart(4,'0');
                        } else if (label.includes('telepon') || label.includes('phone') || label.includes('hp')) {
                            item[f.name] = '08' + Math.floor(Math.random()*900000000+100000000);
                        } else if (label.includes('email')) {
                            item[f.name] = 'example' + (i+1) + '@email.com';
                        } else {
                            item[f.name] = f.label + ' ' + (i + 1);
                        }
                    }
                });
                samples.push(item);
            }
            return samples;
        },
    };
}
</script>
@endsection
