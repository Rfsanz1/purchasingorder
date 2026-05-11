<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpAttendance extends Model {
    protected $table = 'erp_attendance';
    protected $fillable = ['employee_id','tanggal','jam_masuk','jam_keluar','status','overtime_hours','keterangan'];
    protected $casts = ['tanggal' => 'date', 'overtime_hours' => 'decimal:2'];
    public function employee() { return $this->belongsTo(ErpEmployee::class, 'employee_id'); }
}
