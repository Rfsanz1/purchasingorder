<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosPayable extends Model
{
    protected $table = 'pos_payables';
    protected $fillable = ['code','purchase_id','supplier_id','amount','paid_amount','remaining','due_date','status','notes'];
    protected $casts = ['amount'=>'decimal:2','paid_amount'=>'decimal:2','remaining'=>'decimal:2','due_date'=>'date'];

    public function purchase(): BelongsTo { return $this->belongsTo(PosPurchase::class,'purchase_id'); }
    public function supplier(): BelongsTo { return $this->belongsTo(PosSupplier::class,'supplier_id'); }
    public function payments(): HasMany { return $this->hasMany(PosPayablePayment::class,'payable_id'); }
}
