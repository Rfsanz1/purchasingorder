<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpPurchaseOrder extends Model {
    protected $table = 'erp_purchase_orders';
    protected $fillable = ['nomor','supplier_id','tanggal','tanggal_kirim','subtotal','diskon','ppn','total','dibayar','status','status_bayar','catatan','created_by'];
    protected $casts = ['tanggal' => 'date', 'tanggal_kirim' => 'date', 'subtotal' => 'decimal:2', 'total' => 'decimal:2'];
    public function supplier() { return $this->belongsTo(ErpSupplier::class, 'supplier_id'); }
    public function items() { return $this->hasMany(ErpPurchaseOrderItem::class, 'purchase_order_id'); }
}
