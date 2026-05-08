<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\AppSetting;

/**
 * IntegrasiController — Kelola token & koneksi integrasi pihak ketiga.
 * Token disimpan di app_settings (DB) dengan fallback ke env var.
 */
class IntegrasiController extends Controller
{
    // ── Definisi semua integrasi ─────────────────────────────────────────────

    private function daftarIntegrasi(): array
    {
        return [
            [
                'id'       => 'kledo',
                'nama'     => 'Kledo ERP',
                'deskripsi'=> 'Sinkronisasi produk, invoice, dan data penjualan dari Kledo.',
                'icon'     => 'kledo',
                'warna'    => 'blue',
                'env_key'  => 'KLEDO_TOKEN',
                'db_key'   => 'kledo_token',
                'docs_url' => 'https://app.kledo.com/pengaturan/api',
                'docs_label'=> 'Kledo → Pengaturan → API',
            ],
            [
                'id'       => 'fonnte',
                'nama'     => 'Fonnte WhatsApp',
                'deskripsi'=> 'Kirim notifikasi WhatsApp ke customer dan grup internal.',
                'icon'     => 'whatsapp',
                'warna'    => 'green',
                'env_key'  => 'FONNTE_TOKEN',
                'db_key'   => 'fonnte_token',
                'docs_url' => 'https://fonnte.com/dashboard',
                'docs_label'=> 'Fonnte → Dashboard → Token',
            ],
            [
                'id'       => 'fonnte_group',
                'nama'     => 'Fonnte Grup Internal',
                'deskripsi'=> 'Token Fonnte khusus untuk kirim notifikasi ke grup WhatsApp internal.',
                'icon'     => 'whatsapp',
                'warna'    => 'green',
                'env_key'  => 'FONNTE_TOKEN_GROUP',
                'db_key'   => 'fonnte_token_group',
                'docs_url' => 'https://fonnte.com/dashboard',
                'docs_label'=> 'Fonnte → Dashboard → Token Grup',
            ],
            [
                'id'       => 'fonnte_customer',
                'nama'     => 'Fonnte Customer',
                'deskripsi'=> 'Token Fonnte khusus untuk kirim notifikasi ke nomor HP customer.',
                'icon'     => 'whatsapp',
                'warna'    => 'green',
                'env_key'  => 'FONNTE_TOKEN_CUSTOMER',
                'db_key'   => 'fonnte_token_customer',
                'docs_url' => 'https://fonnte.com/dashboard',
                'docs_label'=> 'Fonnte → Dashboard → Token Customer',
            ],
        ];
    }

    // ── Ambil token aktif: DB dulu, lalu env ─────────────────────────────────

    public static function getToken(string $dbKey, string $envKey): ?string
    {
        try {
            $fromDb = AppSetting::get($dbKey);
            if ($fromDb) return $fromDb;
        } catch (\Exception $e) {}
        return env($envKey);
    }

    // ── GET /api/integrasi — semua status ────────────────────────────────────

    public function index(): JsonResponse
    {
        $result = [];

        foreach ($this->daftarIntegrasi() as $integ) {
            $token  = self::getToken($integ['db_key'], $integ['env_key']);
            $fromDb = false;
            try { $fromDb = (bool) AppSetting::get($integ['db_key']); } catch (\Exception $e) {}

            $result[] = array_merge($integ, [
                'has_token'    => (bool) $token,
                'token_prefix' => $token ? substr($token, 0, 18) . '...' : null,
                'sumber'       => $fromDb ? 'database' : ($token ? 'environment' : 'tidak ada'),
            ]);
        }

        return response()->json(['integrasi' => $result]);
    }

    // ── POST /api/integrasi/{id}/update — simpan token ke DB ─────────────────

    public function update(Request $request, string $id): JsonResponse
    {
        $integ = collect($this->daftarIntegrasi())->firstWhere('id', $id);
        if (!$integ) {
            return response()->json(['error' => 'Integrasi tidak ditemukan'], 404);
        }

        $token = trim($request->input('token', ''));
        if (!$token) {
            return response()->json(['error' => 'Token tidak boleh kosong'], 422);
        }

        AppSetting::set($integ['db_key'], $token);

        return response()->json([
            'success'      => true,
            'message'      => 'Token ' . $integ['nama'] . ' berhasil disimpan.',
            'token_prefix' => substr($token, 0, 18) . '...',
            'sumber'       => 'database',
        ]);
    }

    // ── DELETE /api/integrasi/{id}/reset — hapus token dari DB ───────────────

    public function reset(string $id): JsonResponse
    {
        $integ = collect($this->daftarIntegrasi())->firstWhere('id', $id);
        if (!$integ) {
            return response()->json(['error' => 'Integrasi tidak ditemukan'], 404);
        }

        AppSetting::remove($integ['db_key']);

        $envToken = env($integ['env_key']);
        return response()->json([
            'success' => true,
            'message' => 'Token dari database dihapus. ' . ($envToken ? 'Menggunakan token dari environment.' : 'Tidak ada token aktif.'),
            'sumber'  => $envToken ? 'environment' : 'tidak ada',
        ]);
    }

    // ── POST /api/integrasi/{id}/test — test koneksi ──────────────────────────

    public function test(string $id): JsonResponse
    {
        $integ = collect($this->daftarIntegrasi())->firstWhere('id', $id);
        if (!$integ) {
            return response()->json(['error' => 'Integrasi tidak ditemukan'], 404);
        }

        $token = self::getToken($integ['db_key'], $integ['env_key']);
        if (!$token) {
            return response()->json([
                'valid'   => false,
                'status'  => 'Tidak ada token',
                'message' => 'Token belum dikonfigurasi. Masukkan token terlebih dahulu.',
            ]);
        }

        return match ($id) {
            'kledo'           => $this->testKledo($token),
            'fonnte'          => $this->testFonnte($token),
            'fonnte_group'    => $this->testFonnte($token),
            'fonnte_customer' => $this->testFonnte($token),
            default           => response()->json(['valid' => false, 'status' => 'Test tidak tersedia']),
        };
    }

    private function testKledo(string $token): JsonResponse
    {
        $ch = curl_init('https://api.kledo.com/api/v1/finance/invoices?per_page=1');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $token, 'Accept: application/json'],
        ]);
        $body = curl_exec($ch);
        $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        if ($err) return response()->json(['valid' => false, 'status' => 'Koneksi gagal', 'message' => $err]);

        if ($http === 200) {
            $data  = json_decode($body, true);
            $total = $data['data']['total'] ?? '?';
            return response()->json([
                'valid'   => true,
                'status'  => 'Terhubung',
                'message' => "Kledo OK — {$total} invoice ditemukan di akun.",
                'detail'  => ['total_invoice' => $total, 'http' => $http],
            ]);
        }

        return response()->json([
            'valid'   => false,
            'status'  => 'Token ditolak (HTTP ' . $http . ')',
            'message' => 'Token tidak valid atau expired. Generate token baru di ' . 'app.kledo.com → Pengaturan → API.',
        ]);
    }

    private function testFonnte(string $token): JsonResponse
    {
        $ch = curl_init('https://api.fonnte.com/validate');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => [],
            CURLOPT_HTTPHEADER     => ['Authorization: ' . $token],
        ]);
        $body = curl_exec($ch);
        $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err  = curl_error($ch);
        curl_close($ch);

        if ($err) return response()->json(['valid' => false, 'status' => 'Koneksi gagal', 'message' => $err]);

        $data = json_decode($body, true);
        if (!empty($data['status']) || $http === 200) {
            $device = $data['device'] ?? $data['name'] ?? 'perangkat';
            return response()->json([
                'valid'   => true,
                'status'  => 'Terhubung',
                'message' => 'Fonnte OK — perangkat: ' . $device,
                'detail'  => $data,
            ]);
        }

        return response()->json([
            'valid'   => false,
            'status'  => 'Token ditolak (HTTP ' . $http . ')',
            'message' => 'Token tidak valid. Cek di fonnte.com → Dashboard.',
        ]);
    }
}
