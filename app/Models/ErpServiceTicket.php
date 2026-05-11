<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpServiceTicket extends Model {
    protected $table = 'erp_service_tickets';
    protected $fillable = ['nomor','customer_nama','customer_telepon','produk_nama','produk_sn','keluhan','diagnosa','solusi','teknisi','tanggal_masuk','tanggal_selesai','biaya_servis','biaya_sparepart','total_biaya','status','garansi'];
    protected $casts = ['tanggal_masuk' => 'date', 'tanggal_selesai' => 'date', 'total_biaya' => 'decimal:2'];
}
