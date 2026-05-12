<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\KledoSyncLog;
use App\Models\Order;
use App\Models\Customer;

class KledoAutoSync extends Command
{
    protected $signature = 'kledo:auto-sync
                            {--hours=1 : Sync data dalam X jam terakhir}
                            {--force : Force sync semua data hari ini}
                            {--full : Sync semua master data dan transaksi}';

    protected $description = 'Sinkronisasi otomatis data dari Kledo ke ERP setiap jam';

    private string $base = 'https://api.kledo.com/api/v1/finance';

    public function handle(): int
    {
        $token = \App\Http\Controllers\IntegrasiController::getToken('kledo_token', 'KLEDO_TOKEN');
        if (!$token) {
            $this->error('KLEDO_TOKEN belum dikonfigurasi!');
            Log::error('KledoAutoSync: Token tidak dikonfigurasi');
            return 1;
        }

        $hours = (int) $this->option('hours');
        $force = $this->option('force');
        $full = $this->option('full');

        if ($full) {
            $this->info('Full sync mode: Sync semua master data dan transaksi');
            return $this->performFullSync($token);
        }

        if ($force) {
            $startDate = date('Y-m-d');
            $endDate = date('Y-m-d');
            $this->info('Force sync: Data hari ini');
        } else {
            $startDate = date('Y-m-d H:i:s', strtotime("-{$hours} hours"));
            $endDate = date('Y-m-d H:i:s');
            $this->info("Sync data {$hours} jam terakhir");
        }

        $this->line("Periode: {$startDate} - {$endDate}");

        try {
            // 1. Ambil data invoice dari Kledo
            $invoices = $this->fetchInvoicesFromKledo($token, $startDate, $endDate);

            if (empty($invoices)) {
                $this->info('Tidak ada data baru dari Kledo');
                return 0;
            }

            $this->info("Ditemukan " . count($invoices) . " invoice dari Kledo");

            // 2. Sync ke ERP
            $synced = 0;
            $errors = 0;

            foreach ($invoices as $invoice) {
                try {
                    $this->syncInvoiceToERP($invoice);
                    $synced++;
                } catch (\Exception $e) {
                    $this->error("Gagal sync invoice {$invoice['ref_number']}: " . $e->getMessage());
                    Log::error("KledoAutoSync error for invoice {$invoice['ref_number']}: " . $e->getMessage());
                    $errors++;
                }
            }

            $this->info("✅ Sync selesai: {$synced} berhasil, {$errors} error");

            // 3. Log hasil sync
            Log::info("KledoAutoSync completed: {$synced} synced, {$errors} errors", [
                'period' => [$startDate, $endDate],
                'force' => $force
            ]);

            return 0;

        } catch (\Exception $e) {
            $this->error('Sync gagal: ' . $e->getMessage());
            Log::error('KledoAutoSync failed: ' . $e->getMessage());
            return 1;
        }
    }

    private function performFullSync(string $token): int
    {
        try {
            $this->info('Syncing customers...');
            $result = \App\Services\KledoService::syncCustomers();
            $this->info($result['message']);

            $this->info('Syncing products...');
            $result = \App\Services\KledoService::syncProducts();
            $this->info($result['message']);

            $this->info('Syncing suppliers...');
            $result = \App\Services\KledoService::syncSuppliers();
            $this->info($result['message']);

            $this->info('Syncing invoices...');
            $result = \App\Services\KledoService::syncInvoices();
            $this->info($result['message']);

            $this->info('Syncing stock movements...');
            $result = \App\Services\KledoService::syncStockMovements();
            $this->info($result['message']);

            $this->info('Syncing journals...');
            $result = \App\Services\KledoService::syncJournals();
            $this->info($result['message']);

            $this->info('✅ Full sync completed successfully');
            Log::info('KledoAutoSync full sync completed');

            return 0;

        } catch (\Exception $e) {
            $this->error('Full sync failed: ' . $e->getMessage());
            Log::error('KledoAutoSync full sync failed: ' . $e->getMessage());
            return 1;
        }
    }

    private function fetchInvoicesFromKledo(string $token, string $startDate, string $endDate): array
    {
        $headers = [
            'Authorization: Bearer ' . $token,
            'Accept: application/json',
        ];

        $url = "{$this->base}/invoices?per_page=100&type=sales&start_date=" . urlencode($startDate) . "&end_date=" . urlencode($endDate);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 15, // Reduced from 30
            CURLOPT_CONNECTTIMEOUT => 5, // Add connection timeout
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new \Exception("Kledo API error: HTTP {$httpCode}");
        }

        $data = json_decode($response, true);

        if (!($data['success'] ?? false)) {
            throw new \Exception("Kledo API response error: " . ($data['message'] ?? 'Unknown error'));
        }

        return $data['data']['data'] ?? [];
    }

    private function syncInvoiceToERP(array $invoice): void
    {
        // 1. Cek apakah sudah ada di KledoSyncLog
        $existing = KledoSyncLog::where('kledo_invoice_id', $invoice['id'])->first();

        if ($existing) {
            // Update jika ada perubahan
            $existing->update([
                'ref_number' => $invoice['ref_number'],
                'trans_date' => $invoice['trans_date'],
                'contact_name' => $invoice['contact']['name'] ?? null,
                'alamat' => $invoice['contact']['address'] ?? null,
                'total' => (int) ($invoice['total'] ?? 0),
                'diskon' => (int) ($invoice['discount'] ?? 0),
                'pajak' => (int) ($invoice['tax'] ?? 0),
                'status' => $invoice['status'] ?? 'draft',
                'memo' => $invoice['memo'] ?? null,
                'raw_data' => $invoice,
                'updated_at' => now(),
            ]);
            return;
        }

        // 2. Jika belum ada, buat record baru
        KledoSyncLog::create([
            'kledo_invoice_id' => $invoice['id'],
            'ref_number' => $invoice['ref_number'],
            'trans_date' => $invoice['trans_date'],
            'contact_name' => $invoice['contact']['name'] ?? null,
            'alamat' => $invoice['contact']['address'] ?? null,
            'total' => (int) ($invoice['total'] ?? 0),
            'diskon' => (int) ($invoice['discount'] ?? 0),
            'pajak' => (int) ($invoice['tax'] ?? 0),
            'status' => $invoice['status'] ?? 'draft',
            'metode_pembayaran' => $this->extractPaymentMethod($invoice),
            'sales' => $this->extractSales($invoice),
            'memo' => $invoice['memo'] ?? null,
            'items' => $this->extractItems($invoice),
            'raw_data' => $invoice,
            'synced_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. Update atau buat Order jika belum ada
        $this->syncToOrder($invoice);
    }

    private function extractPaymentMethod(array $invoice): ?string
    {
        // Extract dari memo atau payments
        $memo = strtolower($invoice['memo'] ?? '');

        if (str_contains($memo, 'cash')) return 'CASH';
        if (str_contains($memo, 'transfer')) return 'Transfer';
        if (str_contains($memo, 'debit')) return 'Debit';

        // Cek dari payments jika ada
        if (isset($invoice['payments']) && is_array($invoice['payments'])) {
            foreach ($invoice['payments'] as $payment) {
                if (isset($payment['payment_method'])) {
                    return $payment['payment_method'];
                }
            }
        }

        return null;
    }

    private function extractSales(array $invoice): ?string
    {
        $memo = $invoice['memo'] ?? '';

        // Cari pola "Sales: Nama" atau "Nama - 08xxxxxxxxx"
        if (preg_match('/sales:\s*([^-\n]+)/i', $memo, $matches)) {
            return trim($matches[1]);
        }

        // Cari pola "Nama - nomor"
        if (preg_match('/^([^-]+)\s*-\s*\d+/', $memo, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    private function extractItems(array $invoice): array
    {
        if (!isset($invoice['items']) || !is_array($invoice['items'])) {
            return [];
        }

        $items = [];
        foreach ($invoice['items'] as $item) {
            $items[] = [
                'product_name' => $item['product']['name'] ?? 'Unknown Product',
                'quantity' => (int) ($item['quantity'] ?? 1),
                'price' => (int) ($item['price'] ?? 0),
                'total' => (int) ($item['total'] ?? 0),
            ];
        }

        return $items;
    }

    private function syncToOrder(array $invoice): void
    {
        // Generate order_id dari ref_number atau kledo_invoice_id
        $orderId = 'KLD-' . $invoice['id'];

        // Cek apakah order sudah ada
        $existingOrder = Order::where('order_id', $orderId)->first();

        if ($existingOrder) {
            // Update jika perlu
            $existingOrder->update([
                'nama_kontak' => $invoice['contact']['name'] ?? $existingOrder->nama_kontak,
                'alamat' => $invoice['contact']['address'] ?? $existingOrder->alamat,
                'nama_produk' => $this->formatItemsForOrder($invoice),
                'total_harga' => (int) ($invoice['total'] ?? 0),
                'sales_person' => $this->extractSales($invoice) ?? $existingOrder->sales_person,
                'metode_pembayaran' => $this->extractPaymentMethod($invoice) ?? $existingOrder->metode_pembayaran,
                'kledo_invoice_id' => $invoice['id'],
            ]);
            return;
        }

        // Buat order baru
        $items = $this->extractItems($invoice);
        $totalQty = array_sum(array_column($items, 'quantity'));
        $totalPrice = array_sum(array_column($items, 'total'));

        Order::create([
            'order_id' => $orderId,
            'nama_kontak' => $invoice['contact']['name'] ?? 'Customer from Kledo',
            'nomor_telepon' => null, // Tidak ada di invoice basic
            'alamat' => $invoice['contact']['address'] ?? null,
            'nama_produk' => $this->formatItemsForOrder($invoice),
            'jumlah_produk' => $totalQty,
            'harga_produk' => $totalPrice,
            'biaya_pengiriman' => 0,
            'total_harga' => (int) ($invoice['total'] ?? 0),
            'sales_person' => $this->extractSales($invoice) ?? 'Kledo Import',
            'metode_pembayaran' => $this->extractPaymentMethod($invoice) ?? 'CASH',
            'keterangan_pembayaran' => null,
            'whatsapp_sent' => 'false',
            'status_pengiriman' => 'Selesai', // Sudah ada di Kledo
            'metode_pengiriman' => 'Dikirim',
            'kategori_produk' => 'BahanBangunan', // Default
            'kledo_invoice_id' => $invoice['id'],
            'raw_items' => $items,
            'created_at' => $invoice['trans_date'] ?? now(),
        ]);
    }

    private function formatItemsForOrder(array $invoice): string
    {
        $items = $this->extractItems($invoice);

        if (count($items) === 1) {
            return $items[0]['product_name'];
        }

        return implode("\n", array_map(
            fn($item, $idx) => ($idx + 1) . '. ' . $item['product_name'] . ' (' . $item['quantity'] . 'x)',
            $items,
            array_keys($items)
        ));
    }
}