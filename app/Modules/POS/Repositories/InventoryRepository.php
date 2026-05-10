<?php

namespace App\Modules\POS\Repositories;

use App\Models\Pos\PosInventory;
use App\Models\Pos\PosStockMovement;
use Illuminate\Database\Eloquent\Collection;

class InventoryRepository
{
    public function getOrCreate(int $productId, int $warehouseId): PosInventory
    {
        return PosInventory::firstOrCreate(
            ['product_id' => $productId, 'warehouse_id' => $warehouseId],
            ['qty_on_hand' => 0, 'qty_reserved' => 0]
        );
    }

    public function adjustStock(int $productId, int $warehouseId, float $delta): PosInventory
    {
        $inv = $this->getOrCreate($productId, $warehouseId);
        $inv->qty_on_hand = max(0, $inv->qty_on_hand + $delta);
        $inv->save();
        return $inv;
    }

    public function recordMovement(array $data): PosStockMovement
    {
        return PosStockMovement::create($data);
    }

    public function getMovements(int $productId, int $limit = 50): Collection
    {
        return PosStockMovement::with(['warehouse', 'unit', 'creator'])
            ->where('product_id', $productId)
            ->latest()
            ->limit($limit)
            ->get();
    }

    public function getStockValue(int $warehouseId = null): float
    {
        return (float) PosInventory::join('pos_products', 'pos_inventories.product_id', '=', 'pos_products.id')
            ->when($warehouseId, fn($q) => $q->where('pos_inventories.warehouse_id', $warehouseId))
            ->selectRaw('SUM(pos_inventories.qty_on_hand * pos_products.cost_price) as total')
            ->value('total');
    }
}
