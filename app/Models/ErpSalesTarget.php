<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpSalesTarget extends Model {
    protected $table = 'erp_sales_targets';
    protected $fillable = ['sales_nama','periode','target','realisasi'];
    protected $casts = ['target' => 'decimal:2', 'realisasi' => 'decimal:2'];
}
