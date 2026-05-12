<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpSupplier extends Model {
    protected $table = 'erp_suppliers';
    protected $fillable = ['kode','nama','perusahaan','telepon','email','alamat','kota','npwp','pic','rekening_bank','nama_bank','total_pembelian','hutang','status','kledo_id','kledo_data'];
    protected $casts = ['total_pembelian' => 'decimal:2', 'hutang' => 'decimal:2'];
    public function purchaseOrders() { return $this->hasMany(ErpPurchaseOrder::class, 'supplier_id'); }
}
