<?php

namespace App\Modules\POS\Services;

use App\Models\Pos\PosInventory;
use App\Models\Pos\PosStockMovement;
use App\Modules\POS\Repositories\InventoryRepository;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    public function __construct(private readonly InventoryRepository $repo) {}

    public function adjustStock(array $data, int $userId): PosStockMovement
    {
        return DB::transaction(function () use ($data, $userId) {
            $inv    = $this->repo->getOrCreate($data['product_id'], $data['warehouse_id']);
            $before = (float) $inv->qty_on_hand;
            $delta  = $data['type'] === 'in' ? abs($data['qty']) : -abs($data['qty']);

            $this->repo->adjustStock($data['product_id'], $data['warehouse_id'], $delta);

            return $this->repo->recordMovement([
                'product_id'     => $data['product_id'],
                'warehouse_id'   => $data['warehouse_id'],
                'unit_id'        => $data['unit_id'],
                'type'           => $data['type'],
                'reference_type' => 'adjustment',
                'qty'            => abs($data['qty']),
                'qty_before'     => $before,
                'qty_after'      => max(0, $before + $delta),
                'cost_price'     => $data['cost_price'] ?? 0,
                'notes'          => $data['notes'] ?? null,
                'created_by'     => $userId,
            ]);
        });
    }

    public function getStockByWarehouse(int $productId): array
    {
        return PosInventory::with('warehouse')
            ->where('product_id', $productId)
            ->get()
            ->map(fn($inv) => [
                'warehouse_id'   => $inv->warehouse_id,
                'warehouse_name' => $inv->warehouse->name,
                'qty_on_hand'    => (float) $inv->qty_on_hand,
                'qty_reserved'   => (float) $inv->qty_reserved,
                'qty_available'  => (float) $inv->qty_available,
            ])->toArray();
    }

    public function getMovements(int $productId, int $limit = 50)
    {
        return $this->repo->getMovements($productId, $limit);
    }

    public function getStockValue(?int $warehouseId = null): float
    {
        return $this->repo->getStockValue($warehouseId);
    }
}
