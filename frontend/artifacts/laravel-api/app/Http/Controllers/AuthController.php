<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AuthController extends Controller
{
    private array $salesUsernames = [
        'lehan', 'wiwid', 'priyanto', 'agus', 'agung',
        'andre', 'imam', 'dhani', 'rio brandon', 'ivan', 'dias',
    ];

    private array $driverUsernames = ['yanto', 'wawan', 'chaidar'];

    private function salesPassword(string $username): string
    {
        $envKey = 'SALES_PASS_' . strtoupper(str_replace(' ', '_', $username));
        return env($envKey, str_replace(' ', '', $username) . '123');
    }

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
            if (!$username || !in_array($username, $this->salesUsernames)) {
                return response()->json(['ok' => false, 'error' => 'Username sales tidak dikenal'], 401);
            }
            if (!$password) {
                return response()->json(['ok' => false, 'error' => 'Password wajib diisi'], 400);
            }
            if ($password !== $this->salesPassword($username)) {
                return response()->json(['ok' => false, 'error' => 'Password salah'], 401);
            }
            return response()->json(['ok' => true, 'role' => 'sales', 'username' => $username]);
        }

        return response()->json(['ok' => false, 'error' => 'Password salah'], 401);
    }
}
