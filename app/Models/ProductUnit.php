<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductUnit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'symbol',
        'description',
        'status'
    ];

    public static function generateCode()
    {
        $latest = self::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        return 'UNT' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
