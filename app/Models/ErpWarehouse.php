<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpWarehouse extends Model {
    protected $table = 'erp_warehouses';
    protected $fillable = ['kode','nama','alamat','pic','telepon','branch_id','is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function branch() { return $this->belongsTo(ErpBranch::class, 'branch_id'); }
    public function stockMovements() { return $this->hasMany(ErpStockMovement::class, 'warehouse_id'); }
}
