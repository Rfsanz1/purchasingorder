<?php

namespace App\Http\Controllers\API;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Supplier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends BaseController
{
    /**
     * Get all purchase orders
     */
    public function index(Request $request): JsonResponse
    {
        $query = PurchaseOrder::with('supplier', 'items.product');

        // Search
        if ($request->search) {
            $query->where('po_number', 'like', '%' . $request->search . '%')
                  ->orWhereHas('supplier', function ($q) use ($request) {
                      $q->where('name', 'like', '%' . $request->search . '%');
                  });
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by payment status
        if ($request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by supplier
        if ($request->supplier_id) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Date range filter
        if ($request->date_from && $request->date_to) {
            $query->whereBetween('po_date', [$request->date_from, $request->date_to]);
        }

        $purchaseOrders = $query->orderBy('po_date', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->success($purchaseOrders, 'Purchase orders retrieved successfully');
    }

    /**
     * Show a specific purchase order
     */
    public function show($id): JsonResponse
    {
        $po = PurchaseOrder::with('supplier', 'items.product')->find($id);

        if (!$po) {
            return $this->error('Purchase order not found', 404);
        }

        return $this->success($po, 'Purchase order retrieved successfully');
    }

    /**
     * Create a new purchase order
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'po_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date|after_or_equal:po_date',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Create PO
            $po = new PurchaseOrder();
            $po->po_number = PurchaseOrder::generateNumber();
            $po->supplier_id = $validated['supplier_id'];
            $po->po_date = $validated['po_date'];
            $po->expected_delivery_date = $validated['expected_delivery_date'] ?? null;
            $po->description = $validated['description'] ?? null;
            $po->status = 'draft';
            $po->payment_status = 'unpaid';
            $po->created_by = auth()->user()->name ?? 'System';
            $po->notes = $validated['notes'] ?? null;

            // Calculate totals
            $subtotal = 0;
            $items = [];

            foreach ($validated['items'] as $item) {
                $lineTotal = $item['quantity'] * $item['unit_price'];
                $subtotal += $lineTotal;

                $items[] = [
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $lineTotal,
                ];
            }

            $discountAmount = $subtotal * (($validated['discount_percentage'] ?? 0) / 100);
            $taxAmount = ($subtotal - $discountAmount) * 0.11; // 11% PPN

            $po->subtotal = $subtotal;
            $po->discount_amount = $discountAmount;
            $po->tax_amount = $taxAmount;
            $po->total_amount = $subtotal - $discountAmount + $taxAmount;
            $po->save();

            // Create items
            foreach ($items as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'line_total' => $item['line_total'],
                ]);
            }

            DB::commit();

            $po->load('supplier', 'items.product');

            return $this->success($po, 'Purchase order created successfully', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Failed to create purchase order: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update a purchase order
     */
    public function update(Request $request, $id): JsonResponse
    {
        $po = PurchaseOrder::find($id);

        if (!$po) {
            return $this->error('Purchase order not found', 404);
        }

        if ($po->status !== 'draft') {
            return $this->error('Can only update draft purchase orders', 400);
        }

        $validated = $request->validate([
            'expected_delivery_date' => 'nullable|date',
            'description' => 'nullable|string',
            'status' => 'in:draft,sent,acknowledged,partial,received,cancelled',
            'notes' => 'nullable|string',
        ]);

        $po->update($validated);

        return $this->success($po, 'Purchase order updated successfully');
    }

    /**
     * Change PO status
     */
    public function changeStatus(Request $request, $id): JsonResponse
    {
        $po = PurchaseOrder::find($id);

        if (!$po) {
            return $this->error('Purchase order not found', 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:sent,acknowledged,partial,received,cancelled',
        ]);

        $po->status = $validated['status'];
        $po->save();

        return $this->success($po, 'Purchase order status updated successfully');
    }

    /**
     * Approve a purchase order
     */
    public function approve(Request $request, $id): JsonResponse
    {
        $po = PurchaseOrder::find($id);

        if (!$po) {
            return $this->error('Purchase order not found', 404);
        }

        $po->approved_by = auth()->user()->name ?? 'System';
        $po->approved_at = now();
        $po->status = 'acknowledged';
        $po->save();

        return $this->success($po, 'Purchase order approved successfully');
    }

    /**
     * Cancel a purchase order
     */
    public function cancel(Request $request, $id): JsonResponse
    {
        $po = PurchaseOrder::find($id);

        if (!$po) {
            return $this->error('Purchase order not found', 404);
        }

        $po->status = 'cancelled';
        $po->save();

        return $this->success($po, 'Purchase order cancelled successfully');
    }

    /**
     * Delete a purchase order
     */
    public function destroy($id): JsonResponse
    {
        $po = PurchaseOrder::find($id);

        if (!$po) {
            return $this->error('Purchase order not found', 404);
        }

        if ($po->status !== 'draft') {
            return $this->error('Can only delete draft purchase orders', 400);
        }

        $po->items()->delete();
        $po->delete();

        return $this->success(null, 'Purchase order deleted successfully');
    }

    /**
     * Get PO statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_pos' => PurchaseOrder::count(),
            'pending_pos' => PurchaseOrder::where('status', 'draft')->count(),
            'total_amount' => PurchaseOrder::sum('total_amount'),
            'unpaid_amount' => PurchaseOrder::where('payment_status', 'unpaid')->sum('total_amount'),
        ];

        return $this->success($stats, 'PO statistics retrieved successfully');
    }
}
