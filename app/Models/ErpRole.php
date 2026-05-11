<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ErpRole extends Model {
    protected $table = 'erp_roles';
    protected $fillable = ['nama','slug','deskripsi','permissions','is_active'];
    protected $casts = ['permissions' => 'array', 'is_active' => 'boolean'];
}
