<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Services\InventoryService;
use App\Models\Pos\PosWarehouse;
use App\Models\Pos\PosInventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosInventoryController extends Controller
{
    public function __construct(private readonly InventoryService $service) {}

    public function warehouses(): JsonResponse
    {
        return response()->json(['data' => PosWarehouse::where('is_active', true)->get()]);
    }

    public function stockByWarehouse(Request $request): JsonResponse
    {
        $warehouseId = (int) $request->query('warehouse_id', 1);
        $items = PosInventory::with(['product.unit', 'product.category'])
            ->where('warehouse_id', $warehouseId)
            ->get()
            ->map(fn($inv) => [
                'product_id'    => $inv->product_id,
                'product_name'  => $inv->product->name,
                'sku'           => $inv->product->sku,
                'category'      => $inv->product->category?->name,
                'unit'          => $inv->product->unit?->abbreviation,
                'qty_on_hand'   => (float) $inv->qty_on_hand,
                'qty_reserved'  => (float) $inv->qty_reserved,
                'qty_available' => (float) $inv->qty_available,
                'min_stock'     => $inv->product->min_stock_alert,
                'is_low'        => $inv->qty_on_hand <= $inv->product->min_stock_alert,
                'cost_price'    => (float) $inv->product->cost_price,
                'stock_value'   => (float) ($inv->qty_on_hand * $inv->product->cost_price),
            ]);
        return response()->json(['data' => $items]);
    }

    public function adjust(Request $request): JsonResponse
    {
        $request->validate([
            'product_id'  => 'required|exists:pos_products,id',
            'warehouse_id'=> 'required|exists:pos_warehouses,id',
            'unit_id'     => 'required|exists:pos_units,id',
            'type'        => 'required|in:in,out,adjustment',
            'qty'         => 'required|numeric|min:0.0001',
        ]);

        $userId = $request->user('sanctum')?->id ?? 1;
        $movement = $this->service->adjustStock($request->all(), $userId);
        return response()->json(['data' => $movement, 'message' => 'Stok berhasil disesuaikan']);
    }

    public function movements(Request $request, int $productId): JsonResponse
    {
        return response()->json(['data' => $this->service->getMovements($productId)]);
    }

    public function stockValue(Request $request): JsonResponse
    {
        $warehouseId = $request->query('warehouse_id') ? (int) $request->query('warehouse_id') : null;
        return response()->json(['stock_value' => $this->service->getStockValue($warehouseId)]);
    }
}
