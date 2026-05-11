<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpChartOfAccount extends Model {
    protected $table = 'erp_chart_of_accounts';
    protected $fillable = ['kode','nama','tipe','sub_tipe','parent_id','saldo_normal','is_active'];
    protected $casts = ['saldo_normal' => 'decimal:2', 'is_active' => 'boolean'];
    public function parent() { return $this->belongsTo(ErpChartOfAccount::class, 'parent_id'); }
    public function children() { return $this->hasMany(ErpChartOfAccount::class, 'parent_id'); }
}
