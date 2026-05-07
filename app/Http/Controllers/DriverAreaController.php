<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\DriverArea;

class DriverAreaController extends Controller
{
    private array $defaultDrivers = ['Yanto', 'Wawan', 'Chaidar'];

    public function index(): JsonResponse
    {
        return response()->json(DriverArea::getGrouped());
    }

    public function update(Request $request): JsonResponse
    {
        $body = $request->all();
        if (!is_array($body)) {
            return response()->json(['ok' => false, 'error' => 'Body harus berupa object'], 400);
        }

        foreach ($body as $driver => $areas) {
            if (!is_string($driver)) continue;
            $areaList = is_array($areas) ? $areas : [];
            DriverArea::setForDriver($driver, $areaList);
        }

        foreach ($this->defaultDrivers as $d) {
            if (!array_key_exists($d, $body)) {
                DriverArea::setForDriver($d, []);
            }
        }

        \Log::info('Driver areas updated', ['drivers' => array_keys($body)]);
        return response()->json(['ok' => true, 'data' => DriverArea::getGrouped()]);
    }
}
