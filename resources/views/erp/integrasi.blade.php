@extends('layouts.erp')
@section('title', 'Integrasi')

@section('content')
<div x-data="integrasiApp()" x-init="init()" class="p-4 md:p-6 max-w-4xl mx-auto">

    {{-- Header --}}
    <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900">Integrasi</h1>
        <p class="text-sm text-gray-400 mt-0.5">Kelola koneksi ke aplikasi pihak ketiga — token disimpan di database ERP</p>
    </div>

    {{-- Loading --}}
    <div x-show="loading" x-cloak class="flex justify-center py-16">
        <svg class="w-7 h-7 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
    </div>

    {{-- Kartu Integrasi --}}
    <div x-show="!loading" x-cloak class="space-y-4">
        <template x-for="integ in daftar" :key="integ.id">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {{-- Header Kartu --}}
                <div class="px-5 py-4 flex items-start gap-4">
                    {{-- Ikon --}}
                    <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        :class="{
                            'bg-blue-100':   integ.icon === 'kledo',
                            'bg-green-100':  integ.icon === 'whatsapp',
                            'bg-orange-100': integ.icon === 'shopee',
                        }">
                        <template x-if="integ.icon === 'kledo'">
                            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                        </template>
                        <template x-if="integ.icon === 'whatsapp'">
                            <svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        </template>
                        <template x-if="integ.icon === 'shopee'">
                            <svg class="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6H5C3.9 6 3 6.9 3 8v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7 3c1.9 0 3.5 1.3 3.9 3H8.1C8.5 10.3 10.1 9 12 9zm5 9H7v-1.5c0-1.4 2.7-2.5 5-2.5s5 1.1 5 2.5V18z"/></svg>
                        </template>
                    </div>

                    {{-- Info --}}
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3 class="font-semibold text-gray-900 text-sm" x-text="integ.nama"></h3>
                            {{-- Badge Status --}}
                            <span class="text-xs px-2 py-0.5 rounded-full font-semibold"
                                :class="{
                                    'bg-green-100 text-green-700': integ._testResult?.valid === true,
                                    'bg-red-100 text-red-700': integ._testResult?.valid === false,
                                    'bg-gray-100 text-gray-500': integ.has_token && integ._testResult === undefined,
                                    'bg-yellow-100 text-yellow-700': !integ.has_token,
                                }"
                                x-text="
                                    integ._testResult?.valid === true ? '✓ Terhubung' :
                                    integ._testResult?.valid === false ? '✗ Error' :
                                    integ.has_token ? 'Token Ada' : 'Belum diatur'
                                "></span>
                            {{-- Sumber --}}
                            <span x-show="integ.has_token"
                                class="text-xs px-2 py-0.5 rounded-full"
                                :class="integ.sumber === 'database' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-400'"
                                x-text="integ.sumber === 'database' ? '💾 Dari database' : '🔒 Dari environment'"></span>
                        </div>
                        <p class="text-xs text-gray-400 mt-0.5" x-text="integ.deskripsi"></p>
                        <p x-show="integ.has_token" class="text-xs text-gray-300 mt-0.5 font-mono" x-text="integ.token_prefix"></p>
                        {{-- Test result message --}}
                        <p x-show="integ._testResult" class="text-xs mt-1"
                            :class="integ._testResult?.valid ? 'text-green-600' : 'text-red-500'"
                            x-text="integ._testResult?.message"></p>
                    </div>

                    {{-- Tombol Test --}}
                    <button @click="testKoneksi(integ)"
                        :disabled="integ._testing || !integ.has_token"
                        class="shrink-0 text-xs px-3 py-1.5 rounded-lg border font-semibold transition disabled:opacity-40"
                        :class="integ.has_token ? 'border-gray-200 text-gray-600 hover:bg-gray-50' : 'border-gray-100 text-gray-300'">
                        <span x-show="!integ._testing">Test</span>
                        <span x-show="integ._testing" class="flex items-center gap-1">
                            <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                            Cek...
                        </span>
                    </button>
                </div>

                {{-- Form Update Token --}}
                <div class="border-t border-gray-50 px-5 py-4 bg-gray-50/50">
                    <div x-show="!integ._edit && !integ.has_token" class="flex items-center gap-2">
                        <button @click="integ._edit = true"
                            class="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                            Tambah Token
                        </button>
                        <a :href="integ.docs_url" target="_blank"
                            class="text-xs text-gray-400 hover:text-gray-600 underline" x-text="integ.docs_label"></a>
                    </div>

                    <div x-show="!integ._edit && integ.has_token" class="flex items-center gap-3">
                        <button @click="integ._edit = true"
                            class="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                            Ganti Token
                        </button>
                        <button x-show="integ.sumber === 'database'" @click="hapusToken(integ)"
                            class="text-xs text-red-400 hover:text-red-600">
                            Hapus dari database
                        </button>
                        <a :href="integ.docs_url" target="_blank"
                            class="text-xs text-gray-400 hover:text-gray-600 underline ml-auto" x-text="integ.docs_label"></a>
                    </div>

                    {{-- Form Input Token --}}
                    <div x-show="integ._edit" x-cloak>
                        <label class="block text-xs text-gray-500 mb-1.5">Paste token baru di sini:</label>
                        <div class="flex gap-2">
                            <input type="password"
                                x-model="integ._newToken"
                                :placeholder="'Token ' + integ.nama + '...'"
                                class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400">
                            <button @click="simpanToken(integ)"
                                :disabled="integ._saving || !integ._newToken"
                                class="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap transition">
                                <span x-show="!integ._saving">Simpan</span>
                                <span x-show="integ._saving">...</span>
                            </button>
                            <button @click="integ._edit = false; integ._newToken = ''"
                                class="text-sm text-gray-400 hover:text-gray-600 px-2">Batal</button>
                        </div>
                        <p class="text-xs text-gray-400 mt-1.5">Token disimpan di database ERP — tidak perlu lagi menyimpan token di environment server.</p>
                    </div>
                </div>
            </div>
        </template>
    </div>

    {{-- Info Box --}}
    <div x-show="!loading" x-cloak class="mt-5 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 text-xs text-blue-700 space-y-1">
        <p class="font-semibold">Cara kerja Integrasi:</p>
        <p>• Token yang disimpan di sini (database) akan dipakai terlebih dahulu, menggantikan token dari environment server.</p>
        <p>• Kalau tidak ada token di database, sistem otomatis pakai token dari environment server.</p>
        <p>• Klik <strong>Test</strong> untuk memverifikasi koneksi ke masing-masing layanan.</p>
    </div>
</div>

<script>
function integrasiApp() {
    return {
        loading: true,
        daftar: [],

        async init() {
            await this.muat();
        },

        async muat() {
            this.loading = true;
            try {
                const res  = await fetch('/api/integrasi');
                const json = await res.json();
                this.daftar = (json.integrasi || []).map(i => ({
                    ...i,
                    _edit:       false,
                    _newToken:   '',
                    _saving:     false,
                    _testing:    false,
                    _testResult: undefined,
                }));
            } catch (e) {
                console.error('Gagal muat integrasi:', e);
            } finally {
                this.loading = false;
            }
        },

        async simpanToken(integ) {
            if (!integ._newToken.trim()) return;
            integ._saving = true;
            try {
                const res  = await fetch(`/api/integrasi/${integ.id}/update`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' },
                    body:    JSON.stringify({ token: integ._newToken.trim() }),
                });
                const json = await res.json();
                if (json.success) {
                    integ.has_token    = true;
                    integ.token_prefix = json.token_prefix;
                    integ.sumber       = json.sumber;
                    integ._edit        = false;
                    integ._newToken    = '';
                    integ._testResult  = undefined;
                    // Auto-test setelah simpan
                    await this.testKoneksi(integ);
                }
            } catch (e) {
                console.error(e);
            } finally {
                integ._saving = false;
            }
        },

        async hapusToken(integ) {
            if (!confirm(`Hapus token ${integ.nama} dari database?`)) return;
            try {
                const res  = await fetch(`/api/integrasi/${integ.id}/reset`, {
                    method:  'DELETE',
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' },
                });
                const json = await res.json();
                if (json.success) {
                    integ.sumber      = json.sumber;
                    integ.has_token   = json.sumber !== 'tidak ada';
                    integ._testResult = undefined;
                }
            } catch (e) {
                console.error(e);
            }
        },

        async testKoneksi(integ) {
            if (!integ.has_token) return;
            integ._testing    = true;
            integ._testResult = undefined;
            try {
                const res  = await fetch(`/api/integrasi/${integ.id}/test`, {
                    method:  'POST',
                    headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content || '' },
                });
                const json = await res.json();
                integ._testResult = json;
            } catch (e) {
                integ._testResult = { valid: false, status: 'Error', message: e.message };
            } finally {
                integ._testing = false;
            }
        },
    };
}
</script>
@endsection
