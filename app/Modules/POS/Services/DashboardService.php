<?php

namespace App\Modules\POS\Services;

use App\Models\Pos\PosSale;
use App\Models\Pos\PosProduct;
use App\Models\Pos\PosReceivable;
use App\Models\Pos\PosPayable;
use App\Models\Pos\PosSaleItem;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getSummary(): array
    {
        $today     = now()->toDateString();
        $thisMonth = now()->startOfMonth()->toDateString();

        $todaySales = PosSale::where('status', 'completed')->whereDate('created_at', $today);
        $monthSales = PosSale::where('status', 'completed')->whereDate('created_at', '>=', $thisMonth);

        return [
            'today' => [
                'revenue'      => (float) $todaySales->sum('grand_total'),
                'transactions' => $todaySales->count(),
                'avg_order'    => (float) $todaySales->avg('grand_total') ?? 0,
            ],
            'this_month' => [
                'revenue'      => (float) $monthSales->sum('grand_total'),
                'transactions' => $monthSales->count(),
            ],
            'receivables'  => (float) PosReceivable::whereIn('status', ['unpaid', 'partial'])->sum('remaining'),
            'payables'     => (float) PosPayable::whereIn('status', ['unpaid', 'partial'])->sum('remaining'),
            'low_stock'    => PosProduct::where('track_stock', true)
                ->whereHas('inventories', fn($q) => $q->whereRaw('qty_on_hand <= pos_products.min_stock_alert'))
                ->count(),
        ];
    }

    public function getChartData(int $days = 30): array
    {
        $data = PosSale::where('status', 'completed')
            ->whereDate('created_at', '>=', now()->subDays($days))
            ->selectRaw("DATE(created_at) as date, SUM(grand_total) as revenue, COUNT(*) as transactions")
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return $data->map(fn($row) => [
            'date'         => $row->date,
            'revenue'      => (float) $row->revenue,
            'transactions' => (int) $row->transactions,
        ])->values()->toArray();
    }

    public function getTopProducts(int $limit = 10, string $period = 'month'): array
    {
        $from = match ($period) {
            'today' => now()->startOfDay(),
            'week'  => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year'  => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        return PosSaleItem::join('pos_sales', 'pos_sale_items.sale_id', '=', 'pos_sales.id')
            ->join('pos_products', 'pos_sale_items.product_id', '=', 'pos_products.id')
            ->where('pos_sales.status', 'completed')
            ->where('pos_sales.created_at', '>=', $from)
            ->selectRaw('pos_products.id, pos_products.name, pos_products.sku, SUM(pos_sale_items.qty) as total_qty, SUM(pos_sale_items.subtotal) as total_revenue')
            ->groupBy('pos_products.id', 'pos_products.name', 'pos_products.sku')
            ->orderByDesc('total_revenue')
            ->limit($limit)
            ->get()
            ->map(fn($row) => [
                'id'            => $row->id,
                'name'          => $row->name,
                'sku'           => $row->sku,
                'total_qty'     => (float) $row->total_qty,
                'total_revenue' => (float) $row->total_revenue,
            ])->toArray();
    }

    public function getRecentTransactions(int $limit = 10): array
    {
        return PosSale::with(['customer', 'cashier'])
            ->where('status', 'completed')
            ->latest()
            ->limit($limit)
            ->get()
            ->map(fn($sale) => [
                'id'             => $sale->id,
                'invoice_number' => $sale->invoice_number,
                'customer_name'  => $sale->customer?->name ?? $sale->customer_name ?? 'Umum',
                'cashier_name'   => $sale->cashier?->name,
                'grand_total'    => (float) $sale->grand_total,
                'payment_status' => $sale->payment_status,
                'created_at'     => $sale->created_at->format('d/m/Y H:i'),
            ])->toArray();
    }

    public function getMonthlyRevenue(int $months = 12): array
    {
        return PosSale::where('status', 'completed')
            ->where('created_at', '>=', now()->subMonths($months)->startOfMonth())
            ->selectRaw("TO_CHAR(created_at, 'YYYY-MM') as month, SUM(grand_total) as revenue, COUNT(*) as transactions")
            ->groupBy(DB::raw("TO_CHAR(created_at, 'YYYY-MM')"))
            ->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month'        => $row->month,
                'revenue'      => (float) $row->revenue,
                'transactions' => (int) $row->transactions,
            ])->values()->toArray();
    }
}
