<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosPayablePayment extends Model
{
    protected $table = 'pos_payable_payments';
    protected $fillable = ['payable_id','amount','method','reference','payment_date','notes','paid_by'];
    protected $casts = ['amount'=>'decimal:2','payment_date'=>'date'];

    public function payable(): BelongsTo { return $this->belongsTo(PosPayable::class,'payable_id'); }
    public function payer(): BelongsTo { return $this->belongsTo(PosUser::class,'paid_by'); }
}
