<?php

namespace App\Http\Controllers\Shopee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShopeeController extends Controller
{
    public function loginPage()
    {
        if (session('shopee_authenticated')) {
            return redirect('/shopee/dashboard');
        }
        return view('shopee.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $validUsername = env('SHOPEE_ADMIN_USER', 'admin');
        $validPassword = env('SHOPEE_ADMIN_PASS', 'shopee123');

        if ($request->username === $validUsername && $request->password === $validPassword) {
            session([
                'shopee_authenticated' => true,
                'shopee_user'          => $request->username,
            ]);
            return redirect('/shopee/dashboard')->with('success', 'Login berhasil!');
        }

        return back()->withErrors(['password' => 'Username atau password salah.'])->withInput(['username' => $request->username]);
    }

    public function logout()
    {
        session()->forget(['shopee_authenticated', 'shopee_user']);
        return redirect('/shopee/login')->with('success', 'Berhasil logout.');
    }

    public function dashboard(Request $request)
    {
        $managers = config('shopee.managers');
        $activeManager = $request->query('manager');
        $activeMethod  = $request->query('method');

        $currentManager = $activeManager && isset($managers[$activeManager]) ? $managers[$activeManager] : null;
        $currentMethod  = ($currentManager && $activeMethod && isset($currentManager['methods'][$activeMethod]))
            ? ['key' => $activeMethod, 'label' => $currentManager['methods'][$activeMethod]]
            : null;

        return view('shopee.dashboard', compact('managers', 'activeManager', 'activeMethod', 'currentManager', 'currentMethod'));
    }
}
