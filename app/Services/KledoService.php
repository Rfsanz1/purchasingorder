<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class KledoService
{
    private string $base = 'https://api.kledo.com/api/v1/finance';
    private static array $reqCache = [];

    // ============================================================
    // KONSTANTA SPM: brand → PIC (sales id)
    // ============================================================
    public const SPM_BRAND_PIC = [
        'aqua'      => 'lehan',
        'sanken'    => 'imam',
        'artugo'    => 'dhani',
        'steko'     => 'wiwid',
        'rsa'       => 'andre',
        'gea'       => 'andre',
        'toshiba'   => 'agung',
        'midea'     => 'agung',
        'changhong' => 'priyanto',
        'tcl'       => 'agus',
        'kansai'    => 'rio brandon',
    ];

    public const MARGIN = 1.15;

    // ============================================================
    // HELPERS: brand / PIC
    // ============================================================

    public static function isSpmBrand(?string $brand): bool
    {
        if (!$brand) return false;
        return array_key_exists(strtolower(trim($brand)), self::SPM_BRAND_PIC);
    }

    public static function getPicForBrand(?string $brand): ?string
    {
        if (!$brand) return null;
        return self::SPM_BRAND_PIC[strtolower(trim($brand))] ?? null;
    }

    /** Brand-brand yang dikelola oleh sales tertentu */
    public static function getBrandsForSales(string $salesId): array
    {
        $id = strtolower(trim($salesId));
        return array_keys(array_filter(self::SPM_BRAND_PIC, fn($pic) => $pic === $id));
    }

    /** Semua SPM brands */
    public static function allSpmBrands(): array
    {
        return array_keys(self::SPM_BRAND_PIC);
    }

    /** Harga asli + margin 15% */
    public static function withMargin(float $harga): int
    {
        return (int) round($harga * self::MARGIN);
    }

    // ============================================================
    // HTTP
    // ============================================================

    private static function getToken(): string
    {
        return \App\Http\Controllers\IntegrasiController::getToken('kledo_token', 'KLEDO_TOKEN') ?: '';
    }

    private function headers(): array
    {
        return [
            'Authorization: Bearer ' . self::getToken(),
            'Accept: application/json',
            'Content-Type: application/json',
        ];
    }

    private function httpGet(string $url, int $ttl = 300): ?array
    {
        $cacheKey = md5($url);
        if (isset(self::$reqCache[$cacheKey]) && self::$reqCache[$cacheKey]['exp'] > time()) {
            return self::$reqCache[$cacheKey]['data'];
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_HTTPHEADER     => $this->headers(),
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status < 200 || $status >= 300 || !$body) return null;
        $data = json_decode($body, true);
        if (!($data['success'] ?? false)) return null;

        self::$reqCache[$cacheKey] = ['data' => $data, 'exp' => time() + $ttl];
        return $data;
    }

    // ============================================================
    // TRANSFORM
    // ============================================================

    /**
     * Ubah data produk Kledo ke format internal yang konsisten.
     * Semua kalkulasi harga & brand ada di sini satu tempat.
     */
    public function transformProduct(array $p): array
    {
        // Harga jual dari Kledo (field price atau sell_price)
        $hargaJual = (float) (
            $p['sell_price'] ??
            $p['price'] ??
            ($p['prices'][0]['sell_price'] ?? 0)
        );

        // Harga beli / HPP dari Kledo — prioritaskan base_price, lalu avg_base_price
        // Gunakan > 0 karena ?? tidak skip angka 0
        $hargaBeli = 0;
        if (!empty($p['base_price'])) {
            $hargaBeli = (float) $p['base_price'];
        } elseif (!empty($p['avg_base_price'])) {
            $hargaBeli = (float) $p['avg_base_price'];
        } elseif (!empty($p['buy_price'])) {
            $hargaBeli = (float) $p['buy_price'];
        } elseif (!empty($p['cost_price'])) {
            $hargaBeli = (float) $p['cost_price'];
        } elseif (!empty($p['prices'][0]['buy_price'])) {
            $hargaBeli = (float) $p['prices'][0]['buy_price'];
        }

        // Untuk kompatibilitas dengan kode lama
        $hargaAsli = $hargaJual;
        $hpp = $hargaBeli;

        // Stok real dari Kledo (bisa di qty atau warehouses)
        $kledoStok = 0;
        if (isset($p['qty'])) {
            $kledoStok = (int) $p['qty'];
        } elseif (isset($p['warehouses']) && is_array($p['warehouses'])) {
            foreach ($p['warehouses'] as $wh) {
                $kledoStok += (int) ($wh['qty'] ?? 0);
            }
        }

        // Brand dari Kledo (category atau brand field)
        $brandKledo = strtolower(trim(
            $p['brand_name'] ?? $p['category_name'] ?? $p['category'] ?? ''
        ));

        // finance_account_id dari prices[0] (dibutuhkan saat buat invoice di Kledo)
        $financeAccountId = $p['prices'][0]['finance_account_id']
            ?? $p['finance_account_id']
            ?? null;

        // category_id dibutuhkan untuk klasifikasi Elektronik vs Bahan Bangunan
        $kategoriId = isset($p['category_id']) && is_int($p['category_id'])
            ? $p['category_id']
            : (isset($p['category_id']) ? (int)$p['category_id'] : null);

        // Harga satuan = harga beli (base_price) sebagai utama
        // Fallback ke harga jual (price) jika harga beli tidak tersedia
        $hargaSatuan = $hargaBeli > 0 ? (int) $hargaBeli : (int) $hargaJual;

        return [
            'kledoId'           => $p['id'],
            'nama'              => $p['name'],
            'sku'               => $p['code'] ?? '',
            'satuan'            => $p['unit_id'] ?? 73,
            'hargaAsli'         => (int) $hargaAsli,
            'hpp'               => (int) $hpp,
            'hargaSatuan'       => $hargaSatuan,  // max(hargaAsli, hpp)
            'harga'             => self::withMargin($hargaAsli),  // harga jual +15% (legacy)
            'kledoStok'         => $kledoStok,
            'brand'             => $brandKledo,
            'isSpm'             => self::isSpmBrand($brandKledo),
            'pic'               => self::getPicForBrand($brandKledo),
            'financeAccountId'  => $financeAccountId,
            'kategoriId'        => $kategoriId,
        ];
    }

    // ============================================================
    // API: LIST PRODUK
    // ============================================================

    public function getProducts(string $search = '', int $page = 1, int $perPage = 20): array
    {
        $cacheKey = 'kledo_products_search:' . md5(strtolower($search) . ':' . $page . ':' . $perPage);
        return Cache::remember($cacheKey, 30, function () use ($search, $page, $perPage) {
            $url  = "{$this->base}/products?per_page={$perPage}&page={$page}&search=" . urlencode($search);
            $data = $this->httpGet($url, 180);

            if (!$data) {
                return [
                    'products' => [], 'total' => 0,
                    'currentPage' => 1, 'lastPage' => 1,
                    'error' => 'Gagal mengambil produk dari Kledo',
                ];
            }

            return [
                'products'    => array_map(fn($p) => $this->transformProduct($p), $data['data']['data'] ?? []),
                'total'       => $data['data']['total'] ?? 0,
                'currentPage' => $data['data']['current_page'] ?? 1,
                'lastPage'    => $data['data']['last_page'] ?? 1,
            ];
        });
    }

    // ============================================================
    // API: DETAIL PRODUK
    // ============================================================

    public function getProductDetail(int $id): ?array
    {
        $url  = "{$this->base}/products/{$id}";
        $data = $this->httpGet($url, 60);

        if (!$data) return null;
        $p = $data['data'] ?? null;
        if (!$p || !is_array($p)) return null;

        $transformed = $this->transformProduct($p);

        // Merge dengan data lokal (stok internal jika SPM)
        $local = Product::where('kledo_product_id', $id)->first();
        if ($local) {
            $isSpm = self::isSpmBrand($local->brand ?: $transformed['brand']);
            $transformed['brand']    = $local->brand ?: $transformed['brand'];
            $transformed['isSpm']    = $isSpm;
            $transformed['pic']      = self::getPicForBrand($transformed['brand']);
            $transformed['stok']     = $isSpm ? $local->stok : $transformed['kledoStok'];
            $transformed['localId']  = $local->id;
            $transformed['hasLocal'] = true;
            // Jika sudah ada harga lokal, pakai itu; tapi tetap sertakan hargaAsli dari Kledo
            $transformed['harga'] = $local->harga ?: $transformed['harga'];
        } else {
            $isSpm = self::isSpmBrand($transformed['brand']);
            $transformed['stok']     = $isSpm ? 0 : $transformed['kledoStok'];
            $transformed['localId']  = null;
            $transformed['hasLocal'] = false;
        }

        $transformed['stokSrc'] = $transformed['isSpm'] ? 'internal' : 'kledo';
        return $transformed;
    }

    // ============================================================
    // API: LAPORAN PENJUALAN PER SALES (dari invoice Kledo)
    // ============================================================

    /**
     * Ambil semua invoice dari Kledo berdasarkan rentang tanggal.
     * Parse nama sales dari field memo: "Sales: {nama} - {telp}" atau "Order #X - {nama}"
     */
    public function getInvoicesByDateRange(string $startDate, string $endDate, int $perPage = 100): array
    {
        $allInvoices = [];
        $page = 1;

        do {
            $url  = "{$this->base}/invoices?per_page={$perPage}&page={$page}"
                  . "&start_date=" . urlencode($startDate)
                  . "&end_date="   . urlencode($endDate)
                  . "&status=all";
            $data = $this->httpGet($url, 0); // ttl=0 agar selalu fresh

            if (!$data) break;

            $items    = $data['data']['data'] ?? [];
            $lastPage = $data['data']['last_page'] ?? 1;

            foreach ($items as $inv) {
                $memo       = $inv['memo'] ?? $inv['message'] ?? '';
                $salesNama  = $this->parseSalesFromMemo($memo);
                $allInvoices[] = [
                    'id'            => $inv['id'],
                    'ref_number'    => $inv['ref_number'] ?? '-',
                    'trans_date'    => $inv['trans_date'] ?? '',
                    'due_date'      => $inv['due_date'] ?? '',
                    'contact_name'  => $inv['contact']['name'] ?? $inv['contact_name'] ?? '-',
                    'total'         => (int) ($inv['amount'] ?? $inv['total'] ?? 0),
                    'status'        => $inv['status'] ?? '-',
                    'memo'          => $memo,
                    'sales'         => $salesNama,
                ];
            }

            $page++;
        } while ($page <= $lastPage);

        return $allInvoices;
    }

    /**
     * Parse nama sales dari memo Kledo.
     * Format baru ERP: "NamaSales - NomorHP"  (contoh: "Rizal - +62 857-2982-4485")
     * Format lama:     "Sales: NamaSales - Telp"
     * Format lama 2:   "Order #123 - NamaSales"
     */
    private function parseSalesFromMemo(string $memo): string
    {
        if (!$memo) return 'Tidak Diketahui';

        // Format baru ERP: "NamaSales - NomorHP"
        // Pola: teks nama, lalu " - ", lalu nomor HP (dimulai +62 atau 0)
        if (preg_match('/^([^-|\n]+?)\s*-\s*(\+62|0)[\d\s\-\(\)\.]{6,}/', trim($memo), $m)) {
            return trim($m[1]);
        }

        // Format lama: "Sales: NamaSales - Telp"
        if (preg_match('/Sales:\s*([^-\n]+)/i', $memo, $m)) {
            return trim($m[1]);
        }

        // Format lama: "Order #123 - NamaSales"
        if (preg_match('/Order\s*#\d+\s*-\s*(.+)/i', $memo, $m)) {
            return trim($m[1]);
        }

        return 'Tidak Diketahui';
    }

    /**
     * Rekap penjualan per sales dari invoice Kledo
     */
    public function rekapPenjualanPerSales(string $startDate, string $endDate, string $filterSales = ''): array
    {
        $invoices = $this->getInvoicesByDateRange($startDate, $endDate);

        // Filter per sales jika ada
        if ($filterSales) {
            $invoices = array_filter($invoices, function ($inv) use ($filterSales) {
                return stripos($inv['sales'], $filterSales) !== false;
            });
        }

        // Rekap per sales
        $rekap = [];
        foreach ($invoices as $inv) {
            $sales = $inv['sales'];
            if (!isset($rekap[$sales])) {
                $rekap[$sales] = [
                    'sales'          => $sales,
                    'jumlah_invoice' => 0,
                    'total_penjualan'=> 0,
                    'invoices'       => [],
                ];
            }
            $rekap[$sales]['jumlah_invoice']++;
            $rekap[$sales]['total_penjualan'] += $inv['total'];
            $rekap[$sales]['invoices'][]       = $inv;
        }

        // Sort by total tertinggi
        usort($rekap, fn($a, $b) => $b['total_penjualan'] <=> $a['total_penjualan']);

        return [
            'rekap'          => array_values($rekap),
            'total_invoice'  => count($invoices),
            'grand_total'    => array_sum(array_column($invoices, 'total')),
            'periode'        => ['dari' => $startDate, 'sampai' => $endDate],
        ];
    }

    // ============================================================
    // API: LIST + STOK (digunakan Kelola Produk)
    // ============================================================

    /**
     * Kledo products + merge stok:
     * - SPM brand  → stok dari DB internal
     * - Non-SPM    → stok dari Kledo (kledoStok)
     */
    public function getProductsWithStock(string $search = '', int $page = 1, string $brandFilter = ''): array
    {
        $result = $this->getProducts($search, $page, 30);
        if (!empty($result['error'])) return $result;

        $kledoProducts = $result['products'];
        $kledoIds      = array_column($kledoProducts, 'kledoId');

        $localMap = Product::whereIn('kledo_product_id', $kledoIds)
            ->get()
            ->keyBy('kledo_product_id');

        $merged = array_map(function ($p) use ($localMap) {
            $local      = $localMap->get($p['kledoId']);
            $brand      = $local?->brand ?: $p['brand'];
            $isSpm      = self::isSpmBrand($brand);
            $stok       = $isSpm ? ($local?->stok ?? 0) : $p['kledoStok'];

            return array_merge($p, [
                'brand'    => $brand,
                'isSpm'    => $isSpm,
                'pic'      => self::getPicForBrand($brand),
                'stok'     => $stok,
                'stokSrc'  => $isSpm ? 'internal' : 'kledo',
                'harga'    => $local?->harga ?? $p['harga'],
                'localId'  => $local?->id ?? null,
                'hasLocal' => $local !== null,
            ]);
        }, $kledoProducts);

        if ($brandFilter) {
            $merged = array_values(
                array_filter($merged, fn($p) => strtolower($p['brand']) === strtolower($brandFilter))
            );
        }

        $result['products'] = $merged;
        return $result;
    }
}
