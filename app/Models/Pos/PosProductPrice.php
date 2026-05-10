<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosProductPrice extends Model
{
    protected $table = 'pos_product_prices';
    protected $fillable = ['product_id','price_tier_id','unit_id','price','min_qty'];
    protected $casts = ['price'=>'decimal:2'];

    public function product(): BelongsTo { return $this->belongsTo(PosProduct::class,'product_id'); }
    public function priceTier(): BelongsTo { return $this->belongsTo(PosPriceTier::class,'price_tier_id'); }
    public function unit(): BelongsTo { return $this->belongsTo(PosUnit::class,'unit_id'); }
}
