<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosProductController extends Controller
{
    public function __construct(private readonly ProductService $service) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->service->list($request->all(), (int) $request->query('per_page', 20));
        return response()->json($products);
    }

    public function search(Request $request): JsonResponse
    {
        $warehouseId = (int) $request->query('warehouse_id', 1);
        $products = $this->service->searchForPos($request->query('q', ''), $warehouseId);
        return response()->json(['data' => $products]);
    }

    public function show(int $id): JsonResponse
    {
        $product = $this->service->find($id);
        if (!$product) return response()->json(['message' => 'Produk tidak ditemukan'], 404);
        return response()->json(['data' => $product]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'          => 'required|string|max:255',
            'unit_id'       => 'required|exists:pos_units,id',
            'selling_price' => 'required|numeric|min:0',
        ]);

        $product = $this->service->create($request->all());
        return response()->json(['data' => $product, 'message' => 'Produk berhasil dibuat'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'name'          => 'sometimes|string|max:255',
            'unit_id'       => 'sometimes|exists:pos_units,id',
            'selling_price' => 'sometimes|numeric|min:0',
        ]);

        $product = $this->service->update($id, $request->all());
        return response()->json(['data' => $product, 'message' => 'Produk berhasil diupdate']);
    }

    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);
        return response()->json(['message' => 'Produk berhasil dihapus']);
    }

    public function lowStock(Request $request): JsonResponse
    {
        $warehouseId = $request->query('warehouse_id') ? (int) $request->query('warehouse_id') : null;
        return response()->json(['data' => $this->service->getLowStock($warehouseId)]);
    }

    public function generateBarcode(int $id): JsonResponse
    {
        $barcode = $this->service->generateBarcode($id);
        return response()->json(['barcode' => $barcode]);
    }
}
