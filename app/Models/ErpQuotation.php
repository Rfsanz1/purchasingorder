<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpQuotation extends Model {
    protected $table = 'erp_quotations';
    protected $fillable = ['nomor','customer_nama','customer_telepon','tanggal','valid_sampai','subtotal','diskon','ppn','total','status','catatan','sales_nama'];
    protected $casts = ['tanggal' => 'date', 'valid_sampai' => 'date', 'total' => 'decimal:2'];
}
