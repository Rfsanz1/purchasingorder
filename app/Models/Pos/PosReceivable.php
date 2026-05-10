<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosReceivable extends Model
{
    protected $table = 'pos_receivables';
    protected $fillable = ['code','sale_id','customer_id','amount','paid_amount','remaining','due_date','status','notes'];
    protected $casts = ['amount'=>'decimal:2','paid_amount'=>'decimal:2','remaining'=>'decimal:2','due_date'=>'date'];

    public function sale(): BelongsTo { return $this->belongsTo(PosSale::class,'sale_id'); }
    public function customer(): BelongsTo { return $this->belongsTo(PosCustomer::class,'customer_id'); }
    public function payments(): HasMany { return $this->hasMany(PosReceivablePayment::class,'receivable_id'); }
}
