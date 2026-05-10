<?php

namespace App\Models\Pos;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class PosUser extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'pos_users';

    protected $fillable = [
        'name', 'email', 'username', 'password', 'phone',
        'avatar', 'role_id', 'is_active', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'is_active'     => 'boolean',
        'last_login_at' => 'datetime',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(PosRole::class, 'role_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(PosSale::class, 'cashier_id');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(PosCashierSession::class, 'user_id');
    }

    public function hasPermission(string $permission): bool
    {
        return $this->role->permissions()->where('name', $permission)->exists();
    }

    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
    }
}
