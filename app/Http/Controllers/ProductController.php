<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Product;

class ProductController extends Controller
{
    private function formatProduct(Product $p): array
    {
        return [
            'id'               => $p->id,
            'salesId'          => $p->sales_id,
            'namaProduk'       => $p->nama_produk,
            'sku'              => $p->sku,
            'brand'            => $p->brand,
            'kledoProductId'   => $p->kledo_product_id,
            'kledoProductName' => $p->kledo_product_name,
            'harga'            => $p->harga,
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $salesId = $request->query('sales');
        $brand   = $request->query('brand');
        $search  = $request->query('search', '');

        $query = Product::query();

        if ($salesId) {
            $query->bySales($salesId);
        }

        if ($brand) {
            $query->byBrand($brand);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama_produk', 'ilike', "%{$search}%")
                  ->orWhere('sku', 'ilike', "%{$search}%")
                  ->orWhere('brand', 'ilike', "%{$search}%");
            });
        }

        $products = $query->orderBy('nama_produk')->get()->map(fn($p) => $this->formatProduct($p));

        return response()->json(['products' => $products]);
    }

    public function brands(): JsonResponse
    {
        $brands = Product::query()
            ->whereNotNull('brand')
            ->where('brand', '!=', '')
            ->distinct()
            ->orderBy('brand')
            ->pluck('brand');

        return response()->json(['brands' => $brands]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'salesId'          => 'required|string|max:100',
            'namaProduk'       => 'required|string|max:255',
            'sku'              => 'required|string|max:100',
            'brand'            => 'nullable|string|max:100',
            'kledoProductId'   => 'nullable|integer',
            'kledoProductName' => 'nullable|string|max:255',
            'harga'            => 'required|integer|min:0',
        ]);

        $existing = Product::where('sales_id', $data['salesId'])
                            ->where('sku', $data['sku'])
                            ->first();

        if ($existing) {
            return response()->json([
                'ok'    => false,
                'error' => "SKU '{$data['sku']}' sudah ada untuk sales ini.",
            ], 422);
        }

        if (!empty($data['kledoProductId'])) {
            $kledoConflict = Product::where('kledo_product_id', $data['kledoProductId'])->first();
            if ($kledoConflict) {
                return response()->json([
                    'ok'    => false,
                    'error' => 'Produk Kledo ini sudah terhubung ke produk lain.',
                ], 422);
            }
        }

        $product = Product::create([
            'sales_id'           => $data['salesId'],
            'nama_produk'        => $data['namaProduk'],
            'sku'                => $data['sku'],
            'brand'              => $data['brand'] ?? null,
            'kledo_product_id'   => $data['kledoProductId'] ?? null,
            'kledo_product_name' => $data['kledoProductName'] ?? null,
            'harga'              => $data['harga'],
            'stok'               => 0,
        ]);

        return response()->json(['ok' => true, 'product' => $this->formatProduct($product)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['ok' => false, 'error' => 'Produk tidak ditemukan'], 404);
        }

        $data = $request->validate([
            'namaProduk' => 'sometimes|string|max:255',
            'sku'        => 'sometimes|string|max:100',
            'brand'      => 'sometimes|nullable|string|max:100',
            'harga'      => 'sometimes|integer|min:0',
        ]);

        if (isset($data['sku']) && $data['sku'] !== $product->sku) {
            $conflict = Product::where('sales_id', $product->sales_id)
                                ->where('sku', $data['sku'])
                                ->where('id', '!=', $id)
                                ->exists();
            if ($conflict) {
                return response()->json(['ok' => false, 'error' => "SKU '{$data['sku']}' sudah digunakan."], 422);
            }
        }

        $updates = array_filter([
            'nama_produk' => $data['namaProduk'] ?? null,
            'sku'         => $data['sku'] ?? null,
            'brand'       => array_key_exists('brand', $data) ? $data['brand'] : null,
            'harga'       => $data['harga'] ?? null,
        ], fn($v) => $v !== null);

        if (array_key_exists('brand', $data) && $data['brand'] === null) {
            $updates['brand'] = null;
        }

        $product->update($updates);

        return response()->json(['ok' => true, 'product' => $this->formatProduct($product)]);
    }

    public function updateStok(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kledoProductId'   => 'required|integer',
            'kledoProductName' => 'required|string|max:255',
            'brand'            => 'required|string|max:100',
            'salesId'          => 'required|string|max:100',
            'harga'            => 'nullable|integer|min:0',
        ]);

        $product = Product::where('kledo_product_id', $data['kledoProductId'])->first();

        if ($product) {
            $product->update([
                'brand' => $data['brand'],
                'harga' => $data['harga'] ?? $product->harga,
                'kledo_product_name' => $data['kledoProductName'],
            ]);
        } else {
            $product = Product::create([
                'sales_id'           => $data['salesId'],
                'nama_produk'        => $data['kledoProductName'],
                'sku'                => 'KLEDO-' . $data['kledoProductId'],
                'brand'              => $data['brand'],
                'kledo_product_id'   => $data['kledoProductId'],
                'kledo_product_name' => $data['kledoProductName'],
                'harga'              => $data['harga'] ?? 0,
                'stok'               => 0,
            ]);
        }

        return response()->json(['ok' => true, 'product' => $this->formatProduct($product)]);
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['ok' => false, 'error' => 'Produk tidak ditemukan'], 404);
        }

        $product->delete();
        return response()->json(['ok' => true]);
    }
}
