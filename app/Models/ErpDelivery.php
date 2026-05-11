<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpDelivery extends Model {
    protected $table = 'erp_deliveries';
    protected $fillable = ['nomor','customer_nama','alamat_tujuan','driver_nama','kendaraan','tanggal_kirim','jam_kirim','berat_total','status','order_referensi','catatan','foto_bukti','lat','lng'];
    protected $casts = ['tanggal_kirim' => 'date', 'berat_total' => 'decimal:2', 'lat' => 'decimal:6', 'lng' => 'decimal:6'];
}
