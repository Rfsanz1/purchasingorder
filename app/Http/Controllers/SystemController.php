<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SystemController extends Controller
{
    public function healthCheck(): JsonResponse
    {
        $issues = [];
        $ok     = true;

        if (!env('DATABASE_URL') && !env('DB_HOST')) {
            $issues[] = 'DATABASE_URL tidak di-set';
            $ok = false;
        }

        try {
            DB::select('SELECT 1');
        } catch (\Exception $e) {
            $issues[] = 'Database tidak bisa dihubungi: ' . $e->getMessage();
            $ok = false;
        }

        $kledoToken = env('KLEDO_TOKEN');
        if (!$kledoToken) {
            $issues[] = 'KLEDO_TOKEN tidak di-set (integrasi Kledo nonaktif)';
        }

        $fonnteOk = false;
        $fonnteToken = env('FONNTE_TOKEN') ?: env('FONNTE_TOKEN_GROUP') ?: env('FONNTE_TOKEN_CUSTOMER');
        if (!$fonnteToken) {
            $issues[] = 'FONNTE_TOKEN tidak di-set (notifikasi WA nonaktif)';
        } else {
            $fonnteOk = true;
        }

        return response()->json([
            'ok'       => $ok,
            'issues'   => $issues,
            'kledo'    => (bool) $kledoToken,
            'fonnte'   => $fonnteOk,
            'database' => $ok,
        ]);
    }
}
