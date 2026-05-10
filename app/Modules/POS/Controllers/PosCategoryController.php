<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Pos\PosCategory;
use App\Models\Pos\PosUnit;
use App\Models\Pos\PosPriceTier;
use App\Models\Pos\PosWarehouse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = PosCategory::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();
        return response()->json(['data' => $categories]);
    }

    public function all(): JsonResponse
    {
        return response()->json(['data' => PosCategory::orderBy('name')->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate(['name' => 'required|string|max:255']);
        $category = PosCategory::create($request->all());
        return response()->json(['data' => $category, 'message' => 'Kategori berhasil ditambahkan'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = PosCategory::findOrFail($id);
        $category->update($request->all());
        return response()->json(['data' => $category, 'message' => 'Kategori berhasil diupdate']);
    }

    public function destroy(int $id): JsonResponse
    {
        PosCategory::findOrFail($id)->delete();
        return response()->json(['message' => 'Kategori berhasil dihapus']);
    }

    public function units(): JsonResponse
    {
        return response()->json(['data' => PosUnit::where('is_active', true)->orderBy('name')->get()]);
    }

    public function priceTiers(): JsonResponse
    {
        return response()->json(['data' => PosPriceTier::where('is_active', true)->orderBy('sort_order')->get()]);
    }

    public function warehouses(): JsonResponse
    {
        return response()->json(['data' => PosWarehouse::where('is_active', true)->get()]);
    }
}
