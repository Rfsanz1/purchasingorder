<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpJournalEntry extends Model {
    protected $table = 'erp_journal_entries';
    protected $fillable = ['nomor','tanggal','keterangan','total_debit','total_kredit','status','referensi','created_by','journal_number','date','description','reference_type','reference_id','total_debit','total_credit','kledo_id','kledo_data'];
    protected $casts = ['tanggal' => 'date', 'total_debit' => 'decimal:2', 'total_kredit' => 'decimal:2'];
    public function lines() { return $this->hasMany(ErpJournalEntryLine::class, 'journal_entry_id'); }
}
