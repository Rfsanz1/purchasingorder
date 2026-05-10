<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosUnit extends Model
{
    protected $table = 'pos_units';
    protected $fillable = ['name', 'abbreviation', 'description', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];

    public function products(): HasMany
    {
        return $this->hasMany(PosProduct::class, 'unit_id');
    }

    public function productUnits(): HasMany
    {
        return $this->hasMany(PosProductUnit::class, 'unit_id');
    }
}
