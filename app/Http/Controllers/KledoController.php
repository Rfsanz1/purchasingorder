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
            return response()->json(['error' => 'Koneksi ke Kledo gagal'], 500);
        }
    }

    public function laporanPenjualan(Request $request): JsonResponse
    {
        try {
            $startDate   = $request->query('start_date', date('Y-m-01'));
            $endDate     = $request->query('end_date', date('Y-m-d'));
            $filterSales = $request->query('sales', '');

            $result = (new \App\Services\KledoService())->rekapPenjualanPerSales($startDate, $endDate, $filterSales);
            return response()->json($result);
        } catch (\Exception $e) {
            \Log::error('laporanPenjualan error: ' . $e->getMessage());
            return response()->json(['error' => 'Gagal mengambil laporan dari Kledo'], 500);
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

    public static function findOrCreateContact(string $nama, string $telepon, string $alamat): ?int
    {
        try {
            $base    = 'https://api.kledo.com/api/v1/finance';
            $headers = [
                'Authorization: Bearer ' . env('KLEDO_TOKEN'),
                'Accept: application/json',
                'Content-Type: application/json',
            ];

            $ch = curl_init("{$base}/contacts?per_page=20&type_id=3&search=" . urlencode($nama));
            curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => $headers]);
            $data = json_decode(curl_exec($ch), true);
            curl_close($ch);

            if ($data['success'] ?? false) {
                foreach ($data['data']['data'] ?? [] as $c) {
                    if (strtolower($c['name']) === strtolower($nama)) {
                        \Log::info("Kledo contact found: id={$c['id']}");
                        return $c['id'];
                    }
                }
            }

            $payload = json_encode(['name' => $nama, 'address' => $alamat, 'phone' => $telepon, 'type_id' => 3]);
            $ch      = curl_init("{$base}/contacts");
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15,
                CURLOPT_HTTPHEADER => $headers, CURLOPT_POST => true, CURLOPT_POSTFIELDS => $payload,
            ]);
            $createData = json_decode(curl_exec($ch), true);
            curl_close($ch);

            if (($createData['success'] ?? false) && isset($createData['data']['id'])) {
                return $createData['data']['id'];
            }

            if (isset($createData['message']) && str_contains($createData['message'], 'sudah ada')) {
                $ch = curl_init("{$base}/contacts?per_page=50&type_id=3&search=" . urlencode($nama));
                curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 15, CURLOPT_HTTPHEADER => $headers]);
                $retry = json_decode(curl_exec($ch), true);
                curl_close($ch);
                foreach ($retry['data']['data'] ?? [] as $c) {
                    if (strtolower($c['name']) === strtolower($nama)) return $c['id'];
                }
            }

            \Log::error('Gagal membuat contact Kledo', ['createData' => $createData]);
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
