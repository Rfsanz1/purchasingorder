<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpPayroll extends Model {
    protected $table = 'erp_payroll';
    protected $fillable = ['employee_id','periode','gaji_pokok','tunjangan','lembur','bonus','potongan','pph21','total_gaji','status','tanggal_bayar','catatan'];
    protected $casts = ['tanggal_bayar' => 'date', 'gaji_pokok' => 'decimal:2', 'total_gaji' => 'decimal:2'];
    public function employee() { return $this->belongsTo(ErpEmployee::class, 'employee_id'); }
}
