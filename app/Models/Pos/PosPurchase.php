<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosPurchase extends Model
{
    protected $table = 'pos_purchases';
    protected $fillable = [
        'po_number','supplier_id','warehouse_id','created_by','status','payment_status',
        'order_date','expected_date','received_date',
        'subtotal','discount_amount','tax_amount','shipping_cost','grand_total','paid_amount','notes','shipping_address',
    ];
    protected $casts = [
        'subtotal'=>'decimal:2','grand_total'=>'decimal:2','paid_amount'=>'decimal:2',
        'order_date'=>'date','expected_date'=>'date','received_date'=>'date',
    ];

    public function supplier(): BelongsTo { return $this->belongsTo(PosSupplier::class,'supplier_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(PosWarehouse::class,'warehouse_id'); }
    public function creator(): BelongsTo { return $this->belongsTo(PosUser::class,'created_by'); }
    public function items(): HasMany { return $this->hasMany(PosPurchaseItem::class,'purchase_id'); }
    public function payable(): HasMany { return $this->hasMany(PosPayable::class,'purchase_id'); }
}
