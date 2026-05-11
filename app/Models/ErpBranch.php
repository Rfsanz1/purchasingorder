<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpBranch extends Model {
    protected $table = 'erp_branches';
    protected $fillable = ['kode','nama','alamat','kota','telepon','email','pic','is_active'];
    protected $casts = ['is_active' => 'boolean'];
    public function employees() { return $this->hasMany(ErpEmployee::class, 'branch_id'); }
    public function warehouses() { return $this->hasMany(ErpWarehouse::class, 'branch_id'); }
}
