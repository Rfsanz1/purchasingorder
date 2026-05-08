<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';

    protected $fillable = [
        'sales_id',
        'nama_produk',
        'sku',
        'brand',
        'kledo_product_id',
        'kledo_product_name',
        'harga',
        'harga_kledo',
        'harga_jual',
        'hpp',
        'stok',
    ];

    protected $casts = [
        'harga'            => 'integer',
        'harga_kledo'      => 'integer',
        'harga_jual'       => 'integer',
        'hpp'              => 'integer',
        'stok'             => 'integer',
        'kledo_product_id' => 'integer',
    ];

    public function scopeAvailable($query)
    {
        return $query;
    }

    public function scopeBySales($query, string $salesId)
    {
        return $query->where('sales_id', $salesId);
    }

    public function scopeByBrand($query, string $brand)
    {
        return $query->where('brand', $brand);
    }
}
