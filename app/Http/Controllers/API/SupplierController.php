<?php

namespace App\Http\Controllers\API;

use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SupplierController extends BaseController
{
    /**
     * Get all suppliers with optional search and filters
     */
    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query();

        // Search
        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('supplier_code', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Pagination
        $suppliers = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return $this->success($suppliers, 'Suppliers retrieved successfully');
    }

    /**
     * Show a specific supplier
     */
    public function show($id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return $this->error('Supplier not found', 404);
        }

        return $this->success($supplier, 'Supplier retrieved successfully');
    }

    /**
     * Create a new supplier
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:suppliers',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string',
            'bank_account_name' => 'nullable|string',
            'bank_account_number' => 'nullable|string',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'payment_term_days' => 'nullable|integer|min:0',
            'status' => 'in:active,inactive,blocked',
            'notes' => 'nullable|string',
        ]);

        $validated['supplier_code'] = Supplier::generateCode();

        $supplier = Supplier::create($validated);

        return $this->success($supplier, 'Supplier created successfully', 201);
    }

    /**
     * Update a supplier
     */
    public function update(Request $request, $id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return $this->error('Supplier not found', 404);
        }

        $validated = $request->validate([
            'name' => 'string|max:255',
            'contact_person' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:suppliers,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'bank_name' => 'nullable|string',
            'bank_account_name' => 'nullable|string',
            'bank_account_number' => 'nullable|string',
            'discount_percentage' => 'nullable|numeric|min:0|max:100',
            'payment_term_days' => 'nullable|integer|min:0',
            'status' => 'in:active,inactive,blocked',
            'rating' => 'nullable|integer|min:1|max:5',
            'notes' => 'nullable|string',
        ]);

        $supplier->update($validated);

        return $this->success($supplier, 'Supplier updated successfully');
    }

    /**
     * Delete a supplier
     */
    public function destroy($id): JsonResponse
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return $this->error('Supplier not found', 404);
        }

        $supplier->delete();

        return $this->success(null, 'Supplier deleted successfully');
    }

    /**
     * Get supplier statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_suppliers' => Supplier::count(),
            'active_suppliers' => Supplier::where('status', 'active')->count(),
            'total_purchase_amount' => Supplier::sum('total_purchase_amount'),
            'avg_rating' => Supplier::avg('rating'),
        ];

        return $this->success($stats, 'Supplier statistics retrieved successfully');
    }
}
