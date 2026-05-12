<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Warehouse extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'address',
        'city',
        'province',
        'description',
        'capacity',
        'status',
        'manager_name',
        'manager_phone'
    ];

    public static function generateCode()
    {
        $latest = self::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        return 'WH' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
