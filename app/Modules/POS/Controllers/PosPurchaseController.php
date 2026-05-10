<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pos\PosPurchase;
use App\Models\Pos\PosPurchaseItem;
use App\Models\Pos\PosPayable;
use App\Modules\POS\Repositories\InventoryRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PosPurchaseController extends Controller
{
    public function __construct(private readonly InventoryRepository $invRepo) {}

    public function index(Request $request): JsonResponse
    {
        $purchases = PosPurchase::with(['supplier', 'warehouse', 'creator'])
            ->when($request->search, fn($q, $s) => $q->where('po_number', 'ilike', "%$s%"))
            ->when($request->status, fn($q, $v) => $q->where('status', $v))
            ->latest()->paginate((int) $request->query('per_page', 20));
        return response()->json($purchases);
    }

    public function show(int $id): JsonResponse
    {
        $purchase = PosPurchase::with(['supplier', 'warehouse', 'items.product', 'items.unit'])->find($id);
        if (!$purchase) return response()->json(['message' => 'PO tidak ditemukan'], 404);
        return response()->json(['data' => $purchase]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'supplier_id'  => 'required|exists:pos_suppliers,id',
            'warehouse_id' => 'required|exists:pos_warehouses,id',
            'order_date'   => 'required|date',
            'items'        => 'required|array|min:1',
        ]);

        return DB::transaction(function () use ($request) {
            $userId = $request->user('sanctum')?->id ?? 1;

            $last   = PosPurchase::orderByDesc('id')->first();
            $seq    = $last ? ((int) substr($last->po_number, -5)) + 1 : 1;
            $poNumber = 'PO-' . date('Ymd') . '-' . str_pad($seq, 5, '0', STR_PAD_LEFT);

            $subtotal = collect($request->items)->sum(fn($i) => $i['qty_ordered'] * $i['unit_price']);
            $grand    = $subtotal + ($request->shipping_cost ?? 0) + ($request->tax_amount ?? 0) - ($request->discount_amount ?? 0);

            $purchase = PosPurchase::create([
                'po_number'       => $poNumber,
                'supplier_id'     => $request->supplier_id,
                'warehouse_id'    => $request->warehouse_id,
                'created_by'      => $userId,
                'status'          => 'ordered',
                'payment_status'  => 'unpaid',
                'order_date'      => $request->order_date,
                'expected_date'   => $request->expected_date,
                'subtotal'        => $subtotal,
                'discount_amount' => $request->discount_amount ?? 0,
                'tax_amount'      => $request->tax_amount ?? 0,
                'shipping_cost'   => $request->shipping_cost ?? 0,
                'grand_total'     => $grand,
                'paid_amount'     => 0,
                'notes'           => $request->notes,
            ]);

            foreach ($request->items as $item) {
                PosPurchaseItem::create([
                    'purchase_id'  => $purchase->id,
                    'product_id'   => $item['product_id'],
                    'unit_id'      => $item['unit_id'],
                    'product_name' => $item['product_name'],
                    'qty_ordered'  => $item['qty_ordered'],
                    'qty_received' => 0,
                    'unit_price'   => $item['unit_price'],
                    'subtotal'     => $item['qty_ordered'] * $item['unit_price'],
                ]);
            }

            PosPayable::create([
                'code'        => 'PAY-' . strtoupper(Str::random(8)),
                'purchase_id' => $purchase->id,
                'supplier_id' => $purchase->supplier_id,
                'amount'      => $grand,
                'paid_amount' => 0,
                'remaining'   => $grand,
                'due_date'    => now()->addDays(30),
                'status'      => 'unpaid',
            ]);

            return response()->json(['data' => $purchase->load(['items', 'supplier']), 'message' => 'PO berhasil dibuat'], 201);
        });
    }

    public function receive(Request $request, int $id): JsonResponse
    {
        return DB::transaction(function () use ($request, $id) {
            $purchase = PosPurchase::with(['items'])->findOrFail($id);
            $userId   = $request->user('sanctum')?->id ?? 1;

            foreach ($request->items ?? $purchase->items as $item) {
                $pi      = is_array($item) ? PosPurchaseItem::find($item['id']) : $item;
                $qtyRecv = is_array($item) ? ($item['qty_received'] ?? 0) : $pi->qty_ordered;

                if ($qtyRecv > 0) {
                    $pi->update(['qty_received' => $pi->qty_received + $qtyRecv]);
                    $inv    = $this->invRepo->getOrCreate($pi->product_id, $purchase->warehouse_id);
                    $before = (float) $inv->qty_on_hand;
                    $this->invRepo->adjustStock($pi->product_id, $purchase->warehouse_id, $qtyRecv);
                    $this->invRepo->recordMovement([
                        'product_id'     => $pi->product_id,
                        'warehouse_id'   => $purchase->warehouse_id,
                        'unit_id'        => $pi->unit_id,
                        'type'           => 'in',
                        'reference_type' => 'purchase',
                        'reference_id'   => $purchase->id,
                        'qty'            => $qtyRecv,
                        'qty_before'     => $before,
                        'qty_after'      => $before + $qtyRecv,
                        'cost_price'     => $pi->unit_price,
                        'created_by'     => $userId,
                    ]);
                }
            }

            $purchase->update(['status' => 'received', 'received_date' => now()]);
            return response()->json(['data' => $purchase->fresh(['items']), 'message' => 'Barang berhasil diterima']);
        });
    }
}
