<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosWarehouse extends Model
{
    protected $table = 'pos_warehouses';
    protected $fillable = ['code','name','address','phone','is_default','is_active'];
    protected $casts = ['is_default'=>'boolean','is_active'=>'boolean'];

    public function inventories(): HasMany { return $this->hasMany(PosInventory::class,'warehouse_id'); }
    public function stockMovements(): HasMany { return $this->hasMany(PosStockMovement::class,'warehouse_id'); }
}
