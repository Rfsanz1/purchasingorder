<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Repositories\CustomerRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosCustomerController extends Controller
{
    public function __construct(private readonly CustomerRepository $repo) {}

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->repo->paginate($request->all(), (int) $request->query('per_page', 20)));
    }

    public function search(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->repo->search($request->query('q', ''))]);
    }

    public function show(int $id): JsonResponse
    {
        $customer = $this->repo->find($id);
        if (!$customer) return response()->json(['message' => 'Customer tidak ditemukan'], 404);
        return response()->json(['data' => $customer]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'type'  => 'sometimes|in:retail,contractor,store,reseller',
        ]);
        $customer = $this->repo->create($request->all());
        return response()->json(['data' => $customer, 'message' => 'Customer berhasil ditambahkan'], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $customer = $this->repo->find($id);
        if (!$customer) return response()->json(['message' => 'Customer tidak ditemukan'], 404);
        $updated = $this->repo->update($customer, $request->all());
        return response()->json(['data' => $updated, 'message' => 'Customer berhasil diupdate']);
    }

    public function destroy(int $id): JsonResponse
    {
        $customer = $this->repo->find($id);
        if (!$customer) return response()->json(['message' => 'Customer tidak ditemukan'], 404);
        $customer->delete();
        return response()->json(['message' => 'Customer berhasil dihapus']);
    }

    public function purchaseHistory(int $id): JsonResponse
    {
        $customer = $this->repo->find($id);
        if (!$customer) return response()->json(['message' => 'Customer tidak ditemukan'], 404);
        $sales = $customer->sales()->with(['items', 'payments'])->latest()->limit(50)->get();
        return response()->json(['data' => $sales]);
    }
}
