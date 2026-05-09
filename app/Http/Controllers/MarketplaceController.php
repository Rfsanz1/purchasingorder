<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    private function credentials(): array
    {
        return [
            'super_admin' => [
                'password' => env('MARKETPLACE_SUPER_PASSWORD', env('ADMIN_PASSWORD', 'admin123')),
                'name'     => 'Super Admin',
                'role'     => 'super_admin',
            ],
            'admin_marketplace' => [
                'password' => env('MARKETPLACE_PASSWORD', 'marketplace123'),
                'name'     => 'Admin Marketplace',
                'role'     => 'admin_marketplace',
            ],
        ];
    }

    public function loginPage()
    {
        if (session('marketplace_auth')) {
            return redirect()->route('marketplace.dashboard');
        }
        return view('marketplace.login');
    }

    public function login(Request $request)
    {
        $role     = $request->input('role', '');
        $password = $request->input('password', '');
        $creds    = $this->credentials();

        if (!isset($creds[$role])) {
            return back()->withErrors(['error' => 'Role tidak valid.'])->withInput();
        }

        if ($password !== $creds[$role]['password']) {
            return back()->withErrors(['error' => 'Password salah. Coba lagi.'])->withInput();
        }

        session([
            'marketplace_auth' => true,
            'marketplace_role' => $creds[$role]['role'],
            'marketplace_name' => $creds[$role]['name'],
        ]);

        return redirect()->route('marketplace.dashboard');
    }

    public function logout()
    {
        session()->forget(['marketplace_auth', 'marketplace_role', 'marketplace_name']);
        return redirect()->route('marketplace.login');
    }

    public function dashboard()
    {
        return view('marketplace.dashboard');
    }

    public function page(string $platform, string $page = 'dashboard')
    {
        $platforms = [
            'shopee'     => ['name' => 'Shopee',      'color' => 'orange', 'icon' => '🛍️'],
            'tiktok-shop'=> ['name' => 'TikTok Shop', 'color' => 'teal',   'icon' => '🎵'],
            'tokopedia'  => ['name' => 'Tokopedia',   'color' => 'green',  'icon' => '🟢'],
            'lazada'     => ['name' => 'Lazada',      'color' => 'blue',   'icon' => '🔵'],
            'integrasi'  => ['name' => 'Integrasi',   'color' => 'purple', 'icon' => '🔗'],
        ];

        $pages = [
            'dashboard'  => 'Dashboard',
            'orders'     => 'Pesanan',
            'products'   => 'Produk',
            'chat'       => 'Chat',
            'shipping'   => 'Pengiriman',
            'vouchers'   => 'Voucher',
            'customers'  => 'Customer',
            'analytics'  => 'Analytics',
            'settings'   => 'Pengaturan API',
            'connections'=> 'Koneksi Marketplace',
            'sync'       => 'Sinkronisasi',
            'status'     => 'Status API',
            'mapping'    => 'Mapping Produk',
            'stock-sync' => 'Sinkronisasi Stok',
            'order-sync' => 'Sinkronisasi Pesanan',
            'webhook'    => 'Webhook',
            'config'     => 'Pengaturan',
        ];

        $platformInfo = $platforms[$platform] ?? ['name' => ucfirst(str_replace('-', ' ', $platform)), 'color' => 'gray', 'icon' => '📦'];
        $pageTitle    = $pages[$page] ?? ucfirst(str_replace('-', ' ', $page));

        return view('marketplace.coming-soon', compact('platform', 'page', 'platformInfo', 'pageTitle'));
    }
}
