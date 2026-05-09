<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\KledoSyncLog;

class KledoSync extends Command
{
    protected $signature = 'kledo:sync
        {--start= : Tanggal mulai (Y-m-d), default: 20 hari lalu}
        {--end=   : Tanggal akhir (Y-m-d), default: hari ini}
        {--all    : Sync semua invoice (tanpa filter tanggal)}
        {--pages= : Maks halaman yang di-fetch (default: 50)}';

    protected $description = 'Sinkronisasi data penjualan dari Kledo ke database lokal (upsert/no duplicate)';

    private string $base = 'https://api.kledo.com/api/v1/finance';
    private int $maxRetry = 3;

    public function handle(): int
    {
        $token = \App\Http\Controllers\IntegrasiController::getToken('kledo_token', 'KLEDO_TOKEN');
        if (!$token) {
            $this->error('KLEDO_TOKEN belum dikonfigurasi!');
            return 1;
        }

        $startDate = $this->option('start') ?: date('Y-m-d', strtotime('-20 days'));
        $endDate   = $this->option('end')   ?: date('Y-m-d');
        $syncAll   = $this->option('all');
        $maxPages  = (int) ($this->option('pages') ?: 50);

        $this->info('=== Kledo Sync ===');
        $this->info("Periode : {$startDate} s/d {$endDate}");
        $this->info('Token   : ' . substr($token, 0, 8) . '...');
        if (!$syncAll) {
            $this->info("Mode    : Filter tanggal di sisi client (maks {$maxPages} halaman)");
        } else {
            $this->info('Mode    : Sync semua (tanpa filter tanggal)');
        }
        $this->newLine();

        $page       = 1;
        $inserted   = 0;
        $updated    = 0;
        $errors     = 0;
        $totalFetch = 0;
        $skipped    = 0;
        $stopped    = false;

        do {
            $this->line("  Fetching halaman {$page}...");
            $url  = "{$this->base}/invoices?per_page=100&page={$page}&status=all";
            $data = $this->httpGet($url, $token);

            if (!$data) {
                $this->error("  Gagal fetch halaman {$page}.");
                break;
            }

            $items    = $data['data']['data'] ?? [];
            $lastPage = $data['data']['last_page'] ?? 1;
            $totalFetch += count($items);

            $this->line("  Halaman {$page}/{$lastPage} — " . count($items) . ' invoice');

            foreach ($items as $inv) {
                $transDate = $inv['trans_date'] ?? '';

                // Filter tanggal di sisi client (kecuali mode --all)
                if (!$syncAll) {
                    if ($transDate && $transDate < $startDate) {
                        // Invoice sudah lebih lama dari startDate — karena API sort desc, bisa berhenti
                        $this->line("  Melewati tanggal {$startDate}, berhenti.");
                        $stopped = true;
                        break;
                    }
                    if ($transDate && $transDate > $endDate) {
                        $skipped++;
                        continue;
                    }
                }

                $memo  = $inv['memo'] ?? $inv['message'] ?? '';
                $sales = $this->parseSales($memo);

                $row = [
                    'kledo_invoice_id' => (string) $inv['id'],
                    'ref_number'       => $inv['ref_number'] ?? '-',
                    'trans_date'       => $transDate,
                    'contact_name'     => $inv['contact']['name'] ?? $inv['contact_name'] ?? '-',
                    'total'            => (int) ($inv['amount'] ?? $inv['total'] ?? 0),
                    'status'           => $inv['status'] ?? '-',
                    'memo'             => $memo,
                    'sales'            => $sales,
                    'raw_data'         => json_encode($inv),
                ];

                try {
                    $existing = KledoSyncLog::where('kledo_invoice_id', $row['kledo_invoice_id'])->first();
                    if ($existing) {
                        $existing->update(array_merge($row, ['updated_at' => now()]));
                        $updated++;
                    } else {
                        KledoSyncLog::create(array_merge($row, ['synced_at' => now(), 'updated_at' => now()]));
                        $inserted++;
                    }
                } catch (\Exception $e) {
                    $this->warn('  Error upsert ID ' . $row['kledo_invoice_id'] . ': ' . $e->getMessage());
                    $errors++;
                }
            }

            if ($stopped) break;

            $page++;
            if ($page <= min($lastPage, $maxPages)) {
                usleep(200000); // 200ms jeda
            }
        } while ($page <= min($lastPage, $maxPages) && !$stopped);

        $total = KledoSyncLog::count();
        $this->newLine();
        $this->info('=== Selesai ===');
        $this->table(
            ['Keterangan', 'Jumlah'],
            [
                ['Fetched dari Kledo', $totalFetch],
                ['Disimpan (baru)',    $inserted],
                ['Diupdate',          $updated],
                ['Dilewati (di luar rentang)', $skipped],
                ['Error',             $errors],
                ['Total di DB',       $total],
            ]
        );

        // Rekap per sales
        $perSales = KledoSyncLog::selectRaw('sales, COUNT(*) as jumlah, SUM(total) as total_penjualan')
            ->groupBy('sales')
            ->orderByDesc('total_penjualan')
            ->get();

        if ($perSales->count() > 0) {
            $this->newLine();
            $this->info('Rekap per Sales (semua data tersinkron):');
            $rows = $perSales->map(fn($r) => [
                $r->sales,
                $r->jumlah,
                'Rp ' . number_format((float)$r->total_penjualan, 0, ',', '.'),
            ])->toArray();
            $this->table(['Sales', 'Invoice', 'Total Penjualan'], $rows);
        }

        return 0;
    }

    private function httpGet(string $url, string $token, int $retry = 0): ?array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => [
                "Authorization: Bearer {$token}",
                'Accept: application/json',
            ],
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err    = curl_error($ch);
        curl_close($ch);

        if ($err || $status < 200 || $status >= 300 || !$body) {
            if ($retry < $this->maxRetry) {
                $this->warn("  Retry {$retry}/{$this->maxRetry} (HTTP {$status})...");
                sleep(2);
                return $this->httpGet($url, $token, $retry + 1);
            }
            Log::error("Kledo sync HTTP error: status={$status} err={$err}");
            return null;
        }

        $data = json_decode($body, true);
        return ($data['success'] ?? false) ? $data : null;
    }

    private function normalizeSales(string $raw): string
    {
        $known = [
            'lehan', 'agus', 'ivan', 'dias', 'rio brandon',
            'imam', 'agung', 'andre', 'priyanto', 'wiwid', 'dhani',
        ];
        $lower = strtolower(trim($raw));
        foreach ($known as $name) {
            if ($lower === $name) return ucwords($name);
        }
        return ucwords($lower);
    }

    private function parseSales(string $memo): string
    {
        if (!$memo) return 'Tidak Diketahui';

        // Format baru ERP: "NamaSales - +62xxx" atau "NamaSales - 08xxx"
        if (preg_match('/^([^-|\n]+?)\s*-\s*(\+62|0)[\d\s\-\(\)\.]{6,}/', trim($memo), $m)) {
            return $this->normalizeSales(trim($m[1]));
        }
        // Format lama: "Sales: NamaSales - Telp | ..."
        if (preg_match('/Sales:\s*([^-\n|]+)/i', $memo, $m)) {
            return $this->normalizeSales(trim($m[1]));
        }
        // Format: "Order #123 - NamaSales"
        if (preg_match('/Order\s*#\d+\s*-\s*(.+)/i', $memo, $m)) {
            return $this->normalizeSales(trim($m[1]));
        }
        return 'Tidak Diketahui';
    }
}
