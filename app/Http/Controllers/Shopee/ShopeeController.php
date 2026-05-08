<?php

namespace App\Http\Controllers\Shopee;

use App\Http\Controllers\Controller;
use App\Models\ShopeeOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShopeeController extends Controller
{
    public function loginPage()
    {
        if (session('shopee_authenticated')) {
            return redirect('/shopee/orders');
        }
        return view('shopee.login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $validPassword = env('ADMIN_PASSWORD', 'admin123');

        if ($request->password === $validPassword) {
            session([
                'shopee_authenticated' => true,
                'shopee_user'          => 'Admin',
            ]);
            return redirect('/shopee/orders')->with('success', 'Login berhasil!');
        }

        return back()->withErrors(['password' => 'Password salah.']);
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

    public function orders(Request $request)
    {
        $orders = ShopeeOrder::orderByDesc('order_created_at')->paginate(50);
        $stats  = [
            'total'       => ShopeeOrder::count(),
            'belum_sync'  => ShopeeOrder::where('synced_to_erp', false)->count(),
            'sudah_sync'  => ShopeeOrder::where('synced_to_erp', true)->count(),
            'total_nilai' => ShopeeOrder::sum('total_amount'),
        ];
        return view('shopee.orders', compact('orders', 'stats'));
    }

    public function importCsv(Request $request): JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240']);

        $file    = $request->file('file');
        $path    = $file->getRealPath();
        $ext     = strtolower($file->getClientOriginalExtension());
        $rows    = [];

        if ($ext === 'csv' || $ext === 'txt') {
            $handle = fopen($path, 'r');
            $header = null;
            while (($line = fgetcsv($handle, 0, ',')) !== false) {
                if (!$header) { $header = $line; continue; }
                if (count($line) === count($header)) {
                    $rows[] = array_combine($header, $line);
                }
            }
            fclose($handle);
        } else {
            return response()->json(['error' => 'Format file tidak didukung. Gunakan CSV dari Shopee Seller Center.'], 422);
        }

        $imported = 0;
        $skipped  = 0;

        foreach ($rows as $row) {
            $orderSn = $this->findColumn($row, ['No. Pesanan', 'Order ID', 'order_sn', 'No Pesanan']);
            if (!$orderSn) { $skipped++; continue; }

            $data = [
                'shopee_order_sn'  => $orderSn,
                'shopee_shop_name' => $this->findColumn($row, ['Nama Toko', 'Shop Name', 'shop_name']) ?? '',
                'status'           => $this->findColumn($row, ['Status Pesanan', 'Order Status', 'status']) ?? 'COMPLETED',
                'buyer_username'   => $this->findColumn($row, ['Username Pembeli', 'Buyer Username', 'buyer_username']) ?? '',
                'buyer_name'       => $this->findColumn($row, ['Nama Pembeli', 'Buyer Name']) ?? '',
                'recipient_name'   => $this->findColumn($row, ['Nama Penerima', 'Recipient Name', 'recipient_name']) ?? '',
                'shipping_address' => $this->findColumn($row, ['Alamat Pengiriman', 'Shipping Address', 'alamat_pengiriman']) ?? '',
                'phone'            => $this->findColumn($row, ['No. Telepon', 'Phone Number', 'phone']) ?? '',
                'product_name'     => $this->findColumn($row, ['Nama Produk', 'Product Name', 'nama_produk']) ?? '',
                'qty'              => (int) ($this->findColumn($row, ['Jumlah', 'Quantity', 'qty', 'Qty']) ?? 1),
                'original_price'   => $this->parseRupiah($this->findColumn($row, ['Harga Awal', 'Original Price']) ?? '0'),
                'deal_price'       => $this->parseRupiah($this->findColumn($row, ['Harga Setelah Diskon', 'Deal Price', 'harga_deal']) ?? '0'),
                'subtotal'         => $this->parseRupiah($this->findColumn($row, ['Total Harga Produk', 'Subtotal']) ?? '0'),
                'shipping_fee'     => $this->parseRupiah($this->findColumn($row, ['Biaya Pengiriman', 'Shipping Fee', 'ongkir']) ?? '0'),
                'voucher_discount' => $this->parseRupiah($this->findColumn($row, ['Voucher Diskon', 'Voucher Discount', 'diskon_voucher']) ?? '0'),
                'total_amount'     => $this->parseRupiah($this->findColumn($row, ['Total Pembayaran', 'Total Amount', 'total_pembayaran', 'Jumlah Pembayaran']) ?? '0'),
                'logistic_name'    => $this->findColumn($row, ['Metode Pengiriman', 'Shipping Method', 'logistic_name']) ?? '',
                'tracking_number'  => $this->findColumn($row, ['No. Resi', 'Tracking Number', 'tracking_number']) ?? '',
                'payment_method'   => $this->findColumn($row, ['Metode Pembayaran', 'Payment Method', 'payment_method']) ?? '',
                'order_created_at' => $this->parseDate($this->findColumn($row, ['Waktu Pesanan Dibuat', 'Order Creation Time', 'created_at', 'Tanggal Pesanan'])),
                'order_paid_at'    => $this->parseDate($this->findColumn($row, ['Waktu Pembayaran', 'Payment Time', 'paid_at'])),
                'raw_data'         => json_encode($row),
            ];

            ShopeeOrder::updateOrCreate(
                ['shopee_order_sn' => $orderSn],
                $data
            );
            $imported++;
        }

        return response()->json([
            'success'  => true,
            'imported' => $imported,
            'skipped'  => $skipped,
            'message'  => "Berhasil import {$imported} pesanan Shopee." . ($skipped ? " ({$skipped} baris dilewati)" : ''),
        ]);
    }

    public function syncToErp(Request $request): JsonResponse
    {
        $ids    = $request->input('ids', []);
        $synced = 0;

        $query = ShopeeOrder::where('synced_to_erp', false);
        if ($ids) $query->whereIn('id', $ids);

        $orders = $query->get();

        foreach ($orders as $order) {
            try {
                $erpOrder = \App\Models\Order::create([
                    'nama_toko'    => 'Shopee — ' . ($order->shopee_shop_name ?: 'Online'),
                    'nama_sales'   => 'shopee',
                    'nama_customer'=> $order->recipient_name ?: $order->buyer_name ?: $order->buyer_username,
                    'alamat'       => $order->shipping_address,
                    'no_hp'        => $order->phone,
                    'produk'       => $order->product_name,
                    'jumlah'       => $order->qty,
                    'harga'        => $order->total_amount,
                    'total'        => $order->total_amount,
                    'status'       => 'selesai',
                    'catatan'      => 'Import dari Shopee. No. Pesanan: ' . $order->shopee_order_sn,
                    'created_at'   => $order->order_created_at ?? now(),
                ]);

                $order->update(['synced_to_erp' => true, 'erp_order_id' => $erpOrder->id]);
                $synced++;
            } catch (\Exception $e) {
                \Log::error('Gagal sync Shopee order ' . $order->shopee_order_sn . ': ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'synced'  => $synced,
            'message' => "Berhasil sinkronisasi {$synced} pesanan ke ERP.",
        ]);
    }

    public function deleteOrder(int $id): JsonResponse
    {
        ShopeeOrder::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private function findColumn(array $row, array $keys): ?string
    {
        foreach ($keys as $k) {
            if (isset($row[$k]) && $row[$k] !== '') return trim($row[$k]);
        }
        foreach ($row as $colKey => $val) {
            foreach ($keys as $k) {
                if (stripos($colKey, $k) !== false && $val !== '') return trim($val);
            }
        }
        return null;
    }

    private function parseRupiah(?string $val): float
    {
        if (!$val) return 0;
        $clean = preg_replace('/[^0-9.,]/', '', $val);
        $clean = str_replace('.', '', $clean);
        $clean = str_replace(',', '.', $clean);
        return (float) $clean;
    }

    private function parseDate(?string $val): ?string
    {
        if (!$val) return null;
        try {
            return \Carbon\Carbon::parse($val)->toDateTimeString();
        } catch (\Exception $e) {
            return null;
        }
    }
}
