<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosAuthController extends Controller
{
    public function __construct(private readonly AuthService $service) {}

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|string',
            'password' => 'required|string',
        ]);

        $user = $this->service->attempt($request->email, $request->password);

        if (!$user) {
            return response()->json(['message' => 'Email/username atau password salah.'], 401);
        }

        $token = $user->createToken('pos-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $this->service->getUserData($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user('sanctum');
        if (!$user || !($user instanceof \App\Models\Pos\PosUser)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        $user->load('role.permissions');
        return response()->json(['user' => $this->service->getUserData($user)]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user('sanctum')?->currentAccessToken()?->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
