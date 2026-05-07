<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\AppSetting;

class SettingsController extends Controller
{
    private array $secretKeys  = ['fonnteTokenGroup', 'fonnteTokenCustomer'];
    private array $allowedKeys = ['fonnteTokenGroup', 'fonnteTokenCustomer', 'grupInvoiceId', 'grupBuktiTfId'];

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
            $value = AppSetting::get($key);
            if ($value) return $value;
        } catch (\Exception $e) {
            \Log::warning("getSetting DB read failed for key={$key}: " . $e->getMessage());
        }
        $instance = new static();
        return $instance->envFallback($key);
    }

    public function index(): JsonResponse
    {
        try {
            $getValue  = fn($k) => AppSetting::get($k) ?: $this->envFallback($k);
            $getSource = fn($k) => AppSetting::find($k) ? 'db' : ($this->envFallback($k) ? 'env' : 'none');

            return response()->json([
                'fonnteTokenGroup' => [
                    'isSet'  => (bool) $getValue('fonnteTokenGroup'),
                    'source' => $getSource('fonnteTokenGroup'),
                ],
                'fonnteTokenCustomer' => [
                    'isSet'  => (bool) $getValue('fonnteTokenCustomer'),
                    'source' => $getSource('fonnteTokenCustomer'),
                ],
                'grupInvoiceId' => [
                    'value'  => $getValue('grupInvoiceId') ?? '',
                    'source' => AppSetting::find('grupInvoiceId') ? 'db' : (env('FONNTE_GROUP_INVOICE') ? 'env' : 'default'),
                ],
                'grupBuktiTfId' => [
                    'value'  => $getValue('grupBuktiTfId') ?? '',
                    'source' => AppSetting::find('grupBuktiTfId') ? 'db' : (env('FONNTE_GROUP_BUKTI_TF') ? 'env' : 'default'),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal membaca pengaturan: ' . $e->getMessage()], 500);
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
                    AppSetting::remove($k);
                } elseif (is_string($v)) {
                    AppSetting::set($k, trim($v));
                }
            }
            return response()->json(['ok' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Gagal menyimpan pengaturan: ' . $e->getMessage()], 500);
        }
    }
}
