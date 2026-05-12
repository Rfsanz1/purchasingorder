<?php

namespace App\Http\Controllers\API;

use App\Models\GoodsReceipt;
use App\Models\GoodsReceiptItem;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class GoodsReceiptController extends BaseController
{
    /**
     * Get all goods receipts
     */
    public function index(Request $request): JsonResponse
    {
        $query = GoodsReceipt::with('purchaseOrder.supplier', 'items.product');

        if ($request->search) {
            $query->where('gr_number', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->purchase_order_id) {
            $query->where('purchase_order_id', $request->purchase_order_id);
        }

        $goodsReceipts = $query->orderBy('receipt_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->success($goodsReceipts, 'Goods receipts retrieved successfully');
    }

    /**
     * Show a specific goods receipt
     */
    public function show($id): JsonResponse
    {
        $gr = GoodsReceipt::with('purchaseOrder.supplier', 'items.product')->find($id);

        if (!$gr) {
            return $this->error('Goods receipt not found', 404);
        }

        return $this->success($gr, 'Goods receipt retrieved successfully');
    }

    /**
     * Create a new goods receipt
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'purchase_order_id' => 'required|exists:purchase_orders,id',
            'receipt_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.purchase_order_item_id' => 'required|exists:purchase_order_items,id',
            'items.*.quantity_received' => 'required|integer|min:0',
            'items.*.quantity_damaged' => 'nullable|integer|min:0',
            'items.*.quantity_rejected' => 'nullable|integer|min:0',
            'items.*.notes' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $gr = new GoodsReceipt();
            $gr->gr_number = GoodsReceipt::generateNumber();
            $gr->purchase_order_id = $validated['purchase_order_id'];
            $gr->receipt_date = $validated['receipt_date'];
            $gr->status = 'draft';
            $gr->received_by = auth()->user()->name ?? 'System';
            $gr->notes = $validated['notes'] ?? null;
            $gr->save();

            // Create items
            foreach ($validated['items'] as $item) {
                GoodsReceiptItem::create([
                    'goods_receipt_id' => $gr->id,
                    'purchase_order_item_id' => $item['purchase_order_item_id'],
                    'quantity_received' => $item['quantity_received'],
                    'quantity_damaged' => $item['quantity_damaged'] ?? 0,
                    'quantity_rejected' => $item['quantity_rejected'] ?? 0,
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            DB::commit();

            $gr->load('purchaseOrder.supplier', 'items.product');

            return $this->success($gr, 'Goods receipt created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create goods receipt: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Complete a goods receipt
     */
    public function complete(Request $request, $id): JsonResponse
    {
        $gr = GoodsReceipt::find($id);

        if (!$gr) {
            return $this->error('Goods receipt not found', 404);
        }

        $gr->status = 'completed';
        $gr->verified_by = auth()->user()->name ?? 'System';
        $gr->save();

        return $this->success($gr, 'Goods receipt completed successfully');
    }

    /**
     * Cancel a goods receipt
     */
    public function cancel($id): JsonResponse
    {
        $gr = GoodsReceipt::find($id);

        if (!$gr) {
            return $this->error('Goods receipt not found', 404);
        }

        $gr->status = 'cancelled';
        $gr->save();

        return $this->success($gr, 'Goods receipt cancelled successfully');
    }

    /**
     * Delete a goods receipt
     */
    public function destroy($id): JsonResponse
    {
        $gr = GoodsReceipt::find($id);

        if (!$gr) {
            return $this->error('Goods receipt not found', 404);
        }

        $gr->items()->delete();
        $gr->delete();

        return $this->success(null, 'Goods receipt deleted successfully');
    }
}
