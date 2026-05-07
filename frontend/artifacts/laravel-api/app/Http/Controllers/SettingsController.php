<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SettingsController extends Controller
{
    private array $secretKeys   = ['fonnteTokenGroup', 'fonnteTokenCustomer'];
    private array $allowedKeys  = ['fonnteTokenGroup', 'fonnteTokenCustomer', 'grupInvoiceId', 'grupBuktiTfId'];

    private function envFallback(string $key): ?string
    {
        return match ($key) {
            'fonnteTokenGroup'    => env('FONNTE_TOKEN_GROUP') ?: env('FONNTE_TOKEN'),
            'fonnteTokenCustomer' => env('FONNTE_TOKEN_CUSTOMER') ?: env('FONNTE_TOKEN'),
            'grupInvoiceId'       => env('FONNTE_GROUP_INVOICE', '120363405869453556@g.us'),
            'grupBuktiTfId'       => env('FONNTE_GROUP_BUKTI_TF', '120363425112329389@g.us'),
            default               => null,
        };
    }

    public static function getSetting(string $key): ?string
    {
        try {
            $row = DB::table('app_settings')->where('key', $key)->first();
            if ($row && $row->value) {
                return $row->value;
            }
        } catch (\Exception $e) {
            \Log::warning("getSetting DB read failed for key={$key}: " . $e->getMessage());
        }
        $instance = new static();
        return $instance->envFallback($key);
    }

    public function index(): JsonResponse
    {
        try {
            $rows = DB::table('app_settings')->get()->keyBy('key');
            $map  = [];
            foreach ($rows as $k => $r) {
                $map[$k] = $r->value;
            }

            return response()->json([
                'fonnteTokenGroup' => [
                    'isSet'  => !!(($map['fonnteTokenGroup'] ?? null) ?: $this->envFallback('fonnteTokenGroup')),
                    'source' => isset($map['fonnteTokenGroup']) ? 'db' : ($this->envFallback('fonnteTokenGroup') ? 'env' : 'none'),
                ],
                'fonnteTokenCustomer' => [
                    'isSet'  => !!(($map['fonnteTokenCustomer'] ?? null) ?: $this->envFallback('fonnteTokenCustomer')),
                    'source' => isset($map['fonnteTokenCustomer']) ? 'db' : ($this->envFallback('fonnteTokenCustomer') ? 'env' : 'none'),
                ],
                'grupInvoiceId' => [
                    'value'  => ($map['grupInvoiceId'] ?? null) ?: $this->envFallback('grupInvoiceId') ?? '',
                    'source' => isset($map['grupInvoiceId']) ? 'db' : (env('FONNTE_GROUP_INVOICE') ? 'env' : 'default'),
                ],
                'grupBuktiTfId' => [
                    'value'  => ($map['grupBuktiTfId'] ?? null) ?: $this->envFallback('grupBuktiTfId') ?? '',
                    'source' => isset($map['grupBuktiTfId']) ? 'db' : (env('FONNTE_GROUP_BUKTI_TF') ? 'env' : 'default'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal membaca pengaturan'], 500);
        }
    }

    public function update(Request $request): JsonResponse
    {
        $body = $request->all();
        if (!is_array($body)) {
            return response()->json(['error' => 'Body harus object'], 400);
        }

        try {
            foreach ($body as $k => $v) {
                if (!in_array($k, $this->allowedKeys)) continue;
                if ($v === null || (is_string($v) && trim($v) === '')) {
                    DB::table('app_settings')->where('key', $k)->delete();
                } else if (is_string($v)) {
                    DB::table('app_settings')->updateOrInsert(
                        ['key' => $k],
                        ['value' => trim($v), 'updated_at' => now()]
                    );
                }
            }
            return response()->json(['ok' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menyimpan pengaturan'], 500);
        }
    }
}
