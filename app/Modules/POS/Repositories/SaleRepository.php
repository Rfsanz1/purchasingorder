<?php

namespace App\Modules\POS\Repositories;

use App\Models\Pos\PosSale;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class SaleRepository
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return PosSale::with(['customer', 'cashier', 'warehouse', 'items', 'payments'])
            ->when($filters['search'] ?? null, fn($q, $s) =>
                $q->where('invoice_number', 'ilike', "%$s%")
                  ->orWhereHas('customer', fn($cq) => $cq->where('name', 'ilike', "%$s%")))
            ->when($filters['status'] ?? null, fn($q, $v) => $q->where('status', $v))
            ->when($filters['payment_status'] ?? null, fn($q, $v) => $q->where('payment_status', $v))
            ->when($filters['cashier_id'] ?? null, fn($q, $v) => $q->where('cashier_id', $v))
            ->when($filters['date_from'] ?? null, fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($filters['date_to'] ?? null, fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->latest()
            ->paginate($perPage);
    }

    public function find(int $id): ?PosSale
    {
        return PosSale::with(['customer', 'cashier', 'warehouse', 'items.product', 'items.unit', 'payments'])->find($id);
    }

    public function create(array $data): PosSale
    {
        return PosSale::create($data);
    }

    public function getNextInvoiceNumber(): string
    {
        $prefix = 'INV-' . date('Ymd') . '-';
        $last = PosSale::where('invoice_number', 'like', $prefix . '%')->orderByDesc('id')->first();
        $seq = $last ? ((int) substr($last->invoice_number, -4)) + 1 : 1;
        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    public function getDailySales(string $date, int $warehouseId = null): array
    {
        $q = PosSale::where('status', 'completed')->whereDate('created_at', $date)
            ->when($warehouseId, fn($q) => $q->where('warehouse_id', $warehouseId));

        return [
            'total'       => $q->sum('grand_total'),
            'count'       => $q->count(),
            'items_count' => PosSale::whereIn('id', $q->pluck('id'))->withCount('items')->get()->sum('items_count'),
        ];
    }
}
