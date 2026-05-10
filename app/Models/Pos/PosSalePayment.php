<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosSalePayment extends Model
{
    protected $table = 'pos_sale_payments';
    protected $fillable = ['sale_id','method','reference','amount','bank_name','paid_at','notes'];
    protected $casts = ['amount'=>'decimal:2','paid_at'=>'datetime'];

    public function sale(): BelongsTo { return $this->belongsTo(PosSale::class,'sale_id'); }
}
