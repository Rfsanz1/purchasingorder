<?php

namespace App\Http\Controllers\API;

use App\Models\ProductCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProductCategoryController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = ProductCategory::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $categories = $query->with('parent')
            ->orderBy('name')
            ->paginate($request->get('per_page', 15));

        return $this->success($categories, 'Categories retrieved successfully');
    }

    public function all(): JsonResponse
    {
        $categories = ProductCategory::where('status', 'active')
            ->orderBy('name')
            ->get();

        return $this->success($categories, 'All categories retrieved successfully');
    }

    public function show($id): JsonResponse
    {
        $category = ProductCategory::with('children', 'products')->find($id);

        if (!$category) {
            return $this->error('Category not found', 404);
        }

        return $this->success($category, 'Category retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:product_categories',
            'parent_id' => 'nullable|exists:product_categories,id',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $validated['code'] = ProductCategory::generateCode();

        $category = ProductCategory::create($validated);

        return $this->success($category, 'Category created successfully', 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return $this->error('Category not found', 404);
        }

        $validated = $request->validate([
            'name' => 'string|max:255|unique:product_categories,name,' . $id,
            'parent_id' => 'nullable|exists:product_categories,id',
            'description' => 'nullable|string',
            'status' => 'in:active,inactive',
        ]);

        $category->update($validated);

        return $this->success($category, 'Category updated successfully');
    }

    public function destroy($id): JsonResponse
    {
        $category = ProductCategory::find($id);

        if (!$category) {
            return $this->error('Category not found', 404);
        }

        $category->delete();

        return $this->success(null, 'Category deleted successfully');
    }
}
