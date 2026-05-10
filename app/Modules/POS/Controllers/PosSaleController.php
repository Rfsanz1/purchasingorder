<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Services\SaleService;
use App\Models\Pos\PosHeldTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PosSaleController extends Controller
{
    public function __construct(private readonly SaleService $service) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->service->list($request->all(), (int) $request->query('per_page', 20)));
    }

    public function show(int $id): JsonResponse
    {
        $sale = $this->service->find($id);
        if (!$sale) return response()->json(['message' => 'Transaksi tidak ditemukan'], 404);
        return response()->json(['data' => $sale]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'warehouse_id'   => 'required|exists:pos_warehouses,id',
            'items'          => 'required|array|min:1',
            'items.*.product_id'   => 'required|exists:pos_products,id',
            'items.*.unit_id'      => 'required|exists:pos_units,id',
            'items.*.qty'          => 'required|numeric|min:0.0001',
            'items.*.unit_price'   => 'required|numeric|min:0',
            'items.*.product_name' => 'required|string',
            'payments'       => 'required|array|min:1',
            'payments.*.method' => 'required|string',
            'payments.*.amount' => 'required|numeric|min:0',
        ]);

        $cashierId = $request->user('sanctum')?->id ?? 1;
        $sale = $this->service->createSale($request->all(), $cashierId);
        return response()->json(['data' => $sale, 'message' => 'Transaksi berhasil'], 201);
    }

    public function cancel(int $id): JsonResponse
    {
        $sale = $this->service->cancelSale($id);
        return response()->json(['data' => $sale, 'message' => 'Transaksi dibatalkan']);
    }

    public function holdTransaction(Request $request): JsonResponse
    {
        $request->validate([
            'cart_data'   => 'required|array',
            'grand_total' => 'required|numeric',
        ]);

        $cashierId = $request->user('sanctum')?->id ?? 1;
        $held = PosHeldTransaction::create([
            'hold_code'   => 'HOLD-' . strtoupper(Str::random(6)),
            'cashier_id'  => $cashierId,
            'customer_id' => $request->customer_id,
            'cart_data'   => $request->cart_data,
            'grand_total' => $request->grand_total,
            'notes'       => $request->notes,
        ]);

        return response()->json(['data' => $held, 'message' => 'Transaksi di-hold']);
    }

    public function heldTransactions(Request $request): JsonResponse
    {
        $cashierId = $request->user('sanctum')?->id ?? 1;
        $held = PosHeldTransaction::with('customer')
            ->where('cashier_id', $cashierId)
            ->latest()->get();
        return response()->json(['data' => $held]);
    }

    public function releaseHold(int $id): JsonResponse
    {
        $held = PosHeldTransaction::findOrFail($id);
        $held->delete();
        return response()->json(['message' => 'Hold dibatalkan']);
    }
}
