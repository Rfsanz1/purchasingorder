<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\SalesController;

class AuthController extends Controller
{
    private array $salesUsernames = [];

    private array $driverUsernames = ['yanto', 'wawan', 'chaidar'];

    public function login(Request $request): JsonResponse
    {
        $role     = $request->input('role');
        $username = strtolower(trim($request->input('username', '')));
        $password = $request->input('password');

        if (!$role) {
            return response()->json(['ok' => false, 'error' => 'Role wajib diisi'], 400);
        }

        $adminPass = env('ADMIN_PASSWORD', 'admin123');

        if ($role === 'admin') {
            if ($password === $adminPass) {
                return response()->json(['ok' => true, 'role' => 'admin']);
            }
            return response()->json(['ok' => false, 'error' => 'Password salah'], 401);
        }

        if ($role === 'driver') {
            if (!$username || !in_array($username, $this->driverUsernames)) {
                return response()->json(['ok' => false, 'error' => 'Username driver tidak dikenal'], 401);
            }
            return response()->json(['ok' => true, 'role' => 'driver', 'username' => $username]);
        }

        if ($role === 'sales') {
            $validSales = SalesController::ids();
            if (!$username || !in_array($username, $validSales)) {
                return response()->json(['ok' => false, 'error' => 'Nama sales tidak dikenal'], 401);
            }
            return response()->json(['ok' => true, 'role' => 'sales', 'username' => $username]);
        }

        return response()->json(['ok' => false, 'error' => 'Login gagal'], 401);
    }
}
