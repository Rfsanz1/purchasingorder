<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use App\Models\KledoSyncLog;

class KledoImportSales extends Command
{
    protected $signature = 'kledo:import-sales
                            {--start-date= : Tanggal mulai (Y-m-d), default: 1 bulan berjalan}
                            {--end-date=   : Tanggal akhir (Y-m-d), default: hari ini}
                            {--per-page=100 : Jumlah invoice per halaman API}
                            {--with-detail  : Fetch detail tiap invoice (item, alamat, metode bayar) — lebih lambat}';

    protected $description = 'Import data penjualan dari Kledo ke database ERP (upsert by invoice number)';

    private string $base;
    private string $token;

    public function handle(): int
    {
        $this->token = env('KLEDO_API_KEY') ?? env('KLEDO_TOKEN', '');
        $this->base  = rtrim(env('KLEDO_BASE_URL', 'https://api.kledo.com/api/v1/finance'), '/');

        if (!$this->token) {
            $this->error('Token Kledo belum dikonfigurasi. Set KLEDO_API_KEY atau KLEDO_TOKEN di .env / Secrets.');
            return 1;
        }

        $startDate  = $this->option('start-date') ?: date('Y-m-01');
        $endDate    = $this->option('end-date')   ?: date('Y-m-d');
        $perPage    = (int) ($this->option('per-page') ?: 100);
        $withDetail = (bool) $this->option('with-detail');

        $this->info("Import Kledo Sales");
        $this->line("Periode  : {$startDate} s/d {$endDate}");
        $this->line("Token    : " . substr($this->token, 0, 20) . '...');
        $this->line("Detail   : " . ($withDetail ? 'Ya (lambat, lengkap)' : 'Tidak (cepat, basic)'));
        $this->newLine();

        // 1. Validasi token
        $this->line('Memeriksa koneksi ke Kledo...');
        if (!$this->checkToken()) {
            $this->error('Token Kledo tidak valid atau koneksi gagal. Periksa KLEDO_API_KEY / KLEDO_TOKEN.');
            return 1;
        }
        $this->info('Token valid. Mulai fetch data...');

        // 2. Fetch invoice dengan early-stop (Kledo tidak support filter tanggal)
        $this->line("Mengambil invoice periode {$startDate} - {$endDate} (early-stop by date)...");
        $invoices = $this->fetchWithEarlyStop($startDate, $endDate, $perPage);

        if (empty($invoices)) {
            $this->warn("Tidak ada invoice ditemukan untuk periode {$startDate} - {$endDate}.");
            return 0;
        }

        $this->info("Ditemukan " . count($invoices) . " invoice dalam periode tersebut.");

        // 3. Fetch detail per invoice (opsional)
        if ($withDetail) {
            $this->line('Mengambil detail tiap invoice (item, alamat, metode bayar)...');
            $invoices = $this->enrichWithDetail($invoices);
        }

        // 4. Upsert ke database
        $this->line('Menyimpan ke database (upsert by kledo_invoice_id)...');
        $result = $this->upsertInvoices($invoices);

        // 5. Laporan
        $this->newLine();
        $this->info('Import selesai!');
        $this->table(
            ['Keterangan', 'Jumlah'],
            [
                ['Total invoice dari Kledo', count($invoices)],
                ['Baru dimasukkan (insert)', $result['inserted']],
                ['Diperbarui (update)',       $result['updated']],
                ['Gagal',                     $result['errors']],
            ]
        );

        Log::info('kledo:import-sales selesai', [
            'periode'    => "{$startDate} - {$endDate}",
            'total'      => count($invoices),
            'inserted'   => $result['inserted'],
            'updated'    => $result['updated'],
            'errors'     => $result['errors'],
            'with_detail'=> $withDetail,
        ]);

        return 0;
    }

    /**
     * Fetch invoice dengan early-stop.
     * Kledo mengurutkan invoice descending (terbaru dulu).
     * Kita berhenti saat menemukan invoice dengan tanggal < startDate.
     */
    private function fetchWithEarlyStop(string $startDate, string $endDate, int $perPage): array
    {
        $all  = [];
        $page = 1;
        $bar  = null;

        do {
            $url  = "{$this->base}/invoices?per_page={$perPage}&page={$page}&status=all";
            $data = $this->httpGet($url);

            if (!$data) {
                $this->warn("  Gagal fetch halaman {$page}, melanjutkan...");
                Log::warning("kledo:import-sales gagal fetch halaman {$page}");
                break;
            }

            $items    = $data['data']['data'] ?? [];
            $lastPage = $data['data']['last_page'] ?? 1;
            $total    = $data['data']['total'] ?? 0;

            if ($page === 1) {
                $this->line("  Total invoice di Kledo: {$total} | Halaman: {$lastPage}");
                $bar = $this->output->createProgressBar($lastPage);
                $bar->start();
            }

            $stopped = false;
            foreach ($items as $inv) {
                $transDate = $inv['trans_date'] ?? '';
                // Kledo descending — kalau sudah lebih kecil dari startDate, stop
                if ($transDate && $transDate < $startDate) {
                    $stopped = true;
                    break;
                }
                // Skip invoice yang di luar endDate (lebih baru)
                if ($transDate && $transDate > $endDate) continue;

                $all[] = $this->mapInvoice($inv);
            }

            $bar?->advance();

            if ($stopped) {
                $bar?->finish();
                $this->newLine();
                $this->line("  Early stop di halaman {$page} — tanggal sudah sebelum {$startDate}.");
                break;
            }

            $page++;
            if ($page <= $lastPage) usleep(200000);
        } while ($page <= $lastPage);

        if ($bar) {
            $bar->finish();
            $this->newLine();
        }

        return $all;
    }

    private function mapInvoice(array $inv): array
    {
        $memo  = $inv['memo'] ?? $inv['message'] ?? '';
        $sales = $this->parseSalesFromMemo($memo);

        $statusText = $inv['status'] ?? null;
        if (!$statusText || $statusText === '-') {
            $statusText = $this->mapStatusId($inv['status_id'] ?? null);
        }

        return [
            'kledo_invoice_id'  => (string) $inv['id'],
            'ref_number'        => $inv['ref_number'] ?? '-',
            'trans_date'        => $inv['trans_date'] ?? '',
            'contact_name'      => $inv['contact']['name'] ?? $inv['contact_name'] ?? '-',
            'alamat'            => $inv['contact']['address'] ?? $inv['address'] ?? null,
            'total'             => (int) ($inv['amount'] ?? $inv['total'] ?? 0),
            'diskon'            => (int) ($inv['discount_amount'] ?? 0),
            'pajak'             => (int) ($inv['tax_amount'] ?? $inv['total_tax'] ?? 0),
            'status'            => $statusText,
            'metode_pembayaran' => $this->extractMetodeBayar($inv),
            'sales'             => $sales,
            'memo'              => $memo,
            'items'             => $this->extractItems($inv['items'] ?? []),
            'raw_data'          => $inv,
        ];
    }

    private function enrichWithDetail(array $invoices): array
    {
        $bar = $this->output->createProgressBar(count($invoices));
        $bar->start();

        foreach ($invoices as &$inv) {
            $detail = $this->httpGet("{$this->base}/invoices/{$inv['kledo_invoice_id']}");

            if ($detail && isset($detail['data'])) {
                $d = $detail['data'];
                $inv['alamat']            = $d['contact']['address'] ?? $d['address'] ?? $inv['alamat'];
                $inv['diskon']            = (int) ($d['discount_amount'] ?? $inv['diskon']);
                $inv['pajak']             = (int) ($d['tax_amount'] ?? $inv['pajak']);
                $inv['metode_pembayaran'] = $this->extractMetodeBayar($d) ?: $inv['metode_pembayaran'];
                $items = $this->extractItems($d['items'] ?? []);
                if (!empty($items)) $inv['items'] = $items;
                $inv['raw_data'] = $d;
            }

            $bar->advance();
            usleep(150000);
        }
        unset($inv);

        $bar->finish();
        $this->newLine();

        return $invoices;
    }

    private function extractItems(array $rawItems): array
    {
        $result = [];
        foreach ($rawItems as $item) {
            $qty      = (float) ($item['qty'] ?? 1);
            $harga    = (float) ($item['price'] ?? $item['unit_price'] ?? 0);
            $diskon   = (float) ($item['discount_amount'] ?? 0);
            if ($diskon === 0.0 && !empty($item['discount_percent'])) {
                $diskon = round($harga * $qty * (float) $item['discount_percent'] / 100);
            }
            $subtotal = (float) ($item['amount'] ?? ($qty * $harga - $diskon));
            $pajak    = (float) ($item['tax_amount'] ?? 0);

            $result[] = [
                'nama_produk' => $item['name'] ?? $item['product_name'] ?? $item['finance_account_name'] ?? '-',
                'sku'         => $item['code'] ?? $item['sku'] ?? '',
                'qty'         => $qty,
                'harga'       => (int) round($harga),
                'diskon'      => (int) round($diskon),
                'subtotal'    => (int) round($subtotal),
                'pajak'       => (int) round($pajak),
            ];
        }
        return $result;
    }

    private function extractMetodeBayar(array $inv): ?string
    {
        // payment_accounts dari list API Kledo: [{id, name, name_id}]
        $accounts = $inv['payment_accounts'] ?? [];
        if (!empty($accounts)) {
            return $accounts[0]['name_id'] ?? $accounts[0]['name'] ?? null;
        }

        if (!empty($inv['payment_method'])) return $inv['payment_method'];
        if (!empty($inv['bank_account_name'])) return $inv['bank_account_name'];

        $payments = $inv['payments'] ?? $inv['bank_trans'] ?? [];
        if (!empty($payments) && isset($payments[0]['bank_account_name'])) {
            return $payments[0]['bank_account_name'];
        }

        $memo = strtolower($inv['memo'] ?? '');
        if (str_contains($memo, 'transfer') || str_contains($memo, 'tf')) return 'Transfer';
        if (str_contains($memo, 'tunai') || str_contains($memo, 'cash')) return 'Tunai';
        if (str_contains($memo, 'qris')) return 'QRIS';

        return null;
    }

    private function mapStatusId(?int $statusId): string
    {
        return match ($statusId) {
            1 => 'Draft',
            2 => 'Belum Bayar',
            3 => 'Bayar Sebagian',
            4 => 'Lunas',
            5 => 'Dibatalkan',
            6 => 'Expired',
            default => 'Tidak Diketahui',
        };
    }

    private function upsertInvoices(array $invoices): array
    {
        $inserted = 0;
        $updated  = 0;
        $errors   = 0;
        $now      = now();

        foreach ($invoices as $inv) {
            try {
                $existing = KledoSyncLog::where('kledo_invoice_id', $inv['kledo_invoice_id'])->first();

                $payload = [
                    'ref_number'        => $inv['ref_number'],
                    'trans_date'        => $inv['trans_date'],
                    'contact_name'      => $inv['contact_name'],
                    'alamat'            => $inv['alamat'] ?? null,
                    'total'             => $inv['total'],
                    'diskon'            => $inv['diskon'] ?? 0,
                    'pajak'             => $inv['pajak'] ?? 0,
                    'status'            => $inv['status'],
                    'metode_pembayaran' => $inv['metode_pembayaran'] ?? null,
                    'sales'             => $inv['sales'],
                    'memo'              => $inv['memo'],
                    'items'             => !empty($inv['items']) ? $inv['items'] : null,
                    'raw_data'          => $inv['raw_data'],
                    'updated_at'        => $now,
                ];

                if ($existing) {
                    $existing->update($payload);
                    $updated++;
                } else {
                    KledoSyncLog::create(array_merge($payload, [
                        'kledo_invoice_id' => $inv['kledo_invoice_id'],
                        'synced_at'        => $now,
                    ]));
                    $inserted++;
                }
            } catch (\Exception $e) {
                $errors++;
                Log::error('kledo:import-sales upsert error', [
                    'invoice_id' => $inv['kledo_invoice_id'] ?? '?',
                    'error'      => $e->getMessage(),
                ]);
                $this->warn("  Error invoice {$inv['kledo_invoice_id']}: {$e->getMessage()}");
            }
        }

        return compact('inserted', 'updated', 'errors');
    }

    private function checkToken(): bool
    {
        return $this->httpGet("{$this->base}/invoices?per_page=1") !== null;
    }

    private function httpGet(string $url): ?array
    {
        $headers = [
            'Authorization: Bearer ' . $this->token,
            'Accept: application/json',
            'Content-Type: application/json',
        ];

        $retry = 0;
        while ($retry <= 3) {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 20,
                CURLOPT_HTTPHEADER     => $headers,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);
            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $err    = curl_error($ch);
            curl_close($ch);

            if ($err) {
                Log::warning("kledo:import-sales curl error retry {$retry}: {$err}");
                $retry++;
                sleep(1);
                continue;
            }

            if ($status === 429 || $status === 503) {
                sleep(2 + $retry);
                $retry++;
                continue;
            }

            if ($status === 401 || $status === 403) {
                $this->error("Token Kledo ditolak (HTTP {$status}).");
                return null;
            }

            if ($status < 200 || $status >= 300 || !$body) return null;

            $data = json_decode($body, true);
            return ($data['success'] ?? false) ? $data : null;
        }

        return null;
    }

    private function parseSalesFromMemo(string $memo): string
    {
        if (!$memo) return 'Tidak Diketahui';

        $text = trim(preg_replace('/^Sales\s*:\s*/i', '', $memo));

        if (preg_match('/^([^-\n]+?)\s*-\s*(\+62|0)[\d\s\-\(\)\.]{6,}/u', $text, $m)) {
            return ucwords(strtolower(trim($m[1])));
        }
        if (preg_match('/Sales\s*:\s*([^-\n|]+)/i', $text, $m)) {
            return ucwords(strtolower(trim($m[1])));
        }
        if (preg_match('/Order\s*#\d+\s*-\s*(.+)/i', $text, $m)) {
            return ucwords(strtolower(trim($m[1])));
        }

        $known = ['lehan','agus','ivan','dias','rio brandon','imam','agung','andre','priyanto','wiwid','dhani'];
        $lower = strtolower($text);
        foreach ($known as $name) {
            if (str_contains($lower, $name)) return ucwords($name);
        }

        return 'Tidak Diketahui';
    }
}
