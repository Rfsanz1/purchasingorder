<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Customer;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query();

        if ($search = trim((string) $request->query('search', ''))) {
            $query->search($search);
        }

        if ($status = trim((string) $request->query('status', ''))) {
            $query->where('status', $status);
        }

        $perPage = min(max((int) $request->query('per_page', 20), 1), 100);
        $page    = max((int) $request->query('page', 1), 1);
        $total   = $query->count();

        $customers = $query->orderByDesc('last_order_at')
            ->orderByDesc('created_at')
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get()
            ->map(fn($c) => $this->formatCustomer($c));

        return response()->json([
            'customers' => $customers,
            'meta' => [
                'page'     => $page,
                'perPage'  => $perPage,
                'total'    => $total,
                'returned' => $customers->count(),
            ],
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer tidak ditemukan'], 404);
        }

        return response()->json([
            'customer' => $this->formatCustomer($customer),
            'stats' => $this->getCustomerStats($customer),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'pekerjaan' => 'nullable|string|max:100',
            'perusahaan' => 'nullable|string|max:100',
            'status' => 'nullable|in:Aktif,Tidak Aktif,Blacklist',
            'catatan' => 'nullable|string',
        ]);

        $customer = Customer::create($data);

        return response()->json([
            'ok' => true,
            'customer' => $this->formatCustomer($customer),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer tidak ditemukan'], 404);
        }

        $data = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $id,
            'telepon' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'tanggal_lahir' => 'nullable|date',
            'jenis_kelamin' => 'nullable|in:L,P',
            'pekerjaan' => 'nullable|string|max:100',
            'perusahaan' => 'nullable|string|max:100',
            'status' => 'nullable|in:Aktif,Tidak Aktif,Blacklist',
            'catatan' => 'nullable|string',
        ]);

        $customer->update($data);

        return response()->json([
            'ok' => true,
            'customer' => $this->formatCustomer($customer),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $customer = Customer::find($id);
        if (!$customer) {
            return response()->json(['error' => 'Customer tidak ditemukan'], 404);
        }

        $customer->delete();
        return response()->json(['ok' => true]);
    }

    public function summary(): JsonResponse
    {
        $totalCustomers = Customer::count();
        $activeCustomers = Customer::where('status', 'Aktif')->count();
        $statusCounts = Customer::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->get()
            ->map(fn($row) => ['status' => $row->status, 'count' => (int)$row->count]);

        $topCustomers = Customer::where('status', 'Aktif')
            ->orderByDesc('total_nilai_order')
            ->limit(10)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'nama' => $c->nama,
                'total_order' => $c->total_order,
                'total_nilai_order' => $c->total_nilai_order,
            ]);

        return response()->json([
            'totalCustomers' => $totalCustomers,
            'activeCustomers' => $activeCustomers,
            'statusCounts' => $statusCounts,
            'topCustomers' => $topCustomers,
        ]);
    }

    private function formatCustomer(Customer $c): array
    {
        return [
            'id' => $c->id,
            'nama' => $c->nama,
            'email' => $c->email,
            'telepon' => $c->telepon,
            'alamat' => $c->alamat,
            'tanggal_lahir' => $c->tanggal_lahir,
            'jenis_kelamin' => $c->jenis_kelamin,
            'pekerjaan' => $c->pekerjaan,
            'perusahaan' => $c->perusahaan,
            'status' => $c->status,
            'catatan' => $c->catatan,
            'total_order' => $c->total_order,
            'total_nilai_order' => $c->total_nilai_order,
            'last_order_at' => $c->last_order_at,
            'created_at' => $c->created_at,
        ];
    }

    private function getCustomerStats(Customer $customer): array
    {
        $orders = $customer->orders()->orderByDesc('created_at')->limit(10)->get();

        return [
            'total_orders' => $customer->total_order,
            'total_value' => $customer->total_nilai_order,
            'average_order_value' => $customer->total_order > 0 ? round($customer->total_nilai_order / $customer->total_order) : 0,
            'last_order_date' => $customer->last_order_at,
            'recent_orders' => $orders->map(fn($o) => [
                'order_id' => $o->order_id,
                'total_harga' => $o->total_harga,
                'status_pengiriman' => $o->status_pengiriman,
                'created_at' => $o->created_at,
            ]),
        ];
    }
}
