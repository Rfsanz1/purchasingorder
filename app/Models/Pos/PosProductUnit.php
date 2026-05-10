<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosProductUnit extends Model
{
    protected $table = 'pos_product_units';
    protected $fillable = [
        'product_id', 'unit_id', 'conversion_factor',
        'selling_price', 'cost_price', 'is_default',
    ];
    protected $casts = [
        'conversion_factor' => 'decimal:4',
        'selling_price'     => 'decimal:2',
        'cost_price'        => 'decimal:2',
        'is_default'        => 'boolean',
    ];

    public function product(): BelongsTo { return $this->belongsTo(PosProduct::class, 'product_id'); }
    public function unit(): BelongsTo { return $this->belongsTo(PosUnit::class, 'unit_id'); }
}
