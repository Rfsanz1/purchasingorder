<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosSaleItem extends Model
{
    protected $table = 'pos_sale_items';
    protected $fillable = [
        'sale_id','product_id','unit_id','product_name','product_sku',
        'qty','unit_price','cost_price','discount_amount','discount_pct',
        'tax_amount','subtotal','notes',
    ];
    protected $casts = [
        'qty'=>'decimal:4','unit_price'=>'decimal:2','cost_price'=>'decimal:2',
        'discount_amount'=>'decimal:2','tax_amount'=>'decimal:2','subtotal'=>'decimal:2',
    ];

    public function sale(): BelongsTo { return $this->belongsTo(PosSale::class,'sale_id'); }
    public function product(): BelongsTo { return $this->belongsTo(PosProduct::class,'product_id'); }
    public function unit(): BelongsTo { return $this->belongsTo(PosUnit::class,'unit_id'); }
}
