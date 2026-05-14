<?php
    'customer'        => 'Customer',
    'customer-loyalty'=> 'Customer Loyalty',
    'analytics'       => 'Analytics',
    'profit'          => 'Profit Analytics',
    'fees'            => 'Fee Analytics',
    'settlement'      => 'Finance Settlement',
    'cod-monitor'     => 'COD Monitoring',
    'api-settings'    => 'API Settings',
    'webhook'         => 'Webhook',
    'logs'            => 'Activity Logs',
    'errors'          => 'Error Logs',
];
Route::get('/erp/{platform}/{page}', function ($platform, $page) use ($platformPageTitles) {
    $platforms = ['shopee' => 'Shopee', 'tiktok' => 'TikTok Shop', 'tokopedia' => 'Tokopedia', 'lazada' => 'Lazada'];
    if (!array_key_exists($platform, $platforms)) abort(404);
    $platformName = $platforms[$platform];
    $pageTitle    = $platformPageTitles[$page] ?? ucwords(str_replace('-', ' ', $page));
    $title        = $platformName . ' — ' . $pageTitle;
    $description  = 'Fitur ' . $pageTitle . ' untuk toko ' . $platformName . ' Anda.';
    $features     = ['Integrasi ' . $platformName . ' API', 'Sinkronisasi real-time', 'Dashboard terpadu', 'Notifikasi otomatis'];
    
    // Use crud view for basic marketplace features
    return view('erp.crud', [
        'title' => $title,
        'description' => $description,
        'module' => $platform . '-' . $page,
        'formFields' => [
            ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Active', 'Inactive', 'Error']],
            ['name' => 'last_sync', 'label' => 'Last Sync', 'type' => 'datetime'],
            ['name' => 'sync_status', 'label' => 'Sync Status', 'type' => 'select', 'options' => ['Success', 'Failed', 'Pending']],
            ['name' => 'error_message', 'label' => 'Error Message', 'type' => 'textarea'],
            ['name' => 'configuration', 'label' => 'Configuration', 'type' => 'textarea'],
        ],
        'filterOptions' => ['Active', 'Inactive', 'Error'],
    ]);
})->where('platform', 'shopee|tiktok|tokopedia|lazada');

// ── POS System — proxy ke React dev server (port 5173) ─────────────────────
Route::get('/pos/{path?}', function ($path = '') {
    if (app()->environment('production')) {
        // Di production, serve dari build output jika ada
        $buildPath = public_path('pos/index.html');
        if (file_exists($buildPath)) {
            return response()->file($buildPath);
        }
        return response('<html><body style="font-family:sans-serif;padding:40px"><h2>POS System</h2><p>Build belum tersedia. Jalankan: <code>cd frontend/artifacts/pos-app && pnpm build</code></p></body></html>', 200)->header('Content-Type', 'text/html');
    }

    // Development: proxy ke Vite dev server
    $query = request()->getQueryString();
    $url   = 'http://localhost:5173/pos/' . $path . ($query ? '?' . $query : '');

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_FAILONERROR    => false,
        CURLOPT_HEADER         => true,
    ]);
    $response = curl_exec($ch);
    $errno    = curl_errno($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
    curl_close($ch);

