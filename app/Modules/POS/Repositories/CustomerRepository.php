<?php

namespace App\Modules\POS\Repositories;

use App\Models\Pos\PosCustomer;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class CustomerRepository
{
    public function paginate(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return PosCustomer::with(['priceTier'])
            ->when($filters['search'] ?? null, fn($q, $s) =>
                $q->where('name', 'ilike', "%$s%")
                  ->orWhere('phone', 'ilike', "%$s%")
                  ->orWhere('code', 'ilike', "%$s%"))
            ->when($filters['type'] ?? null, fn($q, $v) => $q->where('type', $v))
            ->when($filters['membership_tier'] ?? null, fn($q, $v) => $q->where('membership_tier', $v))
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function search(string $query): Collection
    {
        return PosCustomer::where('is_active', true)
            ->where(fn($q) =>
                $q->where('name', 'ilike', "%$query%")
                  ->orWhere('phone', 'ilike', "%$query%")
                  ->orWhere('code', 'ilike', "%$query%"))
            ->limit(10)->get();
    }

    public function find(int $id): ?PosCustomer
    {
        return PosCustomer::with(['priceTier', 'receivables'])->find($id);
    }

    public function create(array $data): PosCustomer
    {
        $data['code'] = $this->nextCode();
        return PosCustomer::create($data);
    }

    public function update(PosCustomer $customer, array $data): PosCustomer
    {
        $customer->update($data);
        return $customer->fresh();
    }

    private function nextCode(): string
    {
        $last = PosCustomer::orderByDesc('id')->first();
        $seq = $last ? ((int) substr($last->code, 3)) + 1 : 1;
        return 'CST' . str_pad($seq, 5, '0', STR_PAD_LEFT);
    }
}
