<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use App\Models\Order;
use App\Helpers\FonnteHelper;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\SettingsController;

class OrderController extends Controller
{
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
        'bracket','braket','wall mount','wallmount','tiang antena','tiang tv',
        'mounting','dudukan tv','dudukan antena','remote','remot',
        'hdmi','kabel antena','kabel audio','kabel hdmi','kabel tv','kabel speaker',
        'adaptor','adapter','stabilizer','stavolt','ups ','inverter',
        'digital tv','dvb','set-top','decoder','signal booster','penguat sinyal',
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
        3    => ['name' => 'MANDIRI',   'rekening' => '136 000 4780612',     'atasNama' => 'DIAN PURNAMA REZA T.'],
        1456 => ['name' => 'BNI',       'rekening' => '0822 705 836',        'atasNama' => 'INDARTO WIBOWO'],
        1464 => ['name' => 'BRI',       'rekening' => '0262 01 000031 562',  'atasNama' => 'DIAN PURNAMA REZA T.'],
        1465 => ['name' => 'BCA EDC',     'rekening' => '(EDC mesin di toko)', 'atasNama' => '-'],
        1457 => ['name' => 'BRI EDC',     'rekening' => '(EDC mesin di toko)', 'atasNama' => '-'],
        1458 => ['name' => 'BNI EDC',     'rekening' => '(EDC mesin di toko)', 'atasNama' => '-'],
        1459 => ['name' => 'MANDIRI EDC', 'rekening' => '(EDC mesin di toko)', 'atasNama' => '-'],
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
            $amount = max(0, (int) ($r['amount'] ?? 0));
            $bankId = isset($r['bankAccountId']) && is_int($r['bankAccountId']) && $r['bankAccountId'] > 0
                      ? $r['bankAccountId'] : null;
            $out[] = ['method' => $method, 'amount' => $amount, 'bankAccountId' => $bankId];
        }
        return $out;
    }

    private function summarizeSplits(array $splits, int $total): array
    {
        $paying   = array_values(array_filter($splits, fn($s) => $s['method'] !== 'BelumBayar' && $s['amount'] > 0));
        $dpAmount = array_sum(array_column($paying, 'amount'));
        $sisa     = max(0, $total - $dpAmount);
        if (count($paying) === 0)     $metode = 'BelumBayar';
        elseif ($sisa > 0)            $metode = 'DP';
        elseif (count($paying) === 1) $metode = $paying[0]['method'];
        else                          $metode = 'Multi';
        return ['metodePembayaran' => $metode, 'dpAmount' => $dpAmount, 'sisaPembayaran' => $sisa];
    }

    private function buildPublicUrl(Request $req, string $path): string
    {
        $explicit = env('PUBLIC_APP_URL');
        if ($explicit) return rtrim($explicit, '/') . $path;
        $replit   = env('REPLIT_DEV_DOMAIN');
        if ($replit) return "https://{$replit}{$path}";
        $proto = $req->header('x-forwarded-proto') ?? $req->getScheme();
        $host  = $req->header('x-forwarded-host') ?? $req->getHost();
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

    // ── API Endpoints ─────────────────────────────────────────────────────────

    public function index(): JsonResponse
    {
        $orders = Order::select([
                'id', 'order_id', 'nama_kontak', 'nomor_telepon', 'alamat',
                'patokan_lokasi', 'nama_produk', 'jumlah_produk', 'harga_produk',
                'biaya_pengiriman', 'total_harga', 'sales_person', 'metode_pembayaran',
                'keterangan_pembayaran', 'whatsapp_sent', 'status_pengiriman',
                'driver_name', 'metode_pengiriman', 'kategori_produk', 'created_at',
                'kledo_invoice_id',
                \DB::raw('CASE WHEN bukti_transfer_data IS NOT NULL THEN 1 ELSE 0 END AS hasBuktiTf'),
            ])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($o) => [
                'id'                    => $o->id,
                'orderId'               => $o->order_id,
                'namaKontak'            => $o->nama_kontak,
                'nomorTelepon'          => $o->nomor_telepon,
                'alamat'                => $o->alamat,
                'patokanLokasi'         => $o->patokan_lokasi,
                'namaProduk'            => $o->nama_produk,
                'jumlahProduk'          => $o->jumlah_produk,
                'hargaProduk'           => $o->harga_produk,
                'biayaPengiriman'       => $o->biaya_pengiriman,
                'totalHarga'            => $o->total_harga,
                'salesPerson'           => $o->sales_person,
                'metodePembayaran'      => $o->metode_pembayaran,
                'keteranganPembayaran'  => $o->keterangan_pembayaran,
                'whatsappSent'          => $o->whatsapp_sent,
                'statusPengiriman'      => $o->status_pengiriman,
                'driverName'            => $o->driver_name,
                'metodePengiriman'      => $o->metode_pengiriman,
                'kategoriProduk'        => $o->kategori_produk,
                'createdAt'             => $o->created_at,
                'hasBuktiTf'            => (bool) $o->hasBuktiTf,
                'kledoInvoiceId'        => $o->kledo_invoice_id,
            ]);

        return response()->json($orders);
    }

    public function buktiTf(string $orderId): Response|JsonResponse
    {
        $order = Order::where('order_id', $orderId)
            ->select(['bukti_transfer_data', 'bukti_transfer_list'])
            ->withoutGlobalScopes()
            ->first();

        if (!$order) return response()->json(['error' => 'Order tidak ditemukan'], 404);

        $data = $order->getRawOriginal('bukti_transfer_data');
        $list = $order->getRawOriginal('bukti_transfer_list');
        if ($list) {
            $arr = json_decode($list, true);
            if (is_array($arr) && count($arr) > 0) $data = $arr[0];
        }
        if (!$data) return response('Bukti transfer tidak ditemukan', 404);
        return $this->sendBase64Image($data);
    }

    public function buktiTfByIndex(string $orderId, int $index): Response|JsonResponse
    {
        $order = Order::where('order_id', $orderId)
            ->select(['bukti_transfer_data', 'bukti_transfer_list'])
            ->withoutGlobalScopes()
            ->first();

        if (!$order) return response()->json(['error' => 'Order tidak ditemukan'], 404);

        $data = null;
        $list = $order->getRawOriginal('bukti_transfer_list');
        if ($list) {
            $arr = json_decode($list, true);
            if (is_array($arr) && $index < count($arr)) $data = $arr[$index];
        }
        if (!$data && $index === 0) $data = $order->getRawOriginal('bukti_transfer_data');
        if (!$data) return response('Bukti transfer tidak ditemukan', 404);
        return $this->sendBase64Image($data);
    }

    public function destroy(int $id): JsonResponse
    {
        if ($id <= 0) return response()->json(['ok' => false, 'error' => 'ID order tidak valid'], 400);

        $order = Order::find($id);
        if (!$order) return response()->json(['ok' => false, 'error' => 'Order tidak ditemukan'], 404);

        $orderId = $order->order_id;
        $order->delete();
        \Log::info("Order deleted by admin", ['orderId' => $orderId, 'id' => $id]);
        return response()->json(['ok' => true, 'deleted' => $orderId]);
    }

    public function store(Request $request): JsonResponse
    {
        $body     = $request->all();
        $rawItems = is_array($body['items'] ?? null) ? $body['items'] : [];

        if (count($rawItems) > 0) {
            $totalQty   = array_sum(array_column($rawItems, 'jumlahProduk')) ?: count($rawItems);
            $totalPrice = 0;
            foreach ($rawItems as $it) {
                $totalPrice += ((int)($it['hargaProduk'] ?? 0)) * ((int)($it['jumlahProduk'] ?? 1));
            }
            $body['namaProduk']   = count($rawItems) === 1
                ? $rawItems[0]['namaProduk']
                : implode("\n", array_map(
                    fn($it, $idx) => ($idx + 1) . '. ' . $it['namaProduk'] . ' (' . $it['jumlahProduk'] . 'x @ Rp ' . $this->formatRupiah((int)$it['hargaProduk']) . ')',
                    $rawItems, array_keys($rawItems)
                ));
            $body['jumlahProduk'] = $totalQty;
            $body['hargaProduk']  = $totalPrice;
        }

        $required = ['namaProduk', 'jumlahProduk', 'hargaProduk', 'salesPerson', 'metodePembayaran'];
        foreach ($required as $field) {
            if (empty($body[$field]) && $body[$field] !== 0) {
                return response()->json(['error' => "Field {$field} wajib diisi"], 400);
            }
        }

        $orderId          = strtoupper(substr(Str::uuid(), 0, 8));
        $customerLocToken = Str::random(16);
        $ongkir           = (int)($body['biayaPengiriman'] ?? 0);
        $hargaProduk      = (int)$body['hargaProduk'];
        $jumlahProduk     = (int)$body['jumlahProduk'];
        $subtotal         = count($rawItems) > 0 ? $hargaProduk : $hargaProduk * $jumlahProduk;
        $total            = $subtotal + $ongkir;

        $rawSplits     = $body['paymentSplits'] ?? null;
        $paymentSplits = $this->normalizeSplits($rawSplits);
        $buktiTfList   = array_values(array_filter(
            is_array($body['buktiTfList'] ?? null) ? $body['buktiTfList'] : [],
            fn($s) => is_string($s) && strlen($s) > 0
        ));

        $kledoBankFallback = isset($body['kledoBankAccountId']) && is_int($body['kledoBankAccountId']) ? $body['kledoBankAccountId'] : null;
        $buktiFallback     = (isset($body['buktiTransferBase64']) && is_string($body['buktiTransferBase64']) && strlen($body['buktiTransferBase64']) > 0)
                             ? $body['buktiTransferBase64'] : null;

        if (count($paymentSplits) === 0) {
            $metode        = $body['metodePembayaran'];
            $paymentSplits = $metode === 'BelumBayar'
                ? [['method' => 'BelumBayar', 'amount' => 0, 'bankAccountId' => null]]
                : [['method' => $metode, 'amount' => $total, 'bankAccountId' => $kledoBankFallback]];
        }

        $summary        = $this->summarizeSplits($paymentSplits, $total);
        $metodeSummary  = $summary['metodePembayaran'];
        $dpAmount       = $summary['dpAmount'];
        $sisaPembayaran = $summary['sisaPembayaran'];

        $numTransfer      = count(array_filter($paymentSplits, fn($s) => $s['method'] === 'Transfer'));
        $buktiTfListFinal = $buktiTfList;
        if (count($buktiTfListFinal) === 0 && $buktiFallback && $numTransfer > 0) {
            $buktiTfListFinal = [$buktiFallback];
        }
        while (count($buktiTfListFinal) < $numTransfer) $buktiTfListFinal[] = '';

        $buktiLegacy = null;
        foreach ($buktiTfListFinal as $b) {
            if ($b && strlen($b) > 0) { $buktiLegacy = $b; break; }
        }
        $buktiLegacy = $buktiLegacy ?? $buktiFallback;

        $adaElektronik = $adaBahanBangunan = false;
        foreach (count($rawItems) > 0 ? $rawItems : [] as $it) {
            $catId = isset($it['kategoriId']) && is_int($it['kategoriId']) ? $it['kategoriId'] : null;
            $klas  = $this->klasifikasiItem($catId, $it['namaProduk'] ?? '');
            if ($klas === 'Elektronik')    $adaElektronik = true;
            if ($klas === 'BahanBangunan') $adaBahanBangunan = true;
        }
        $kategoriProduk = ($adaElektronik && $adaBahanBangunan) ? 'Campuran'
            : ($adaElektronik ? 'Elektronik' : 'BahanBangunan');

        $metodePengiriman = ($body['metodePengiriman'] ?? '') === 'BawaSendiri' ? 'BawaSendiri' : 'Dikirim';
        $statusAwal       = $metodePengiriman === 'BawaSendiri' ? 'Selesai' : 'Menunggu';

        try {
            Order::create([
                'order_id'              => $orderId,
                'nama_kontak'           => $body['namaKontak'] ?? null,
                'nomor_telepon'         => !empty($body['nomorTelepon']) ? $body['nomorTelepon'] : null,
                'alamat'                => !empty($body['alamat']) ? $body['alamat'] : null,
                'patokan_lokasi'        => $body['patokanLokasi'] ?? '',
                'nama_produk'           => $body['namaProduk'],
                'jumlah_produk'         => $jumlahProduk,
                'harga_produk'          => $hargaProduk,
                'biaya_pengiriman'      => $ongkir,
                'total_harga'           => $total,
                'sales_person'          => $body['salesPerson'],
                'metode_pembayaran'     => $metodeSummary,
                'keterangan_pembayaran' => null,
                'whatsapp_sent'         => 'false',
                'status_pengiriman'     => $statusAwal,
                'metode_pengiriman'     => $metodePengiriman,
                'kategori_produk'       => $kategoriProduk,
                'customer_loc_token'    => $customerLocToken,
                'bukti_transfer_data'   => $buktiLegacy,
                'payment_splits'        => $paymentSplits,
                'bukti_transfer_list'   => count($buktiTfListFinal) > 0 ? $buktiTfListFinal : null,
                'dp_amount'             => $dpAmount,
                'sisa_pembayaran'       => $sisaPembayaran,
                'raw_items'             => count($rawItems) > 0 ? $rawItems : null,
                'created_at'            => now(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Order insert failed: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => 'Gagal menyimpan order ke database'], 500);
        }

        $kledoEnabled = (bool) env('KLEDO_TOKEN');
        $response = response()->json([
            'success' => true,
            'message' => 'Order berhasil dikirim! Notifikasi WA & invoice Kledo sedang diproses.',
            'orderId' => $orderId,
            'pending' => ['whatsapp' => true, 'kledo' => $kledoEnabled],
        ], 201);

        $that = $this;
        register_shutdown_function(function () use (
            $that, $request, $orderId, $body, $paymentSplits, $buktiTfListFinal,
            $total, $ongkir, $dpAmount, $sisaPembayaran, $rawItems, $metodePengiriman,
            $customerLocToken, $metodeSummary
        ) {
            $that->processBackground(
                $request, $orderId, $body, $paymentSplits, $buktiTfListFinal,
                $total, $ongkir, $dpAmount, $sisaPembayaran, $rawItems, $metodePengiriman,
                $customerLocToken, $metodeSummary
            );
        });

        return $response;
    }

    public function processBackground(
        Request $request, string $orderId, array $d,
        array $paymentSplits, array $buktiTfListFinal,
        int $total, int $ongkir, int $dpAmount, int $sisaPembayaran,
        array $rawItems, string $metodePengiriman,
        string $customerLocToken, string $metodeSummary
    ): void {
        // Pastikan PHP tetap jalan meski client disconnect, beri waktu 2 menit
        ignore_user_abort(true);
        set_time_limit(120);
        sleep(2);
        try {
            $whatsappSent   = false;
            $nomorPelanggan = FonnteHelper::cleanPhoneNumber($d['nomorTelepon'] ?? '');
            $transferSplits = array_values(array_filter($paymentSplits, fn($s) => $s['method'] === 'Transfer'));
            $adaBuktiTf     = count(array_filter($buktiTfListFinal, fn($b) => $b && strlen($b) > 0)) > 0;
            $timestamp      = now()->format('d/m/Y H:i');
            $locationShareUrl = $this->buildPublicUrl($request, "/loc/{$customerLocToken}");

            $blokBagikanLokasi = $metodePengiriman === 'Dikirim'
                ? "\n📍 *Bagikan Lokasi Anda*\nAgar driver kami mudah menemukan rumah Anda, mohon bagikan titik lokasi GPS Anda:\n👉 {$locationShareUrl}\n"
                : '';

            $statusBayarLabel = $sisaPembayaran > 0 && $dpAmount > 0
                ? '🟡 *DP Diterima:* Rp ' . $this->formatRupiah($dpAmount) . ' (sisa Rp ' . $this->formatRupiah($sisaPembayaran) . ')'
                : ($sisaPembayaran > 0
                    ? '⏳ *Status Pembayaran:* Belum Bayar (Rp ' . $this->formatRupiah($total) . ')'
                    : '✅ *Status Pembayaran:* Lunas');

            $paying      = array_filter($paymentSplits, fn($s) => $s['method'] !== 'BelumBayar' && $s['amount'] > 0);
            $allUnpaid   = count($paying) === 0;
            $blokRincian = '';
            if (count($paymentSplits) > 1 || $sisaPembayaran > 0) {
                $blokRincian = "\n💰 *Rincian Pembayaran:*\n";
                foreach ($paying as $s) {
                    $bankInfo    = self::BANK_INFO[$s['bankAccountId'] ?? 0] ?? null;
                    $bankLabel   = $bankInfo ? ' – ' . $bankInfo['name'] : '';
                    $blokRincian .= "• {$s['method']}{$bankLabel}: Rp " . $this->formatRupiah($s['amount']) . "\n";
                }
                if ($sisaPembayaran > 0) $blokRincian .= '• ⏳ *Belum Bayar (sisa): Rp ' . $this->formatRupiah($sisaPembayaran) . '*';
                $blokRincian .= "\n";
            }

            $uniqueBankIds = array_unique(array_filter(array_column($transferSplits, 'bankAccountId'), fn($b) => $b !== null && $b > 0));
            $infoRekening  = '';
            if (count($uniqueBankIds) > 0) {
                $infoRekening = "\n🏦 *Rekening Pembayaran*\n";
                foreach ($uniqueBankIds as $id) {
                    $b = self::BANK_INFO[$id] ?? null;
                    $infoRekening .= $b ? "• *{$b['name']}*\n  {$b['rekening']}\n  a.n. {$b['atasNama']}\n" : "• Bank ID {$id}\n";
                }
                if ($adaBuktiTf) $infoRekening .= "\n_(Bukti transfer sudah kami terima ✅)_\n";
            }

            $pesanPelanggan =
                "Halo Kak 👋\n\nTerima kasih sudah mengisi form Purchase Order 🙏\n\n" .
                "📦 *Nama Produk:* {$d['namaProduk']}\n" .
                "🔢 *Jumlah:* {$d['jumlahProduk']} unit\n" .
                "💰 *Harga:* Rp " . $this->formatRupiah((int)$d['hargaProduk']) . "\n" .
                ($ongkir ? "🚚 *Ongkir:* Rp " . $this->formatRupiah($ongkir) . "\n" : '') .
                "📍 *Alamat:* {$d['alamat']}" . (($d['patokanLokasi'] ?? '') ? " – {$d['patokanLokasi']}" : '') . "\n\n" .
                "💳 *Total: Rp " . $this->formatRupiah($total) . "*\n" .
                $blokRincian . $statusBayarLabel . "\n" . $infoRekening . $blokBagikanLokasi .
                "\nJika ada pertanyaan, jangan ragu menghubungi kami 😊\nTerima kasih 🙌";

            $labelStatusAdmin = $sisaPembayaran > 0 && $dpAmount > 0
                ? "DP Rp " . $this->formatRupiah($dpAmount) . " (sisa Rp " . $this->formatRupiah($sisaPembayaran) . ")"
                : ($sisaPembayaran > 0 ? "Belum Bayar" : (count($paymentSplits) > 1 ? "Lunas (Multi)" : "Lunas ({$paymentSplits[0]['method']})"));

            $buktiStatus = count($transferSplits) > 0 ? ($adaBuktiTf ? ' ✅ (' . count(array_filter($buktiTfListFinal)) . ' bukti TF)' : ' ⏳ (belum ada bukti TF)') : '';

            $pesanAdmin =
                "🔔 *Order masuk bossku!* 👀\n\n" .
                "📌 *Customer:*\n{$d['namaKontak']} – {$d['nomorTelepon']}\n\n" .
                "📍 *Alamat:* {$d['alamat']}\n" .
                (($d['patokanLokasi'] ?? '') ? "🏠 *Patokan:* {$d['patokanLokasi']}\n" : '') .
                "\n📦 *Pesanan:*\n{$d['namaProduk']} x {$d['jumlahProduk']} unit\n\n" .
                "💰 *Total: Rp " . $this->formatRupiah($total) . "*" . ($ongkir ? " (Ongkir: Rp " . $this->formatRupiah($ongkir) . ")" : '') . "\n" .
                "💳 Pembayaran: {$labelStatusAdmin}{$buktiStatus}" . (($d['keteranganPembayaran'] ?? '') ? " – {$d['keteranganPembayaran']}" : '') . "\n" .
                $blokRincian . "\n👨‍💼 *Sales:* {$d['salesPerson']}\n\n🕒 {$timestamp}";

            if ($nomorPelanggan) {
                $sent = FonnteHelper::kirimWA($nomorPelanggan, $pesanPelanggan);
                if ($sent) $whatsappSent = true;
            }

            $adminWA = SettingsController::getSetting('grupInvoiceId') ?? '120363405869453556@g.us';
            if ($adminWA) {
                FonnteHelper::kirimWA($adminWA, $pesanAdmin, [
                    'button' => '✅ Siap meluncur bossku!,📞 Hubungi customer,⏳ Follow up nanti',
                    'footer' => "Order #{$orderId} – {$d['salesPerson']}",
                ]);
                $whatsappSent = true;
            }

            Order::where('order_id', $orderId)->update(['whatsapp_sent' => $whatsappSent ? 'true' : 'false']);

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
                            if ($found) { $productId = $found['id']; $unitId = $found['unitId']; }
                            else { continue; }
                        }
                        if (!$productId) continue;

                        $kledoItems[] = [
                            'kledoProductId'        => $productId,
                            'kledoFinanceAccountId' => $item['kledoFinanceAccountId'] ?? null,
                            'kledoUnitId'           => $unitId,
                            'jumlahProduk'          => (int)($item['jumlahProduk'] ?? 1),
                            'hargaProduk'           => (int)($item['hargaProduk'] ?? 0),
                        ];
                    }

                    if (count($kledoItems) > 0) {
                        $contactId  = KledoController::findOrCreateContact($d['namaKontak'], $d['nomorTelepon'], $d['alamat']);
                        if ($contactId) {
                            $salesPhone = self::SALES_PHONE[strtoupper($d['salesPerson'] ?? '')] ?? '';
                            $baseMemo   = $salesPhone ? "{$d['salesPerson']} - {$salesPhone}" : "{$d['salesPerson']}";
                            $statusMemo = $allUnpaid ? ' | BELUM BAYAR'
                                : ($sisaPembayaran > 0
                                    ? ' | DP Rp ' . $this->formatRupiah($dpAmount) . ' / Sisa Rp ' . $this->formatRupiah($sisaPembayaran)
                                    : ' | LUNAS');

                            // Retry createInvoice sampai 3x dengan jeda 5 detik
                            $inv      = null;
                            $attempts = 0;
                            while ($attempts < 3) {
                                $attempts++;
                                $inv = KledoController::createInvoice([
                                    'contactId' => $contactId, 'orderId' => $orderId,
                                    'items' => $kledoItems, 'biayaPengiriman' => $ongkir,
                                    'memo' => $baseMemo . $statusMemo, 'patokanLokasi' => $d['patokanLokasi'] ?? '',
                                ]);
                                if ($inv['success'] ?? false) break;
                                \Log::warning("Kledo createInvoice attempt {$attempts} gagal untuk order {$orderId}", ['response' => $inv]);
                                if ($attempts < 3) sleep(5);
                            }

                            if (($inv['success'] ?? false) && isset($inv['invoiceId'])) {
                                $invoiceId = (int) $inv['invoiceId'];
                                Order::where('order_id', $orderId)->update(['kledo_invoice_id' => $invoiceId]);
                                $firstBukti = null;
                                foreach ($buktiTfListFinal as $b) { if ($b && strlen($b) > 0) { $firstBukti = $b; break; } }
                                if ($firstBukti) {
                                    try { KledoController::uploadAttachment($invoiceId, $firstBukti, "bukti-tf-order-{$orderId}.jpg"); }
                                    catch (\Exception $e) { \Log::error("Upload bukti TF ke Kledo gagal: " . $e->getMessage()); }
                                }

                                $transferIdx = 0;
                                foreach ($paymentSplits as $split) {
                                    if ($split['method'] === 'BelumBayar' || $split['amount'] <= 0) continue;
                                    $memo = "Order #{$orderId} - {$d['salesPerson']}";
                                    if ($split['method'] === 'CASH') {
                                        $elektrAmount = $lainAmount = 0;
                                        $sourceForCash = count($rawItems) > 0 ? $rawItems : [['namaProduk' => $d['namaProduk'], 'jumlahProduk' => $d['jumlahProduk'], 'hargaProduk' => $d['hargaProduk'], 'kategoriId' => null]];
                                        foreach ($sourceForCash as $it) {
                                            $lineTotal = ((int)($it['hargaProduk'] ?? 0)) * ((int)($it['jumlahProduk'] ?? 1));
                                            $klas      = $this->klasifikasiItem(isset($it['kategoriId']) && is_int($it['kategoriId']) ? $it['kategoriId'] : null, $it['namaProduk'] ?? '');
                                            // 'unknown' default ke Elektronik — bukan Bahan Bangunan
                                            if ($klas === 'BahanBangunan') $lainAmount   += $lineTotal;
                                            else                           $elektrAmount += $lineTotal;
                                        }
                                        if ($elektrAmount > 0 && $lainAmount === 0) {
                                            // Semua produk Elektronik — full cash ke Kas Elektronik
                                            KledoController::payInvoice($invoiceId, self::KLEDO_KAS_ELEKTRONIK, $split['amount'], "{$memo} (CASH-Elektronik)");
                                        } elseif ($lainAmount > 0 && $elektrAmount === 0) {
                                            // Semua produk Bahan Bangunan — full cash ke Kas Sulawesi
                                            KledoController::payInvoice($invoiceId, self::KLEDO_KAS_SULAWESI, $split['amount'], "{$memo} (CASH-Bahan)");
                                        } else {
                                            // Campuran — proporsi berdasarkan nilai item
                                            $totalKat       = $elektrAmount + $lainAmount;
                                            $ratio          = $totalKat > 0 ? $split['amount'] / $totalKat : 0;
                                            $scaledElektrik = (int) round($elektrAmount * $ratio);
                                            $scaledLain     = $split['amount'] - $scaledElektrik;
                                            if ($scaledElektrik > 0) KledoController::payInvoice($invoiceId, self::KLEDO_KAS_ELEKTRONIK, $scaledElektrik, "{$memo} (CASH-Elektronik)");
                                            if ($scaledLain > 0)     KledoController::payInvoice($invoiceId, self::KLEDO_KAS_SULAWESI, $scaledLain, "{$memo} (CASH-Bahan)");
                                        }
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
                } catch (\Exception $e) { \Log::error("Kledo invoice error for order {$orderId}: " . $e->getMessage()); }
            }

            $grupBuktiTF = SettingsController::getSetting('grupBuktiTfId') ?? '120363425112329389@g.us';
            if ($grupBuktiTF) {
                $txIdx = 0;
                foreach ($paymentSplits as $split) {
                    if ($split['method'] !== 'Transfer') continue;
                    $currentIdx = $txIdx++;
                    if (!isset($buktiTfListFinal[$currentIdx]) || strlen($buktiTfListFinal[$currentIdx]) === 0) continue;
                    try {
                        $rawBukti = $buktiTfListFinal[$currentIdx];
                        preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $rawBukti, $mMatch);
                        $mime     = $mMatch ? $mMatch[1] : 'image/jpeg';
                        $b64      = $mMatch ? $mMatch[2] : $rawBukti;
                        $buffer   = base64_decode($b64);
                        $ext      = explode('/', $mime)[1] ?? 'jpg';
                        $bankInfo = self::BANK_INFO[$split['bankAccountId'] ?? 0] ?? null;
                        $pesan    = "💸 *Bukti Transfer Masuk*\n\nOrder: #{$orderId}\nCustomer: {$d['namaKontak']} – {$d['nomorTelepon']}\nTotal Order: Rp " . $this->formatRupiah($total) . "\nNominal Transfer: Rp " . $this->formatRupiah($split['amount']) . "\nBank: " . ($bankInfo['name'] ?? '-') . "\nSales: {$d['salesPerson']}";
                        FonnteHelper::kirimWA($grupBuktiTF, $pesan, [
                            'file' => ['buffer' => $buffer, 'filename' => "bukti-tf-{$orderId}-{$currentIdx}.{$ext}", 'mime' => $mime],
                        ]);
                    } catch (\Exception $e) { \Log::error("Gagal forward bukti TF idx={$currentIdx}: " . $e->getMessage()); }
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

        $order = Order::find($id);
        if (!$order) return response()->json(['ok' => false, 'error' => 'Order tidak ditemukan'], 404);

        preg_match('/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/', $photoBase64, $m);
        $mime     = $m ? $m[1] : 'image/jpeg';
        $b64      = $m ? $m[2] : $photoBase64;
        $buffer   = base64_decode($b64);
        $ext      = explode('/', $mime)[1] ?? 'jpg';
        $filename = "bukti-{$order->order_id}.{$ext}";
        $groupId  = env('FONNTE_GROUP_ID', '120363356936985289@g.us');

        $message = "📸 *Bukti Pengiriman*\n\nOrder: #{$order->order_id}\nCustomer: {$order->nama_kontak} – {$order->nomor_telepon}\nAlamat: {$order->alamat}" .
            ($order->patokan_lokasi ? " – {$order->patokan_lokasi}" : '') . "\nProduk: {$order->nama_produk} × {$order->jumlah_produk}\nDriver: " .
            ($driverName ?: $order->driver_name ?: 'Driver') . ($caption ? "\n\nCatatan: {$caption}" : '');

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

        Order::where('id', $id)->update($update);
        return response()->json(['ok' => true]);
    }

    public function getLocation(string $token): JsonResponse
    {
        if (!$token) return response()->json(['error' => 'Token tidak valid'], 400);

        $order = Order::where('customer_loc_token', $token)
            ->select(['order_id', 'nama_kontak', 'alamat', 'customer_lat'])
            ->first();

        if (!$order) return response()->json(['error' => 'Link lokasi tidak ditemukan / sudah kedaluwarsa'], 404);

        return response()->json([
            'orderId'       => $order->order_id,
            'namaKontak'    => $order->nama_kontak,
            'alamat'        => $order->alamat,
            'alreadyShared' => (bool) $order->customer_lat,
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

        $updated = Order::where('customer_loc_token', $token)->update([
            'customer_lat'           => (string) $lat,
            'customer_lng'           => (string) $lng,
            'customer_loc_shared_at' => now(),
        ]);

        if ($updated === 0) return response()->json(['error' => 'Link lokasi tidak ditemukan'], 404);

        $order = Order::where('customer_loc_token', $token)->select('order_id', 'nama_kontak')->first();
        \Log::info("Customer shared GPS", ['orderId' => $order->order_id, 'lat' => $lat, 'lng' => $lng]);
        return response()->json(['ok' => true, 'orderId' => $order->order_id]);
    }

    // ── Kirim Ulang Invoice ke Kledo ───────────────────────────────────────────
    public function resendKledo(string $orderId): JsonResponse
    {
        if (!env('KLEDO_TOKEN')) {
            return response()->json(['ok' => false, 'error' => 'KLEDO_TOKEN belum dikonfigurasi'], 400);
        }

        $order = Order::where('order_id', $orderId)
            ->select(['id', 'order_id', 'kledo_invoice_id', 'raw_items', 'payment_splits',
                      'bukti_transfer_list', 'nama_kontak', 'nomor_telepon', 'alamat',
                      'patokan_lokasi', 'sales_person', 'total_harga', 'biaya_pengiriman',
                      'dp_amount', 'sisa_pembayaran', 'nama_produk', 'jumlah_produk', 'harga_produk'])
            ->first();

        if (!$order) return response()->json(['ok' => false, 'error' => 'Order tidak ditemukan'], 404);
        if ($order->kledo_invoice_id) {
            return response()->json(['ok' => false, 'error' => 'Invoice Kledo sudah ada (#' . $order->kledo_invoice_id . ')'], 400);
        }

        $rawItems      = $order->raw_items ?? [];
        $paymentSplits = $order->payment_splits ?? [];
        $buktiTfList   = $order->bukti_transfer_list ?? [];
        $ongkir        = (int) $order->biaya_pengiriman;
        $dpAmount      = (int) $order->dp_amount;
        $sisaPembayaran = (int) $order->sisa_pembayaran;
        $allUnpaid     = count(array_filter($paymentSplits, fn($s) => $s['method'] !== 'BelumBayar' && ($s['amount'] ?? 0) > 0)) === 0;

        if (count($rawItems) === 0) {
            return response()->json(['ok' => false, 'error' => 'Data item produk tidak tersedia (order lama)'], 400);
        }

        try {
            $kledoItems = [];
            foreach ($rawItems as $item) {
                $productId = isset($item['kledoProductId']) && is_int($item['kledoProductId']) && $item['kledoProductId'] > 0
                    ? $item['kledoProductId'] : null;
                $unitId = isset($item['kledoUnitId']) && is_int($item['kledoUnitId']) && $item['kledoUnitId'] > 0
                    ? $item['kledoUnitId'] : 73;

                if (!$productId && !empty($item['namaProduk'])) {
                    $found = KledoController::searchProductByName(trim($item['namaProduk']));
                    if ($found) { $productId = $found['id']; $unitId = $found['unitId']; }
                    else { continue; }
                }
                if (!$productId) continue;

                $kledoItems[] = [
                    'kledoProductId'        => $productId,
                    'kledoFinanceAccountId' => $item['kledoFinanceAccountId'] ?? null,
                    'kledoUnitId'           => $unitId,
                    'jumlahProduk'          => (int)($item['jumlahProduk'] ?? 1),
                    'hargaProduk'           => (int)($item['hargaProduk'] ?? 0),
                ];
            }

            if (count($kledoItems) === 0) {
                return response()->json(['ok' => false, 'error' => 'Tidak ada produk valid untuk dikirim ke Kledo'], 400);
            }

            $contactId = KledoController::findOrCreateContact($order->nama_kontak, $order->nomor_telepon, $order->alamat);
            if (!$contactId) {
                return response()->json(['ok' => false, 'error' => 'Gagal membuat/menemukan kontak di Kledo'], 502);
            }

            $salesPhone = self::SALES_PHONE[strtoupper($order->sales_person ?? '')] ?? '';
            $baseMemo   = $salesPhone ? "{$order->sales_person} - {$salesPhone}" : "{$order->sales_person}";
            $statusMemo = $allUnpaid ? ' | BELUM BAYAR'
                : ($sisaPembayaran > 0
                    ? ' | DP Rp ' . $this->formatRupiah($dpAmount) . ' / Sisa Rp ' . $this->formatRupiah($sisaPembayaran)
                    : ' | LUNAS');

            $inv = KledoController::createInvoice([
                'contactId'       => $contactId,
                'orderId'         => $orderId,
                'items'           => $kledoItems,
                'biayaPengiriman' => $ongkir,
                'memo'            => $baseMemo . $statusMemo,
                'patokanLokasi'   => $order->patokan_lokasi ?? '',
            ]);

            if (!($inv['success'] ?? false) || !isset($inv['invoiceId'])) {
                \Log::error("resendKledo gagal untuk order {$orderId}", ['response' => $inv]);
                return response()->json(['ok' => false, 'error' => 'Kledo gagal membuat invoice: ' . ($inv['message'] ?? 'Error tidak diketahui')], 502);
            }

            $invoiceId = (int) $inv['invoiceId'];
            Order::where('order_id', $orderId)->update(['kledo_invoice_id' => $invoiceId]);

            // Bayar invoice sesuai splits
            foreach ($paymentSplits as $idx => $split) {
                if ($split['method'] === 'BelumBayar' || ($split['amount'] ?? 0) <= 0) continue;
                $memo = "Order #{$orderId} - {$order->sales_person} [resend]";
                if ($split['method'] === 'CASH') {
                    KledoController::payInvoice($invoiceId, self::KLEDO_KAS_ELEKTRONIK, $split['amount'], "{$memo} (CASH)");
                } elseif (in_array($split['method'], ['Transfer', 'Debit']) && ($split['bankAccountId'] ?? null)) {
                    KledoController::payInvoice($invoiceId, $split['bankAccountId'], $split['amount'], "{$memo} ({$split['method']})");
                }
            }

            \Log::info("resendKledo berhasil", ['orderId' => $orderId, 'invoiceId' => $invoiceId]);
            return response()->json(['ok' => true, 'invoiceId' => $invoiceId]);

        } catch (\Exception $e) {
            \Log::error("resendKledo exception untuk order {$orderId}: " . $e->getMessage());
            return response()->json(['ok' => false, 'error' => 'Error: ' . $e->getMessage()], 500);
        }
    }
}
