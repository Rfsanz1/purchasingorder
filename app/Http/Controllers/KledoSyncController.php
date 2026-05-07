<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use App\Models\KledoSyncLog;
use App\Services\KledoService;
use App\Http\Controllers\SalesController;

/**
 * KledoSyncController — Sinkronisasi data penjualan dari Kledo ke ERP lokal.
 *
 * Kledo adalah database utama; ERP hanya perantara/interface.
 * Data disimpan di kledo_sync_logs untuk:
 *   - cache lokal (mengurangi request ke Kledo)
 *   - dedup/upsert (tidak ada duplikat)
 *   - filter per sales, laporan, dan analytics
 */
class KledoSyncController extends Controller
{
    private string $base = 'https://api.kledo.com/api/v1/finance';
    private int $maxRetry = 3;

    // ── HTTP ──────────────────────────────────────────────────────────────────

    private function headers(): array
    {
        return [
            'Authorization: Bearer ' . env('KLEDO_TOKEN'),
            'Accept: application/json',
            'Content-Type: application/json',
        ];
    }

    private function httpGetWithRetry(string $url, int $retry = 0): ?array
    {
        try {
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 20,
                CURLOPT_HTTPHEADER     => $this->headers(),
                CURLOPT_SSL_VERIFYPEER => true,
            ]);
            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $err    = curl_error($ch);
            curl_close($ch);

            if ($err) {
                Log::warning("Kledo sync curl error (attempt {$retry}): {$err}");
                if ($retry < $this->maxRetry) {
                    sleep(1);
                    return $this->httpGetWithRetry($url, $retry + 1);
                }
                return null;
            }

            if ($status === 429 || $status === 503) {
                Log::warning("Kledo rate limit/unavailable (HTTP {$status}), retrying...");
                if ($retry < $this->maxRetry) {
                    sleep(2 + $retry);
                    return $this->httpGetWithRetry($url, $retry + 1);
                }
                return null;
            }

            if ($status < 200 || $status >= 300 || !$body) return null;

            $data = json_decode($body, true);
            return ($data['success'] ?? false) ? $data : null;
        } catch (\Exception $e) {
            Log::error("Kledo sync httpGet exception: " . $e->getMessage());
            if ($retry < $this->maxRetry) {
                sleep(1);
                return $this->httpGetWithRetry($url, $retry + 1);
            }
            return null;
        }
    }

    // ── Normalisasi Nama Sales ────────────────────────────────────────────────

    /**
     * Normalisasi nama sales agar konsisten:
     * "Sales: Lehan", "LEHAN", "lehan" → "Lehan"
     */
    private function normalizeSalesName(string $raw): string
    {
        $known = [
            'lehan', 'agus', 'ivan', 'dias', 'rio brandon',
            'imam', 'agung', 'andre', 'priyanto', 'wiwid', 'dhani',
        ];
        $lower = strtolower(trim($raw));
        foreach ($known as $name) {
            if ($lower === $name) {
                return ucwords($name);
            }
        }
        return ucwords($lower);
    }

    // ── Parse Nama Sales dari Memo ────────────────────────────────────────────

    /**
     * Parse nama sales dari memo Kledo.
     * Format yang dihasilkan ERP: "NamaSales - NomorHP"
     * Contoh: "Lehan - +62 857-2982-4485"
     * Format lama: "Sales: NamaSales - Telp"
     */
    private function parseSalesFromMemo(string $memo): string
    {
        if (!$memo) return 'Tidak Diketahui';

        $text = trim($memo);

        // 1. Format ERP baru: "NamaSales - +62xxx" atau "NamaSales - 08xxx"
        if (preg_match('/^([^-\n]+?)\s*-\s*(\+62|0)[\d\s\-\(\)\.]{6,}/u', $text, $m)) {
            return $this->normalizeSalesName(trim($m[1]));
        }

        // 2. Format: "Sales: NamaSales" atau "Sales: NamaSales - Telp"
        if (preg_match('/Sales\s*:\s*([^-\n|]+)/i', $text, $m)) {
            return $this->normalizeSalesName(trim($m[1]));
        }

        // 3. Format tagihan/penjualan Kledo: "Nama Sales | ..."
        if (preg_match('/^([^|\n]+)\s*\|/u', $text, $m)) {
            $candidate = trim($m[1]);
            if ($this->isKnownSales($candidate)) {
                return $this->normalizeSalesName($candidate);
            }
        }

        // 4. Format: "Order #123 - NamaSales"
        if (preg_match('/Order\s*#\d+\s*-\s*(.+)/i', $text, $m)) {
            return $this->normalizeSalesName(trim($m[1]));
        }

        // 5. Cek apakah nama sales muncul di mana saja dalam memo
        $known = ['lehan','agus','ivan','dias','rio brandon','imam','agung','andre','priyanto','wiwid','dhani'];
        $lower = strtolower($text);
        foreach ($known as $name) {
            if (str_contains($lower, $name)) {
                return ucwords($name);
            }
        }

        return 'Tidak Diketahui';
    }

    private function isKnownSales(string $name): bool
    {
        $known = ['lehan','agus','ivan','dias','rio brandon','imam','agung','andre','priyanto','wiwid','dhani'];
        $lower = strtolower(trim($name));
        foreach ($known as $n) {
            if ($lower === $n || str_contains($lower, $n)) return true;
        }
        return false;
    }

    // ── Ambil & Mapping Invoice ───────────────────────────────────────────────

    private function mapInvoice(array $inv): array
    {
        $memo      = $inv['memo'] ?? $inv['message'] ?? '';
        $salesNama = $this->parseSalesFromMemo($memo);

        return [
            'kledo_invoice_id' => (string) $inv['id'],
            'ref_number'       => $inv['ref_number'] ?? '-',
            'trans_date'       => $inv['trans_date'] ?? '',
            'contact_name'     => $inv['contact']['name'] ?? $inv['contact_name'] ?? '-',
            'total'            => (int) ($inv['amount'] ?? $inv['total'] ?? 0),
            'status'           => $inv['status'] ?? '-',
            'memo'             => $memo,
            'sales'            => $salesNama,
            'raw_data'         => $inv,
        ];
    }

    // ── Fetch dengan early-stop per tanggal ──────────────────────────────────

    private function fetchInvoicesInRange(string $startDate, string $endDate): array
    {
        $all     = [];
        $page    = 1;
        $maxPage = 50; // safety cap per API call

        do {
            $url  = "{$this->base}/invoices?per_page=100&page={$page}&status=all";
            Log::info("Kledo sync API: fetching halaman {$page}");
            $data = $this->httpGetWithRetry($url);

            if (!$data) {
                Log::error("Kledo sync API: gagal fetch halaman {$page}");
                break;
            }

            $items    = $data['data']['data'] ?? [];
            $lastPage = $data['data']['last_page'] ?? 1;
            $stopped  = false;

            foreach ($items as $inv) {
                $transDate = $inv['trans_date'] ?? '';
                if ($transDate && $transDate < $startDate) {
                    $stopped = true;
                    break;
                }
                if ($transDate && $transDate > $endDate) continue;
                $all[] = $this->mapInvoice($inv);
            }

            if ($stopped) break;
            $page++;
            if ($page <= min($lastPage, $maxPage)) usleep(200000);
        } while ($page <= min($lastPage, $maxPage));

        return $all;
    }

    // ── Fetch Semua Invoice dari Kledo berdasarkan Rentang Tanggal ───────────

    private function fetchInvoicesFromKledo(string $startDate, string $endDate, int $perPage = 100): array
    {
        $all  = [];
        $page = 1;

        do {
            $url  = "{$this->base}/invoices?per_page={$perPage}&page={$page}"
                  . "&start_date=" . urlencode($startDate)
                  . "&end_date="   . urlencode($endDate)
                  . "&status=all";

            Log::info("Kledo sync: fetching page {$page} ({$startDate} - {$endDate})");
            $data = $this->httpGetWithRetry($url);

            if (!$data) {
                Log::error("Kledo sync: gagal fetch halaman {$page}");
                break;
            }

            $items    = $data['data']['data'] ?? [];
            $lastPage = $data['data']['last_page'] ?? 1;

            foreach ($items as $inv) {
                $all[] = $this->mapInvoice($inv);
            }

            Log::info("Kledo sync: page {$page}/{$lastPage}, " . count($items) . " invoice");
            $page++;
        } while ($page <= $lastPage);

        return $all;
    }

    // ── Upsert ke kledo_sync_logs ─────────────────────────────────────────────

    private function upsertInvoices(array $invoices): array
    {
        $inserted = 0;
        $updated  = 0;
        $errors   = 0;

        foreach ($invoices as $inv) {
            try {
                $existing = KledoSyncLog::where('kledo_invoice_id', $inv['kledo_invoice_id'])->first();

                if ($existing) {
                    $existing->update([
                        'ref_number'   => $inv['ref_number'],
                        'trans_date'   => $inv['trans_date'],
                        'contact_name' => $inv['contact_name'],
                        'total'        => $inv['total'],
                        'status'       => $inv['status'],
                        'memo'         => $inv['memo'],
                        'sales'        => $inv['sales'],
                        'raw_data'     => $inv['raw_data'],
                        'updated_at'   => now(),
                    ]);
                    $updated++;
                } else {
                    KledoSyncLog::create(array_merge($inv, ['synced_at' => now(), 'updated_at' => now()]));
                    $inserted++;
                }
            } catch (\Exception $e) {
                Log::error("Kledo sync upsert error: " . $e->getMessage(), ['inv' => $inv['kledo_invoice_id']]);
                $errors++;
            }
        }

        return compact('inserted', 'updated', 'errors');
    }

    // ── API: Sync Manual ──────────────────────────────────────────────────────

    /**
     * POST /api/kledo/sync
     * Trigger sinkronisasi manual dari Kledo ke cache lokal.
     * Body (opsional): { start_date: "2025-04-18", end_date: "2025-05-07" }
     */
    public function sync(Request $request): JsonResponse
    {
        if (!env('KLEDO_TOKEN')) {
            return response()->json(['error' => 'KLEDO_TOKEN belum dikonfigurasi'], 503);
        }

        $startDate = $request->input('start_date', '2025-04-18');
        $endDate   = $request->input('end_date', date('Y-m-d'));

        Log::info("Kledo sync dimulai: {$startDate} - {$endDate}");

        try {
            $invoices = $this->fetchInvoicesInRange($startDate, $endDate);
            $result   = $this->upsertInvoices($invoices);

            Log::info("Kledo sync selesai", $result);

            return response()->json([
                'success'    => true,
                'periode'    => ['dari' => $startDate, 'sampai' => $endDate],
                'total_fetched' => count($invoices),
                'inserted'   => $result['inserted'],
                'updated'    => $result['updated'],
                'errors'     => $result['errors'],
                'synced_at'  => now()->toDateTimeString(),
            ]);
        } catch (\Exception $e) {
            Log::error("Kledo sync gagal: " . $e->getMessage());
            return response()->json(['error' => 'Sync gagal: ' . $e->getMessage()], 500);
        }
    }

    // ── API: Status Sync ──────────────────────────────────────────────────────

    /**
     * GET /api/kledo/sync/status
     * Cek berapa data yang sudah tersinkron.
     */
    public function status(): JsonResponse
    {
        $total   = KledoSyncLog::count();
        $last    = KledoSyncLog::orderByDesc('synced_at')->first();
        $perSales = KledoSyncLog::selectRaw('sales, COUNT(*) as jumlah, SUM(total) as total_penjualan')
            ->groupBy('sales')
            ->orderByDesc('total_penjualan')
            ->get();

        return response()->json([
            'total_synced'   => $total,
            'last_synced_at' => $last?->synced_at,
            'last_invoice'   => $last ? [
                'id'         => $last->kledo_invoice_id,
                'ref'        => $last->ref_number,
                'date'       => $last->trans_date,
            ] : null,
            'per_sales'      => $perSales,
        ]);
    }

    // ── API: Data Penjualan dari Cache Lokal ──────────────────────────────────

    /**
     * GET /api/kledo/sync/penjualan
     * Ambil data penjualan tersinkron, bisa filter per sales.
     * Query: ?sales=Rizal&start_date=2025-04-18&end_date=2025-05-07
     */
    public function penjualan(Request $request): JsonResponse
    {
        $sales     = $request->query('sales', '');
        $startDate = $request->query('start_date', '');
        $endDate   = $request->query('end_date', '');

        $query = KledoSyncLog::orderByDesc('trans_date');

        if ($sales) {
            $query->where('sales', 'ILIKE', "%{$sales}%");
        }
        if ($startDate) {
            $query->where('trans_date', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('trans_date', '<=', $endDate);
        }

        $data = $query->get()->map(fn($row) => [
            'id'           => $row->kledo_invoice_id,
            'ref'          => $row->ref_number,
            'tanggal'      => $row->trans_date,
            'pelanggan'    => $row->contact_name,
            'total'        => $row->total,
            'status'       => $row->status,
            'sales'        => $row->sales,
            'memo'         => $row->memo,
        ]);

        $grandTotal = $data->sum('total');
        $perSales   = $data->groupBy('sales')->map(fn($g) => [
            'sales'          => $g->first()['sales'],
            'jumlah_invoice' => $g->count(),
            'total'          => $g->sum('total'),
        ])->values();

        return response()->json([
            'success'     => true,
            'total'       => $data->count(),
            'grand_total' => $grandTotal,
            'per_sales'   => $perSales,
            'data'        => $data,
            'filter'      => compact('sales', 'startDate', 'endDate'),
        ]);
    }

    // ── API: Auto-Memo berdasarkan Sales ─────────────────────────────────────

    /**
     * GET /api/kledo/memo-sales
     * Kembalikan format memo untuk sales tertentu.
     * Query: ?sales_id=lehan
     * Response: { memo: "Lehan - +62 857-2982-4485" }
     */
    public function memoSales(Request $request): JsonResponse
    {
        $salesId = strtolower(trim($request->query('sales_id', '')));

        $salesList = SalesController::SALES_LIST;
        $found     = null;

        foreach ($salesList as $s) {
            if ($s['id'] === $salesId) {
                $found = $s;
                break;
            }
        }

        if (!$found) {
            return response()->json(['error' => 'Sales tidak ditemukan', 'sales_id' => $salesId], 404);
        }

        // Format memo: "NamaSales - NomorHP"
        $memo = $found['nama'] . ' - ' . $found['telp'];

        return response()->json([
            'sales_id' => $found['id'],
            'nama'     => $found['nama'],
            'telp'     => $found['telp'],
            'memo'     => $memo,
        ]);
    }

    // ── API: Semua Memo Sales ─────────────────────────────────────────────────

    /**
     * GET /api/kledo/memo-sales/all
     * Kembalikan semua format memo untuk semua sales.
     */
    public function allMemoSales(): JsonResponse
    {
        $salesList = SalesController::SALES_LIST;

        $memos = array_map(fn($s) => [
            'id'   => $s['id'],
            'nama' => $s['nama'],
            'telp' => $s['telp'],
            'memo' => $s['nama'] . ' - ' . $s['telp'],
        ], $salesList);

        return response()->json(['memos' => $memos]);
    }
}
