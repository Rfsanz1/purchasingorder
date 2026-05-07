<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Helpers\FonnteHelper;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\SettingsController;

class OrderController extends Controller
{
    // ── Constants ────────────────────────────────────────────────────────────

    private const KLEDO_KAS_ELEKTRONIK = 1;
    private const KLEDO_KAS_SULAWESI   = 1466;

    private const ELEKTRONIK_CATEGORY_IDS = [
        3, 4, 5, 6, 7, 8, 10, 11, 13, 14, 15, 16, 17, 21, 22, 23, 29, 35, 36, 37, 38,
        42, 44, 45, 74, 75, 77, 78, 80, 98, 102, 110, 120, 130, 131, 138, 141, 142,
        143, 144, 145,
    ];

    private const ELEKTRONIK_KEYWORDS = [
        'antena','parabola','set top box','receiver','tv','television','kulkas',
        'refrigerator','freezer','showcase','display cooler','chest freezer',
        'mesin cuci','washing machine','dispenser','air purifier','penjernih udara',
        'vacuum cleaner','vacum cleaner','cooker hood','dish washer','dishwasher',
        'oven','microwave','panggang listrik','air fryer','slow cooker','water heater',
        'pemanas air','kipas angin','exhaust fan','air cooler','blender','mixer',
        'chopper','juicer','magicom','magic com','magic jar','rice cooker','setrika',
        'hair dryer','hair dyer','ac ','air conditioner',' ac','speaker','radio',
        'mic ','microphone','kompor','cup sealer','pest control',
    ];

    private const BAHAN_BANGUNAN_KEYWORDS = [
        'semen','cement','mortar','pasir','kerikil','split','batu','bata','batako',
        'hebel','celcon','paku','skrup','sekrup','screw','mur','baut','ring','kawat',
        'wire mesh','wiremesh','besi','baja','plat','siku','hollow','cnp','unp','pipa',
        'gypsum','gipsum','plafon','triplek','plywood','kayu','balok','papan','lis ',
        'profil','cat ','paint','tinner','thinner','dempul','plamir','plamur','lem ',
        'glue','epoxy','sealant','silikon','silicone','kaca ','cermin','keramik',
        'granit','marmer','tile','ubin','pipa pvc',' pvc','pralon','selang','genteng',
        'asbes','atap','spandek','galvalum','polycarbonate','kunci','engsel','gembok',
        'handle ','pegangan','kran','keran','faucet','shower','kloset','closet',
        'wastafel','westafel','washtafel','pintu','jendela','kusen','kasement',
        'rolling door','sealer','waterproof','waterproofing','kabel','stop kontak',
        'saklar','fitting','mcb','lampu',
    ];

    private const BANK_INFO = [
        1470 => ['name' => 'BCA GIRO',  'rekening' => '155 91 99999',       'atasNama' => 'INDARTO WIBOWO'],
        3    => ['name' => 'MANDIRI',   'rekening' => '136 000 4780612',     'atasNama' => 'DIAN PURNAMA'],
        1456 => ['name' => 'BNI',       'rekening' => '0822 705 836',        'atasNama' => 'INDARTO WIBOWO'],
        1464 => ['name' => 'BRI',       'rekening' => '0262 01 000031 562',  'atasNama' => 'DIAN PURNAMA REZA T.'],
        1465 => ['name' => 'BCA EDC',   'rekening' => '(EDC mesin di toko)', 'atasNama' => '-'],
        1457 => ['name' => 'BRI EDC',   'rekening' => '(EDC mesin di toko)', 'atasNama' => '-'],
    ];

    private const SALES_PHONE = [
        'LEHAN'       => '+62 857-2982-4485',
        'AGUS'        => '+62 857-3084-5708',
        'IVAN'        => '+62 857-1820-0975',
        'DIAS'        => '+62 852-2996-0722',
        'RIO BRANDON' => '+62 859-5282-5277',
        'IMAM'        => '+62 858-9233-3127',
        'AGUNG'       => '+62 882-3368-4224',
        'ANDRE'       => '+62 821-3763-3912',
        'PRIYANTO'    => '+62 823-3479-2357',
        'WIWIT'       => '+62 857-4115-6110',
        'WIWID'       => '+62 857-4115-6110',
        'DHANI'       => '+62 812-1599-2058',
    ];

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function formatRupiah(int $num): string
    {
        return number_format($num, 0, ',', '.');
    }

    private function nameMatch(string $nama, array $keywords): bool
    {
        $n = ' ' . strtolower(trim($nama)) . ' ';
        foreach ($keywords as $k) {
            if (str_contains($n, $k)) return true;
        }
        return false;
    }

    private function klasifikasiItem(?int $catId, string $nama): string
    {
        if ($catId !== null) {
            return in_array($catId, self::ELEKTRONIK_CATEGORY_IDS) ? 'Elektronik' : 'BahanBangunan';
        }
        if ($this->nameMatch($nama, self::ELEKTRONIK_KEYWORDS))     return 'Elektronik';
        if ($this->nameMatch($nama, self::BAHAN_BANGUNAN_KEYWORDS)) return 'BahanBangunan';
        return 'unknown';
    }

    private function normalizeSplits(mixed $raw): array
    {
        if (!is_array($raw)) return [];
        $out = [];
        foreach ($raw as $r) {
            if (!is_array($r)) continue;
            $method = $r['method'] ?? '';
            if (!in_array($method, ['CASH', 'Transfer', 'Debit', 'BelumBayar'])) continue;
            $amount      = max(0, (int) ($r['amount'] ?? 0));
            $bankId      = isset($r['bankAccountId']) && is_int($r['bankAccountId']) && $r['bankAccountId'] > 0
                           ? $r['bankAccountId'] : null;
            $out[] = ['method' => $method, 'amount' => $amount, 'bankAccountId' => $bankId];
        }
        return $out;
    }

    private function summarizeSplits(array $splits, int $total): array
    {
        $paying    = array_filter($splits, fn($s) => $s['method'] !== 'BelumBayar' && $s['amount'] > 0);
        $paying    = array_values($paying);
        $dpAmount  = array_sum(array_column($paying, 'amount'));
        $sisa      = max(0, $total - $dpAmount);
        if (count($paying) === 0)      $metode = 'BelumBayar';
        elseif ($sisa > 0)             $metode = 'DP';
        elseif (count($paying) === 1)  $metode = $paying[0]['method'];
        else                           $metode = 'Multi';
        return ['metodePembayaran' => $metode, 'dpAmount' => $dpAmount, 'sisaPembayaran' => $sisa];
    }

    private function buildPublicUrl(Request $req, string $path): string
    {
        $explicit = env('PUBLIC_APP_URL');
        if ($explicit) return rtrim($explicit, '/') . $path;
        $replit   = env('REPLIT_DEV_DOMAIN');
        if ($replit) return "https://{$replit}{$path}";
        $proto    = $req->header('x-forwarded-proto') ?? $req->getScheme();
        $host     = $req->header('x-forwarded-host') ?? $req->getHost();
        return "{$proto}://{$host}{$path}";
    }

    private function sendBase64Image(string $data): Response
    {
        preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $data, $m);
        $mime   = $m ? $m[1] : 'image/jpeg';
        $b64    = $m ? $m[2] : $data;
        $buffer = base64_decode($b64);
        return response($buffer, 200, [
            'Content-Type'   => $mime,
            'Cache-Control'  => 'public, max-age=86400',
            'Content-Length' => strlen($buffer),
        ]);
    }

    // ── Endpoints ─────────────────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        $rows = DB::table('orders')
            ->select([
                'id', 'order_id', 'nama_kontak', 'nomor_telepon', 'alamat',
                'patokan_lokasi', 'nama_produk', 'jumlah_produk', 'harga_produk',
                'biaya_pengiriman', 'total_harga', 'sales_person', 'metode_pembayaran',
                'keterangan_pembayaran', 'whatsapp_sent', 'status_pengiriman',
                'driver_name', 'metode_pengiriman', 'kategori_produk', 'created_at',
                DB::raw('(bukti_transfer_data IS NOT NULL) AS "hasBuktiTf"'),
            ])
            ->orderByDesc('created_at')
            ->get();

        $result = $rows->map(function ($r) {
            $arr = (array) $r;
            $arr['orderId']            = $arr['order_id'] ?? null;
            $arr['namaKontak']         = $arr['nama_kontak'] ?? null;
            $arr['nomorTelepon']       = $arr['nomor_telepon'] ?? null;
            $arr['patokanLokasi']      = $arr['patokan_lokasi'] ?? null;
            $arr['namaProduk']         = $arr['nama_produk'] ?? null;
            $arr['jumlahProduk']       = $arr['jumlah_produk'] ?? null;
            $arr['hargaProduk']        = $arr['harga_produk'] ?? null;
            $arr['biayaPengiriman']    = $arr['biaya_pengiriman'] ?? null;
            $arr['totalHarga']         = $arr['total_harga'] ?? null;
            $arr['salesPerson']        = $arr['sales_person'] ?? null;
            $arr['metodePembayaran']   = $arr['metode_pembayaran'] ?? null;
            $arr['keteranganPembayaran'] = $arr['keterangan_pembayaran'] ?? null;
            $arr['whatsappSent']       = $arr['whatsapp_sent'] ?? null;
            $arr['statusPengiriman']   = $arr['status_pengiriman'] ?? null;
            $arr['driverName']         = $arr['driver_name'] ?? null;
            $arr['metodePengiriman']   = $arr['metode_pengiriman'] ?? null;
            $arr['kategoriProduk']     = $arr['kategori_produk'] ?? null;
            $arr['createdAt']          = $arr['created_at'] ?? null;
            $arr['hasBuktiTf']         = (bool) ($arr['hasBuktiTf'] ?? false);
            return $arr;
        });

        return response()->json($result);
    }

    public function buktiTf(string $orderId): Response|JsonResponse
    {
        $row = DB::table('orders')
            ->select(['bukti_transfer_data', 'bukti_transfer_list'])
            ->where('order_id', $orderId)
            ->first();

        if (!$row) return response()->json(['error' => 'Order tidak ditemukan'], 404);

        $data = $row->bukti_transfer_data;
        if ($row->bukti_transfer_list) {
            $arr = json_decode($row->bukti_transfer_list, true);
            if (is_array($arr) && count($arr) > 0) $data = $arr[0];
        }
        if (!$data) return response('Bukti transfer tidak ditemukan', 404);
        return $this->sendBase64Image($data);
    }

    public function buktiTfByIndex(string $orderId, int $index): Response|JsonResponse
    {
        $row = DB::table('orders')
            ->select(['bukti_transfer_data', 'bukti_transfer_list'])
            ->where('order_id', $orderId)
            ->first();

        if (!$row) return response()->json(['error' => 'Order tidak ditemukan'], 404);

        $data = null;
        if ($row->bukti_transfer_list) {
            $arr = json_decode($row->bukti_transfer_list, true);
            if (is_array($arr) && $index < count($arr)) $data = $arr[$index];
        }
        if (!$data && $index === 0) $data = $row->bukti_transfer_data;
        if (!$data) return response('Bukti transfer tidak ditemukan', 404);
        return $this->sendBase64Image($data);
    }

    public function destroy(int $id): JsonResponse
    {
        if ($id <= 0) return response()->json(['ok' => false, 'error' => 'ID order tidak valid'], 400);

        $existing = DB::table('orders')->where('id', $id)->first();
        if (!$existing) return response()->json(['ok' => false, 'error' => 'Order tidak ditemukan'], 404);

        DB::table('orders')->where('id', $id)->delete();
        \Log::info("Order deleted by admin", ['orderId' => $existing->order_id, 'id' => $id]);
        return response()->json(['ok' => true, 'deleted' => $existing->order_id]);
    }

    public function store(Request $request): JsonResponse
    {
        $body     = $request->all();
        $rawItems = is_array($body['items'] ?? null) ? $body['items'] : [];

        // Multi-item normalization
        if (count($rawItems) > 0) {
            $totalQty   = array_sum(array_column($rawItems, 'jumlahProduk')) ?: count($rawItems);
            $totalPrice = 0;
            foreach ($rawItems as $it) {
                $totalPrice += ((int)($it['hargaProduk'] ?? 0)) * ((int)($it['jumlahProduk'] ?? 1));
            }
            if (count($rawItems) === 1) {
                $namaProduk = $rawItems[0]['namaProduk'];
            } else {
                $namaProduk = implode("\n", array_map(
                    fn($it, $idx) => ($idx + 1) . '. ' . $it['namaProduk'] . ' (' . $it['jumlahProduk'] . 'x @ Rp ' . $this->formatRupiah((int)$it['hargaProduk']) . ')',
                    $rawItems, array_keys($rawItems)
                ));
            }
            $body['namaProduk']   = $namaProduk;
            $body['jumlahProduk'] = $totalQty;
            $body['hargaProduk']  = $totalPrice;
        }

        // Validate required fields
        $required = ['namaKontak', 'nomorTelepon', 'alamat', 'namaProduk', 'jumlahProduk', 'hargaProduk', 'salesPerson', 'metodePembayaran'];
        foreach ($required as $field) {
            if (empty($body[$field]) && $body[$field] !== 0) {
                return response()->json(['error' => "Field {$field} wajib diisi"], 400);
            }
        }

        $orderId         = strtoupper(substr(Str::uuid(), 0, 8));
        $customerLocToken = Str::random(16);
        $ongkir          = (int)($body['biayaPengiriman'] ?? 0);
        $hargaProduk     = (int)$body['hargaProduk'];
        $jumlahProduk    = (int)$body['jumlahProduk'];
        $subtotal        = count($rawItems) > 0 ? $hargaProduk : $hargaProduk * $jumlahProduk;
        $total           = $subtotal + $ongkir;

        // Payment splits
        $rawSplits      = $body['paymentSplits'] ?? null;
        $paymentSplits  = $this->normalizeSplits($rawSplits);
        $buktiTfList    = array_values(array_filter(
            is_array($body['buktiTfList'] ?? null) ? $body['buktiTfList'] : [],
            fn($s) => is_string($s) && strlen($s) > 0
        ));

        $kledoBankFallback   = isset($body['kledoBankAccountId']) && is_int($body['kledoBankAccountId']) ? $body['kledoBankAccountId'] : null;
        $buktiFallback       = (isset($body['buktiTransferBase64']) && is_string($body['buktiTransferBase64']) && strlen($body['buktiTransferBase64']) > 0)
                               ? $body['buktiTransferBase64'] : null;

        if (count($paymentSplits) === 0) {
            $metode = $body['metodePembayaran'];
            if ($metode === 'BelumBayar') {
                $paymentSplits = [['method' => 'BelumBayar', 'amount' => 0, 'bankAccountId' => null]];
            } else {
                $paymentSplits = [['method' => $metode, 'amount' => $total, 'bankAccountId' => $kledoBankFallback]];
            }
        }

        $summary    = $this->summarizeSplits($paymentSplits, $total);
        $metodeSummary = $summary['metodePembayaran'];
        $dpAmount      = $summary['dpAmount'];
        $sisaPembayaran = $summary['sisaPembayaran'];

        // Build bukti TF list
        $buktiTfListFinal = $buktiTfList;
        $numTransfer      = count(array_filter($paymentSplits, fn($s) => $s['method'] === 'Transfer'));
        if (count($buktiTfListFinal) === 0 && $buktiFallback && $numTransfer > 0) {
            $buktiTfListFinal = [$buktiFallback];
        }
        while (count($buktiTfListFinal) < $numTransfer) $buktiTfListFinal[] = '';

        $buktiLegacy = null;
        foreach ($buktiTfListFinal as $b) {
            if ($b && strlen($b) > 0) { $buktiLegacy = $b; break; }
        }
        $buktiLegacy = $buktiLegacy ?? $buktiFallback;

        // Kategori produk
        $adaElektronik    = false;
        $adaBahanBangunan = false;
        $sourceItems = count($rawItems) > 0 ? $rawItems : [];
        foreach ($sourceItems as $it) {
            $catId = isset($it['kategoriId']) && is_int($it['kategoriId']) ? $it['kategoriId'] : null;
            $klas  = $this->klasifikasiItem($catId, $it['namaProduk'] ?? '');
            if ($klas === 'Elektronik')    $adaElektronik = true;
            if ($klas === 'BahanBangunan') $adaBahanBangunan = true;
        }
        if ($adaElektronik && $adaBahanBangunan) $kategoriProduk = 'Campuran';
        elseif ($adaElektronik)                  $kategoriProduk = 'Elektronik';
        elseif ($adaBahanBangunan)               $kategoriProduk = 'BahanBangunan';
        else                                     $kategoriProduk = 'BahanBangunan';

        $metodePengiriman = ($body['metodePengiriman'] ?? '') === 'BawaSendiri' ? 'BawaSendiri' : 'Dikirim';
        $statusAwal       = $metodePengiriman === 'BawaSendiri' ? 'Selesai' : 'Menunggu';

        // Insert to DB
        try {
            DB::table('orders')->insert([
                'order_id'             => $orderId,
                'nama_kontak'          => $body['namaKontak'],
                'nomor_telepon'        => $body['nomorTelepon'],
                'alamat'               => $body['alamat'],
                'patokan_lokasi'       => $body['patokanLokasi'] ?? '',
                'nama_produk'          => $body['namaProduk'],
                'jumlah_produk'        => $jumlahProduk,
                'harga_produk'         => $hargaProduk,
                'biaya_pengiriman'     => $ongkir ?: null,
                'total_harga'          => $total,
                'sales_person'         => $body['salesPerson'],
                'metode_pembayaran'    => $metodeSummary,
                'keterangan_pembayaran' => $body['keteranganPembayaran'] ?? null,
                'whatsapp_sent'        => 'false',
                'status_pengiriman'    => $statusAwal,
                'metode_pengiriman'    => $metodePengiriman,
                'kategori_produk'      => $kategoriProduk,
                'customer_loc_token'   => $customerLocToken,
                'bukti_transfer_data'  => $buktiLegacy,
                'payment_splits'       => json_encode($paymentSplits),
                'bukti_transfer_list'  => count($buktiTfListFinal) > 0 ? json_encode($buktiTfListFinal) : null,
                'dp_amount'            => $dpAmount,
                'sisa_pembayaran'      => $sisaPembayaran,
                'created_at'           => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error('DB insert failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Gagal menyimpan order ke database'], 500);
        }

        // Reply browser immediately
        $kledoEnabled = (bool) env('KLEDO_TOKEN');
        $response = response()->json([
            'success' => true,
            'message' => 'Order berhasil dikirim! Notifikasi WA & invoice Kledo sedang diproses.',
            'orderId' => $orderId,
            'pending' => ['whatsapp' => true, 'kledo' => $kledoEnabled],
        ], 201);

        // Fire background processing (register shutdown function)
        $orderData = $body;
        $that      = $this;
        register_shutdown_function(function () use (
            $that, $request, $orderId, $orderData, $paymentSplits, $buktiTfListFinal,
            $total, $ongkir, $dpAmount, $sisaPembayaran, $rawItems, $metodePengiriman,
            $customerLocToken, $metodeSummary
        ) {
            $that->processBackground(
                $request, $orderId, $orderData, $paymentSplits, $buktiTfListFinal,
                $total, $ongkir, $dpAmount, $sisaPembayaran, $rawItems, $metodePengiriman,
                $customerLocToken, $metodeSummary
            );
        });

        return $response;
    }

    public function processBackground(
        Request $request,
        string $orderId,
        array $d,
        array $paymentSplits,
        array $buktiTfListFinal,
        int $total,
        int $ongkir,
        int $dpAmount,
        int $sisaPembayaran,
        array $rawItems,
        string $metodePengiriman,
        string $customerLocToken,
        string $metodeSummary
    ): void {
        try {
            $whatsappSent     = false;
            $nomorPelanggan   = FonnteHelper::cleanPhoneNumber($d['nomorTelepon'] ?? '');
            $transferSplits   = array_values(array_filter($paymentSplits, fn($s) => $s['method'] === 'Transfer'));
            $adaBuktiTf       = count(array_filter($buktiTfListFinal, fn($b) => $b && strlen($b) > 0)) > 0;

            $timestamp = now()->format('d/m/Y H:i');
            $locationShareUrl = $this->buildPublicUrl($request, "/loc/{$customerLocToken}");

            // ── WA Messages ──────────────────────────────────────────────────
            $blokBagikanLokasi = $metodePengiriman === 'Dikirim'
                ? "\n📍 *Bagikan Lokasi Anda*\nAgar driver kami mudah menemukan rumah Anda, mohon bagikan titik lokasi GPS Anda dengan menekan link berikut:\n👉 {$locationShareUrl}\n\n_(Cukup buka link, lalu tekan tombol \"Bagikan Lokasi Saya\" — sangat membantu driver kami 🙏)_\n"
                : '';

            $statusBayarLabel = $sisaPembayaran > 0 && $dpAmount > 0
                ? '🟡 *DP Diterima:* Rp ' . $this->formatRupiah($dpAmount) . ' (sisa Rp ' . $this->formatRupiah($sisaPembayaran) . ' ditagih kemudian)'
                : ($sisaPembayaran > 0
                    ? '⏳ *Status Pembayaran:* Belum Bayar (Rp ' . $this->formatRupiah($total) . ')'
                    : '✅ *Status Pembayaran:* Lunas');

            $blokRincian = '';
            $paying      = array_filter($paymentSplits, fn($s) => $s['method'] !== 'BelumBayar' && $s['amount'] > 0);
            if (count($paymentSplits) > 1 || $sisaPembayaran > 0) {
                $blokRincian = "\n💰 *Rincian Pembayaran:*\n";
                foreach ($paying as $s) {
                    $bankInfo  = self::BANK_INFO[$s['bankAccountId'] ?? 0] ?? null;
                    $bankLabel = $bankInfo ? ' – ' . $bankInfo['name'] : '';
                    $label     = $s['method'] === 'BelumBayar' ? 'Belum Bayar' : $s['method'];
                    $blokRincian .= "• {$label}{$bankLabel}: Rp " . $this->formatRupiah($s['amount']) . "\n";
                }
                if ($sisaPembayaran > 0) {
                    $blokRincian .= '• ⏳ *Belum Bayar (sisa): Rp ' . $this->formatRupiah($sisaPembayaran) . '*';
                }
                $blokRincian .= "\n";
            }

            $uniqueBankIds = array_unique(array_filter(
                array_column($transferSplits, 'bankAccountId'),
                fn($b) => $b !== null && $b > 0
            ));
            $infoRekening = '';
            if (count($uniqueBankIds) > 0) {
                $infoRekening = "\n🏦 *Rekening Pembayaran*\n" . (count($uniqueBankIds) === 1
                    ? "Silahkan transfer ke rekening berikut:\n\n"
                    : "Silahkan transfer ke rekening berikut (kalau split, transfer sesuai pembagiannya):\n\n");
                foreach ($uniqueBankIds as $id) {
                    $b = self::BANK_INFO[$id] ?? null;
                    $infoRekening .= $b ? "• *{$b['name']}*\n  {$b['rekening']}\n  a.n. {$b['atasNama']}" : "• Bank ID {$id}";
                    $infoRekening .= "\n";
                }
                if ($adaBuktiTf) $infoRekening .= "\n_(Bukti transfer sudah kami terima ✅)_\n";
            }

            $pesanPelanggan =
                "Halo Kak 👋\n\n" .
                "Terima kasih sudah mengisi form Purchase Order Customer 🙏\n\n" .
                "Pesanan Kakak sudah kami terima dan saat ini sedang diproses oleh tim kami. Berikut ringkasan pesanan Kakak:\n\n" .
                "📦 *Nama Produk:* {$d['namaProduk']}\n" .
                "🔢 *Jumlah:* {$d['jumlahProduk']} unit\n" .
                "💰 *Harga:* Rp " . $this->formatRupiah((int)$d['hargaProduk']) . "\n" .
                ($ongkir ? "🚚 *Ongkir:* Rp " . $this->formatRupiah($ongkir) . "\n" : '') .
                "📍 *Alamat:* {$d['alamat']}" . (($d['patokanLokasi'] ?? '') ? " – {$d['patokanLokasi']}" : '') . "\n\n" .
                "💳 *Total Pembayaran: Rp " . $this->formatRupiah($total) . "*\n" .
                $blokRincian . "{$statusBayarLabel}\n" . $infoRekening . $blokBagikanLokasi .
                ($sisaPembayaran > 0
                    ? "\nMohon lakukan pelunasan sisa pembayaran sesuai kesepakatan ya 🙏\n"
                    : "\nPesanan Kakak sudah lunas, kami akan segera memproses ya 🙏\n") .
                "_(Jika ada bukti transfer tambahan, mohon kirim ke chat ini)_\n\n" .
                "Jika ada pertanyaan, jangan ragu untuk menghubungi kami 😊\n\n" .
                "Terima kasih atas kepercayaannya 🙌";

            $paying2   = array_filter($paymentSplits, fn($s) => $s['method'] !== 'BelumBayar' && $s['amount'] > 0);
            $allUnpaid = count($paying2) === 0;
            $labelStatusAdmin = $sisaPembayaran > 0 && $dpAmount > 0
                ? "DP Rp " . $this->formatRupiah($dpAmount) . " (sisa Rp " . $this->formatRupiah($sisaPembayaran) . ")"
                : ($sisaPembayaran > 0 ? "Belum Bayar" : (count($paymentSplits) > 1 ? "Lunas (Multi)" : "Lunas ({$paymentSplits[0]['method']})"));

            $buktiStatus = count($transferSplits) > 0 ? ($adaBuktiTf ? ' ✅ (' . count(array_filter($buktiTfListFinal)) . ' bukti TF terlampir)' : ' ⏳ (belum ada bukti TF)') : '';

            $pesanAdmin =
                "🔔 *Order masuk bossku!* 👀\n\n" .
                "📌 *Customer:*\n{$d['namaKontak']} – {$d['nomorTelepon']}\n\n" .
                "📍 *Alamat:* {$d['alamat']}\n" .
                (($d['patokanLokasi'] ?? '') ? "🏠 *Patokan:* {$d['patokanLokasi']}\n" : '') .
                "\n📦 *Pesanan:*\n{$d['namaProduk']} x {$d['jumlahProduk']} unit\n\n" .
                "💰 *Total: Rp " . $this->formatRupiah($total) . "*" . ($ongkir ? " (Ongkir: Rp " . $this->formatRupiah($ongkir) . ")" : '') . "\n" .
                "💳 Pembayaran: {$labelStatusAdmin}{$buktiStatus}" . (($d['keteranganPembayaran'] ?? '') ? " – {$d['keteranganPembayaran']}" : '') . "\n" .
                $blokRincian . "\n👨‍💼 *Sales:* {$d['salesPerson']}\n\n" .
                "⚡ Yuk langsung di-follow up sebelum dia keburu cancel 😄\n\n🕒 {$timestamp}";

            // Send WA to customer
            if ($nomorPelanggan) {
                $sent = FonnteHelper::kirimWA($nomorPelanggan, $pesanPelanggan);
                if ($sent) $whatsappSent = true;
            }

            // Send WA to admin group
            $adminWA = SettingsController::getSetting('grupInvoiceId') ?? '120363405869453556@g.us';
            if ($adminWA) {
                FonnteHelper::kirimWA($adminWA, $pesanAdmin, [
                    'button' => '✅ Siap meluncur bossku!,📞 Hubungi customer,⏳ Follow up nanti',
                    'footer' => "Order #{$orderId} – {$d['salesPerson']}",
                ]);
                $whatsappSent = true;
            }

            DB::table('orders')->where('order_id', $orderId)->update([
                'whatsapp_sent' => $whatsappSent ? 'true' : 'false',
            ]);

            // ── Kledo Invoice ─────────────────────────────────────────────────
            if (env('KLEDO_TOKEN') && count($rawItems) > 0) {
                try {
                    $kledoItems = [];
                    foreach ($rawItems as $item) {
                        $productId = isset($item['kledoProductId']) && is_int($item['kledoProductId']) && $item['kledoProductId'] > 0
                            ? $item['kledoProductId'] : null;
                        $unitId = isset($item['kledoUnitId']) && is_int($item['kledoUnitId']) && $item['kledoUnitId'] > 0
                            ? $item['kledoUnitId'] : 73;

                        if (!$productId && !empty($item['namaProduk'])) {
                            $found = KledoController::searchProductByName(trim($item['namaProduk']));
                            if ($found) {
                                $productId = $found['id'];
                                $unitId    = $found['unitId'];
                            } else {
                                \Log::warning("Produk tidak ditemukan di Kledo: {$item['namaProduk']}");
                                continue;
                            }
                        }
                        if (!$productId) continue;

                        $kledoItems[] = [
                            'kledoProductId'         => $productId,
                            'kledoFinanceAccountId'  => $item['kledoFinanceAccountId'] ?? null,
                            'kledoUnitId'            => $unitId,
                            'jumlahProduk'           => (int)($item['jumlahProduk'] ?? 1),
                            'hargaProduk'            => (int)($item['hargaProduk'] ?? 0),
                        ];
                    }

                    if (count($kledoItems) > 0) {
                        $contactId = KledoController::findOrCreateContact($d['namaKontak'], $d['nomorTelepon'], $d['alamat']);
                        if ($contactId) {
                            $salesPhone  = self::SALES_PHONE[strtoupper($d['salesPerson'] ?? '')] ?? '';
                            $baseMemo    = $salesPhone ? "Sales: {$d['salesPerson']} - {$salesPhone}" : "Sales: {$d['salesPerson']}";
                            $statusMemo  = $allUnpaid ? ' | BELUM BAYAR'
                                : ($sisaPembayaran > 0
                                    ? ' | DP Rp ' . $this->formatRupiah($dpAmount) . ' / Sisa Rp ' . $this->formatRupiah($sisaPembayaran)
                                    : ' | LUNAS');

                            $inv = KledoController::createInvoice([
                                'contactId'      => $contactId,
                                'orderId'        => $orderId,
                                'items'          => $kledoItems,
                                'biayaPengiriman' => $ongkir,
                                'memo'           => $baseMemo . $statusMemo,
                                'patokanLokasi'  => $d['patokanLokasi'] ?? '',
                            ]);

                            if (($inv['success'] ?? false) && isset($inv['invoiceId'])) {
                                $invoiceId = (int) $inv['invoiceId'];
                                \Log::info("Kledo invoice created #{$inv['invoiceNumber']} id={$invoiceId} for order {$orderId}");

                                // Upload first bukti TF as attachment
                                $firstBukti = null;
                                foreach ($buktiTfListFinal as $b) { if ($b && strlen($b) > 0) { $firstBukti = $b; break; } }
                                if ($firstBukti) {
                                    try {
                                        KledoController::uploadAttachment($invoiceId, $firstBukti, "bukti-tf-order-{$orderId}.jpg");
                                    } catch (\Exception $e) {
                                        \Log::error("Upload bukti TF ke Kledo gagal: " . $e->getMessage());
                                    }
                                }

                                // Auto-pay splits
                                $transferIdx = 0;
                                foreach ($paymentSplits as $split) {
                                    if ($split['method'] === 'BelumBayar' || $split['amount'] <= 0) continue;
                                    $memo = "Order #{$orderId} - {$d['salesPerson']}";

                                    if ($split['method'] === 'CASH') {
                                        $elektrAmount = 0;
                                        $lainAmount   = 0;
                                        $sourceForCash = count($rawItems) > 0 ? $rawItems : [['namaProduk' => $d['namaProduk'], 'jumlahProduk' => $d['jumlahProduk'], 'hargaProduk' => $d['hargaProduk'], 'kategoriId' => null]];
                                        foreach ($sourceForCash as $it) {
                                            $lineTotal = ((int)($it['hargaProduk'] ?? 0)) * ((int)($it['jumlahProduk'] ?? 1));
                                            $catId     = isset($it['kategoriId']) && is_int($it['kategoriId']) ? $it['kategoriId'] : null;
                                            $klas      = $this->klasifikasiItem($catId, $it['namaProduk'] ?? '');
                                            if ($klas === 'Elektronik') $elektrAmount += $lineTotal;
                                            else                        $lainAmount   += $lineTotal;
                                        }
                                        if ($elektrAmount > 0 && $lainAmount === 0) $elektrAmount += $ongkir;
                                        else                                        $lainAmount   += $ongkir;
                                        $totalKat       = $elektrAmount + $lainAmount;
                                        $ratio          = $totalKat > 0 ? $split['amount'] / $totalKat : 0;
                                        $scaledElektrik = (int) round($elektrAmount * $ratio);
                                        $scaledLain     = $split['amount'] - $scaledElektrik;
                                        if ($scaledElektrik > 0) KledoController::payInvoice($invoiceId, self::KLEDO_KAS_ELEKTRONIK, $scaledElektrik, "{$memo} (CASH-Elektronik)");
                                        if ($scaledLain > 0)     KledoController::payInvoice($invoiceId, self::KLEDO_KAS_SULAWESI, $scaledLain, "{$memo} (CASH-Bahan)");

                                    } elseif ($split['method'] === 'Debit' && $split['bankAccountId']) {
                                        KledoController::payInvoice($invoiceId, $split['bankAccountId'], $split['amount'], "{$memo} (Debit)");

                                    } elseif ($split['method'] === 'Transfer' && $split['bankAccountId']) {
                                        $hasBukti = isset($buktiTfListFinal[$transferIdx]) && strlen($buktiTfListFinal[$transferIdx]) > 0;
                                        $transferIdx++;
                                        if ($hasBukti) KledoController::payInvoice($invoiceId, $split['bankAccountId'], $split['amount'], "{$memo} (Transfer)");
                                    }
                                }
                            }
                        }
                    }
                } catch (\Exception $e) {
                    \Log::error("Kledo invoice error for order {$orderId}: " . $e->getMessage());
                }
            }

            // ── Forward bukti TF ke grup WA ─────────────────────────────────
            $grupBuktiTF = SettingsController::getSetting('grupBuktiTfId') ?? '120363425112329389@g.us';
            if ($grupBuktiTF) {
                $txIdx = 0;
                foreach ($paymentSplits as $split) {
                    if ($split['method'] !== 'Transfer') continue;
                    $currentIdx = $txIdx++;
                    $buktiAda   = isset($buktiTfListFinal[$currentIdx]) && strlen($buktiTfListFinal[$currentIdx]) > 0;
                    if (!$buktiAda) continue;

                    try {
                        $rawBukti = $buktiTfListFinal[$currentIdx];
                        preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $rawBukti, $mMatch);
                        $mime     = $mMatch ? $mMatch[1] : 'image/jpeg';
                        $b64      = $mMatch ? $mMatch[2] : $rawBukti;
                        $buffer   = base64_decode($b64);
                        $ext      = explode('/', $mime)[1] ?? 'jpg';
                        $filename = "bukti-tf-{$orderId}-{$currentIdx}.{$ext}";

                        $bankInfo = self::BANK_INFO[$split['bankAccountId'] ?? 0] ?? null;
                        $total_str  = $this->formatRupiah($total);
                        $amount_str = $this->formatRupiah($split['amount']);
                        $countStr   = count($transferSplits) > 1 ? " ({$currentIdx}+" . count($transferSplits) . ")" : '';

                        $pesan = "💸 *Bukti Transfer Masuk*{$countStr}\n\n" .
                            "Order: #{$orderId}\n" .
                            "Customer: {$d['namaKontak']} – {$d['nomorTelepon']}\n" .
                            "Total Order: Rp {$total_str}\n" .
                            "Nominal Transfer: Rp {$amount_str}\n" .
                            "Bank Tujuan: " . ($bankInfo['name'] ?? '-') . "\n" .
                            ($sisaPembayaran > 0 ? "Status: DP (sisa Rp " . $this->formatRupiah($sisaPembayaran) . ")\n" : '') .
                            "Sales: {$d['salesPerson']}";

                        FonnteHelper::kirimWA($grupBuktiTF, $pesan, [
                            'file' => ['buffer' => $buffer, 'filename' => $filename, 'mime' => $mime],
                        ]);
                    } catch (\Exception $e) {
                        \Log::error("Gagal forward bukti TF ke grup WA idx={$currentIdx}: " . $e->getMessage());
                    }
                }
            }
        } catch (\Exception $e) {
            \Log::error("Background WA/Kledo flow failed for order {$orderId}: " . $e->getMessage());
        }
    }

    public function uploadFoto(Request $request, int $id): JsonResponse
    {
        $photoBase64 = $request->input('photoBase64');
        $driverName  = $request->input('driverName');
        $caption     = $request->input('caption');

        if (!$photoBase64) return response()->json(['ok' => false, 'error' => 'Foto wajib diisi'], 400);

        $order = DB::table('orders')->where('id', $id)->first();
        if (!$order) return response()->json(['ok' => false, 'error' => 'Order tidak ditemukan'], 404);

        preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $photoBase64, $m);
        $mime     = $m ? $m[1] : 'image/jpeg';
        $b64      = $m ? $m[2] : $photoBase64;
        $buffer   = base64_decode($b64);
        $ext      = explode('/', $mime)[1] ?? 'jpg';
        $filename = "bukti-{$order->order_id}.{$ext}";

        $groupId     = env('FONNTE_GROUP_ID', '120363356936985289@g.us');
        $driverLabel = $driverName ?: $order->driver_name ?: 'Driver';

        $message = "📸 *Bukti Pengiriman*\n\n" .
            "Order: #{$order->order_id}\n" .
            "Customer: {$order->nama_kontak} – {$order->nomor_telepon}\n" .
            "Alamat: {$order->alamat}" . ($order->patokan_lokasi ? " – {$order->patokan_lokasi}" : '') . "\n" .
            "Produk: {$order->nama_produk} × {$order->jumlah_produk}\n" .
            "Driver: {$driverLabel}" . ($caption ? "\n\nCatatan: {$caption}" : '');

        $sent = FonnteHelper::kirimWA($groupId, $message, [
            'file' => ['buffer' => $buffer, 'filename' => $filename, 'mime' => $mime],
        ]);

        if (!$sent) return response()->json(['ok' => false, 'error' => 'Gagal mengirim ke grup WA'], 502);
        return response()->json(['ok' => true]);
    }

    public function updatePengiriman(Request $request, int $id): JsonResponse
    {
        $statusPengiriman = $request->input('statusPengiriman');
        $driverName       = $request->input('driverName');

        $validStatus = ['Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];
        if (!$statusPengiriman || !in_array($statusPengiriman, $validStatus)) {
            return response()->json(['error' => 'Status tidak valid'], 400);
        }

        $update = ['status_pengiriman' => $statusPengiriman];
        if ($driverName !== null) $update['driver_name'] = $driverName;

        DB::table('orders')->where('id', $id)->update($update);
        return response()->json(['ok' => true]);
    }

    public function getLocation(string $token): JsonResponse
    {
        if (!$token) return response()->json(['error' => 'Token tidak valid'], 400);

        $row = DB::table('orders')
            ->select(['order_id', 'nama_kontak', 'alamat', 'customer_lat'])
            ->where('customer_loc_token', $token)
            ->first();

        if (!$row) return response()->json(['error' => 'Link lokasi tidak ditemukan / sudah kedaluwarsa'], 404);

        return response()->json([
            'orderId'       => $row->order_id,
            'namaKontak'    => $row->nama_kontak,
            'alamat'        => $row->alamat,
            'alreadyShared' => (bool) $row->customer_lat,
        ]);
    }

    public function saveLocation(Request $request, string $token): JsonResponse
    {
        if (!$token) return response()->json(['error' => 'Token tidak valid'], 400);

        $lat = (float) $request->input('lat');
        $lng = (float) $request->input('lng');

        if (!is_finite($lat) || !is_finite($lng) || $lat < -90 || $lat > 90 || $lng < -180 || $lng > 180) {
            return response()->json(['error' => 'Koordinat GPS tidak valid'], 400);
        }

        $updated = DB::table('orders')
            ->where('customer_loc_token', $token)
            ->update([
                'customer_lat'          => (string) $lat,
                'customer_lng'          => (string) $lng,
                'customer_loc_shared_at' => now(),
            ]);

        if ($updated === 0) return response()->json(['error' => 'Link lokasi tidak ditemukan'], 404);

        $row = DB::table('orders')->select('order_id', 'nama_kontak')->where('customer_loc_token', $token)->first();
        \Log::info("Customer shared GPS location", ['orderId' => $row->order_id, 'lat' => $lat, 'lng' => $lng]);
        return response()->json(['ok' => true, 'orderId' => $row->order_id]);
    }
}
