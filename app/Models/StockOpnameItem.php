<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockOpnameItem extends Model
{
    protected $fillable = [
        'stock_opname_id',
        'product_id',
        'kledo_product_id',
        'sku',
        'nama_produk',
        'expected_qty',
        'counted_qty',
        'diff',
        'source',
    ];

    protected $casts = [
        'expected_qty' => 'integer',
        'counted_qty' => 'integer',
        'diff' => 'integer',
    ];

    public function stockOpname(): BelongsTo
    {
        return $this->belongsTo(StockOpname::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
