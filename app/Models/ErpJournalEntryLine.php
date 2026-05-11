<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpJournalEntryLine extends Model {
    public $timestamps = false;
    protected $table = 'erp_journal_entry_lines';
    protected $fillable = ['journal_entry_id','account_id','debit','kredit','keterangan'];
    protected $casts = ['debit' => 'decimal:2', 'kredit' => 'decimal:2'];
    public function journalEntry() { return $this->belongsTo(ErpJournalEntry::class, 'journal_entry_id'); }
    public function account() { return $this->belongsTo(ErpChartOfAccount::class, 'account_id'); }
}
