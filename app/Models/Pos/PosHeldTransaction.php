<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosHeldTransaction extends Model
{
    protected $table = 'pos_held_transactions';
    protected $fillable = ['hold_code','cashier_id','customer_id','cart_data','grand_total','notes'];
    protected $casts = ['cart_data'=>'array','grand_total'=>'decimal:2'];

    public function cashier(): BelongsTo { return $this->belongsTo(PosUser::class,'cashier_id'); }
    public function customer(): BelongsTo { return $this->belongsTo(PosCustomer::class,'customer_id'); }
}
