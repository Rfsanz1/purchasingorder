<?php

namespace App\Helpers;

use App\Http\Controllers\SettingsController;

class FonnteHelper
{
    public static function kirimWA(
        string $target,
        string $message,
        array $options = []
    ): bool {
        $isGroup = str_ends_with($target, '@g.us');

        if ($isGroup) {
            $token = \App\Http\Controllers\IntegrasiController::getToken('fonnte_token_group', 'FONNTE_TOKEN_GROUP')
                  ?: \App\Http\Controllers\IntegrasiController::getToken('fonnte_token', 'FONNTE_TOKEN');
        } else {
            $token = \App\Http\Controllers\IntegrasiController::getToken('fonnte_token_customer', 'FONNTE_TOKEN_CUSTOMER')
                  ?: \App\Http\Controllers\IntegrasiController::getToken('fonnte_token', 'FONNTE_TOKEN');
        }

        if (!$token) {
            \Log::warning("Fonnte token not set untuk target={$target}, skipping WA");
            return false;
        }

        try {
            $ch = curl_init('https://api.fonnte.com/send');

            $postFields = [
                'target'  => $target,
                'message' => $message,
            ];

            if (!empty($options['button'])) $postFields['button'] = $options['button'];
            if (!empty($options['footer'])) $postFields['footer'] = $options['footer'];

            if (!empty($options['fileUrl'])) {
                $postFields['url'] = $options['fileUrl'];
            } elseif (!empty($options['file'])) {
                $file    = $options['file'];
                $tmpFile = tempnam(sys_get_temp_dir(), 'fonnte_');
                file_put_contents($tmpFile, $file['buffer']);
                $postFields['file'] = new \CURLFile($tmpFile, $file['mime'], $file['filename']);
            }

            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 30,
                CURLOPT_HTTPHEADER     => ["Authorization: {$token}"],
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => $postFields,
            ]);

            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if (isset($tmpFile)) @unlink($tmpFile);

            \Log::info("Fonnte WA sent to {$target}", ['status' => $status, 'response' => $body]);
            return $status >= 200 && $status < 300;
        } catch (\Exception $e) {
            \Log::error("Failed to send WA via Fonnte to {$target}: " . $e->getMessage());
            return false;
        }
    }

    public static function cleanPhoneNumber(string $raw): ?string
    {
        $cleaned = preg_replace('/[\s\-\(\)\.]/','', $raw);
        if (str_starts_with($cleaned, '+62')) return substr($cleaned, 1);
        if (str_starts_with($cleaned, '62'))  return $cleaned;
        if (str_starts_with($cleaned, '0'))   return '62' . substr($cleaned, 1);
        if (str_starts_with($cleaned, '8'))   return '62' . $cleaned;
        return null;
    }
}
