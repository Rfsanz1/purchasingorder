<?php

namespace App\Modules\POS\Services;

use App\Models\Pos\PosProduct;
use App\Models\Pos\PosProductUnit;
use App\Models\Pos\PosProductPrice;
use App\Modules\POS\Repositories\ProductRepository;
use Illuminate\Support\Str;

class ProductService
{
    public function __construct(private readonly ProductRepository $repo) {}

    public function list(array $filters, int $perPage = 20)
    {
        return $this->repo->paginate($filters, $perPage);
    }

    public function searchForPos(string $query, int $warehouseId)
    {
        return $this->repo->searchForPos($query, $warehouseId);
    }

    public function find(int $id): ?PosProduct
    {
        return $this->repo->find($id);
    }

    public function create(array $data): PosProduct
    {
        $data['sku']  = $data['sku'] ?? strtoupper(Str::random(8));
        $data['slug'] = Str::slug($data['name']) . '-' . strtolower(Str::random(6));

        $product = $this->repo->create($data);

        if (!empty($data['product_units'])) {
            foreach ($data['product_units'] as $pu) {
                PosProductUnit::create(array_merge($pu, ['product_id' => $product->id]));
            }
        }

        if (!empty($data['prices'])) {
            foreach ($data['prices'] as $pr) {
                PosProductPrice::create(array_merge($pr, ['product_id' => $product->id]));
            }
        }

        return $this->repo->find($product->id);
    }

    public function update(int $id, array $data): PosProduct
    {
        $product = $this->repo->find($id);
        $updated = $this->repo->update($product, $data);

        if (isset($data['product_units'])) {
            $product->productUnits()->delete();
            foreach ($data['product_units'] as $pu) {
                PosProductUnit::create(array_merge($pu, ['product_id' => $product->id]));
            }
        }

        if (isset($data['prices'])) {
            $product->prices()->delete();
            foreach ($data['prices'] as $pr) {
                PosProductPrice::create(array_merge($pr, ['product_id' => $product->id]));
            }
        }

        return $this->repo->find($updated->id);
    }

    public function delete(int $id): bool
    {
        $product = $this->repo->find($id);
        return $this->repo->delete($product);
    }

    public function generateBarcode(int $id): string
    {
        $product = $this->repo->find($id);
        $barcode = str_pad($product->id, 12, '0', STR_PAD_LEFT);
        $product->update(['barcode' => $barcode]);
        return $barcode;
    }

    public function getLowStock(?int $warehouseId = null)
    {
        return $this->repo->getLowStock($warehouseId);
    }
}
