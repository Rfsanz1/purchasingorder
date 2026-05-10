<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PosInventory extends Model
{
    protected $table = 'pos_inventories';
    protected $fillable = ['product_id','warehouse_id','qty_on_hand','qty_reserved'];
    protected $casts = ['qty_on_hand'=>'decimal:4','qty_reserved'=>'decimal:4'];

    public function product(): BelongsTo { return $this->belongsTo(PosProduct::class,'product_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(PosWarehouse::class,'warehouse_id'); }
}
