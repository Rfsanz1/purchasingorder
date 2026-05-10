<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosSale extends Model
{
    protected $table = 'pos_sales';
    protected $fillable = [
        'invoice_number','reference_number','customer_id','cashier_id',
        'warehouse_id','session_id','status','sale_type',
        'subtotal','discount_amount','discount_pct','tax_amount','tax_pct',
        'shipping_cost','other_cost','grand_total','paid_amount','change_amount',
        'payment_status','notes','customer_name','customer_phone',
    ];
    protected $casts = [
        'subtotal'=>'decimal:2','discount_amount'=>'decimal:2','tax_amount'=>'decimal:2',
        'grand_total'=>'decimal:2','paid_amount'=>'decimal:2','change_amount'=>'decimal:2',
    ];

    public function customer(): BelongsTo { return $this->belongsTo(PosCustomer::class,'customer_id'); }
    public function cashier(): BelongsTo { return $this->belongsTo(PosUser::class,'cashier_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(PosWarehouse::class,'warehouse_id'); }
    public function session(): BelongsTo { return $this->belongsTo(PosCashierSession::class,'session_id'); }
    public function items(): HasMany { return $this->hasMany(PosSaleItem::class,'sale_id'); }
    public function payments(): HasMany { return $this->hasMany(PosSalePayment::class,'sale_id'); }
    public function receivable(): HasMany { return $this->hasMany(PosReceivable::class,'sale_id'); }
}
