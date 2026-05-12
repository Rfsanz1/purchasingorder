<?php

namespace App\Http\Controllers\API;

use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class WarehouseController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Warehouse::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%')
                  ->orWhere('city', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $warehouses = $query->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return $this->success($warehouses, 'Warehouses retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $warehouses = Warehouse::where('status', 'active')
            ->orderBy('name')
            ->get();

        return $this->success($warehouses, 'All warehouses retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return $this->error('Warehouse not found', 404);
        }

        return $this->success($warehouse, 'Warehouse retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:warehouses',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'capacity' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'manager_name' => 'nullable|string|max:255',
            'manager_phone' => 'nullable|string|max:20',
            'status' => 'in:active,inactive',
        ]);

        $validated['code'] = Warehouse::generateCode();

        $warehouse = Warehouse::create($validated);

        return $this->success($warehouse, 'Warehouse created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return $this->error('Warehouse not found', 404);
        }

        $validated = $request->validate([
            'name' => 'string|max:255|unique:warehouses,name,' . $id,
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'capacity' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'manager_name' => 'nullable|string|max:255',
            'manager_phone' => 'nullable|string|max:20',
            'status' => 'in:active,inactive',
        ]);

        $warehouse->update($validated);

        return $this->success($warehouse, 'Warehouse updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $warehouse = Warehouse::find($id);

        if (!$warehouse) {
            return $this->error('Warehouse not found', 404);
        }

        $warehouse->delete();

        return $this->success(null, 'Warehouse deleted successfully');
    }
}
