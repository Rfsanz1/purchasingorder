<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Services\ReportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosReportController extends Controller
{
    public function __construct(private readonly ReportService $service) {}

    public function sales(Request $request): JsonResponse
    {
        $report = $this->service->salesReport($request->all());
        return response()->json([
            'totals' => $report['totals'],
            'data'   => $report['sales'],
        ]);
    }

    public function stock(Request $request): JsonResponse
    {
        $warehouseId = $request->query('warehouse_id') ? (int) $request->query('warehouse_id') : null;
        return response()->json(['data' => $this->service->stockReport($warehouseId)]);
    }

    public function receivables(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->service->receivablesReport($request->query('status'))]);
    }

    public function payables(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->service->payablesReport($request->query('status'))]);
    }

    public function cashier(Request $request): JsonResponse
    {
        return response()->json(['data' => $this->service->cashierReport($request->all())]);
    }
}
