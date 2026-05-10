<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosPriceTier extends Model
{
    protected $table = 'pos_price_tiers';
    protected $fillable = ['name','label','min_qty','sort_order','is_active'];
    protected $casts = ['is_active'=>'boolean'];

    public function customers(): HasMany { return $this->hasMany(PosCustomer::class,'price_tier_id'); }
    public function productPrices(): HasMany { return $this->hasMany(PosProductPrice::class,'price_tier_id'); }
}
