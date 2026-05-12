<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpStockMovement extends Model {
    protected $table = 'erp_stock_movements';
    protected $fillable = ['warehouse_id','produk_id','produk_nama','produk_kode','tipe','qty','qty_sebelum','qty_sesudah','harga_satuan','referensi','keterangan','created_by','product_id','movement_type','quantity','reference_type','reference_id','notes','kledo_id','kledo_data'];
    protected $casts = ['qty' => 'decimal:2', 'harga_satuan' => 'decimal:2'];
    public function warehouse() { return $this->belongsTo(ErpWarehouse::class, 'warehouse_id'); }
}
