<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Order;

class LaporanController extends Controller
{
    // Akun kas per divisi
    private const KAS_ELEKTRONIK_ID = 1;
    private const KAS_SULAWESI_ID   = 1466;

    // Pemetaan bank account Kledo
    private const BANK_LABELS = [
        1470 => 'BCA Giro (Transfer)',
        3    => 'Mandiri (Transfer)',
        1456 => 'BNI (Transfer)',
        1464 => 'BRI (Transfer)',
        1465 => 'BCA EDC (Debit)',
        1457 => 'BRI EDC (Debit)',
        1458 => 'BNI EDC (Debit)',
        1459 => 'Mandiri EDC (Debit)',
    ];

    private const TRANSFER_BANK_IDS = [1470, 3, 1456, 1464];
    private const DEBIT_BANK_IDS    = [1465, 1457, 1458, 1459];

    public function divisi(Request $request): JsonResponse
    {
        $dari    = $request->query('dari');
        $sampai  = $request->query('sampai');

        $query = Order::select([
            'kategori_produk', 'total_harga', 'metode_pembayaran',
            'payment_splits', 'harga_produk', 'biaya_pengiriman',
            'created_at', 'nama_kontak', 'alamat', 'sales_person',
            'status_pengiriman',
        ]);

        if ($dari)   $query->whereDate('created_at', '>=', $dari);
        if ($sampai) $query->whereDate('created_at', '<=', $sampai);

        $orders = $query->orderByDesc('created_at')->get();

        // Per divisi
        $divisi = [
            'Elektronik'    => ['count' => 0, 'total' => 0, 'cash' => 0, 'transfer' => 0, 'debit' => 0, 'belumBayar' => 0],
            'BahanBangunan' => ['count' => 0, 'total' => 0, 'cash' => 0, 'transfer' => 0, 'debit' => 0, 'belumBayar' => 0],
            'Campuran'      => ['count' => 0, 'total' => 0, 'cash' => 0, 'transfer' => 0, 'debit' => 0, 'belumBayar' => 0],
        ];

        // Per bank (transfer dan debit)
        $bankTransfer = [];
        $bankDebit    = [];

        // Rekap kas
        $kasElektronik = 0;
        $kasSulawesi   = 0;

        foreach ($orders as $order) {
            $kat    = $order->kategori_produk ?: 'BahanBangunan';
            $total  = (int) $order->total_harga;
            $splits = $order->payment_splits ?? [];

            if (!isset($divisi[$kat])) $kat = 'Campuran';
            $divisi[$kat]['count']++;
            $divisi[$kat]['total'] += $total;

            foreach ((array) $splits as $split) {
                $method    = $split['method'] ?? '';
                $amount    = (int) ($split['amount'] ?? 0);
                $bankId    = (int) ($split['bankAccountId'] ?? 0);

                if ($amount <= 0) continue;

                if ($method === 'CASH') {
                    $divisi[$kat]['cash'] += $amount;
                    if ($kat === 'Elektronik')    $kasElektronik += $amount;
                    else                          $kasSulawesi   += $amount;
                } elseif ($method === 'Transfer') {
                    $divisi[$kat]['transfer'] += $amount;
                    if ($bankId > 0) {
                        $bankTransfer[$bankId] = ($bankTransfer[$bankId] ?? 0) + $amount;
                    }
                } elseif ($method === 'Debit') {
                    $divisi[$kat]['debit'] += $amount;
                    if ($bankId > 0) {
                        $bankDebit[$bankId] = ($bankDebit[$bankId] ?? 0) + $amount;
                    }
                } elseif ($method === 'BelumBayar') {
                    $divisi[$kat]['belumBayar'] += $total;
                }
            }
        }

        // Grand total
        $grandTotal = array_sum(array_column($divisi, 'total'));

        // Format bank labels
        $transferLabeled = [];
        foreach ($bankTransfer as $id => $amt) {
            $label = self::BANK_LABELS[$id] ?? "Bank ID {$id}";
            $transferLabeled[] = ['id' => $id, 'label' => $label, 'total' => $amt];
        }
        $debitLabeled = [];
        foreach ($bankDebit as $id => $amt) {
            $label = self::BANK_LABELS[$id] ?? "Bank ID {$id}";
            $debitLabeled[] = ['id' => $id, 'label' => $label, 'total' => $amt];
        }

        usort($transferLabeled, fn($a, $b) => $b['total'] - $a['total']);
        usort($debitLabeled,    fn($a, $b) => $b['total'] - $a['total']);

        // Validasi alamat Temanggung
        $alamatWarning = $orders->filter(function($o) {
            $alamat = strtolower($o->alamat ?? '');
            return str_contains($alamat, 'magelang') && (
                str_contains($alamat, 'parakan') ||
                str_contains($alamat, 'temanggung') ||
                str_contains($alamat, 'ngadirejo') ||
                str_contains($alamat, 'kranggan')
            );
        })->count();

        return response()->json([
            'success'       => true,
            'periode'       => ['dari' => $dari, 'sampai' => $sampai],
            'totalOrders'   => $orders->count(),
            'grandTotal'    => $grandTotal,
            'divisi'        => $divisi,
            'kas'           => [
                ['id' => self::KAS_ELEKTRONIK_ID, 'label' => 'Kas Elektronik',  'total' => $kasElektronik],
                ['id' => self::KAS_SULAWESI_ID,   'label' => 'Kas Sulawesi',    'total' => $kasSulawesi],
            ],
            'transferPerBank' => $transferLabeled,
            'debitPerBank'    => $debitLabeled,
            'alamatWarning'   => $alamatWarning,
        ]);
    }
}
