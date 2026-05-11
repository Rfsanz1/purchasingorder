<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

use App\Models\ErpEmployee;
use App\Models\ErpAttendance;
use App\Models\ErpPayroll;
use App\Models\ErpBranch;
use App\Models\ErpSupplier;
use App\Models\ErpPurchaseOrder;
use App\Models\ErpPurchaseOrderItem;
use App\Models\ErpWarehouse;
use App\Models\ErpStockMovement;
use App\Models\ErpCashTransaction;
use App\Models\ErpBankAccount;
use App\Models\ErpBankTransaction;
use App\Models\ErpChartOfAccount;
use App\Models\ErpJournalEntry;
use App\Models\ErpJournalEntryLine;
use App\Models\ErpServiceTicket;
use App\Models\ErpDelivery;
use App\Models\ErpRole;
use App\Models\ErpSalesTarget;
use App\Models\ErpQuotation;
use App\Models\Order;
use App\Models\Customer;
use App\Models\Product;

class ErpApiController extends Controller
{
    // ─── ANALYTICS ──────────────────────────────────────────────────────────────

    public function analyticsDashboard(Request $req)
    {
        $period = $req->get('period', 'month');
        $now = Carbon::now();

        $startDate = match($period) {
            'week'  => $now->copy()->startOfWeek(),
            'month' => $now->copy()->startOfMonth(),
            'year'  => $now->copy()->startOfYear(),
            default => $now->copy()->startOfMonth(),
        };

        // Revenue from orders
        $revenue = Order::where('created_at', '>=', $startDate)->sum('total_harga') ?: 0;
        $prevStart = $startDate->copy()->sub($startDate->diff($now));
        $prevRevenue = Order::whereBetween('created_at', [$prevStart, $startDate])->sum('total_harga') ?: 0;

        // Orders count
        $orders = Order::where('created_at', '>=', $startDate)->count();

        // Customers
        $customers = Customer::where('created_at', '>=', $startDate)->count();
        $totalCustomers = Customer::count();

        // Products
        $totalProducts = Product::count();

        // Monthly trend (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = $now->copy()->subMonths($i);
            $monthlyTrend[] = [
                'label'   => $m->format('M'),
                'revenue' => (float)(Order::whereYear('created_at', $m->year)->whereMonth('created_at', $m->month)->sum('total_harga') ?: 0),
                'orders'  => Order::whereYear('created_at', $m->year)->whereMonth('created_at', $m->month)->count(),
            ];
        }

        // Status breakdown
        $statusBreakdown = Order::select('status', DB::raw('count(*) as total'))
            ->where('created_at', '>=', $startDate)
            ->groupBy('status')->pluck('total', 'status');

        // Top sales
        $topSales = Order::select('nama_sales', DB::raw('count(*) as orders'), DB::raw('sum(total_harga) as revenue'))
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('nama_sales')
            ->groupBy('nama_sales')
            ->orderByDesc('revenue')
            ->limit(5)->get();

        return response()->json([
            'revenue'         => (float)$revenue,
            'prev_revenue'    => (float)$prevRevenue,
            'revenue_growth'  => $prevRevenue > 0 ? round((($revenue - $prevRevenue) / $prevRevenue) * 100, 1) : 0,
            'orders'          => $orders,
            'customers'       => $customers,
            'total_customers' => $totalCustomers,
            'total_products'  => $totalProducts,
            'monthly_trend'   => $monthlyTrend,
            'status_breakdown'=> $statusBreakdown,
            'top_sales'       => $topSales,
        ]);
    }

    public function multiBranchAnalytics(Request $req)
    {
        $branches = ErpBranch::all();
        $period = $req->get('period', 'month');
        $startDate = $period === 'year' ? Carbon::now()->startOfYear() : Carbon::now()->startOfMonth();

        $data = $branches->map(function ($b) use ($startDate) {
            $employees = ErpEmployee::where('branch_id', $b->id)->count();
            $warehouses = ErpWarehouse::where('branch_id', $b->id)->count();
            return [
                'id'         => $b->id,
                'nama'       => $b->nama,
                'kode'       => $b->kode,
                'kota'       => $b->kota,
                'employees'  => $employees,
                'warehouses' => $warehouses,
                'is_active'  => $b->is_active,
            ];
        });

        $total_branches = $branches->count();
        $active_branches = $branches->where('is_active', true)->count();
        $total_employees = ErpEmployee::count();
        $total_warehouses = ErpWarehouse::count();

        return response()->json(compact('data', 'total_branches', 'active_branches', 'total_employees', 'total_warehouses'));
    }

    // ─── HRD: EMPLOYEES ─────────────────────────────────────────────────────────

    public function employees(Request $req)
    {
        $q = ErpEmployee::with('branch');
        if ($req->search) $q->where('nama', 'ilike', "%{$req->search}%")->orWhere('nik', 'ilike', "%{$req->search}%");
        if ($req->status)      $q->where('status', $req->status);
        if ($req->departemen)  $q->where('departemen', $req->departemen);
        $perPage = $req->get('per_page', 15);
        $data = $q->latest()->paginate($perPage);

        $stats = [
            'total'      => ErpEmployee::count(),
            'aktif'      => ErpEmployee::where('status', 'aktif')->count(),
            'non_aktif'  => ErpEmployee::where('status', 'non-aktif')->count(),
            'resign'     => ErpEmployee::where('status', 'resign')->count(),
            'departemen' => ErpEmployee::select('departemen')->distinct()->whereNotNull('departemen')->pluck('departemen'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeEmployee(Request $req)
    {
        $req->validate(['nama' => 'required', 'nik' => 'required|unique:erp_employees,nik']);
        $emp = ErpEmployee::create($req->all());
        return response()->json(['success' => true, 'data' => $emp->load('branch')], 201);
    }

    public function updateEmployee(Request $req, $id)
    {
        $emp = ErpEmployee::findOrFail($id);
        $req->validate(['nama' => 'required', 'nik' => 'required|unique:erp_employees,nik,'.$id]);
        $emp->update($req->all());
        return response()->json(['success' => true, 'data' => $emp->load('branch')]);
    }

    public function deleteEmployee($id)
    {
        ErpEmployee::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── HRD: ATTENDANCE ─────────────────────────────────────────────────────────

    public function attendance(Request $req)
    {
        $q = ErpAttendance::with('employee');
        if ($req->search)      $q->whereHas('employee', fn($e) => $e->where('nama', 'ilike', "%{$req->search}%"));
        if ($req->tanggal)     $q->whereDate('tanggal', $req->tanggal);
        if ($req->status)      $q->where('status', $req->status);
        if ($req->month)       $q->whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$req->month]);
        $data = $q->latest('tanggal')->paginate($req->get('per_page', 20));

        $today = now()->toDateString();
        $thisMonth = now()->format('Y-m');
        $stats = [
            'hadir_hari_ini'  => ErpAttendance::whereDate('tanggal', $today)->where('status', 'hadir')->count(),
            'izin_hari_ini'   => ErpAttendance::whereDate('tanggal', $today)->whereIn('status', ['izin','sakit'])->count(),
            'total_karyawan'  => ErpEmployee::where('status', 'aktif')->count(),
            'hadir_bulan_ini' => ErpAttendance::whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$thisMonth])->where('status', 'hadir')->count(),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeAttendance(Request $req)
    {
        $req->validate(['employee_id' => 'required', 'tanggal' => 'required|date', 'status' => 'required']);
        $att = ErpAttendance::updateOrCreate(
            ['employee_id' => $req->employee_id, 'tanggal' => $req->tanggal],
            $req->only(['jam_masuk', 'jam_keluar', 'status', 'overtime_hours', 'keterangan'])
        );
        return response()->json(['success' => true, 'data' => $att->load('employee')], 201);
    }

    public function deleteAttendance($id)
    {
        ErpAttendance::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── HRD: PAYROLL ────────────────────────────────────────────────────────────

    public function payroll(Request $req)
    {
        $q = ErpPayroll::with('employee');
        if ($req->periode) $q->where('periode', $req->periode);
        if ($req->status)  $q->where('status', $req->status);
        if ($req->search)  $q->whereHas('employee', fn($e) => $e->where('nama', 'ilike', "%{$req->search}%"));
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $thisMonth = now()->format('Y-m');
        $stats = [
            'total_gaji_bulan_ini' => ErpPayroll::where('periode', $thisMonth)->sum('total_gaji'),
            'jumlah_karyawan'      => ErpPayroll::where('periode', $thisMonth)->count(),
            'sudah_dibayar'        => ErpPayroll::where('periode', $thisMonth)->where('status', 'paid')->count(),
            'belum_dibayar'        => ErpPayroll::where('periode', $thisMonth)->where('status', '!=', 'paid')->count(),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storePayroll(Request $req)
    {
        $req->validate(['employee_id' => 'required', 'periode' => 'required']);
        $gaji_pokok = $req->gaji_pokok ?? 0;
        $tunjangan  = $req->tunjangan ?? 0;
        $lembur     = $req->lembur ?? 0;
        $bonus      = $req->bonus ?? 0;
        $potongan   = $req->potongan ?? 0;
        $pph21      = $req->pph21 ?? 0;
        $total_gaji = ($gaji_pokok + $tunjangan + $lembur + $bonus) - $potongan - $pph21;

        $payroll = ErpPayroll::updateOrCreate(
            ['employee_id' => $req->employee_id, 'periode' => $req->periode],
            array_merge($req->all(), compact('total_gaji'))
        );
        return response()->json(['success' => true, 'data' => $payroll->load('employee')], 201);
    }

    public function updatePayrollStatus(Request $req, $id)
    {
        $payroll = ErpPayroll::findOrFail($id);
        $payroll->update(['status' => $req->status, 'tanggal_bayar' => $req->tanggal_bayar]);
        return response()->json(['success' => true, 'data' => $payroll]);
    }

    // ─── PURCHASE: SUPPLIERS ─────────────────────────────────────────────────────

    public function suppliers(Request $req)
    {
        $q = ErpSupplier::query();
        if ($req->search) $q->where(function($w) use ($req) {
            $w->where('nama', 'ilike', "%{$req->search}%")->orWhere('kode', 'ilike', "%{$req->search}%");
        });
        if ($req->status) $q->where('status', $req->status);
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $stats = [
            'total'      => ErpSupplier::count(),
            'aktif'      => ErpSupplier::where('status', 'aktif')->count(),
            'total_hutang' => ErpSupplier::sum('hutang'),
            'total_pembelian' => ErpSupplier::sum('total_pembelian'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeSupplier(Request $req)
    {
        $req->validate(['nama' => 'required']);
        if (!$req->kode) {
            $last = ErpSupplier::max('id') ?: 0;
            $req->merge(['kode' => 'SUP-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT)]);
        }
        $sup = ErpSupplier::create($req->all());
        return response()->json(['success' => true, 'data' => $sup], 201);
    }

    public function updateSupplier(Request $req, $id)
    {
        $sup = ErpSupplier::findOrFail($id);
        $sup->update($req->all());
        return response()->json(['success' => true, 'data' => $sup]);
    }

    public function deleteSupplier($id)
    {
        ErpSupplier::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── PURCHASE: PURCHASE ORDERS ───────────────────────────────────────────────

    public function purchaseOrders(Request $req)
    {
        $q = ErpPurchaseOrder::with('supplier');
        if ($req->search)  $q->where('nomor', 'ilike', "%{$req->search}%");
        if ($req->status)  $q->where('status', $req->status);
        if ($req->supplier_id) $q->where('supplier_id', $req->supplier_id);
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $stats = [
            'total'          => ErpPurchaseOrder::count(),
            'draft'          => ErpPurchaseOrder::where('status', 'draft')->count(),
            'pending'        => ErpPurchaseOrder::whereIn('status', ['sent','partial'])->count(),
            'selesai'        => ErpPurchaseOrder::where('status', 'received')->count(),
            'total_nilai'    => ErpPurchaseOrder::sum('total'),
            'belum_dibayar'  => ErpPurchaseOrder::where('status_bayar', 'belum')->sum('total'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storePurchaseOrder(Request $req)
    {
        $req->validate(['supplier_id' => 'required', 'tanggal' => 'required']);
        $last = ErpPurchaseOrder::max('id') ?: 0;
        $nomor = 'PO-' . now()->format('Ymd') . '-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT);

        $subtotal = collect($req->items ?? [])->sum('subtotal');
        $ppn = $req->ppn_persen ? ($subtotal * $req->ppn_persen / 100) : 0;
        $total = $subtotal - ($req->diskon ?? 0) + $ppn;

        $po = ErpPurchaseOrder::create(array_merge($req->except('items'), [
            'nomor' => $nomor, 'subtotal' => $subtotal, 'ppn' => $ppn, 'total' => $total,
        ]));

        foreach ($req->items ?? [] as $item) {
            $po->items()->create($item);
        }

        // Update supplier total
        ErpSupplier::where('id', $req->supplier_id)->increment('total_pembelian', $total);

        return response()->json(['success' => true, 'data' => $po->load(['supplier', 'items'])], 201);
    }

    public function updatePurchaseOrderStatus(Request $req, $id)
    {
        $po = ErpPurchaseOrder::findOrFail($id);
        $po->update($req->only(['status', 'status_bayar', 'dibayar']));
        return response()->json(['success' => true, 'data' => $po]);
    }

    public function deletePurchaseOrder($id)
    {
        ErpPurchaseOrder::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── INVENTORY: WAREHOUSES ───────────────────────────────────────────────────

    public function warehouses(Request $req)
    {
        $q = ErpWarehouse::with('branch');
        if ($req->search) $q->where('nama', 'ilike', "%{$req->search}%");
        if ($req->is_active !== null) $q->where('is_active', $req->is_active);
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $stats = [
            'total'   => ErpWarehouse::count(),
            'aktif'   => ErpWarehouse::where('is_active', true)->count(),
            'cabang'  => ErpBranch::count(),
            'produk'  => Product::count(),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeWarehouse(Request $req)
    {
        $req->validate(['nama' => 'required']);
        if (!$req->kode) {
            $last = ErpWarehouse::max('id') ?: 0;
            $req->merge(['kode' => 'WH-' . str_pad($last + 1, 3, '0', STR_PAD_LEFT)]);
        }
        $wh = ErpWarehouse::create($req->all());
        return response()->json(['success' => true, 'data' => $wh->load('branch')], 201);
    }

    public function updateWarehouse(Request $req, $id)
    {
        $wh = ErpWarehouse::findOrFail($id);
        $wh->update($req->all());
        return response()->json(['success' => true, 'data' => $wh->load('branch')]);
    }

    public function deleteWarehouse($id)
    {
        ErpWarehouse::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── INVENTORY: STOCK MOVEMENTS ──────────────────────────────────────────────

    public function stockMovements(Request $req)
    {
        $q = ErpStockMovement::with('warehouse');
        if ($req->search)    $q->where('produk_nama', 'ilike', "%{$req->search}%");
        if ($req->tipe)      $q->where('tipe', $req->tipe);
        if ($req->warehouse_id) $q->where('warehouse_id', $req->warehouse_id);
        $data = $q->latest()->paginate($req->get('per_page', 20));

        $stats = [
            'total_masuk'  => ErpStockMovement::where('tipe', 'masuk')->sum('qty'),
            'total_keluar' => ErpStockMovement::where('tipe', 'keluar')->sum('qty'),
            'hari_ini'     => ErpStockMovement::whereDate('created_at', today())->count(),
            'bulan_ini'    => ErpStockMovement::whereMonth('created_at', now()->month)->count(),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeStockMovement(Request $req)
    {
        $req->validate(['produk_nama' => 'required', 'tipe' => 'required', 'qty' => 'required']);
        $mv = ErpStockMovement::create($req->all());
        return response()->json(['success' => true, 'data' => $mv], 201);
    }

    // ─── FINANCE: CASH TRANSACTIONS ──────────────────────────────────────────────

    public function cashTransactions(Request $req)
    {
        $q = ErpCashTransaction::query();
        if ($req->tipe)     $q->where('tipe', $req->tipe);
        if ($req->kas_type) $q->where('kas_type', $req->kas_type);
        if ($req->search)   $q->where('keterangan', 'ilike', "%{$req->search}%");
        if ($req->bulan)    $q->whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$req->bulan]);
        $data = $q->latest('tanggal')->paginate($req->get('per_page', 20));

        $thisMonth = now()->format('Y-m');
        $stats = [
            'kas_masuk'    => ErpCashTransaction::where('tipe', 'masuk')->whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$thisMonth])->sum('jumlah'),
            'kas_keluar'   => ErpCashTransaction::where('tipe', 'keluar')->whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$thisMonth])->sum('jumlah'),
            'saldo'        => ErpCashTransaction::where('tipe', 'masuk')->sum('jumlah') - ErpCashTransaction::where('tipe', 'keluar')->sum('jumlah'),
            'transaksi'    => ErpCashTransaction::whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$thisMonth])->count(),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeCashTransaction(Request $req)
    {
        $req->validate(['tipe' => 'required', 'jumlah' => 'required', 'tanggal' => 'required']);
        $last = ErpCashTransaction::max('id') ?: 0;
        $prefix = $req->tipe === 'masuk' ? 'KM' : 'KK';
        $nomor = $prefix . '-' . now()->format('Ymd') . '-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT);
        $tx = ErpCashTransaction::create(array_merge($req->all(), ['nomor' => $nomor]));
        return response()->json(['success' => true, 'data' => $tx], 201);
    }

    public function updateCashTransaction(Request $req, $id)
    {
        $tx = ErpCashTransaction::findOrFail($id);
        $tx->update($req->all());
        return response()->json(['success' => true, 'data' => $tx]);
    }

    public function deleteCashTransaction($id)
    {
        ErpCashTransaction::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── FINANCE: BANK ACCOUNTS ──────────────────────────────────────────────────

    public function bankAccounts(Request $req)
    {
        $data = ErpBankAccount::withCount('transactions')->latest()->get();
        $stats = [
            'total_saldo'  => ErpBankAccount::where('is_active', true)->sum('saldo'),
            'total_rekening' => ErpBankAccount::where('is_active', true)->count(),
        ];
        return response()->json(compact('data', 'stats'));
    }

    public function storeBankAccount(Request $req)
    {
        $req->validate(['nama_bank' => 'required', 'no_rekening' => 'required|unique:erp_bank_accounts,no_rekening', 'atas_nama' => 'required']);
        $ba = ErpBankAccount::create($req->all());
        return response()->json(['success' => true, 'data' => $ba], 201);
    }

    public function updateBankAccount(Request $req, $id)
    {
        $ba = ErpBankAccount::findOrFail($id);
        $ba->update($req->all());
        return response()->json(['success' => true, 'data' => $ba]);
    }

    // ─── ACCOUNTING: CHART OF ACCOUNTS ───────────────────────────────────────────

    public function chartOfAccounts(Request $req)
    {
        $q = ErpChartOfAccount::with('parent');
        if ($req->search) $q->where(function($w) use ($req) {
            $w->where('nama', 'ilike', "%{$req->search}%")->orWhere('kode', 'ilike', "%{$req->search}%");
        });
        if ($req->tipe) $q->where('tipe', $req->tipe);
        $data = $q->orderBy('kode')->paginate($req->get('per_page', 30));

        $stats = [
            'total'      => ErpChartOfAccount::count(),
            'aktiva'     => ErpChartOfAccount::where('tipe', 'aktiva')->count(),
            'pasiva'     => ErpChartOfAccount::where('tipe', 'pasiva')->count(),
            'pendapatan' => ErpChartOfAccount::where('tipe', 'pendapatan')->count(),
            'biaya'      => ErpChartOfAccount::where('tipe', 'biaya')->count(),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeChartOfAccount(Request $req)
    {
        $req->validate(['kode' => 'required|unique:erp_chart_of_accounts,kode', 'nama' => 'required', 'tipe' => 'required']);
        $acc = ErpChartOfAccount::create($req->all());
        return response()->json(['success' => true, 'data' => $acc], 201);
    }

    public function updateChartOfAccount(Request $req, $id)
    {
        $acc = ErpChartOfAccount::findOrFail($id);
        $req->validate(['kode' => 'required|unique:erp_chart_of_accounts,kode,'.$id, 'nama' => 'required']);
        $acc->update($req->all());
        return response()->json(['success' => true, 'data' => $acc]);
    }

    public function deleteChartOfAccount($id)
    {
        ErpChartOfAccount::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── ACCOUNTING: JOURNAL ENTRIES ──────────────────────────────────────────────

    public function journalEntries(Request $req)
    {
        $q = ErpJournalEntry::with('lines.account');
        if ($req->search) $q->where('keterangan', 'ilike', "%{$req->search}%");
        if ($req->status) $q->where('status', $req->status);
        $data = $q->latest('tanggal')->paginate($req->get('per_page', 15));

        $stats = [
            'total'   => ErpJournalEntry::count(),
            'draft'   => ErpJournalEntry::where('status', 'draft')->count(),
            'posted'  => ErpJournalEntry::where('status', 'posted')->count(),
            'total_debit' => ErpJournalEntry::where('status', 'posted')->sum('total_debit'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeJournalEntry(Request $req)
    {
        $req->validate(['tanggal' => 'required', 'keterangan' => 'required', 'lines' => 'required|array|min:2']);
        $last = ErpJournalEntry::max('id') ?: 0;
        $nomor = 'JE-' . now()->format('Ymd') . '-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT);

        $total_debit  = collect($req->lines)->sum('debit');
        $total_kredit = collect($req->lines)->sum('kredit');

        $je = ErpJournalEntry::create(array_merge($req->except('lines'), [
            'nomor' => $nomor, 'total_debit' => $total_debit, 'total_kredit' => $total_kredit,
        ]));

        foreach ($req->lines as $line) {
            $je->lines()->create($line);
        }

        return response()->json(['success' => true, 'data' => $je->load('lines.account')], 201);
    }

    // ─── SERVICE CENTER ───────────────────────────────────────────────────────────

    public function serviceTickets(Request $req)
    {
        $q = ErpServiceTicket::query();
        if ($req->search) $q->where(function($w) use ($req) {
            $w->where('nomor', 'ilike', "%{$req->search}%")
              ->orWhere('customer_nama', 'ilike', "%{$req->search}%")
              ->orWhere('produk_nama', 'ilike', "%{$req->search}%");
        });
        if ($req->status)   $q->where('status', $req->status);
        if ($req->teknisi)  $q->where('teknisi', $req->teknisi);
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $stats = [
            'total'    => ErpServiceTicket::count(),
            'pending'  => ErpServiceTicket::whereIn('status', ['pending','diagnosa'])->count(),
            'proses'   => ErpServiceTicket::where('status', 'proses')->count(),
            'selesai'  => ErpServiceTicket::where('status', 'selesai')->count(),
            'revenue'  => ErpServiceTicket::whereIn('status', ['selesai','diambil'])->sum('total_biaya'),
            'teknisi'  => ErpServiceTicket::select('teknisi')->distinct()->whereNotNull('teknisi')->pluck('teknisi'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeServiceTicket(Request $req)
    {
        $req->validate(['customer_nama' => 'required', 'produk_nama' => 'required', 'keluhan' => 'required', 'tanggal_masuk' => 'required']);
        $last = ErpServiceTicket::max('id') ?: 0;
        $nomor = 'SRV-' . now()->format('Ymd') . '-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT);
        $total = ($req->biaya_servis ?? 0) + ($req->biaya_sparepart ?? 0);
        $ticket = ErpServiceTicket::create(array_merge($req->all(), ['nomor' => $nomor, 'total_biaya' => $total]));
        return response()->json(['success' => true, 'data' => $ticket], 201);
    }

    public function updateServiceTicket(Request $req, $id)
    {
        $ticket = ErpServiceTicket::findOrFail($id);
        $total = ($req->biaya_servis ?? $ticket->biaya_servis) + ($req->biaya_sparepart ?? $ticket->biaya_sparepart);
        $ticket->update(array_merge($req->all(), ['total_biaya' => $total]));
        return response()->json(['success' => true, 'data' => $ticket]);
    }

    public function deleteServiceTicket($id)
    {
        ErpServiceTicket::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── DELIVERIES ───────────────────────────────────────────────────────────────

    public function deliveries(Request $req)
    {
        $q = ErpDelivery::query();
        if ($req->search) $q->where(function($w) use ($req) {
            $w->where('nomor', 'ilike', "%{$req->search}%")
              ->orWhere('customer_nama', 'ilike', "%{$req->search}%");
        });
        if ($req->status)      $q->where('status', $req->status);
        if ($req->driver_nama) $q->where('driver_nama', $req->driver_nama);
        if ($req->tanggal)     $q->whereDate('tanggal_kirim', $req->tanggal);
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $stats = [
            'total'     => ErpDelivery::count(),
            'pending'   => ErpDelivery::whereIn('status', ['pending','pickup'])->count(),
            'on_delivery' => ErpDelivery::where('status', 'on_delivery')->count(),
            'delivered' => ErpDelivery::where('status', 'delivered')->count(),
            'drivers'   => ErpDelivery::select('driver_nama')->distinct()->whereNotNull('driver_nama')->pluck('driver_nama'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeDelivery(Request $req)
    {
        $req->validate(['customer_nama' => 'required', 'tanggal_kirim' => 'required']);
        $last = ErpDelivery::max('id') ?: 0;
        $nomor = 'DEL-' . now()->format('Ymd') . '-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT);
        $del = ErpDelivery::create(array_merge($req->all(), ['nomor' => $nomor]));
        return response()->json(['success' => true, 'data' => $del], 201);
    }

    public function updateDelivery(Request $req, $id)
    {
        $del = ErpDelivery::findOrFail($id);
        $del->update($req->all());
        return response()->json(['success' => true, 'data' => $del]);
    }

    public function deleteDelivery($id)
    {
        ErpDelivery::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── ROLES & PERMISSIONS ─────────────────────────────────────────────────────

    public function roles(Request $req)
    {
        $data = ErpRole::latest()->get();
        $stats = [
            'total'  => ErpRole::count(),
            'aktif'  => ErpRole::where('is_active', true)->count(),
            'users'  => User::count(),
        ];
        return response()->json(compact('data', 'stats'));
    }

    public function storeRole(Request $req)
    {
        $req->validate(['nama' => 'required']);
        $slug = Str::slug($req->nama);
        $role = ErpRole::create(array_merge($req->all(), ['slug' => $slug]));
        return response()->json(['success' => true, 'data' => $role], 201);
    }

    public function updateRole(Request $req, $id)
    {
        $role = ErpRole::findOrFail($id);
        $role->update($req->all());
        return response()->json(['success' => true, 'data' => $role]);
    }

    public function deleteRole($id)
    {
        ErpRole::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── SYSTEM USERS ─────────────────────────────────────────────────────────────

    public function users(Request $req)
    {
        $q = User::query();
        if ($req->search) $q->where(function($w) use ($req) {
            $w->where('name', 'ilike', "%{$req->search}%")->orWhere('email', 'ilike', "%{$req->search}%");
        });
        $data = $q->latest()->paginate($req->get('per_page', 15));
        $stats = [
            'total' => User::count(),
            'aktif' => User::count(),
        ];
        return response()->json(compact('data', 'stats'));
    }

    // ─── BRANCHES ─────────────────────────────────────────────────────────────────

    public function branches(Request $req)
    {
        $data = ErpBranch::withCount(['employees', 'warehouses'])->latest()->get();
        $stats = [
            'total'  => ErpBranch::count(),
            'aktif'  => ErpBranch::where('is_active', true)->count(),
        ];
        return response()->json(compact('data', 'stats'));
    }

    public function storeBranch(Request $req)
    {
        $req->validate(['nama' => 'required']);
        if (!$req->kode) {
            $last = ErpBranch::max('id') ?: 0;
            $req->merge(['kode' => 'CAB-' . str_pad($last + 1, 3, '0', STR_PAD_LEFT)]);
        }
        $br = ErpBranch::create($req->all());
        return response()->json(['success' => true, 'data' => $br], 201);
    }

    public function updateBranch(Request $req, $id)
    {
        $br = ErpBranch::findOrFail($id);
        $br->update($req->all());
        return response()->json(['success' => true, 'data' => $br]);
    }

    public function deleteBranch($id)
    {
        ErpBranch::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── SALES TARGETS ────────────────────────────────────────────────────────────

    public function salesTargets(Request $req)
    {
        $q = ErpSalesTarget::query();
        if ($req->periode)    $q->where('periode', $req->periode);
        if ($req->sales_nama) $q->where('sales_nama', $req->sales_nama);
        $data = $q->latest()->get();

        // Sync realisasi from orders
        $data->each(function ($t) {
            $realisasi = Order::where('nama_sales', $t->sales_nama)
                ->whereRaw("to_char(created_at,'YYYY-MM') = ?", [$t->periode])
                ->sum('total_harga');
            if ($t->realisasi != $realisasi) {
                $t->update(['realisasi' => $realisasi]);
                $t->realisasi = $realisasi;
            }
        });

        $stats = [
            'total_target'     => $data->sum('target'),
            'total_realisasi'  => $data->sum('realisasi'),
            'achievement_rate' => $data->sum('target') > 0
                ? round(($data->sum('realisasi') / $data->sum('target')) * 100, 1) : 0,
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeSalesTarget(Request $req)
    {
        $req->validate(['sales_nama' => 'required', 'periode' => 'required', 'target' => 'required']);
        $st = ErpSalesTarget::updateOrCreate(
            ['sales_nama' => $req->sales_nama, 'periode' => $req->periode],
            ['target' => $req->target]
        );
        return response()->json(['success' => true, 'data' => $st], 201);
    }

    // ─── QUOTATIONS ───────────────────────────────────────────────────────────────

    public function quotations(Request $req)
    {
        $q = ErpQuotation::query();
        if ($req->search) $q->where(function($w) use ($req) {
            $w->where('nomor', 'ilike', "%{$req->search}%")->orWhere('customer_nama', 'ilike', "%{$req->search}%");
        });
        if ($req->status) $q->where('status', $req->status);
        $data = $q->latest()->paginate($req->get('per_page', 15));

        $stats = [
            'total'    => ErpQuotation::count(),
            'draft'    => ErpQuotation::where('status', 'draft')->count(),
            'sent'     => ErpQuotation::where('status', 'sent')->count(),
            'accepted' => ErpQuotation::where('status', 'accepted')->count(),
            'total_nilai' => ErpQuotation::where('status', 'accepted')->sum('total'),
        ];

        return response()->json(compact('data', 'stats'));
    }

    public function storeQuotation(Request $req)
    {
        $req->validate(['customer_nama' => 'required', 'tanggal' => 'required']);
        $last = ErpQuotation::max('id') ?: 0;
        $nomor = 'QUO-' . now()->format('Ymd') . '-' . str_pad($last + 1, 4, '0', STR_PAD_LEFT);
        $q = ErpQuotation::create(array_merge($req->all(), ['nomor' => $nomor]));
        return response()->json(['success' => true, 'data' => $q], 201);
    }

    public function updateQuotation(Request $req, $id)
    {
        $q = ErpQuotation::findOrFail($id);
        $q->update($req->all());
        return response()->json(['success' => true, 'data' => $q]);
    }

    public function deleteQuotation($id)
    {
        ErpQuotation::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ─── REPORTS ──────────────────────────────────────────────────────────────────

    public function reportSales(Request $req)
    {
        $from = $req->get('from', now()->startOfMonth()->toDateString());
        $to   = $req->get('to', now()->toDateString());

        $bySales = Order::select('nama_sales', DB::raw('count(*) as orders'), DB::raw('sum(total_harga) as revenue'))
            ->whereBetween('created_at', [$from, $to])
            ->whereNotNull('nama_sales')
            ->groupBy('nama_sales')
            ->orderByDesc('revenue')
            ->get();

        $daily = Order::select(DB::raw("date_trunc('day', created_at) as day"), DB::raw('count(*) as orders'), DB::raw('sum(total_harga) as revenue'))
            ->whereBetween('created_at', [$from, $to])
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->map(fn($r) => ['day' => Carbon::parse($r->day)->format('d/m'), 'orders' => $r->orders, 'revenue' => (float)$r->revenue]);

        $topProducts = SaleItem::select('produk_nama', DB::raw('sum(qty) as total_qty'), DB::raw('sum(subtotal) as total_value'))
            ->whereHas('order', fn($q) => $q->whereBetween('created_at', [$from, $to]))
            ->groupBy('produk_nama')
            ->orderByDesc('total_value')
            ->limit(10)
            ->get();

        return response()->json(compact('bySales', 'daily', 'topProducts'));
    }

    public function reportFinance(Request $req)
    {
        $from = $req->get('from', now()->startOfMonth()->toDateString());
        $to   = $req->get('to', now()->toDateString());

        $pendapatan = Order::whereBetween('created_at', [$from, $to])->sum('total_harga');
        $kas_masuk  = ErpCashTransaction::where('tipe', 'masuk')->whereBetween('tanggal', [$from, $to])->sum('jumlah');
        $kas_keluar = ErpCashTransaction::where('tipe', 'keluar')->whereBetween('tanggal', [$from, $to])->sum('jumlah');
        $saldo_bank = ErpBankAccount::where('is_active', true)->sum('saldo');

        $monthly = [];
        for ($i = 5; $i >= 0; $i--) {
            $m = now()->subMonths($i);
            $monthly[] = [
                'label'     => $m->format('M Y'),
                'masuk'     => (float)ErpCashTransaction::where('tipe', 'masuk')->whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$m->format('Y-m')])->sum('jumlah'),
                'keluar'    => (float)ErpCashTransaction::where('tipe', 'keluar')->whereRaw("to_char(tanggal,'YYYY-MM') = ?", [$m->format('Y-m')])->sum('jumlah'),
                'pendapatan'=> (float)Order::whereYear('created_at', $m->year)->whereMonth('created_at', $m->month)->sum('total_harga'),
            ];
        }

        return response()->json(compact('pendapatan', 'kas_masuk', 'kas_keluar', 'saldo_bank', 'monthly'));
    }
}
