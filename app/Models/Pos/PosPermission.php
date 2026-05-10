<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PosPermission extends Model
{
    protected $table = 'pos_permissions';
    protected $fillable = ['name', 'label', 'module'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(PosRole::class, 'pos_role_permissions', 'permission_id', 'role_id');
    }
}
