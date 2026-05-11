<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpCashTransaction extends Model {
    protected $table = 'erp_cash_transactions';
    protected $fillable = ['nomor','tipe','kategori','kas_type','tanggal','jumlah','keterangan','referensi','pihak','status','created_by'];
    protected $casts = ['tanggal' => 'date', 'jumlah' => 'decimal:2'];
}
