<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpBankTransaction extends Model {
    protected $table = 'erp_bank_transactions';
    protected $fillable = ['bank_account_id','tipe','tanggal','jumlah','keterangan','referensi','saldo_setelah','is_reconciled'];
    protected $casts = ['tanggal' => 'date', 'jumlah' => 'decimal:2', 'saldo_setelah' => 'decimal:2', 'is_reconciled' => 'boolean'];
    public function bankAccount() { return $this->belongsTo(ErpBankAccount::class, 'bank_account_id'); }
}
