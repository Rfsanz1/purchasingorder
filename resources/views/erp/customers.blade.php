@extends('layouts.erp')

@section('title', 'Data Customer')

@section('content')
<div x-data="customerApp()" x-init="init()" class="p-4 md:p-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
            <h1 class="text-2xl font-bold text-gray-900">Data Customer</h1>
            <p class="text-gray-600 mt-1">Kelola database pelanggan dan informasi kontak</p>
        </div>
        <button @click="openCreateModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Tambah Customer
        </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Total Customer</p>
                    <p class="text-2xl font-bold text-gray-900" x-text="stats.totalCustomers || 0"></p>
                </div>
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Customer Aktif</p>
                    <p class="text-2xl font-bold text-green-600" x-text="stats.activeCustomers || 0"></p>
                </div>
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Total Order</p>
                    <p class="text-2xl font-bold text-purple-600" x-text="stats.totalOrders || 0"></p>
                </div>
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                </div>
            </div>
        </div>
        <div class="bg-white rounded-lg border p-4">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-gray-600">Total Revenue</p>
                    <p class="text-2xl font-bold text-orange-600" x-text="formatCurrency(stats.totalRevenue || 0)"></p>
                </div>
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg border p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Cari</label>
                <input x-model="filters.search" @input.debounce.300ms="loadCustomers()"
                       type="text" placeholder="Nama, telepon, email..."
                       class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select x-model="filters.status" @change="loadCustomers()"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Semua Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="Blacklist">Blacklist</option>
                </select>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Per Halaman</label>
                <select x-model="filters.perPage" @change="loadCustomers()"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div class="flex items-end">
                <button @click="resetFilters()" class="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                    Reset Filter
                </button>
            </div>
        </div>
    </div>

    <!-- Customer Table -->
    <div class="bg-white rounded-lg border overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Nilai</th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <template x-for="customer in customers" :key="customer.id">
                        <tr class="hover:bg-gray-50">
                            <td class="px-4 py-4">
                                <div>
                                    <div class="font-medium text-gray-900" x-text="customer.nama"></div>
                                    <div class="text-sm text-gray-500" x-text="customer.perusahaan || '-'"></div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <div class="text-sm">
                                    <div x-text="customer.telepon || '-'"></div>
                                    <div class="text-gray-500" x-text="customer.email || '-'"></div>
                                </div>
                            </td>
                            <td class="px-4 py-4">
                                <span :class="getStatusClass(customer.status)"
                                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                      x-text="customer.status"></span>
                            </td>
                            <td class="px-4 py-4 text-sm text-gray-900" x-text="customer.total_order"></td>
                            <td class="px-4 py-4 text-sm text-gray-900" x-text="formatCurrency(customer.total_nilai_order)"></td>
                            <td class="px-4 py-4 text-sm font-medium">
                                <div class="flex space-x-2">
                                    <button @click="viewCustomer(customer)" class="text-blue-600 hover:text-blue-900">Lihat</button>
                                    <button @click="editCustomer(customer)" class="text-indigo-600 hover:text-indigo-900">Edit</button>
                                    <button @click="deleteCustomer(customer)" class="text-red-600 hover:text-red-900">Hapus</button>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    Menampilkan <span x-text="meta.returned"></span> dari <span x-text="meta.total"></span> customer
                </div>
                <div class="flex space-x-2">
                    <button @click="prevPage()" :disabled="meta.page <= 1"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Previous
                    </button>
                    <button @click="nextPage()" :disabled="meta.page >= Math.ceil(meta.total / meta.perPage)"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                        Next
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Create/Edit Modal -->
    <div x-show="isCreateModalOpen || showEditModal" x-cloak
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
         @click.self="closeModal()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div class="mt-3">
                <h3 class="text-lg font-medium text-gray-900 mb-4" x-text="isCreateModalOpen ? 'Tambah Customer' : 'Edit Customer'"></h3>

                <form @submit.prevent="saveCustomer()" class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nama *</label>
                            <input x-model="form.nama" type="text" required
                                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Email</label>
                            <input x-model="form.email" type="email"
                                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Telepon</label>
                            <input x-model="form.telepon" type="text"
                                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                            <input x-model="form.tanggal_lahir" type="date"
                                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                            <select x-model="form.jenis_kelamin"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">Pilih</option>
                                <option value="L">Laki-laki</option>
                                <option value="P">Perempuan</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Status</label>
                            <select x-model="form.status"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                                <option value="Aktif">Aktif</option>
                                <option value="Tidak Aktif">Tidak Aktif</option>
                                <option value="Blacklist">Blacklist</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Alamat</label>
                        <textarea x-model="form.alamat" rows="3"
                                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Pekerjaan</label>
                            <input x-model="form.pekerjaan" type="text"
                                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Perusahaan</label>
                            <input x-model="form.perusahaan" type="text"
                                   class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                        </div>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Catatan</label>
                        <textarea x-model="form.catatan" rows="2"
                                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
                    </div>

                    <div class="flex justify-end space-x-3 pt-4">
                        <button type="button" @click="closeModal()"
                                class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit" :disabled="loading"
                                class="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                            <span x-show="loading">Menyimpan...</span>
                            <span x-show="!loading" x-text="isCreateModalOpen ? 'Simpan' : 'Update'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- View Modal -->
    <div x-show="showViewModal" x-cloak
         class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
         @click.self="closeViewModal()">
        <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div class="mt-3">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-medium text-gray-900" x-text="viewCustomerData.customer?.nama || 'Detail Customer'"></h3>
                    <button @click="closeViewModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="space-y-6">
                    <!-- Customer Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Informasi Dasar</h4>
                            <dl class="space-y-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Nama</dt>
                                    <dd class="text-sm text-gray-900" x-text="viewCustomerData.customer?.nama"></dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Email</dt>
                                    <dd class="text-sm text-gray-900" x-text="viewCustomerData.customer?.email || '-'"></dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Telepon</dt>
                                    <dd class="text-sm text-gray-900" x-text="viewCustomerData.customer?.telepon || '-'"></dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Status</dt>
                                    <dd>
                                        <span :class="getStatusClass(viewCustomerData.customer?.status)"
                                              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                              x-text="viewCustomerData.customer?.status"></span>
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div>
                            <h4 class="font-medium text-gray-900 mb-3">Statistik</h4>
                            <dl class="space-y-2">
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Total Order</dt>
                                    <dd class="text-sm text-gray-900" x-text="viewCustomerData.stats?.total_orders || 0"></dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Total Nilai Order</dt>
                                    <dd class="text-sm text-gray-900" x-text="formatCurrency(viewCustomerData.stats?.total_value || 0)"></dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Rata-rata Order</dt>
                                    <dd class="text-sm text-gray-900" x-text="formatCurrency(viewCustomerData.stats?.average_order_value || 0)"></dd>
                                </div>
                                <div>
                                    <dt class="text-sm font-medium text-gray-500">Order Terakhir</dt>
                                    <dd class="text-sm text-gray-900" x-text="viewCustomerData.customer?.last_order_at ? formatDate(viewCustomerData.customer.last_order_at) : '-'"></dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <!-- Recent Orders -->
                    <div>
                        <h4 class="font-medium text-gray-900 mb-3">Order Terbaru</h4>
                        <div class="space-y-2">
                            <template x-for="order in viewCustomerData.stats?.recent_orders || []" :key="order.order_id">
                                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <div class="font-medium text-sm" x-text="order.order_id"></div>
                                        <div class="text-xs text-gray-500" x-text="formatDate(order.created_at)"></div>
                                    </div>
                                    <div class="text-right">
                                        <div class="font-medium text-sm" x-text="formatCurrency(order.total_harga)"></div>
                                        <div class="text-xs text-gray-500" x-text="order.status_pengiriman"></div>
                                    </div>
                                </div>
                            </template>
                            <div x-show="(viewCustomerData.stats?.recent_orders || []).length === 0" class="text-center py-4 text-gray-500">
                                Belum ada order
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function customerApp() {
    return {
        customers: [],
        stats: {},
        meta: { page: 1, perPage: 20, total: 0, returned: 0 },
        filters: { search: '', status: '', perPage: 20 },
        isCreateModalOpen: false,
        showEditModal: false,
        showViewModal: false,
        loading: false,
        form: {
            nama: '', email: '', telepon: '', alamat: '', tanggal_lahir: '',
            jenis_kelamin: '', pekerjaan: '', perusahaan: '', status: 'Aktif', catatan: ''
        },
        viewCustomerData: { customer: null, stats: null },

        async init() {
            await this.loadStats();
            await this.loadCustomers();
        },

        async loadStats() {
            try {
                const res = await fetch('/api/customers/summary');
                const data = await res.json();
                this.stats = data;
            } catch (e) {
                console.error('Failed to load stats:', e);
            }
        },

        async loadCustomers() {
            try {
                const params = new URLSearchParams({
                    page: this.meta.page,
                    per_page: this.filters.perPage,
                    search: this.filters.search,
                    status: this.filters.status
                });

                const res = await fetch(`/api/customers?${params}`);
                const data = await res.json();
                this.customers = data.customers || [];
                this.meta = data.meta || this.meta;
            } catch (e) {
                console.error('Failed to load customers:', e);
            }
        },

        resetFilters() {
            this.filters = { search: '', status: '', perPage: 20 };
            this.meta.page = 1;
            this.loadCustomers();
        },

        prevPage() {
            if (this.meta.page > 1) {
                this.meta.page--;
                this.loadCustomers();
            }
        },

        nextPage() {
            if (this.meta.page < Math.ceil(this.meta.total / this.meta.perPage)) {
                this.meta.page++;
                this.loadCustomers();
            }
        },

        openCreateModal() {
            this.isCreateModalOpen = true;
            this.resetForm();
        },

        editCustomer(customer) {
            this.showEditModal = true;
            this.form = { ...customer };
        },

        viewCustomer(customer) {
            this.showViewModal = true;
            this.loadCustomerDetail(customer.id);
        },

        async loadCustomerDetail(id) {
            try {
                const res = await fetch(`/api/customers/${id}`);
                const data = await res.json();
                this.viewCustomerData = data;
            } catch (e) {
                console.error('Failed to load customer detail:', e);
            }
        },

        closeModal() {
            this.isCreateModalOpen = false;
            this.showEditModal = false;
            this.resetForm();
        },

        closeViewModal() {
            this.showViewModal = false;
            this.viewCustomerData = { customer: null, stats: null };
        },

        resetForm() {
            this.form = {
                nama: '', email: '', telepon: '', alamat: '', tanggal_lahir: '',
                jenis_kelamin: '', pekerjaan: '', perusahaan: '', status: 'Aktif', catatan: ''
            };
        },

        async saveCustomer() {
            this.loading = true;
            try {
                const method = this.isCreateModalOpen ? 'POST' : 'PUT';
                const url = this.isCreateModalOpen ? '/api/customers' : `/api/customers/${this.form.id}`;

                const res = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(this.form)
                });

                const data = await res.json();

                if (data.ok) {
                    this.closeModal();
                    await this.loadCustomers();
                    await this.loadStats();
                } else {
                    alert(data.error || 'Gagal menyimpan customer');
                }
            } catch (e) {
                console.error('Failed to save customer:', e);
                alert('Terjadi kesalahan saat menyimpan');
            } finally {
                this.loading = false;
            }
        },

        async deleteCustomer(customer) {
            if (!confirm(`Yakin hapus customer "${customer.nama}"?`)) return;

            try {
                const res = await fetch(`/api/customers/${customer.id}`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    }
                });

                if (res.ok) {
                    await this.loadCustomers();
                    await this.loadStats();
                } else {
                    alert('Gagal menghapus customer');
                }
            } catch (e) {
                console.error('Failed to delete customer:', e);
                alert('Terjadi kesalahan saat menghapus');
            }
        },

        getStatusClass(status) {
            const classes = {
                'Aktif': 'bg-green-100 text-green-800',
                'Tidak Aktif': 'bg-gray-100 text-gray-800',
                'Blacklist': 'bg-red-100 text-red-800'
            };
            return classes[status] || 'bg-gray-100 text-gray-800';
        },

        formatCurrency(amount) {
            return new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0
            }).format(amount);
        },

        formatDate(dateStr) {
            if (!dateStr) return '-';
            return new Date(dateStr).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    }
}
</script>
@endsection