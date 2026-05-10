<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosCustomer extends Model
{
    protected $table = 'pos_customers';
    protected $fillable = [
        'code','name','type','phone','email','address','city','province',
        'nik','npwp','membership_tier','credit_limit','payment_term_days',
        'total_purchases','total_transactions','price_tier_id','custom_discount_pct','notes','is_active',
    ];
    protected $casts = [
        'is_active'=>'boolean','credit_limit'=>'decimal:2',
        'total_purchases'=>'decimal:2','custom_discount_pct'=>'decimal:2',
    ];

    public function priceTier(): BelongsTo { return $this->belongsTo(PosPriceTier::class,'price_tier_id'); }
    public function sales(): HasMany { return $this->hasMany(PosSale::class,'customer_id'); }
    public function receivables(): HasMany { return $this->hasMany(PosReceivable::class,'customer_id'); }

    public function getTotalReceivableAttribute(): float
    {
        return (float) $this->receivables()->whereIn('status',['unpaid','partial'])->sum('remaining');
    }
}
