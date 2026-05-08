<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SaleItem extends Model
{
    use HasFactory;

    protected $table = 'sale_items';

    protected $fillable = [
        'order_id',
        'nama_produk',
        'qty',
        'harga_satuan',
        'diskon',
        'subtotal',
        'kategori',
        'kledo_product_id',
    ];

    protected $casts = [
        'qty'              => 'integer',
        'harga_satuan'     => 'integer',
        'diskon'           => 'integer',
        'subtotal'         => 'integer',
        'kledo_product_id' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }
}
