<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ErpEmployee extends Model {
    use HasFactory;
    protected $table = 'erp_employees';
    protected $fillable = ['nik','nama','jabatan','departemen','branch_id','telepon','email','alamat','tanggal_masuk','gaji_pokok','status','foto'];
    protected $casts = ['tanggal_masuk' => 'date', 'gaji_pokok' => 'decimal:2'];
    public function branch() { return $this->belongsTo(ErpBranch::class, 'branch_id'); }
    public function attendances() { return $this->hasMany(ErpAttendance::class, 'employee_id'); }
    public function payrolls() { return $this->hasMany(ErpPayroll::class, 'employee_id'); }
}
