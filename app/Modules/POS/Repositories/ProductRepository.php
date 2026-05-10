<?php

namespace App\Modules\POS\Repositories;

use App\Models\Pos\PosProduct;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return PosProduct::with(['category', 'unit', 'inventories.warehouse'])
            ->when($filters['search'] ?? null, fn($q, $s) =>
                $q->where('name', 'ilike', "%$s%")
                  ->orWhere('sku', 'ilike', "%$s%")
                  ->orWhere('barcode', 'ilike', "%$s%"))
            ->when($filters['category_id'] ?? null, fn($q, $v) => $q->where('category_id', $v))
            ->when(isset($filters['is_active']), fn($q) => $q->where('is_active', $filters['is_active']))
            ->when($filters['low_stock'] ?? false, fn($q) =>
                $q->whereHas('inventories', fn($iq) =>
                    $iq->whereRaw('pos_inventories.qty_on_hand <= pos_products.min_stock_alert')))
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function searchForPos(string $query, int $warehouseId, int $limit = 20): Collection
    {
        return PosProduct::with(['unit', 'category',
                'inventories' => fn($q) => $q->where('warehouse_id', $warehouseId),
                'productUnits.unit',
            ])
            ->where('is_active', true)
            ->where(fn($q) =>
                $q->where('name', 'ilike', "%$query%")
                  ->orWhere('sku', 'ilike', "%$query%")
                  ->orWhere('barcode', $query))
            ->limit($limit)
            ->get();
    }

    public function findByBarcode(string $barcode): ?PosProduct
    {
        return PosProduct::with(['unit', 'inventories'])->where('barcode', $barcode)->first();
    }

    public function find(int $id): ?PosProduct
    {
        return PosProduct::with(['category', 'unit', 'supplier', 'productUnits.unit', 'prices.priceTier', 'inventories.warehouse'])->find($id);
    }

    public function create(array $data): PosProduct
    {
        return PosProduct::create($data);
    }

    public function update(PosProduct $product, array $data): PosProduct
    {
        $product->update($data);
        return $product->fresh(['category', 'unit']);
    }

    public function delete(PosProduct $product): bool
    {
        return $product->delete();
    }

    public function getLowStock(int $warehouseId = null): Collection
    {
        return PosProduct::with(['unit', 'inventories'])
            ->where('track_stock', true)
            ->where('is_active', true)
            ->whereHas('inventories', fn($q) =>
                $q->whereRaw('qty_on_hand <= pos_products.min_stock_alert')
                  ->when($warehouseId, fn($wq) => $wq->where('warehouse_id', $warehouseId)))
            ->get();
    }
}
