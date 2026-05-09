<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KledoController extends Controller
{
    private string $kledoBase = 'https://api.kledo.com/api/v1/finance';
    private array $cache = [];

    private function kledoHeaders(): array
    {
        return [
            'Authorization' => 'Bearer ' . env('KLEDO_TOKEN'),
            'Accept'        => 'application/json',
            'Content-Type'  => 'application/json',
        ];
    }

    private function httpGet(string $url): array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_HTTPHEADER     => array_map(
                fn($k, $v) => "$k: $v",
                array_keys($this->kledoHeaders()),
                $this->kledoHeaders()
            ),
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ['status' => $status, 'body' => $body];
    }

    public function contacts(Request $request): JsonResponse
    {
        $search     = $request->query('search', '');
        $digitsOnly = preg_replace('/\D/', '', $search);
        $isPhone    = strlen($digitsOnly) >= 3 && strlen($digitsOnly) === strlen(preg_replace('/[\s\-\+\(\)\.]/','', $search));
        $query      = $isPhone ? $digitsOnly : $search;

        $cacheKey = "contacts:{$search}";
        if (isset($this->cache[$cacheKey]) && $this->cache[$cacheKey]['exp'] > time()) {
            return response()->json($this->cache[$cacheKey]['data']);
        }

        try {
            $url  = "{$this->kledoBase}/contacts?per_page=20&type_id=3&search=" . urlencode($query);
            $resp = $this->httpGet($url);
            $data = json_decode($resp['body'], true);

            if (!($data['success'] ?? false)) {
                return response()->json(['contacts' => []]);
            }

            $candidates = array_slice($data['data']['data'] ?? [], 0, 10);
            $contacts   = [];

            foreach ($candidates as $c) {
                $detail = $this->fetchContactDetail($c['id']);
                $contacts[] = [
                    'id'           => $c['id'],
                    'name'         => $c['name'],
                    'mobile_phone' => $detail['phone'] ?? '',
                    'address'      => $detail['address'] ?? $c['address'] ?? '',
                ];
            }

            $result = ['contacts' => $contacts];
            $this->cache[$cacheKey] = ['data' => $result, 'exp' => time() + 60];
            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('Kledo contacts fetch error: ' . $e->getMessage());
            return response()->json(['error' => 'Koneksi ke Kledo gagal'], 500);
        }
    }

    private function fetchContactDetail(int $id): ?array
    {
        try {
            $resp = $this->httpGet("{$this->kledoBase}/contacts/{$id}");
            $data = json_decode($resp['body'], true);
            return ($data['success'] ?? false) ? $data['data'] : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function products(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search', '');
            $page   = (int) $request->query('page', '1');
            $result = (new \App\Services\KledoService())->getProducts($search, $page);

            if (!empty($result['error'])) {
                return response()->json(['error' => $result['error']], 502);
            }
            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('Kledo products error: ' . $e->getMessage());
            return response()->json(['error' => 'Koneksi ke Kledo gagal'], 500);
        }
    }

    public function productDetail(int $id): JsonResponse
    {
        try {
            $product = (new \App\Services\KledoService())->getProductDetail($id);
            if (!$product) {
                return response()->json(['error' => 'Produk tidak ditemukan'], 404);
            }
            return response()->json(['product' => $product]);
        } catch (\Exception $e) {
            \Log::error('Kledo productDetail error: ' . $e->getMessage());
            return response()->json(['error' => 'Koneksi ke Kledo gagal'], 500);
        }
    }

    public function productsWithStock(Request $request): JsonResponse
    {
        try {
            $search = $request->query('search', '');
            $page   = (int) $request->query('page', '1');
            $brand  = $request->query('brand', '');
            $result = (new \App\Services\KledoService())->getProductsWithStock($search, $page, $brand);

            if (!empty($result['error'])) {
                return response()->json(['error' => $result['error']], 502);
            }
            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('Kledo productsWithStock error: ' . $e->getMessage());
            return response()->json([
                'error'   => 'Koneksi ke Kledo gagal',
                'detail'  => $e->getMessage(),
                'class'   => get_class($e),
            ], 500);
        }
    }

    public function laporanPenjualan(Request $request): JsonResponse
    {
        try {
            $startDate   = $request->query('start_date', date('Y-m-01'));
            $endDate     = $request->query('end_date', date('Y-m-d'));
            $filterSales = $request->query('sales', '');

            // Ambil dari DB cache (kledo_sync_logs) — lebih cepat & tidak bergantung Kledo API
            $query = \App\Models\KledoSyncLog::query()
                ->whereBetween('trans_date', [$startDate, $endDate]);

            if ($filterSales) {
                $query->where('sales', 'ILIKE', "%{$filterSales}%");
            }

            $rows = $query->orderBy('trans_date', 'desc')->get();

            // Rekap per sales
            $rekap = [];
            foreach ($rows as $inv) {
                $sales = $inv->sales ?: 'Tidak Diketahui';
                if (!isset($rekap[$sales])) {
                    $rekap[$sales] = [
                        'sales'           => $sales,
                        'jumlah_invoice'  => 0,
                        'total_penjualan' => 0,
                        'invoices'        => [],
                    ];
                }
                $rekap[$sales]['jumlah_invoice']++;
                $rekap[$sales]['total_penjualan'] += (int) $inv->total;
                $rekap[$sales]['invoices'][] = [
                    'ref_number'   => $inv->ref_number,
                    'trans_date'   => $inv->trans_date,
                    'contact_name' => $inv->contact_name,
                    'total'        => (int) $inv->total,
                    'status'       => $inv->status,
                    'memo'         => $inv->memo,
                ];
            }

            usort($rekap, fn($a, $b) => $b['total_penjualan'] <=> $a['total_penjualan']);

            $grandTotal = $rows->sum(fn($r) => (int) $r->total);

            return response()->json([
                'rekap'         => array_values($rekap),
                'total_invoice' => $rows->count(),
                'grand_total'   => $grandTotal,
                'periode'       => ['dari' => $startDate, 'sampai' => $endDate],
                'sumber'        => 'cache_db',
            ]);
        } catch (\Exception $e) {
            \Log::error('laporanPenjualan error: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mengambil laporan: ' . $e->getMessage()], 500);
        }
    }

    public function spmBrands(): JsonResponse
    {
        $mapping = \App\Services\KledoService::SPM_BRAND_PIC;
        $list = [];
        foreach ($mapping as $brand => $pic) {
            $list[] = ['brand' => $brand, 'pic' => $pic];
        }
        return response()->json(['spmBrands' => $list, 'mapping' => $mapping]);
    }

    public static function searchProductByName(string $nama): ?array
    {
        try {
            $base    = 'https://api.kledo.com/api/v1/finance';
            $headers = [
                'Authorization: Bearer ' . env('KLEDO_TOKEN'),
                'Accept: application/json',
                'Content-Type: application/json',
            ];
            $ch = curl_init("{$base}/products?per_page=20&search=" . urlencode($nama));
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 15,
                CURLOPT_HTTPHEADER     => $headers,
            ]);
            $body = curl_exec($ch);
            curl_close($ch);
            $data = json_decode($body, true);

            if (!($data['success'] ?? false) || empty($data['data']['data'])) return null;

            $products = $data['data']['data'];
            $exact = null;
            foreach ($products as $p) {
                if (strtolower($p['name']) === strtolower($nama)) { $exact = $p; break; }
            }
            $match = $exact ?? $products[0];
            return ['id' => $match['id'], 'unitId' => $match['unit_id'] ?? 73];
        } catch (\Exception $e) {
            \Log::error('searchProductByName error: ' . $e->getMessage());
            return null;
        }
    }

    private static function normalizePhoneForKledo(string $raw): ?string
    {
        $cleaned = trim($raw);
        $cleaned = preg_replace('/[^\d\+]/', '', $cleaned);
        if ($cleaned === '') {
            return null;
        }

        if (str_starts_with($cleaned, '+')) {
            $cleaned = substr($cleaned, 1);
        }

        if (str_starts_with($cleaned, '0')) {
            $cleaned = '62' . substr($cleaned, 1);
        }

        if (str_starts_with($cleaned, '8')) {
            $cleaned = '62' . $cleaned;
        }

        return preg_match('/^\d+$/', $cleaned) ? $cleaned : null;
    }

    private static function contactMatchesPhone(array $contact, string $phone): bool
    {
        $candidate = $contact['phone'] ?? $contact['mobile_phone'] ?? null;
        if (!$candidate) {
            return false;
        }
        $normalized = self::normalizePhoneForKledo($candidate);
        return $normalized !== null && $normalized === $phone;
    }

    public static function findOrCreateContact(string $nama, string $telepon, string $alamat): ?int
    {
        try {
            $base    = 'https://api.kledo.com/api/v1/finance';
            $headers = [
                'Authorization: Bearer ' . env('KLEDO_TOKEN'),
                'Accept: application/json',
                'Content-Type: application/json',
            ];

            $normalizedPhone = self::normalizePhoneForKledo($telepon);
            $searchName = trim($nama);
            if (empty($searchName)) {
                $searchName = 'Customer ' . date('YmdHis');
            }
            $searchQueries  = array_filter([
                $searchName,
                $normalizedPhone,
                preg_replace('/\D/', '', $telepon),
            ]);

            foreach ($searchQueries as $query) {
                $ch = curl_init("{$base}/contacts?per_page=50&type_id=3&search=" . urlencode($query));
                curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => $headers]);
                $data = json_decode(curl_exec($ch), true);
                curl_close($ch);

                if (!($data['success'] ?? false)) {
                    continue;
                }

                foreach ($data['data']['data'] ?? [] as $c) {
                    if (strtolower($c['name']) === strtolower($searchName)) {
                        \Log::info("Kledo contact found by name: id={$c['id']}");
                        return $c['id'];
                    }
                    if ($normalizedPhone && self::contactMatchesPhone($c, $normalizedPhone)) {
                        \Log::info("Kledo contact found by phone: id={$c['id']}");
                        return $c['id'];
                    }
                }
            }

            $payload = ['name' => $nama, 'address' => $alamat, 'type_id' => 3];
            if ($normalizedPhone) {
                $payload['phone'] = $normalizedPhone;
            }

            // Pastikan name tidak kosong, gunakan fallback jika perlu
            if (empty(trim($payload['name']))) {
                $payload['name'] = 'Customer ' . date('YmdHis');
            }

            $ch = curl_init("{$base}/contacts");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 15,
                CURLOPT_HTTPHEADER     => $headers,
                CURLOPT_POST          => true,
                CURLOPT_POSTFIELDS    => json_encode($payload),
            ]);
            $createData = json_decode(curl_exec($ch), true);
            curl_close($ch);

            if (($createData['success'] ?? false) && isset($createData['data']['id'])) {
                return $createData['data']['id'];
            }

            if (isset($createData['message']) && str_contains($createData['message'], 'sudah ada')) {
                foreach ($searchQueries as $query) {
                    $ch = curl_init("{$base}/contacts?per_page=50&type_id=3&search=" . urlencode($query));
                    curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => $headers]);
                    $retry = json_decode(curl_exec($ch), true);
                    curl_close($ch);
                    foreach ($retry['data']['data'] ?? [] as $c) {
                        if (strtolower($c['name']) === strtolower($searchName) || ($normalizedPhone && self::contactMatchesPhone($c, $normalizedPhone))) {
                            return $c['id'];
                        }
                    }
                }
            }

            \Log::error('Gagal membuat contact Kledo', ['payload' => $payload, 'createData' => $createData]);
            return null;
        } catch (\Exception $e) {
            \Log::error('findOrCreateContact error: ' . $e->getMessage());
            return null;
        }
    }

    public static function createInvoice(array $params): array
    {
        try {
            $base    = 'https://api.kledo.com/api/v1/finance';
            $headers = [
                'Authorization: Bearer ' . env('KLEDO_TOKEN'),
                'Accept: application/json',
                'Content-Type: application/json',
            ];
            $today   = date('Y-m-d');
            $items   = array_map(fn($item) => [
                'finance_account_id' => $item['kledoFinanceAccountId'] ?? $item['kledoProductId'],
                'qty'                => $item['jumlahProduk'],
                'price'              => $item['hargaProduk'],
                'amount'             => $item['jumlahProduk'] * $item['hargaProduk'],
                'unit_id'            => $item['kledoUnitId'] ?? 73,
                'discount_percent'   => 0,
                'discount_amount'    => 0,
            ], $params['items']);

            $body    = json_encode([
                'contact_id'    => $params['contactId'],
                'trans_date'    => $today,
                'due_date'      => $today,
                'memo'          => $params['memo'] ?? '',
                'message'       => $params['patokanLokasi'] ?? '',
                'shipping_cost' => $params['biayaPengiriman'] ?? 0,
                'include_tax'   => 0,
                'items'         => $items,
            ]);

            $ch = curl_init("{$base}/invoices");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTPHEADER => $headers, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body,
            ]);
            $data = json_decode(curl_exec($ch), true);
            curl_close($ch);

            if (($data['success'] ?? false) && isset($data['data']['id'])) {
                return ['success' => true, 'invoiceId' => $data['data']['id'], 'invoiceNumber' => $data['data']['ref_number'] ?? null];
            }
            \Log::error('Kledo invoice creation failed', ['data' => $data]);
            return ['success' => false];
        } catch (\Exception $e) {
            \Log::error('createInvoice error: ' . $e->getMessage());
            return ['success' => false];
        }
    }

    public static function payInvoice(int $invoiceId, int $bankAccountId, int $amount, string $memo = ''): bool
    {
        try {
            $base    = 'https://api.kledo.com/api/v1/finance';
            $headers = [
                'Authorization: Bearer ' . env('KLEDO_TOKEN'),
                'Accept: application/json',
                'Content-Type: application/json',
            ];
            $body = json_encode([
                'trans_date'       => date('Y-m-d'),
                'bank_account_id'  => $bankAccountId,
                'business_tran_id' => $invoiceId,
                'amount'           => $amount,
                'memo'             => $memo,
            ]);
            $ch = curl_init("{$base}/bankTrans/invoicePayment");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 30,
                CURLOPT_HTTPHEADER => $headers, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body,
            ]);
            $data = json_decode(curl_exec($ch), true);
            curl_close($ch);
            return ($data['success'] ?? false) && isset($data['data']['id']);
        } catch (\Exception $e) {
            \Log::error('payInvoice error: ' . $e->getMessage());
            return false;
        }
    }

    public function dataPenjualan(Request $request): JsonResponse
    {
        $startDate = $request->query('start_date', '2026-04-08');
        $endDate   = $request->query('end_date',   '2026-05-08');
        $page      = max(1, (int) $request->query('page', '1'));
        $perPage   = min(100, max(10, (int) $request->query('per_page', '100')));

        try {
            $token = env('KLEDO_TOKEN');
            if (!$token) {
                return response()->json(['error' => 'Token Kledo belum diatur'], 401);
            }

            $allInvoices = [];
            $currentPage = 1;
            $totalPages  = 1;

            do {
                $url  = "{$this->kledoBase}/invoices?"
                      . http_build_query([
                            'page'      => $currentPage,
                            'per_page'  => 100,
                            'dateStart' => $startDate,
                            'dateEnd'   => $endDate,
                            'status_id' => '',
                        ]);
                $resp = $this->httpGet($url);

                if ($resp['status'] !== 200) {
                    \Log::error('Kledo invoices fetch failed', ['status' => $resp['status'], 'body' => substr($resp['body'], 0, 500)]);
                    break;
                }

                $data = json_decode($resp['body'], true);
                if (!($data['success'] ?? false)) break;

                $invoiceData = $data['data']['data']    ?? [];
                $lastPage    = $data['data']['last_page'] ?? 1;
                $totalPages  = $lastPage;

                foreach ($invoiceData as $inv) {
                    $memo  = $inv['memo'] ?? '';
                    $sales = '';
                    // Ekstrak nama sales dari memo format "NAMA - nomor" atau hanya "NAMA"
                    if (preg_match('/^([A-Z][A-Z ]+?)(?:\s*-\s*|\s*\|)/u', strtoupper($memo), $m)) {
                        $sales = trim($m[1]);
                    }

                    $allInvoices[] = [
                        'id'           => $inv['id'],
                        'ref_number'   => $inv['ref_number']   ?? '-',
                        'trans_date'   => $inv['trans_date']   ?? '',
                        'contact_name' => $inv['contact']['name'] ?? ($inv['contact_name'] ?? '-'),
                        'total'        => (int) ($inv['amount']   ?? $inv['total'] ?? 0),
                        'status'       => $inv['status_name']  ?? ($inv['status'] ?? '-'),
                        'status_id'    => $inv['status_id']    ?? null,
                        'memo'         => $memo,
                        'sales'        => $sales,
                        'due_date'     => $inv['due_date']     ?? '',
                    ];
                }

                $currentPage++;
            } while ($currentPage <= $totalPages);

            // Rekap per sales
            $rekapSales = [];
            $grandTotal = 0;
            foreach ($allInvoices as $inv) {
                $s = $inv['sales'] ?: 'Tidak Diketahui';
                if (!isset($rekapSales[$s])) {
                    $rekapSales[$s] = ['sales' => $s, 'jumlah' => 0, 'total' => 0];
                }
                $rekapSales[$s]['jumlah']++;
                $rekapSales[$s]['total'] += $inv['total'];
                $grandTotal += $inv['total'];
            }
            usort($rekapSales, fn($a, $b) => $b['total'] <=> $a['total']);

            // Rekap per status
            $rekapStatus = [];
            foreach ($allInvoices as $inv) {
                $st = $inv['status'] ?: '-';
                if (!isset($rekapStatus[$st])) {
                    $rekapStatus[$st] = ['status' => $st, 'jumlah' => 0, 'total' => 0];
                }
                $rekapStatus[$st]['jumlah']++;
                $rekapStatus[$st]['total'] += $inv['total'];
            }

            return response()->json([
                'success'      => true,
                'invoices'     => $allInvoices,
                'total_invoice'=> count($allInvoices),
                'grand_total'  => $grandTotal,
                'rekap_sales'  => array_values($rekapSales),
                'rekap_status' => array_values($rekapStatus),
                'periode'      => ['dari' => $startDate, 'sampai' => $endDate],
                'sumber'       => 'kledo_api_langsung',
            ]);
        } catch (\Exception $e) {
            \Log::error('dataPenjualan error: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mengambil data dari Kledo: ' . $e->getMessage()], 500);
        }
    }

    public static function uploadAttachment(int $invoiceId, string $dataInput, string $filename = 'bukti.jpg'): ?string
    {
        try {
            $base = 'https://api.kledo.com/api/v1/finance';
            preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $dataInput, $m);
            $mime   = $m ? $m[1] : 'image/jpeg';
            $b64    = $m ? $m[2] : $dataInput;
            $buffer = base64_decode($b64);
            $ext    = str_replace('jpeg', 'jpg', explode('/', $mime)[1] ?? 'jpg');
            if (!preg_match('/\.[a-zA-Z0-9]+$/', $filename)) {
                $filename .= ".{$ext}";
            }

            $tmpFile = tempnam(sys_get_temp_dir(), 'kledo_');
            file_put_contents($tmpFile, $buffer);

            $ch = curl_init("{$base}/invoices/{$invoiceId}/attachments");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 30,
                CURLOPT_HTTPHEADER     => [
                    'Authorization: Bearer ' . env('KLEDO_TOKEN'),
                    'Accept: application/json',
                ],
                CURLOPT_POST      => true,
                CURLOPT_POSTFIELDS => ['file' => new \CURLFile($tmpFile, $mime, $filename)],
            ]);
            $data = json_decode(curl_exec($ch), true);
            curl_close($ch);
            unlink($tmpFile);

            if (($data['success'] ?? false) && is_string($data['data'] ?? null)) {
                return $data['data'];
            }
            \Log::error("Kledo attachment upload failed for invoice {$invoiceId}", ['data' => $data]);
            return null;
        } catch (\Exception $e) {
            \Log::error('uploadAttachment error: ' . $e->getMessage());
            return null;
        }
    }
}
