<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosReceivablePayment extends Model
{
    protected $table = 'pos_receivable_payments';
    protected $fillable = ['receivable_id','amount','method','reference','payment_date','notes','received_by'];
    protected $casts = ['amount'=>'decimal:2','payment_date'=>'date'];

    public function receivable(): BelongsTo { return $this->belongsTo(PosReceivable::class,'receivable_id'); }
    public function receiver(): BelongsTo { return $this->belongsTo(PosUser::class,'received_by'); }
}
