<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosStockMovement extends Model
{
    protected $table = 'pos_stock_movements';
    protected $fillable = [
        'product_id','warehouse_id','unit_id','type','reference_type',
        'reference_id','qty','qty_before','qty_after','cost_price','notes','created_by',
    ];
    protected $casts = ['qty'=>'decimal:4','qty_before'=>'decimal:4','qty_after'=>'decimal:4','cost_price'=>'decimal:2'];

    public function product(): BelongsTo { return $this->belongsTo(PosProduct::class,'product_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(PosWarehouse::class,'warehouse_id'); }
    public function unit(): BelongsTo { return $this->belongsTo(PosUnit::class,'unit_id'); }
    public function creator(): BelongsTo { return $this->belongsTo(PosUser::class,'created_by'); }
}
