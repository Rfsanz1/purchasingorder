<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Carbon\Carbon;

/**
 * Generic ERP Module Controller
 * Handles CRUD for all ERP modules via a unified API.
 */
class ErpModuleController extends Controller
{
    private function tableForModule(string $module): ?string
    {
        return [
            'suppliers'          => 'suppliers',
            'purchase-orders'    => 'purchase_orders',
            'purchase-items'     => 'purchase_order_items',
            'cash-in'            => 'cash_transactions',
            'cash-out'           => 'cash_transactions',
            'expenses'           => 'expenses',
            'employees'          => 'employees',
            'attendance'         => 'attendance',
            'quotations'         => 'quotations',
            'returns'            => 'returns',
            'stock-mutations'    => 'stock_mutations',
            'promos'             => 'promos',
            'payrolls'           => 'payrolls',
            'delivery-proofs'    => 'delivery_proofs',
            'sales-targets'      => 'sales_targets',
            'journals'           => 'journal_entries',
            'coa'                => 'chart_of_accounts',
            'wa-logs'            => 'wa_notification_logs',
            'assets'             => 'erp_assets',
            'asset-categories'   => 'erp_asset_categories',
            'asset-maintenance'  => 'erp_asset_maintenances',
            'asset-transfers'    => 'erp_asset_transfers',
            'asset-disposals'    => 'erp_asset_disposals',
            'asset-audit-logs'   => 'erp_asset_audit_logs',
            'projects'           => 'erp_projects',
            'project-tasks'      => 'erp_project_tasks',
            'project-milestones' => 'erp_project_milestones',
            'project-timesheets' => 'erp_project_timesheets',
            'project-costs'      => 'erp_project_costs',
            'documents'          => 'erp_documents',
            'document-templates' => 'erp_document_templates',
            'inspections'        => 'erp_quality_inspections',
            'ncrs'               => 'erp_quality_ncrs',
            'supplier-quality'   => 'erp_supplier_quality',
            'mrp-planning'       => 'erp_mrp_plans',
            'custom-reports'     => 'erp_custom_reports',
            'vendors'            => 'erp_vendors',
            'entities'           => 'erp_entities',
            'role-matrix'        => 'erp_role_matrix',
            'delivery-tracking'  => 'erp_delivery_trackings',
            'audit-trails'       => 'erp_audit_trails',
            'mfa-settings'       => 'erp_mfa_settings',
            'session-logs'       => 'erp_session_logs',
            'vendor-scorecards'  => 'erp_vendor_scorecards',
        ][$module] ?? null;
    }

    private function moduleTable(string $module): ?string
    {
        $table = $this->tableForModule($module);
        if ($table && Schema::hasTable($table)) {
            return $table;
        }

        $fallback = 'erp_' . $module;
        return Schema::hasTable($fallback) ? $fallback : null;
    }

    private function applySearchAndFilter($q, string $table, string $search = '', string $filter = '')
    {
        if ($search) {
            $q->where(function ($w) use ($table, $search) {
                $columns = Schema::getColumnListing($table);
                foreach ($columns as $column) {
                    if (in_array($column, ['id', 'created_at', 'updated_at', 'deleted_at'])) {
                        continue;
                    }
                    $w->orWhere($column, 'ilike', "%{$search}%");
                }
            });
        }
        if ($filter) {
            $statusColumn = Schema::hasColumn($table, 'status') ? 'status' :
                            (Schema::hasColumn($table, 'approval_status') ? 'approval_status' : null);
            if ($statusColumn) {
                $q->where($statusColumn, $filter);
            }
        }
        return $q;
    }

    // ─── SUPPLIERS ────────────────────────────────────────────────────────────

    public function suppliersIndex(Request $request): JsonResponse
    {
        $q = DB::table('suppliers');
        if ($s = $request->query('search')) {
            $q->where(function ($w) use ($s) {
                $w->where('nama', 'ilike', "%$s%")
                  ->orWhere('kode', 'ilike', "%$s%")
                  ->orWhere('telepon', 'ilike', "%$s%");
            });
        }
        if ($status = $request->query('status')) $q->where('status', $status);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function suppliersSummary(): JsonResponse
    {
        $total = DB::table('suppliers')->count();
        $aktif = DB::table('suppliers')->where('status', 'Aktif')->count();
        $po_total = DB::table('purchase_orders')->sum('total');
        return response()->json(['total' => $total, 'aktif' => $aktif, 'nonaktif' => $total - $aktif, 'total_pembelian' => (float)$po_total]);
    }

    public function suppliersStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama'       => 'required|string|max:200',
            'kode'       => 'nullable|string|max:20',
            'kontak'     => 'nullable|string|max:100',
            'telepon'    => 'nullable|string|max:30',
            'email'      => 'nullable|email',
            'alamat'     => 'nullable|string',
            'kota'       => 'nullable|string|max:100',
            'npwp'       => 'nullable|string|max:30',
            'status'     => 'nullable|in:Aktif,Non-Aktif',
            'catatan'    => 'nullable|string',
            'top'        => 'nullable|integer',
            'limit_kredit' => 'nullable|numeric',
        ]);
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('suppliers')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function suppliersUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['nama','kode','kontak','telepon','email','alamat','kota','npwp','status','catatan','top','limit_kredit','rekening_bank','nama_bank','atas_nama']);
        $data['updated_at'] = now();
        DB::table('suppliers')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function suppliersDestroy(int $id): JsonResponse
    {
        DB::table('suppliers')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── PURCHASE ORDERS ──────────────────────────────────────────────────────

    public function purchaseOrdersIndex(Request $request): JsonResponse
    {
        $q = DB::table('purchase_orders as po')
            ->leftJoin('suppliers as s', 'po.supplier_id', '=', 's.id')
            ->select('po.*', 's.nama as nama_supplier');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) {
                $w->where('po.no_po', 'ilike', "%$s%")->orWhere('s.nama', 'ilike', "%$s%");
            });
        }
        if ($status = $request->query('status')) $q->where('po.status', $status);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('po.created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function purchaseOrdersSummary(): JsonResponse
    {
        $total = DB::table('purchase_orders')->count();
        $pending = DB::table('purchase_orders')->where('status', 'Pending')->count();
        $approved = DB::table('purchase_orders')->where('status', 'Approved')->count();
        $received = DB::table('purchase_orders')->where('status', 'Diterima')->count();
        $nilaiTotal = DB::table('purchase_orders')->sum('total');
        return response()->json(compact('total','pending','approved','received','nilaiTotal'));
    }

    public function purchaseOrdersStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'supplier_id' => 'nullable|integer',
            'tanggal'     => 'required|date',
            'tanggal_kirim' => 'nullable|date',
            'catatan'     => 'nullable|string',
            'items'       => 'required|array|min:1',
        ]);
        $noPo = 'PO-' . date('Ymd') . '-' . str_pad(DB::table('purchase_orders')->count() + 1, 4, '0', STR_PAD_LEFT);
        $subtotal = collect($data['items'])->sum(fn($i) => ($i['qty'] ?? 0) * ($i['harga'] ?? 0));
        $ppn = $subtotal * 0.11;
        $total = $subtotal + $ppn;
        $poId = DB::table('purchase_orders')->insertGetId([
            'no_po' => $noPo, 'supplier_id' => $data['supplier_id'],
            'tanggal' => $data['tanggal'], 'tanggal_kirim' => $data['tanggal_kirim'] ?? null,
            'subtotal' => $subtotal, 'ppn' => $ppn, 'total' => $total, 'sisa' => $total,
            'catatan' => $data['catatan'] ?? null, 'status' => 'Draft',
            'dibuat_oleh' => 'Admin', 'created_at' => now(), 'updated_at' => now(),
        ]);
        foreach ($data['items'] as $item) {
            DB::table('purchase_order_items')->insert([
                'purchase_order_id' => $poId, 'nama_produk' => $item['nama_produk'],
                'sku' => $item['sku'] ?? null, 'satuan' => $item['satuan'] ?? 'pcs',
                'qty' => $item['qty'] ?? 1, 'qty_diterima' => 0,
                'harga' => $item['harga'] ?? 0,
                'total' => ($item['qty'] ?? 1) * ($item['harga'] ?? 0),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        return response()->json(['ok' => true, 'no_po' => $noPo, 'id' => $poId], 201);
    }

    public function purchaseOrdersUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['status','status_bayar','dp','catatan','disetujui_oleh']);
        $data['updated_at'] = now();
        if (isset($data['disetujui_oleh'])) $data['disetujui_at'] = now();
        DB::table('purchase_orders')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function purchaseOrdersDestroy(int $id): JsonResponse
    {
        DB::table('purchase_order_items')->where('purchase_order_id', $id)->delete();
        DB::table('purchase_orders')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── CASH IN / CASH OUT ───────────────────────────────────────────────────

    public function cashIndex(Request $request): JsonResponse
    {
        $jenis = $request->query('jenis', '');
        $q = DB::table('cash_transactions');
        if ($jenis) $q->where('jenis', $jenis);
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) {
                $w->where('keterangan', 'ilike', "%$s%")->orWhere('no_transaksi', 'ilike', "%$s%")->orWhere('referensi', 'ilike', "%$s%");
            });
        }
        if ($from = $request->query('from')) $q->whereDate('tanggal', '>=', $from);
        if ($to = $request->query('to')) $q->whereDate('tanggal', '<=', $to);
        $total = $q->count();
        $sumMasuk = (clone $q)->where('jenis', 'masuk')->sum('jumlah');
        $sumKeluar = (clone $q)->where('jenis', 'keluar')->sum('jumlah');
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('tanggal')->orderByDesc('created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'sum_masuk' => (float)$sumMasuk, 'sum_keluar' => (float)$sumKeluar, 'saldo' => (float)($sumMasuk - $sumKeluar), 'page' => $page, 'per_page' => $perPage]);
    }

    public function cashStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'jenis'      => 'required|in:masuk,keluar',
            'kategori'   => 'nullable|string|max:50',
            'akun_kas'   => 'nullable|string|max:50',
            'tanggal'    => 'required|date',
            'jumlah'     => 'required|numeric|min:1',
            'metode_pembayaran' => 'nullable|string|max:30',
            'referensi'  => 'nullable|string|max:100',
            'keterangan' => 'nullable|string',
        ]);
        $prefix = $data['jenis'] === 'masuk' ? 'KM' : 'KK';
        $data['no_transaksi'] = $prefix . '-' . date('Ymd') . '-' . str_pad(DB::table('cash_transactions')->count() + 1, 4, '0', STR_PAD_LEFT);
        $data['dibuat_oleh'] = 'Admin';
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('cash_transactions')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function cashDestroy(int $id): JsonResponse
    {
        DB::table('cash_transactions')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── EXPENSES ─────────────────────────────────────────────────────────────

    public function expensesIndex(Request $request): JsonResponse
    {
        $q = DB::table('expenses');
        if ($s = $request->query('search')) $q->where('deskripsi', 'ilike', "%$s%")->orWhere('kategori', 'ilike', "%$s%");
        if ($from = $request->query('from')) $q->whereDate('tanggal', '>=', $from);
        if ($to = $request->query('to')) $q->whereDate('tanggal', '<=', $to);
        $total = $q->count();
        $totalNilai = $q->sum('jumlah');
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('tanggal')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'total_nilai' => (float)$totalNilai, 'page' => $page, 'per_page' => $perPage]);
    }

    public function expensesStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kategori'   => 'required|string|max:100',
            'tanggal'    => 'required|date',
            'jumlah'     => 'required|numeric|min:1',
            'metode_bayar' => 'nullable|string|max:30',
            'deskripsi'  => 'nullable|string',
        ]);
        $data['no_expense'] = 'EXP-' . date('Ymd') . '-' . str_pad(DB::table('expenses')->count() + 1, 4, '0', STR_PAD_LEFT);
        $data['dibuat_oleh'] = 'Admin';
        $data['status'] = 'Approved';
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('expenses')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function expensesDestroy(int $id): JsonResponse
    {
        DB::table('expenses')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── EMPLOYEES ────────────────────────────────────────────────────────────

    public function employeesIndex(Request $request): JsonResponse
    {
        $q = DB::table('employees');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) {
                $w->where('nama', 'ilike', "%$s%")->orWhere('nik', 'ilike', "%$s%")->orWhere('jabatan', 'ilike', "%$s%");
            });
        }
        if ($dep = $request->query('departemen')) $q->where('departemen', $dep);
        if ($status = $request->query('status')) $q->where('status', $status);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderBy('nama')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function employeesSummary(): JsonResponse
    {
        return response()->json([
            'total' => DB::table('employees')->count(),
            'aktif' => DB::table('employees')->where('status', 'Aktif')->count(),
            'nonaktif' => DB::table('employees')->where('status', '!=', 'Aktif')->count(),
            'departemen' => DB::table('employees')->selectRaw('departemen, count(*) as total')->groupBy('departemen')->get(),
        ]);
    }

    public function employeesStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nik'           => 'nullable|string|max:20',
            'nama'          => 'required|string|max:200',
            'jabatan'       => 'nullable|string|max:100',
            'departemen'    => 'nullable|string|max:100',
            'divisi'        => 'nullable|string|max:100',
            'telepon'       => 'nullable|string|max:30',
            'email'         => 'nullable|email',
            'alamat'        => 'nullable|string',
            'tanggal_masuk' => 'nullable|date',
            'gaji_pokok'    => 'nullable|numeric',
            'status'        => 'nullable|in:Aktif,Resign,Cuti Panjang',
            'jenis_kelamin' => 'nullable|in:L,P',
            'tanggal_lahir' => 'nullable|date',
        ]);
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('employees')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function employeesUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['nik','nama','jabatan','departemen','divisi','telepon','email','alamat','tanggal_masuk','gaji_pokok','status','jenis_kelamin','tanggal_lahir','no_rekening','nama_bank']);
        $data['updated_at'] = now();
        DB::table('employees')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function employeesDestroy(int $id): JsonResponse
    {
        DB::table('employees')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── ATTENDANCE ───────────────────────────────────────────────────────────

    public function attendanceIndex(Request $request): JsonResponse
    {
        $q = DB::table('attendance');
        if ($s = $request->query('search')) $q->where('nama_karyawan', 'ilike', "%$s%");
        if ($date = $request->query('tanggal')) $q->whereDate('tanggal', $date);
        if ($month = $request->query('bulan')) $q->whereRaw("to_char(tanggal, 'YYYY-MM') = ?", [$month]);
        $total = $q->count();
        $hadir = DB::table('attendance')->where('status', 'Hadir')->when($request->query('bulan'), fn($x, $m) => $x->whereRaw("to_char(tanggal, 'YYYY-MM') = ?", [$m]))->count();
        $perPage = (int)$request->query('per_page', 50);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('tanggal')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'hadir' => $hadir, 'page' => $page, 'per_page' => $perPage]);
    }

    public function attendanceStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama_karyawan' => 'required|string|max:100',
            'tanggal'       => 'required|date',
            'jam_masuk'     => 'nullable|string',
            'jam_keluar'    => 'nullable|string',
            'status'        => 'required|in:Hadir,Izin,Sakit,Alpa,Cuti',
            'keterangan'    => 'nullable|string',
            'lembur_jam'    => 'nullable|numeric',
        ]);
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('attendance')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function attendanceDestroy(int $id): JsonResponse
    {
        DB::table('attendance')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── RETURNS ──────────────────────────────────────────────────────────────

    public function returnsIndex(Request $request): JsonResponse
    {
        $q = DB::table('returns');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) {
                $w->where('no_retur', 'ilike', "%$s%")->orWhere('nama_customer', 'ilike', "%$s%");
            });
        }
        if ($status = $request->query('status')) $q->where('status', $status);
        $total = $q->count();
        $totalNilai = $q->sum('nilai_retur');
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'total_nilai' => (float)$totalNilai, 'page' => $page, 'per_page' => $perPage]);
    }

    public function returnsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'no_order'      => 'nullable|string',
            'nama_customer' => 'nullable|string|max:200',
            'tanggal'       => 'required|date',
            'alasan'        => 'nullable|string|max:200',
            'kondisi_barang'=> 'nullable|string|max:50',
            'tindakan'      => 'nullable|string|max:50',
            'nilai_retur'   => 'nullable|numeric',
            'keterangan'    => 'nullable|string',
        ]);
        $data['no_retur'] = 'RET-' . date('Ymd') . '-' . str_pad(DB::table('returns')->count() + 1, 4, '0', STR_PAD_LEFT);
        $data['status'] = 'Proses';
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('returns')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function returnsUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['status','tindakan','keterangan']);
        $data['updated_at'] = now();
        DB::table('returns')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function returnsDestroy(int $id): JsonResponse
    {
        DB::table('returns')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── PROMOS ───────────────────────────────────────────────────────────────

    public function promosIndex(Request $request): JsonResponse
    {
        $q = DB::table('promos');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) { $w->where('nama', 'ilike', "%$s%")->orWhere('kode', 'ilike', "%$s%"); });
        }
        if ($status = $request->query('status')) $q->where('status', $status);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function promosStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kode'          => 'required|string|max:30|unique:promos,kode',
            'nama'          => 'required|string|max:200',
            'jenis'         => 'required|in:persen,nominal,gratis_ongkir',
            'nilai'         => 'required|numeric',
            'min_transaksi' => 'nullable|numeric',
            'max_diskon'    => 'nullable|numeric',
            'mulai'         => 'nullable|date',
            'berakhir'      => 'nullable|date',
            'kuota'         => 'nullable|integer',
            'deskripsi'     => 'nullable|string',
        ]);
        $data['status'] = 'Aktif';
        $data['terpakai'] = 0;
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('promos')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function promosUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['nama','jenis','nilai','min_transaksi','max_diskon','mulai','berakhir','kuota','status','deskripsi']);
        $data['updated_at'] = now();
        DB::table('promos')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function promosDestroy(int $id): JsonResponse
    {
        DB::table('promos')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── STOCK MUTATIONS ──────────────────────────────────────────────────────

    public function stockMutationsIndex(Request $request): JsonResponse
    {
        $q = DB::table('stock_mutations');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) { $w->where('nama_produk', 'ilike', "%$s%")->orWhere('no_mutasi', 'ilike', "%$s%"); });
        }
        if ($jenis = $request->query('jenis')) $q->where('jenis', $jenis);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('tanggal')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function stockMutationsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'jenis'         => 'required|in:masuk,keluar,transfer,adjustment',
            'nama_produk'   => 'required|string|max:200',
            'sku'           => 'nullable|string|max:50',
            'gudang_asal'   => 'nullable|string|max:100',
            'gudang_tujuan' => 'nullable|string|max:100',
            'qty'           => 'required|numeric',
            'satuan'        => 'nullable|string|max:20',
            'tanggal'       => 'required|date',
            'referensi'     => 'nullable|string|max:100',
            'keterangan'    => 'nullable|string',
        ]);
        $data['no_mutasi'] = 'MUT-' . date('Ymd') . '-' . str_pad(DB::table('stock_mutations')->count() + 1, 4, '0', STR_PAD_LEFT);
        $data['dibuat_oleh'] = 'Admin';
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('stock_mutations')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function stockMutationsDestroy(int $id): JsonResponse
    {
        DB::table('stock_mutations')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── ANALYTICS / DASHBOARD ────────────────────────────────────────────────

    public function analyticsSummary(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        $revenueQuery = DB::table('orders')->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereNotIn('status_pengiriman', ['Dibatalkan']);
        $revenue = $revenueQuery->sum('total_harga');
        $orders = $revenueQuery->count();
        $expenses = DB::table('expenses')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');
        $cashIn = DB::table('cash_transactions')->where('jenis','masuk')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');
        $cashOut = DB::table('cash_transactions')->where('jenis','keluar')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');

        $dailyRevenue = DB::table('orders')
            ->selectRaw("DATE(created_at) as date, SUM(total_harga) as revenue, COUNT(*) as orders")
            ->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)
            ->whereNotIn('status_pengiriman', ['Dibatalkan'])
            ->groupBy('date')->orderBy('date')->get();

        $topProducts = DB::table('sale_items as si')
            ->join('orders as o', 'si.order_id', '=', 'o.id')
            ->selectRaw('si.nama_produk, SUM(si.qty) as total_qty, SUM(si.subtotal) as total_revenue')
            ->whereDate('o.created_at', '>=', $from)->whereDate('o.created_at', '<=', $to)
            ->whereNotIn('o.status_pengiriman', ['Dibatalkan'])
            ->groupBy('si.nama_produk')->orderByDesc('total_revenue')->limit(10)->get();

        return response()->json([
            'revenue' => (float)$revenue,
            'orders' => (int)$orders,
            'expenses' => (float)$expenses,
            'profit' => (float)($revenue - $expenses),
            'cash_in' => (float)$cashIn,
            'cash_out' => (float)$cashOut,
            'saldo_kas' => (float)($cashIn - $cashOut),
            'daily_revenue' => $dailyRevenue,
            'top_products' => $topProducts,
        ]);
    }

    // ─── PROFIT / LOSS ────────────────────────────────────────────────────────

    public function profitLoss(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        $revenue = DB::table('orders')->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereNotIn('status_pengiriman', ['Dibatalkan'])->sum('total_harga');
        $cogs = DB::table('sale_items as si')->join('orders as o', 'si.order_id', '=', 'o.id')
            ->whereDate('o.created_at', '>=', $from)->whereDate('o.created_at', '<=', $to)->sum('si.hpp');
        $expenses = DB::table('expenses')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');
        $grossProfit = $revenue - $cogs;
        $netProfit = $grossProfit - $expenses;

        $expenseByCategory = DB::table('expenses')->selectRaw('kategori, SUM(jumlah) as total')
            ->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->groupBy('kategori')->get();

        return response()->json([
            'periode' => ['from' => $from, 'to' => $to],
            'pendapatan' => (float)$revenue,
            'hpp' => (float)$cogs,
            'laba_kotor' => (float)$grossProfit,
            'biaya_operasional' => (float)$expenses,
            'laba_bersih' => (float)$netProfit,
            'margin_kotor' => $revenue > 0 ? round(($grossProfit / $revenue) * 100, 2) : 0,
            'margin_bersih' => $revenue > 0 ? round(($netProfit / $revenue) * 100, 2) : 0,
            'detail_biaya' => $expenseByCategory,
        ]);
    }

    // ─── QUOTATIONS ───────────────────────────────────────────────────────────

    public function quotationsIndex(Request $request): JsonResponse
    {
        $q = DB::table('quotations');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) { $w->where('no_quotation', 'ilike', "%$s%")->orWhere('nama_customer', 'ilike', "%$s%"); });
        }
        if ($status = $request->query('status')) $q->where('status', $status);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function quotationsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama_customer'    => 'required|string|max:200',
            'telepon_customer' => 'nullable|string|max:30',
            'tanggal'          => 'required|date',
            'valid_until'      => 'nullable|date',
            'catatan'          => 'nullable|string',
            'items'            => 'required|array|min:1',
        ]);
        $noQ = 'QUO-' . date('Ymd') . '-' . str_pad(DB::table('quotations')->count() + 1, 4, '0', STR_PAD_LEFT);
        $subtotal = collect($data['items'])->sum(fn($i) => ($i['qty'] ?? 1) * ($i['harga'] ?? 0));
        $id = DB::table('quotations')->insertGetId([
            'no_quotation' => $noQ, 'nama_customer' => $data['nama_customer'],
            'telepon_customer' => $data['telepon_customer'] ?? null,
            'tanggal' => $data['tanggal'], 'valid_until' => $data['valid_until'] ?? null,
            'subtotal' => $subtotal, 'total' => $subtotal, 'status' => 'Dikirim',
            'catatan' => $data['catatan'] ?? null, 'dibuat_oleh' => 'Admin',
            'created_at' => now(), 'updated_at' => now(),
        ]);
        foreach ($data['items'] as $item) {
            DB::table('quotation_items')->insert([
                'quotation_id' => $id, 'nama_produk' => $item['nama_produk'],
                'satuan' => $item['satuan'] ?? 'pcs', 'qty' => $item['qty'] ?? 1,
                'harga' => $item['harga'] ?? 0, 'total' => ($item['qty'] ?? 1) * ($item['harga'] ?? 0),
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        return response()->json(['ok' => true, 'no_quotation' => $noQ, 'id' => $id], 201);
    }

    public function quotationsDestroy(int $id): JsonResponse
    {
        DB::table('quotation_items')->where('quotation_id', $id)->delete();
        DB::table('quotations')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── PAYROLL ──────────────────────────────────────────────────────────────

    public function payrollIndex(Request $request): JsonResponse
    {
        $q = DB::table('payrolls');
        if ($s = $request->query('search')) $q->where('nama_karyawan', 'ilike', "%$s%");
        if ($periode = $request->query('periode')) $q->where('periode', $periode);
        $total = $q->count();
        $totalGaji = $q->sum('total_gaji');
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('periode')->orderBy('nama_karyawan')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'total_gaji' => (float)$totalGaji, 'page' => $page, 'per_page' => $perPage]);
    }

    public function payrollStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama_karyawan' => 'required|string|max:100',
            'periode'       => 'required|string|max:10',
            'gaji_pokok'    => 'required|numeric',
            'tunjangan'     => 'nullable|numeric',
            'insentif'      => 'nullable|numeric',
            'lembur'        => 'nullable|numeric',
            'potongan'      => 'nullable|numeric',
        ]);
        $data['tunjangan'] = $data['tunjangan'] ?? 0;
        $data['insentif'] = $data['insentif'] ?? 0;
        $data['lembur'] = $data['lembur'] ?? 0;
        $data['potongan'] = $data['potongan'] ?? 0;
        $data['bpjs_tk'] = round($data['gaji_pokok'] * 0.02);
        $data['bpjs_kes'] = round($data['gaji_pokok'] * 0.01);
        $data['pph21'] = 0;
        $data['total_gaji'] = $data['gaji_pokok'] + $data['tunjangan'] + $data['insentif'] + $data['lembur'] - $data['potongan'] - $data['bpjs_tk'] - $data['bpjs_kes'];
        $data['status'] = 'Draft';
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('payrolls')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function payrollUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['status','tanggal_bayar','catatan']);
        $data['updated_at'] = now();
        DB::table('payrolls')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function payrollDestroy(int $id): JsonResponse
    {
        DB::table('payrolls')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── DELIVERY PROOFS ──────────────────────────────────────────────────────

    public function deliveryProofsIndex(Request $request): JsonResponse
    {
        $q = DB::table('delivery_proofs');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) { $w->where('no_order', 'ilike', "%$s%")->orWhere('nama_customer', 'ilike', "%$s%")->orWhere('driver', 'ilike', "%$s%"); });
        }
        if ($status = $request->query('status')) $q->where('status', $status);
        $total = $q->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('tanggal_kirim')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'page' => $page, 'per_page' => $perPage]);
    }

    public function deliveryProofsUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['status','foto_bukti','catatan','lat','lng']);
        if (isset($data['status']) && $data['status'] === 'Terkirim') {
            $data['diterima_at'] = now();
        }
        $data['updated_at'] = now();
        DB::table('delivery_proofs')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    // ─── WA LOGS ──────────────────────────────────────────────────────────────

    public function waLogsIndex(Request $request): JsonResponse
    {
        $q = DB::table('wa_notification_logs');
        if ($s = $request->query('search')) $q->where('tujuan', 'ilike', "%$s%")->orWhere('tipe', 'ilike', "%$s%");
        $total = $q->count();
        $terkirim = DB::table('wa_notification_logs')->where('status', 'Terkirim')->count();
        $perPage = (int)$request->query('per_page', 20);
        $page = (int)$request->query('page', 1);
        $rows = $q->orderByDesc('created_at')->skip(($page-1)*$perPage)->take($perPage)->get();
        return response()->json(['data' => $rows, 'total' => $total, 'terkirim' => $terkirim, 'gagal' => $total - $terkirim, 'page' => $page, 'per_page' => $perPage]);
    }

    // ─── CHART OF ACCOUNTS ────────────────────────────────────────────────────

    public function coaIndex(Request $request): JsonResponse
    {
        $q = DB::table('chart_of_accounts');
        if ($s = $request->query('search')) {
            $q->where(function($w) use ($s) { $w->where('kode', 'ilike', "%$s%")->orWhere('nama', 'ilike', "%$s%"); });
        }
        if ($jenis = $request->query('jenis')) $q->where('jenis', $jenis);
        $total = $q->count();
        $rows = $q->orderBy('kode')->get();

        // Seed default COA if empty
        if ($total === 0) {
            $defaultCoa = [
                ['kode' => '1-0000', 'nama' => 'AKTIVA', 'jenis' => 'Aktiva', 'sub_jenis' => null],
                ['kode' => '1-1000', 'nama' => 'Kas', 'jenis' => 'Aktiva', 'sub_jenis' => 'Kas & Bank'],
                ['kode' => '1-1100', 'nama' => 'Kas Kecil', 'jenis' => 'Aktiva', 'sub_jenis' => 'Kas & Bank'],
                ['kode' => '1-1200', 'nama' => 'Bank BCA', 'jenis' => 'Aktiva', 'sub_jenis' => 'Kas & Bank'],
                ['kode' => '1-2000', 'nama' => 'Piutang Usaha', 'jenis' => 'Aktiva', 'sub_jenis' => 'Piutang'],
                ['kode' => '1-3000', 'nama' => 'Persediaan Barang', 'jenis' => 'Aktiva', 'sub_jenis' => 'Persediaan'],
                ['kode' => '2-0000', 'nama' => 'KEWAJIBAN', 'jenis' => 'Pasiva', 'sub_jenis' => null],
                ['kode' => '2-1000', 'nama' => 'Hutang Usaha', 'jenis' => 'Pasiva', 'sub_jenis' => 'Hutang Jangka Pendek'],
                ['kode' => '2-2000', 'nama' => 'Hutang PPN', 'jenis' => 'Pasiva', 'sub_jenis' => 'Hutang Pajak'],
                ['kode' => '3-0000', 'nama' => 'EKUITAS', 'jenis' => 'Ekuitas', 'sub_jenis' => null],
                ['kode' => '3-1000', 'nama' => 'Modal', 'jenis' => 'Ekuitas', 'sub_jenis' => 'Modal'],
                ['kode' => '4-0000', 'nama' => 'PENDAPATAN', 'jenis' => 'Pendapatan', 'sub_jenis' => null],
                ['kode' => '4-1000', 'nama' => 'Penjualan', 'jenis' => 'Pendapatan', 'sub_jenis' => 'Pendapatan Usaha'],
                ['kode' => '5-0000', 'nama' => 'BEBAN', 'jenis' => 'Biaya', 'sub_jenis' => null],
                ['kode' => '5-1000', 'nama' => 'HPP', 'jenis' => 'Biaya', 'sub_jenis' => 'Beban Pokok'],
                ['kode' => '5-2000', 'nama' => 'Biaya Gaji', 'jenis' => 'Biaya', 'sub_jenis' => 'Beban Operasional'],
                ['kode' => '5-3000', 'nama' => 'Biaya Transportasi', 'jenis' => 'Biaya', 'sub_jenis' => 'Beban Operasional'],
                ['kode' => '5-4000', 'nama' => 'Biaya Utilitas', 'jenis' => 'Biaya', 'sub_jenis' => 'Beban Operasional'],
            ];
            foreach ($defaultCoa as $row) {
                $row['is_active'] = true;
                $row['saldo_awal'] = 0;
                $row['created_at'] = $row['updated_at'] = now();
                DB::table('chart_of_accounts')->insert($row);
            }
            $rows = DB::table('chart_of_accounts')->orderBy('kode')->get();
            $total = count($rows);
        }

        return response()->json(['data' => $rows, 'total' => $total]);
    }

    public function coaStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kode'      => 'required|string|max:20|unique:chart_of_accounts,kode',
            'nama'      => 'required|string|max:150',
            'jenis'     => 'required|in:Aktiva,Pasiva,Pendapatan,Biaya,Ekuitas',
            'sub_jenis' => 'nullable|string|max:50',
            'saldo_awal'=> 'nullable|numeric',
        ]);
        $data['is_active'] = true;
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('chart_of_accounts')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function coaUpdate(Request $request, int $id): JsonResponse
    {
        $data = $request->only(['nama','jenis','sub_jenis','saldo_awal','is_active']);
        $data['updated_at'] = now();
        DB::table('chart_of_accounts')->where('id', $id)->update($data);
        return response()->json(['ok' => true]);
    }

    public function coaDestroy(int $id): JsonResponse
    {
        DB::table('chart_of_accounts')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── REPORT: SALES ────────────────────────────────────────────────────────

    public function reportSales(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        $summary = DB::table('orders')
            ->selectRaw('COUNT(*) as total_order, SUM(total_harga) as total_revenue, AVG(total_harga) as avg_order')
            ->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)
            ->whereNotIn('status_pengiriman', ['Dibatalkan'])->first();

        $byStatus = DB::table('orders')
            ->selectRaw('status_pengiriman as status, COUNT(*) as total')
            ->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)
            ->groupBy('status_pengiriman')->get();

        $topSales = DB::table('orders')
            ->selectRaw('nama_sales, COUNT(*) as total_order, SUM(total_harga) as total_revenue')
            ->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)
            ->whereNotNull('nama_sales')->whereNotIn('status_pengiriman', ['Dibatalkan'])
            ->groupBy('nama_sales')->orderByDesc('total_revenue')->limit(10)->get();

        return response()->json([
            'periode' => ['from' => $from, 'to' => $to],
            'summary' => $summary,
            'by_status' => $byStatus,
            'top_sales' => $topSales,
        ]);
    }

    // ─── REPORT: FINANCE ──────────────────────────────────────────────────────

    public function reportFinance(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        $revenue = DB::table('orders')->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)->whereNotIn('status_pengiriman', ['Dibatalkan'])->sum('total_harga');
        $expenses = DB::table('expenses')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');
        $cashIn = DB::table('cash_transactions')->where('jenis','masuk')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');
        $cashOut = DB::table('cash_transactions')->where('jenis','keluar')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('jumlah');
        $purchasesTotal = DB::table('purchase_orders')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->sum('total');

        $expenseByCategory = DB::table('expenses')->selectRaw('kategori, SUM(jumlah) as total')->whereDate('tanggal', '>=', $from)->whereDate('tanggal', '<=', $to)->groupBy('kategori')->orderByDesc('total')->get();

        return response()->json([
            'periode' => ['from' => $from, 'to' => $to],
            'pendapatan' => (float)$revenue,
            'beban_operasional' => (float)$expenses,
            'kas_masuk' => (float)$cashIn,
            'kas_keluar' => (float)$cashOut,
            'saldo_kas' => (float)($cashIn - $cashOut),
            'total_pembelian' => (float)$purchasesTotal,
            'laba_bersih' => (float)($revenue - $expenses),
            'detail_biaya' => $expenseByCategory,
        ]);
    }

    // ─── REPORT: DRIVER ───────────────────────────────────────────────────────

    public function reportDriver(Request $request): JsonResponse
    {
        $from = $request->query('from', now()->startOfMonth()->toDateString());
        $to = $request->query('to', now()->toDateString());

        $perDriver = DB::table('orders')
            ->selectRaw('nama_driver, COUNT(*) as total_order, SUM(CASE WHEN status_pengiriman = \'Terkirim\' THEN 1 ELSE 0 END) as terkirim, SUM(CASE WHEN status_pengiriman = \'Terlambat\' THEN 1 ELSE 0 END) as terlambat')
            ->whereDate('created_at', '>=', $from)->whereDate('created_at', '<=', $to)
            ->whereNotNull('nama_driver')
            ->groupBy('nama_driver')->orderByDesc('total_order')->get();

        return response()->json([
            'periode' => ['from' => $from, 'to' => $to],
            'per_driver' => $perDriver,
            'total_pengiriman' => $perDriver->sum('total_order'),
        ]);
    }

    // ─── SALES TARGETS ────────────────────────────────────────────────────────

    public function salesTargetsIndex(Request $request): JsonResponse
    {
        $q = DB::table('sales_targets');
        if ($periode = $request->query('periode')) $q->where('periode', $periode);
        $rows = $q->orderByDesc('periode')->orderBy('nama_sales')->get();
        return response()->json(['data' => $rows, 'total' => $rows->count()]);
    }

    public function salesTargetsStore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama_sales'     => 'required|string|max:100',
            'periode'        => 'required|string|max:10',
            'target_revenue' => 'required|numeric',
            'target_order'   => 'nullable|integer',
        ]);
        $data['realisasi_revenue'] = 0;
        $data['realisasi_order'] = 0;
        $data['status'] = 'Berjalan';
        $data['created_at'] = $data['updated_at'] = now();
        $id = DB::table('sales_targets')->insertGetId($data);
        return response()->json(['ok' => true, 'id' => $id], 201);
    }

    public function salesTargetsDestroy(int $id): JsonResponse
    {
        DB::table('sales_targets')->where('id', $id)->delete();
        return response()->json(['ok' => true]);
    }

    // ─── GENERIC MODULE API ────────────────────────────────────────────────────
    // Handles all remaining ERP modules via erp_module_data table.

    public function genericIndex(Request $request, string $module): JsonResponse
    {
        $perPage = min((int) $request->query('per_page', 20), 200);
        $search  = $request->query('search', '');
        $filter  = $request->query('filter', '');
        $page    = max(1, (int) $request->query('page', 1));
        $table   = $this->moduleTable($module);

        if ($table) {
            $q = DB::table($table);
            $q = $this->applySearchAndFilter($q, $table, $search, $filter);
            $total = $q->count();
            $rows = $q->orderByDesc(Schema::hasColumn($table, 'created_at') ? 'created_at' : 'id')
                ->skip(($page - 1) * $perPage)
                ->take($perPage)
                ->get();

            return response()->json([
                'data'     => $rows,
                'total'    => $total,
                'page'     => $page,
                'per_page' => $perPage,
            ]);
        }

        if (!Schema::hasTable('erp_module_data')) {
            return response()->json(['data' => [], 'total' => 0, 'page' => 1, 'per_page' => $perPage]);
        }

        $q = DB::table('erp_module_data')->where('module', $module);
        if ($search) {
            $q->whereRaw("data::text ilike ?", ["%{$search}%"]);
        }
        if ($filter) {
            $q->whereRaw("data->>'status' = ?", [$filter]);
        }

        $total = $q->count();
        $rows  = $q->orderByDesc('created_at')
                   ->skip(($page - 1) * $perPage)
                   ->take($perPage)
                   ->get()
                   ->map(function ($r) {
                       $data = is_array($r->data) ? $r->data : (json_decode($r->data, true) ?? []);
                       $data['id'] = $r->id;
                       $data['created_at'] = $r->created_at;
                       $data['updated_at'] = $r->updated_at;
                       return $data;
                   });

        return response()->json([
            'data'     => $rows,
            'total'    => $total,
            'page'     => $page,
            'per_page' => $perPage,
        ]);
    }

    public function genericStore(Request $request, string $module): JsonResponse
    {
        $table = $this->moduleTable($module);
        $data  = $request->except(['_token', '_method']);

        if ($table) {
            if (Schema::hasColumn($table, 'created_at')) {
                $data['created_at'] = now();
                $data['updated_at'] = now();
            }
            $id = DB::table($table)->insertGetId($data);
            $record = DB::table($table)->where('id', $id)->first();
            return response()->json(['data' => $record], 201);
        }

        if (!Schema::hasTable('erp_module_data')) {
            return response()->json(['data' => array_merge($data, ['id' => rand(1000, 9999)])], 201);
        }

        $id = DB::table('erp_module_data')->insertGetId([
            'module'     => $module,
            'data'       => json_encode($data),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['data' => array_merge($data, ['id' => $id])], 201);
    }

    public function genericUpdate(Request $request, string $module, int $id): JsonResponse
    {
        $table = $this->moduleTable($module);
        $data  = $request->except(['_token', '_method', 'id']);

        if ($table) {
            if (Schema::hasColumn($table, 'updated_at')) {
                $data['updated_at'] = now();
            }
            DB::table($table)->where('id', $id)->update($data);
            $record = DB::table($table)->where('id', $id)->first();
            return response()->json(['data' => $record]);
        }

        if (!Schema::hasTable('erp_module_data')) {
            return response()->json(['data' => array_merge($data, ['id' => $id])]);
        }

        DB::table('erp_module_data')
            ->where('id', $id)
            ->where('module', $module)
            ->update(['data' => json_encode($data), 'updated_at' => now()]);

        return response()->json(['data' => array_merge($data, ['id' => $id])]);
    }

    public function genericDestroy(string $module, int $id): JsonResponse
    {
        $table = $this->moduleTable($module);
        if ($table) {
            DB::table($table)->where('id', $id)->delete();
            return response()->json(['message' => 'Deleted']);
        }

        if (Schema::hasTable('erp_module_data')) {
            DB::table('erp_module_data')->where('id', $id)->where('module', $module)->delete();
        }
        return response()->json(['message' => 'Deleted']);
    }
}

