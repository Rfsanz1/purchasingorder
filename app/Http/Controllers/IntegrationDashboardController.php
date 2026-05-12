<?php

namespace App\Http\Controllers;

use App\Models\KledoSyncLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class IntegrationDashboardController extends Controller
{
    public function index()
    {
        // Last sync times
        $lastSyncs = [
            'customers' => KledoSyncLog::where('data_type', 'customers')->latest('created_at')->first(),
            'products' => KledoSyncLog::where('data_type', 'products')->latest('created_at')->first(),
            'suppliers' => KledoSyncLog::where('data_type', 'suppliers')->latest('created_at')->first(),
            'invoices' => KledoSyncLog::where('data_type', 'invoices')->latest('created_at')->first(),
            'journals' => KledoSyncLog::where('data_type', 'journals')->latest('created_at')->first(),
        ];

        // Sync statistics
        $stats = [
            'total_synced_today' => KledoSyncLog::whereDate('created_at', today())->sum('records_synced'),
            'total_errors_today' => KledoSyncLog::whereDate('created_at', today())->where('status', 'error')->count(),
            'last_7_days' => KledoSyncLog::where('created_at', '>=', now()->subDays(7))
                ->selectRaw('DATE(created_at) as date, SUM(records_synced) as total')
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
        ];

        // Recent sync logs
        $recentLogs = KledoSyncLog::latest('created_at')->take(10)->get();

        // Queue status (simplified)
        $queueStatus = [
            'pending' => DB::table('jobs')->count(),
            'failed' => DB::table('failed_jobs')->count(),
        ];

        return view('integration.dashboard', compact('lastSyncs', 'stats', 'recentLogs', 'queueStatus'));
    }

    public function manualSync(Request $request)
    {
        $type = $request->get('type');

        try {
            switch ($type) {
                case 'customers':
                    $result = \App\Services\KledoService::syncCustomers();
                    break;
                case 'products':
                    $result = \App\Services\KledoService::syncProducts();
                    break;
                case 'suppliers':
                    $result = \App\Services\KledoService::syncSuppliers();
                    break;
                case 'invoices':
                    $result = \App\Services\KledoService::syncInvoices();
                    break;
                case 'journals':
                    $result = \App\Services\KledoService::syncJournals();
                    break;
                default:
                    return response()->json(['success' => false, 'message' => 'Invalid sync type']);
            }

            // Log the sync
            KledoSyncLog::create([
                'data_type' => $type,
                'status' => $result['success'] ? 'success' : 'error',
                'records_synced' => $result['synced'] ?? 0,
                'message' => $result['message'] ?? 'Sync completed',
                'sync_data' => json_encode($result),
            ]);

            return response()->json($result);

        } catch (\Exception $e) {
            KledoSyncLog::create([
                'data_type' => $type,
                'status' => 'error',
                'records_synced' => 0,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Sync failed: ' . $e->getMessage()
            ]);
        }
    }

    public function apiStatus()
    {
        // Check Kledo API status
        try {
            $service = new \App\Services\KledoService();
            $response = $service->httpGet($service->base . '/me');

            return response()->json([
                'status' => 'connected',
                'response_time' => $response ? 'OK' : 'Failed',
                'last_check' => now(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'disconnected',
                'error' => $e->getMessage(),
                'last_check' => now(),
            ]);
        }
    }
}