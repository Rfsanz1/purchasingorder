<?php

namespace App\Modules\POS\Services;

use App\Models\Pos\PosUser;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function attempt(string $email, string $password): ?PosUser
    {
        $user = PosUser::with('role.permissions')
            ->where(fn($q) => $q->where('email', $email)->orWhere('username', $email))
            ->where('is_active', true)
            ->first();

        if (!$user || !Hash::check($password, $user->password)) {
            return null;
        }

        $user->update(['last_login_at' => now()]);
        return $user;
    }

    public function generateToken(PosUser $user): string
    {
        return $user->createToken('pos-token', ['*'])->plainTextToken;
    }

    public function getUserData(PosUser $user): array
    {
        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'username'    => $user->username,
            'avatar'      => $user->avatar,
            'role'        => $user->role->name,
            'role_label'  => $user->role->label,
            'permissions' => $user->role->permissions->pluck('name')->toArray(),
        ];
    }
}
