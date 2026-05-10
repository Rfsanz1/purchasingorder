<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosSupplier extends Model
{
    protected $table = 'pos_suppliers';
    protected $fillable = [
        'code','name','company','phone','email','address',
        'city','province','credit_limit','payment_term_days','notes','is_active',
    ];
    protected $casts = ['is_active'=>'boolean','credit_limit'=>'decimal:2'];

    public function products(): HasMany { return $this->hasMany(PosProduct::class,'supplier_id'); }
    public function purchases(): HasMany { return $this->hasMany(PosPurchase::class,'supplier_id'); }
    public function payables(): HasMany { return $this->hasMany(PosPayable::class,'supplier_id'); }

    public function getTotalPayableAttribute(): float
    {
        return (float) $this->payables()->whereIn('status',['unpaid','partial'])->sum('remaining');
    }
}
