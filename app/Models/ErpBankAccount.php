<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpBankAccount extends Model {
    protected $table = 'erp_bank_accounts';
    protected $fillable = ['nama_bank','no_rekening','atas_nama','saldo','is_active'];
    protected $casts = ['saldo' => 'decimal:2', 'is_active' => 'boolean'];
    public function transactions() { return $this->hasMany(ErpBankTransaction::class, 'bank_account_id'); }
}
