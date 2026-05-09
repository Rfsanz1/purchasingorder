<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Product;
use App\Models\StockOpname;
use App\Models\StockOpnameItem;
use App\Services\KledoService;

class StockOpnameController extends Controller
{
    public function searchProduct(Request $request): JsonResponse
    {
        $query = trim((string) $request->query('q', ''));
        if ($query === '') {
            return response()->json(['ok' => false, 'error' => 'Masukkan kode atau nama produk terlebih dahulu.'], 400);
        }

        $products = Product::query()
            ->where('sku', 'ilike', $query)
            ->orWhere('sku', 'ilike', "%{$query}%")
            ->orWhere('nama_produk', 'ilike', "%{$query}%")
            ->orderBy('sku')
            ->limit(20)
            ->get();

        if ($products->count() > 0) {
            return response()->json([
                'ok' => true,
                'results' => $products->map(fn($p) => [
                    'productId' => $p->id,
                    'sku' => $p->sku,
                    'namaProduk' => $p->nama_produk,
                    'brand' => $p->brand,
                    'expectedQty' => $p->stok ?? 0,
                    'source' => 'internal',
                    'kledoProductId' => $p->kledo_product_id,
                ]),
            ]);
        }

        try {
            $result = (new KledoService())->getProductsWithStock($query, 1, '');
        } catch (\Exception $e) {
            return response()->json(['ok' => false, 'error' => 'Gagal mencari produk Kledo: ' . $e->getMessage()], 500);
        }

        if (!empty($result['error']) || empty($result['products'])) {
            return response()->json(['ok' => false, 'error' => 'Produk tidak ditemukan.'], 404);
        }

        $results = array_map(fn($p) => [
            'productId' => $p['localId'] ?? null,
            'sku' => $p['sku'] ?? '',
            'namaProduk' => $p['nama'] ?? ($p['namaProduk'] ?? ($p['kledoProductName'] ?? ($p['name'] ?? ''))),
            'brand' => $p['brand'] ?? '',
            'expectedQty' => (int) ($p['stok'] ?? 0),
            'source' => $p['stokSrc'] ?? 'kledo',
            'kledoProductId' => $p['kledoId'] ?? null,
        ], $result['products']);

        return response()->json(['ok' => true, 'results' => $results]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'userRole' => 'required|string|max:50',
            'username' => 'required|string|max:100',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.sku' => 'required|string|max:150',
            'items.*.namaProduk' => 'required|string|max:255',
            'items.*.expectedQty' => 'required|integer|min:0',
            'items.*.countedQty' => 'required|integer|min:0',
            'items.*.diff' => 'required|integer',
            'items.*.source' => 'required|string|max:50',
            'items.*.productId' => 'nullable|integer',
            'items.*.kledoProductId' => 'nullable|integer',
        ]);

        $opname = StockOpname::create([
            'user_role' => $data['userRole'],
            'username' => $data['username'],
            'notes' => $data['notes'] ?? null,
        ]);

        foreach ($data['items'] as $item) {
            StockOpnameItem::create([
                'stock_opname_id' => $opname->id,
                'product_id' => $item['productId'] ?? null,
                'kledo_product_id' => $item['kledoProductId'] ?? null,
                'sku' => $item['sku'],
                'nama_produk' => $item['namaProduk'],
                'expected_qty' => $item['expectedQty'],
                'counted_qty' => $item['countedQty'],
                'diff' => $item['diff'],
                'source' => $item['source'],
            ]);

            if (!empty($item['productId'])) {
                $product = Product::find($item['productId']);
                if ($product) {
                    $product->update(['stok' => $item['countedQty']]);
                }
            }
        }

        return response()->json(['ok' => true, 'id' => $opname->id, 'savedAt' => $opname->created_at]);
    }

    public function index(Request $request): JsonResponse
    {
        $opnames = StockOpname::with('items')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'ok' => true,
            'opnames' => $opnames->items(),
            'pagination' => [
                'current_page' => $opnames->currentPage(),
                'last_page' => $opnames->lastPage(),
                'per_page' => $opnames->perPage(),
                'total' => $opnames->total(),
            ],
        ]);
    }

    public function approve(Request $request, $id): JsonResponse
    {
        $opname = StockOpname::findOrFail($id);
        if ($opname->status !== 'pending') {
            return response()->json(['ok' => false, 'error' => 'Opname sudah diproses.'], 400);
        }

        $opname->update([
            'status' => 'approved',
            'approved_by' => $request->user()->name ?? 'Admin',
            'approved_at' => now(),
        ]);

        return response()->json(['ok' => true, 'message' => 'Opname disetujui.']);
    }

    public function reject(Request $request, $id): JsonResponse
    {
        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $opname = StockOpname::findOrFail($id);
        if ($opname->status !== 'pending') {
            return response()->json(['ok' => false, 'error' => 'Opname sudah diproses.'], 400);
        }

        $opname->update([
            'status' => 'rejected',
            'rejected_reason' => $request->reason,
        ]);

        return response()->json(['ok' => true, 'message' => 'Opname ditolak.']);
    }
}
