<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\Order;
use App\Models\SaleItem;
use Carbon\Carbon;

class RiwayatPenjualanController extends Controller
{
    private function formatRupiah(int $num): string
    {
        return number_format($num, 0, ',', '.');
    }

    /**
     * Parse items dari teks nama_produk (format multi-item dari OrderController)
     * Format: "1. Nama Produk (qty x @ Rp harga)\n2. ..."
     */
    private function parseItemsFromText(string $text, int $totalHarga, int $totalQty): array
    {
        $lines = array_filter(explode("\n", trim($text)));
        $items = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // Match format: "1. Nama Produk (Qx @ Rp Harga)" atau "N. Nama (qty x @ Rp harga)"
            if (preg_match('/^\d+\.\s+(.+?)\s+\((\d+)x\s+@\s+Rp\s+([\d.]+)\)$/u', $line, $m)) {
                $nama   = trim($m[1]);
                $qty    = (int) $m[2];
                $harga  = (int) str_replace('.', '', $m[3]);
                $items[] = [
                    'nama_produk'  => $nama,
                    'qty'          => $qty,
                    'harga_satuan' => $harga,
                    'diskon'       => 0,
                    'subtotal'     => $qty * $harga,
                ];
            } else {
                // Single item atau format tidak dikenali
                $nama = preg_replace('/^\d+\.\s+/', '', $line);
                $items[] = [
                    'nama_produk'  => $nama,
                    'qty'          => $totalQty,
                    'harga_satuan' => $totalQty > 0 ? (int) round($totalHarga / $totalQty) : $totalHarga,
                    'diskon'       => 0,
                    'subtotal'     => $totalHarga,
                ];
            }
        }

        if (empty($items)) {
            $items[] = [
                'nama_produk'  => $text,
                'qty'          => $totalQty,
                'harga_satuan' => $totalQty > 0 ? (int) round($totalHarga / $totalQty) : $totalHarga,
                'diskon'       => 0,
                'subtotal'     => $totalHarga,
            ];
        }

        return $items;
    }

    /**
     * GET /api/riwayat-penjualan
     * Server-side pagination dengan filter & sort
     */
    public function index(Request $request): JsonResponse
    {
        $search   = $request->query('search', '');
        $dari     = $request->query('dari', '');
        $sampai   = $request->query('sampai', '');
        $metode   = $request->query('metode', '');
        $status   = $request->query('status', '');
        $sort     = $request->query('sort', 'created_at');
        $dir      = $request->query('dir', 'desc') === 'asc' ? 'asc' : 'desc';
        $perPage  = min((int) $request->query('per_page', 15), 100);

        $allowedSorts = ['order_id', 'created_at', 'total_harga', 'nama_kontak', 'metode_pembayaran', 'status_pengiriman'];
        if (!in_array($sort, $allowedSorts)) $sort = 'created_at';

        $query = Order::select([
            'id', 'order_id', 'nama_kontak', 'nomor_telepon', 'alamat',
            'nama_produk', 'jumlah_produk', 'harga_produk', 'biaya_pengiriman',
            'total_harga', 'sales_person', 'metode_pembayaran', 'status_pengiriman',
            'kategori_produk', 'dp_amount', 'sisa_pembayaran', 'created_at',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'ilike', "%{$search}%")
                  ->orWhere('nama_kontak', 'ilike', "%{$search}%")
                  ->orWhere('nama_produk', 'ilike', "%{$search}%");
            });
        }
        if ($dari)   $query->whereDate('created_at', '>=', $dari);
        if ($sampai) $query->whereDate('created_at', '<=', $sampai);
        if ($metode) $query->where('metode_pembayaran', $metode);
        if ($status) $query->where('status_pengiriman', $status);

        $paginator = $query->orderBy($sort, $dir)->paginate($perPage);

        $items = collect($paginator->items())->map(fn($o) => [
            'id'               => $o->id,
            'invoice'          => $o->order_id,
            'tanggal'          => $o->created_at?->format('Y-m-d H:i'),
            'tanggalFormatted' => $o->created_at?->translatedFormat('d M Y, H:i'),
            'customer'         => $o->nama_kontak ?? '-',
            'telepon'          => $o->nomor_telepon ?? '-',
            'alamat'           => $o->alamat ?? '-',
            'total'            => $o->total_harga,
            'hargaProduk'      => $o->harga_produk,
            'ongkir'           => $o->biaya_pengiriman,
            'jumlahItem'       => $o->jumlah_produk,
            'metodePembayaran' => $o->metode_pembayaran,
            'kasir'            => $o->sales_person,
            'status'           => $o->status_pengiriman,
            'kategori'         => $o->kategori_produk,
            'dpAmount'         => $o->dp_amount ?? 0,
            'sisaPembayaran'   => $o->sisa_pembayaran ?? 0,
        ]);

        return response()->json([
            'data'         => $items,
            'total'        => $paginator->total(),
            'per_page'     => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page'    => $paginator->lastPage(),
            'from'         => $paginator->firstItem(),
            'to'           => $paginator->lastItem(),
        ]);
    }

    /**
     * GET /api/riwayat-penjualan/{id}
     * Detail transaksi: customer info + items
     */
    public function show(int $id): JsonResponse
    {
        $order = Order::select([
            'id', 'order_id', 'nama_kontak', 'nomor_telepon', 'alamat', 'patokan_lokasi',
            'nama_produk', 'jumlah_produk', 'harga_produk', 'biaya_pengiriman',
            'total_harga', 'sales_person', 'metode_pembayaran', 'status_pengiriman',
            'kategori_produk', 'dp_amount', 'sisa_pembayaran', 'created_at',
            'payment_splits', 'driver_name', 'metode_pengiriman',
        ])->find($id);

        if (!$order) {
            return response()->json(['error' => 'Transaksi tidak ditemukan'], 404);
        }

        // Cek sale_items dulu, jika tidak ada, parse dari text
        $saleItems = SaleItem::where('order_id', $order->order_id)->get();

        if ($saleItems->isNotEmpty()) {
            $items = $saleItems->map(fn($i) => [
                'nama_produk'  => $i->nama_produk,
                'qty'          => $i->qty,
                'harga_satuan' => $i->harga_satuan,
                'diskon'       => $i->diskon,
                'subtotal'     => $i->subtotal,
                'kategori'     => $i->kategori,
            ])->all();
        } else {
            $items = $this->parseItemsFromText(
                $order->nama_produk ?? '',
                $order->harga_produk ?? 0,
                $order->jumlah_produk ?? 1
            );
        }

        return response()->json([
            'id'               => $order->id,
            'invoice'          => $order->order_id,
            'tanggal'          => $order->created_at?->format('Y-m-d H:i'),
            'tanggalFormatted' => $order->created_at?->translatedFormat('d M Y, H:i'),
            'customer'         => $order->nama_kontak ?? '-',
            'telepon'          => $order->nomor_telepon ?? '-',
            'alamat'           => $order->alamat ?? '-',
            'patokan'          => $order->patokan_lokasi ?? '-',
            'total'            => $order->total_harga,
            'hargaProduk'      => $order->harga_produk,
            'ongkir'           => $order->biaya_pengiriman,
            'metodePembayaran' => $order->metode_pembayaran,
            'kasir'            => $order->sales_person,
            'driver'           => $order->driver_name ?? '-',
            'metodePengiriman' => $order->metode_pengiriman,
            'status'           => $order->status_pengiriman,
            'kategori'         => $order->kategori_produk,
            'dpAmount'         => $order->dp_amount ?? 0,
            'sisaPembayaran'   => $order->sisa_pembayaran ?? 0,
            'paymentSplits'    => $order->payment_splits ?? [],
            'items'            => $items,
        ]);
    }

    /**
     * GET /api/riwayat-penjualan/summary
     * Summary card: hari ini
     */
    public function summary(): JsonResponse
    {
        $today = Carbon::today();

        $todayOrders = Order::whereDate('created_at', $today)->get([
            'total_harga', 'jumlah_produk', 'metode_pembayaran', 'status_pengiriman',
        ]);

        $totalTransaksi  = $todayOrders->count();
        $omzetHariIni    = $todayOrders->sum('total_harga');
        $totalItemTerjual = $todayOrders->sum('jumlah_produk');

        $metodeCounts = $todayOrders->groupBy('metode_pembayaran')
            ->map(fn($g) => $g->count())
            ->sortDesc();

        $metodeTerbanyak = $metodeCounts->isNotEmpty()
            ? $metodeCounts->keys()->first() . ' (' . $metodeCounts->first() . 'x)'
            : '-';

        // Total semua waktu untuk perbandingan
        $totalAllTime = Order::count();
        $omzetAllTime = Order::sum('total_harga');

        return response()->json([
            'totalTransaksiHariIni' => $totalTransaksi,
            'omzetHariIni'          => $omzetHariIni,
            'totalItemTerjual'      => $totalItemTerjual,
            'metodeTerbanyak'       => $metodeTerbanyak,
            'totalAllTime'          => $totalAllTime,
            'omzetAllTime'          => $omzetAllTime,
        ]);
    }

    /**
     * GET /api/riwayat-penjualan/export
     * Export CSV sederhana (tanpa library eksternal)
     */
    public function export(Request $request)
    {
        $search  = $request->query('search', '');
        $dari    = $request->query('dari', '');
        $sampai  = $request->query('sampai', '');
        $metode  = $request->query('metode', '');
        $status  = $request->query('status', '');

        $query = Order::select([
            'order_id', 'nama_kontak', 'nomor_telepon', 'nama_produk',
            'jumlah_produk', 'harga_produk', 'biaya_pengiriman', 'total_harga',
            'sales_person', 'metode_pembayaran', 'status_pengiriman', 'created_at',
        ]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_id', 'ilike', "%{$search}%")
                  ->orWhere('nama_kontak', 'ilike', "%{$search}%");
            });
        }
        if ($dari)   $query->whereDate('created_at', '>=', $dari);
        if ($sampai) $query->whereDate('created_at', '<=', $sampai);
        if ($metode) $query->where('metode_pembayaran', $metode);
        if ($status) $query->where('status_pengiriman', $status);

        $rows = $query->orderByDesc('created_at')->limit(5000)->get();

        $csvRows = [];
        $csvRows[] = ['Invoice', 'Tanggal', 'Customer', 'Telepon', 'Produk', 'Qty', 'Harga Produk', 'Ongkir', 'Total', 'Metode Bayar', 'Kasir', 'Status'];

        foreach ($rows as $r) {
            $csvRows[] = [
                $r->order_id,
                $r->created_at?->format('d/m/Y H:i'),
                $r->nama_kontak ?? '-',
                $r->nomor_telepon ?? '-',
                str_replace(["\n", "\r"], ' | ', $r->nama_produk ?? '-'),
                $r->jumlah_produk,
                $r->harga_produk,
                $r->biaya_pengiriman,
                $r->total_harga,
                $r->metode_pembayaran,
                $r->sales_person,
                $r->status_pengiriman,
            ];
        }

        $output = '';
        foreach ($csvRows as $row) {
            $escaped = array_map(function ($val) {
                $val = str_replace('"', '""', (string) $val);
                return '"' . $val . '"';
            }, $row);
            $output .= implode(',', $escaped) . "\r\n";
        }

        $filename = 'riwayat-penjualan-' . now()->format('Ymd-His') . '.csv';

        return response($output, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control'       => 'no-cache, no-store, must-revalidate',
        ]);
    }
}
