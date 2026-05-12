<?php

namespace App\Http\Controllers\API;

use App\Models\ProductUnit;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductUnitController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductUnit::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $units = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return $this->success($units, 'Units retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $units = ProductUnit::where('status', 'active')
            ->orderBy('name')
            ->get();

        return $this->success($units, 'All units retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $unit = ProductUnit::find($id);

        if (!$unit) {
            return $this->error('Unit not found', 404);
        }

        return $this->success($unit, 'Unit retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_units',
            'symbol' => 'nullable|string|max:10|unique:product_units',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $validated['code'] = ProductUnit::generateCode();

        $unit = ProductUnit::create($validated);

        return $this->success($unit, 'Unit created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $unit = ProductUnit::find($id);

        if (!$unit) {
            return $this->error('Unit not found', 404);
        }

        $validated = $request->validate([
            'name' => 'string|max:255|unique:product_units,name,' . $id,
            'symbol' => 'nullable|string|max:10|unique:product_units,symbol,' . $id,
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $unit->update($validated);

        return $this->success($unit, 'Unit updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $unit = ProductUnit::find($id);

        if (!$unit) {
            return $this->error('Unit not found', 404);
        }

        $unit->delete();

        return $this->success(null, 'Unit deleted successfully');
    }
}
