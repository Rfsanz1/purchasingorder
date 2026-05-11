<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpPurchaseOrderItem extends Model {
    protected $table = 'erp_purchase_order_items';
    protected $fillable = ['purchase_order_id','produk_nama','produk_kode','qty','satuan','harga','diskon','subtotal','qty_diterima'];
    protected $casts = ['qty' => 'decimal:2', 'harga' => 'decimal:2', 'subtotal' => 'decimal:2'];
    public function purchaseOrder() { return $this->belongsTo(ErpPurchaseOrder::class, 'purchase_order_id'); }
}
