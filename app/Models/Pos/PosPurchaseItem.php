<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosPurchaseItem extends Model
{
    protected $table = 'pos_purchase_items';
    protected $fillable = [
        'purchase_id','product_id','unit_id','product_name',
        'qty_ordered','qty_received','unit_price','discount_amount','tax_amount','subtotal','notes',
    ];
    protected $casts = [
        'qty_ordered'=>'decimal:4','qty_received'=>'decimal:4',
        'unit_price'=>'decimal:2','subtotal'=>'decimal:2',
    ];

    public function purchase(): BelongsTo { return $this->belongsTo(PosPurchase::class,'purchase_id'); }
    public function product(): BelongsTo { return $this->belongsTo(PosProduct::class,'product_id'); }
    public function unit(): BelongsTo { return $this->belongsTo(PosUnit::class,'unit_id'); }
}
