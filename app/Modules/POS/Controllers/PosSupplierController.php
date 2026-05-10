<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pos\PosSupplier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosSupplierController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $suppliers = PosSupplier::when($request->search, fn($q, $s) =>
                $q->where('name', 'ilike', "%$s%")->orWhere('code', 'ilike', "%$s%"))
            ->when($request->is_active !== null, fn($q) => $q->where('is_active', $request->is_active))
            ->orderBy('name')
            ->paginate((int) $request->query('per_page', 20));
        return response()->json($suppliers);
    }

    public function show(int $id): JsonResponse
    {
        $supplier = PosSupplier::with('products')->find($id);
        if (!$supplier) return response()->json(['message' => 'Supplier tidak ditemukan'], 404);
        return response()->json(['data' => $supplier]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['name' => 'required|string|max:255']);
        $last = PosSupplier::orderByDesc('id')->first();
        $seq  = $last ? ((int) substr($last->code, 3)) + 1 : 1;
        $supplier = PosSupplier::create(array_merge($request->all(), [
            'code' => 'SUP' . str_pad($seq, 5, '0', STR_PAD_LEFT),
        ]));
        return response()->json(['data' => $supplier, 'message' => 'Supplier berhasil ditambahkan'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $supplier = PosSupplier::findOrFail($id);
        $supplier->update($request->all());
        return response()->json(['data' => $supplier, 'message' => 'Supplier berhasil diupdate']);
    }

    public function destroy(int $id): JsonResponse
    {
        PosSupplier::findOrFail($id)->delete();
        return response()->json(['message' => 'Supplier berhasil dihapus']);
    }
}
