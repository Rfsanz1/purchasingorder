<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DriverAreaController extends Controller
{
    private string $dataDir;
    private string $dataFile;
    private array $defaultDrivers = ['Yanto', 'Wawan', 'Chaidar'];

    public function __construct()
    {
        $this->dataDir  = base_path('data');
        $this->dataFile = base_path('data/driver-areas.json');
    }

    private function ensureFile(): array
    {
        if (!is_dir($this->dataDir)) {
            mkdir($this->dataDir, 0755, true);
        }
        if (!file_exists($this->dataFile)) {
            $init = array_fill_keys($this->defaultDrivers, []);
            file_put_contents($this->dataFile, json_encode($init, JSON_PRETTY_PRINT));
            return $init;
        }
        try {
            $raw = json_decode(file_get_contents($this->dataFile), true);
            foreach ($this->defaultDrivers as $d) {
                if (!isset($raw[$d])) $raw[$d] = [];
            }
            return $raw;
        } catch (\Exception $e) {
            $init = array_fill_keys($this->defaultDrivers, []);
            file_put_contents($this->dataFile, json_encode($init, JSON_PRETTY_PRINT));
            return $init;
        }
    }

    public function index(): JsonResponse
    {
        return response()->json($this->ensureFile());
    }

    public function update(Request $request): JsonResponse
    {
        $body = $request->all();
        if (!is_array($body)) {
            return response()->json(['ok' => false, 'error' => 'Body harus berupa object'], 400);
        }

        $cleaned = [];
        foreach ($body as $driver => $areas) {
            if (!is_string($driver)) continue;
            $list = is_array($areas) ? array_map('trim', $areas) : [];
            $list = array_filter($list, fn($a) => $a !== '');
            $seen = [];
            $dedup = [];
            foreach ($list as $a) {
                $k = strtolower($a);
                if (!in_array($k, $seen)) {
                    $seen[] = $k;
                    $dedup[] = $a;
                }
            }
            $cleaned[$driver] = array_values($dedup);
        }

        foreach ($this->defaultDrivers as $d) {
            if (!isset($cleaned[$d])) $cleaned[$d] = [];
        }

        if (!is_dir($this->dataDir)) mkdir($this->dataDir, 0755, true);
        file_put_contents($this->dataFile, json_encode($cleaned, JSON_PRETTY_PRINT));

        \Log::info('Driver areas updated', ['drivers' => array_keys($cleaned)]);
        return response()->json(['ok' => true, 'data' => $cleaned]);
    }
}
