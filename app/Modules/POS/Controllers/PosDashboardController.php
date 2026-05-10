<?php

namespace App\Modules\POS\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\POS\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PosDashboardController extends Controller
{
    public function __construct(private readonly DashboardService $service) {}

    public function summary(): JsonResponse
    {
        return response()->json($this->service->getSummary());
    }

    public function chart(Request $request): JsonResponse
    {
        $days = (int) $request->query('days', 30);
        return response()->json($this->service->getChartData($days));
    }

    public function topProducts(Request $request): JsonResponse
    {
        $limit  = (int) $request->query('limit', 10);
        $period = $request->query('period', 'month');
        return response()->json($this->service->getTopProducts($limit, $period));
    }

    public function recentTransactions(Request $request): JsonResponse
    {
        $limit = (int) $request->query('limit', 10);
        return response()->json($this->service->getRecentTransactions($limit));
    }

    public function monthlyRevenue(Request $request): JsonResponse
    {
        $months = (int) $request->query('months', 12);
        return response()->json($this->service->getMonthlyRevenue($months));
    }
}
