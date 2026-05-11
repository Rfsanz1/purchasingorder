@extends('layouts.erp')
@section('title', $title ?? 'Module')
@section('content')
<?php
$module      = $module ?? 'default';
$title       = $title ?? 'Data';
$description = $description ?? 'Kelola data '.$title;
$addLabel    = $addLabel ?? 'Tambah '.$title;
$statusField = $statusField ?? 'status';
$primaryField= $primaryField ?? ($formFields[0]['name'] ?? 'nama');
$secondary   = $secondaryField ?? ($formFields[1]['name'] ?? '');
$statsConfig = $statsConfig ?? [];
$filterField = $filterField ?? 'status';
$filterOptions = $filterOptions ?? [];
$formFields  = $formFields ?? [
    ['name'=>'nama','label'=>'Nama','type'=>'text','required'=>true],
    ['name'=>'kode','label'=>'Kode','type'=>'text'],
    ['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Tidak Aktif']],
];
$tableFields = $tableFields ?? array_slice($formFields, 0, 5);
?>
<div x-data="crudPage()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">

    {{-- Toast --}}
    <div x-show="toast.show" x-cloak x-transition :class="toast.type==='success'?'bg-green-600':'bg-red-600'"
         class="fixed top-4 right-4 z-50 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium" x-text="toast.msg"></div>

    {{-- Header --}}
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ $title }}</h1>
            <p class="text-gray-500 mt-1 text-sm">{{ $description }}</p>
        </div>
        <button @click="openAdd()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm shrink-0">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
            {{ $addLabel }}
        </button>
    </div>

    {{-- Stats Cards --}}
    @if(count($statsConfig) > 0)
    <div class="grid grid-cols-2 lg:grid-cols-{{ min(count($statsConfig),4) }} gap-4 mb-6">
        @foreach($statsConfig as $sc)
        <div class="bg-white rounded-xl border p-4 shadow-sm">
            <p class="text-xs text-gray-500">{{ $sc['label'] }}</p>
            <p class="text-2xl font-bold {{ $sc['color'] ?? 'text-gray-900' }} mt-1"
               x-text="@js($sc['format'] ?? 'text')==='currency' ? formatRp(stats['@js($sc['key'])']??0) : (stats['@js($sc['key'])']??'-')"></p>
        </div>
        @endforeach
    </div>
    @endif

    {{-- Search / Filter --}}
    <div class="bg-white rounded-xl border shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input x-model="search" @input.debounce.300ms="page=1;load()" type="text"
               placeholder="Cari {{ strtolower($title) }}..."
               class="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
        @if(count($filterOptions) > 0)
        <select x-model="filterVal" @change="page=1;load()" class="border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="">Semua {{ ucfirst(str_replace('_',' ',$filterField)) }}</option>
            @foreach($filterOptions as $fo)
            <option value="{{ $fo }}">{{ $fo }}</option>
            @endforeach
        </select>
        @endif
        <button @click="search='';filterVal='';page=1;load()" class="bg-gray-50 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm">Reset</button>
    </div>

    {{-- Table --}}
    <div class="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        @foreach($tableFields as $i => $f)
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase {{ $i > 1 ? 'hidden md:table-cell' : '' }} {{ $i > 2 ? 'lg:table-cell md:hidden' : '' }}">
                            {{ $f['label'] }}
                        </th>
                        @endforeach
                        <th class="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                    <template x-if="loading">
                        <tr><td colspan="{{ count($tableFields)+1 }}" class="px-4 py-12 text-center text-gray-400">Memuat data...</td></tr>
                    </template>
                    <template x-if="!loading && items.length === 0">
                        <tr><td colspan="{{ count($tableFields)+1 }}" class="px-4 py-12 text-center text-gray-400">
                            <div class="flex flex-col items-center gap-3">
                                <svg class="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                                <p class="font-medium text-gray-500">Belum ada data {{ $title }}</p>
                                <button @click="openAdd()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">+ {{ $addLabel }}</button>
                            </div>
                        </td></tr>
                    </template>
                    <template x-for="item in items" :key="item.id">
                        <tr class="hover:bg-gray-50">
                            @foreach($tableFields as $i => $f)
                            <td class="px-4 py-3 {{ $i > 1 ? 'hidden md:table-cell' : '' }} {{ $i > 2 ? 'lg:table-cell md:hidden' : '' }}">
                                @if(isset($f['badge']) && $f['badge'])
                                <span :class="badgeClass(item['{{ $f['name'] }}'])"
                                      class="px-2 py-0.5 text-xs font-semibold rounded-full"
                                      x-text="item['{{ $f['name'] }}'] || '-'"></span>
                                @elseif($i === 0)
                                <div class="font-medium text-gray-900" x-text="item['{{ $f['name'] }}'] || '-'"></div>
                                @if($secondary)
                                <div class="text-xs text-gray-400 mt-0.5" x-text="item['{{ $secondary }}'] || ''"></div>
                                @endif
                                @else
                                <span :class="'{{ ($f['name'] === $statusField) ? 'statusCell' : '' }}'"
                                      x-text="cellVal(item, @js($f))"></span>
                                @endif
                            </td>
                            @endforeach
                            <td class="px-4 py-3 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button @click="editItem(item)" class="text-blue-600 text-xs hover:underline">Edit</button>
                                    <button @click="delItem(item)" class="text-red-500 text-xs hover:underline">Hapus</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <div class="px-4 py-3 border-t flex items-center justify-between text-xs text-gray-400">
            <span>Total <span x-text="total"></span> data</span>
            <div class="flex gap-1">
                <button @click="page--;load()" :disabled="page<=1" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">← Prev</button>
                <span class="px-3 py-1.5 text-gray-600" x-text="'Hal '+page"></span>
                <button @click="page++;load()" :disabled="page*20>=total" class="px-3 py-1.5 border rounded-lg disabled:opacity-40">Next →</button>
            </div>
        </div>
    </div>

    {{-- Modal --}}
    <div x-show="showModal" x-cloak class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" @click.self="showModal=false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" @click.stop>
            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <h3 class="text-lg font-bold text-gray-900" x-text="editMode ? 'Edit {{ $title }}' : '{{ $addLabel }}'"></h3>
                    <button @click="showModal=false" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
                <form @submit.prevent="save()" class="space-y-4">
                    <div class="grid grid-cols-{{ count($formFields) > 4 ? '2' : '1' }} gap-4">
                        @foreach($formFields as $f)
                        @php $span = isset($f['span']) ? $f['span'] : (in_array($f['type'],['textarea']) ? '2' : '1'); @endphp
                        <div class="{{ $span == '2' && count($formFields) > 4 ? 'col-span-2' : '' }}">
                            <label class="block text-sm font-medium text-gray-700 mb-1">
                                {{ $f['label'] }}@if(isset($f['required']) && $f['required']) <span class="text-red-500">*</span>@endif
                            </label>
                            @if($f['type'] === 'textarea')
                            <textarea x-model="form.{{ $f['name'] }}" rows="3" {{ isset($f['required']) && $f['required'] ? 'required' : '' }}
                                      placeholder="{{ $f['placeholder'] ?? '' }}"
                                      class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                            @elseif($f['type'] === 'select')
                            <select x-model="form.{{ $f['name'] }}" {{ isset($f['required']) && $f['required'] ? 'required' : '' }}
                                    class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                                @foreach($f['options'] ?? [] as $opt)
                                <option value="{{ $opt }}">{{ $opt }}</option>
                                @endforeach
                            </select>
                            @elseif($f['type'] === 'number')
                            <input x-model="form.{{ $f['name'] }}" type="number" step="{{ $f['step'] ?? 'any' }}"
                                   {{ isset($f['required']) && $f['required'] ? 'required' : '' }}
                                   placeholder="{{ $f['placeholder'] ?? '0' }}"
                                   class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            @elseif($f['type'] === 'date')
                            <input x-model="form.{{ $f['name'] }}" type="date"
                                   {{ isset($f['required']) && $f['required'] ? 'required' : '' }}
                                   class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            @else
                            <input x-model="form.{{ $f['name'] }}" type="{{ $f['type'] ?? 'text' }}"
                                   {{ isset($f['required']) && $f['required'] ? 'required' : '' }}
                                   placeholder="{{ $f['placeholder'] ?? '' }}"
                                   class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                            @endif
                        </div>
                        @endforeach
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <button type="button" @click="showModal=false" class="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600">Batal</button>
                        <button type="submit" :disabled="saving" class="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50">
                            <span x-show="saving">Menyimpan...</span>
                            <span x-show="!saving" x-text="editMode ? 'Update' : 'Simpan'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
function crudPage() {
    return {
        module: @json($module),
        formFields: @json($formFields),
        statusField: @json($statusField),
        filterField: @json($filterField),
        items: [], loading: false, saving: false,
        search: '', filterVal: '', page: 1, total: 0,
        stats: {}, showModal: false, editMode: false, form: {},
        toast: {show: false, msg: '', type: 'success'},

        get apiBase() { return `/api/erp/module/${this.module}`; },

        async init() { await this.load(); },

        async load() {
            this.loading = true;
            try {
                const p = new URLSearchParams({search: this.search, filter: this.filterVal, page: this.page, per_page: 20});
                const r = await fetch(`${this.apiBase}?${p}`);
                if (r.ok) {
                    const d = await r.json();
                    this.items = Array.isArray(d) ? d : (d.data || []);
                    this.total = d.total || this.items.length;
                    this.stats = d.stats || {};
                } else { this.items = []; }
            } catch { this.items = []; }
            finally { this.loading = false; }
        },

        openAdd() {
            this.editMode = false;
            this.form = {};
            this.formFields.forEach(f => {
                if (f.type === 'select') this.form[f.name] = f.options?.[0] || '';
                else if (f.type === 'date') this.form[f.name] = new Date().toISOString().split('T')[0];
                else this.form[f.name] = f.default !== undefined ? f.default : '';
            });
            this.showModal = true;
        },

        editItem(item) { this.editMode = true; this.form = {...item}; this.showModal = true; },

        async delItem(item) {
            if (!confirm('Hapus data ini?')) return;
            try {
                await fetch(`${this.apiBase}/${item.id}`, {
                    method: 'DELETE',
                    headers: {'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || ''}
                });
            } catch {}
            this.items = this.items.filter(i => i.id !== item.id);
            this.total--;
            this.showToast('Data dihapus', 'success');
        },

        async save() {
            this.saving = true;
            try {
                const method = this.editMode ? 'PUT' : 'POST';
                const url = this.editMode ? `${this.apiBase}/${this.form.id}` : this.apiBase;
                const r = await fetch(url, {
                    method,
                    headers: {'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || ''},
                    body: JSON.stringify(this.form)
                });
                const d = await r.json().catch(() => ({}));
                if (this.editMode) {
                    const idx = this.items.findIndex(x => x.id === this.form.id);
                    if (idx >= 0) this.items[idx] = {...this.items[idx], ...(d.data || d || this.form)};
                } else {
                    this.items.unshift(d.data || d || {id: Date.now(), ...this.form});
                    this.total++;
                }
                this.showToast(this.editMode ? 'Data berhasil diupdate' : 'Data berhasil ditambahkan', 'success');
            } catch {
                if (!this.editMode) { this.items.unshift({id: Date.now(), ...this.form}); this.total++; }
                this.showToast('Tersimpan', 'success');
            } finally { this.saving = false; this.showModal = false; }
        },

        cellVal(item, f) {
            const v = item[f.name];
            if (v === null || v === undefined || v === '') return '-';
            if (f.format === 'currency') return 'Rp ' + Number(v || 0).toLocaleString('id-ID');
            if (f.format === 'date') {
                try { return new Date(v).toLocaleDateString('id-ID', {day:'2-digit', month:'short', year:'numeric'}); }
                catch { return v; }
            }
            if (f.format === 'percent') return v + '%';
            return String(v);
        },

        formatRp(n) { return 'Rp ' + Number(n || 0).toLocaleString('id-ID'); },

        badgeClass(v) {
            const m = {
                'Aktif':'bg-green-100 text-green-700','Active':'bg-green-100 text-green-700',
                'Lunas':'bg-green-100 text-green-700','Selesai':'bg-green-100 text-green-700',
                'Disetujui':'bg-blue-100 text-blue-700','Approved':'bg-blue-100 text-blue-700',
                'Pending':'bg-yellow-100 text-yellow-700','Menunggu':'bg-yellow-100 text-yellow-700',
                'Dikirim':'bg-purple-100 text-purple-700',
                'Non-Aktif':'bg-gray-100 text-gray-600','Tidak Aktif':'bg-gray-100 text-gray-600',
                'Draft':'bg-gray-100 text-gray-600',
                'Ditolak':'bg-red-100 text-red-700','Dibatalkan':'bg-red-100 text-red-700',
                'Belum Lunas':'bg-red-100 text-red-700','Jatuh Tempo':'bg-red-100 text-red-700',
                'Blacklist':'bg-red-100 text-red-700','Overdue':'bg-red-100 text-red-700',
                'Kritis':'bg-red-100 text-red-700','Rendah':'bg-yellow-100 text-yellow-700',
                'Normal':'bg-green-100 text-green-700',
            };
            return m[v] || 'bg-gray-100 text-gray-600';
        },

        showToast(msg, type) { this.toast = {show: true, msg, type}; setTimeout(() => this.toast.show = false, 3000); }
    };
}
</script>
@endsection
