<?php

namespace App\Modules\POS\Services;

use App\Models\Pos\PosSale;
use App\Models\Pos\PosSaleItem;
use App\Models\Pos\PosPurchase;
use App\Models\Pos\PosReceivable;
use App\Models\Pos\PosPayable;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function salesReport(array $filters): array
    {
        $q = PosSale::with(['customer', 'cashier', 'items'])
            ->where('status', 'completed')
            ->when($filters['date_from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($filters['cashier_id'] ?? null, fn($q, $v) => $q->where('cashier_id', $v))
            ->when($filters['warehouse_id'] ?? null, fn($q, $v) => $q->where('warehouse_id', $v));

        $sales  = $q->get();
        $totals = [
            'count'           => $sales->count(),
            'subtotal'        => (float) $sales->sum('subtotal'),
            'discount_amount' => (float) $sales->sum('discount_amount'),
            'tax_amount'      => (float) $sales->sum('tax_amount'),
            'grand_total'     => (float) $sales->sum('grand_total'),
            'cost_total'      => (float) $sales->flatMap->items->sum(fn($i) => $i->qty * $i->cost_price),
        ];
        $totals['gross_profit'] = $totals['grand_total'] - $totals['cost_total'];
        $totals['margin_pct']   = $totals['grand_total'] > 0
            ? round($totals['gross_profit'] / $totals['grand_total'] * 100, 2) : 0;

        return ['sales' => $sales, 'totals' => $totals];
    }

    public function stockReport(?int $warehouseId = null): array
    {
        return DB::table('pos_products as p')
            ->leftJoin('pos_inventories as i', fn($j) =>
                $j->on('p.id', '=', 'i.product_id')
                  ->when($warehouseId, fn($j2) => $j2->where('i.warehouse_id', $warehouseId)))
            ->leftJoin('pos_categories as c', 'p.category_id', '=', 'c.id')
            ->leftJoin('pos_units as u', 'p.unit_id', '=', 'u.id')
            ->where('p.is_active', true)
            ->selectRaw('p.id, p.sku, p.name, p.min_stock_alert, p.cost_price, p.selling_price, c.name as category, u.abbreviation as unit, COALESCE(i.qty_on_hand,0) as qty_on_hand, COALESCE(i.qty_on_hand,0)*p.cost_price as stock_value')
            ->orderBy('p.name')
            ->get()
            ->toArray();
    }

    public function receivablesReport(string $status = null): array
    {
        return PosReceivable::with(['customer', 'sale'])
            ->when($status, fn($q, $v) => $q->where('status', $v))
            ->orderBy('due_date')
            ->get()
            ->toArray();
    }

    public function payablesReport(string $status = null): array
    {
        return PosPayable::with(['supplier', 'purchase'])
            ->when($status, fn($q, $v) => $q->where('status', $v))
            ->orderBy('due_date')
            ->get()
            ->toArray();
    }

    public function cashierReport(array $filters): array
    {
        return PosSale::with('cashier')
            ->where('status', 'completed')
            ->when($filters['date_from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->selectRaw('cashier_id, SUM(grand_total) as total, COUNT(*) as count')
            ->groupBy('cashier_id')
            ->with('cashier')
            ->get()
            ->toArray();
    }
}
