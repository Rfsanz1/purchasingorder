<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PosRole extends Model
{
    protected $table = 'pos_roles';
    protected $fillable = ['name', 'label', 'description'];

    public function users(): HasMany
    {
        return $this->hasMany(PosUser::class, 'role_id');
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(PosPermission::class, 'pos_role_permissions', 'role_id', 'permission_id');
    }
}
