<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;
use App\Http\Controllers\KledoController;
use App\Http\Controllers\Shopee\ShopeeController;
use App\Http\Controllers\MarketplaceController;

Route::get('/health', fn() => response()->json(['status' => 'ok']));

// Proxy ke mockup-sandbox vite server (port 23636) — hanya aktif di development
Route::any('/__mockup/{path?}', function ($path = '') {
    // Di production Vite dev server tidak berjalan — langsung return 404
    if (app()->environment('production')) {
        return response('Not available in production', 404);
    }
    $query = request()->getQueryString();
    $url = 'http://localhost:23636/__mockup/' . $path . ($query ? '?' . $query : '');
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_HTTPHEADER     => array_filter(array_map(function ($name, $vals) {
            if (in_array(strtolower($name), ['host', 'content-length'])) return null;
            return $name . ': ' . implode(', ', $vals);
        }, array_keys(request()->headers->all()), request()->headers->all())),
        CURLOPT_CUSTOMREQUEST  => request()->method(),
        CURLOPT_POSTFIELDS     => request()->getContent() ?: null,
    ]);
    $raw      = curl_exec($ch);
    $info     = curl_getinfo($ch);
    $hdrSize  = $info['header_size'];
    $status   = $info['http_code'] ?: 502;
    curl_close($ch);
    $headerStr = substr($raw, 0, $hdrSize);
    $body      = substr($raw, $hdrSize);
    $headers   = [];
    foreach (explode("\r\n", $headerStr) as $line) {
        if (str_contains($line, ':')) {
            [$k, $v] = explode(':', $line, 2);
            $k = trim($k);
            if (in_array(strtolower($k), ['transfer-encoding', 'content-encoding', 'connection'])) continue;
            $headers[$k] = trim($v);
        }
    }
    return response($body, $status)->withHeaders($headers);
})->where('path', '.*');
Route::get('/', [PageController::class, 'landing']);

// ===== SHOPEE ADMIN =====
Route::get('/shopee/login', [ShopeeController::class, 'loginPage'])->name('shopee.login');
Route::post('/shopee/login', [ShopeeController::class, 'login'])->name('shopee.login.post');
Route::get('/shopee/logout', [ShopeeController::class, 'logout'])->name('shopee.logout');
Route::middleware(\App\Http\Middleware\ShopeeAuth::class)->group(function () {
    Route::get('/shopee/dashboard', [ShopeeController::class, 'dashboard'])->name('shopee.dashboard');
    Route::get('/shopee/orders',    [ShopeeController::class, 'orders'])->name('shopee.orders');
    Route::post('/shopee/import-csv',   [ShopeeController::class, 'importCsv'])->name('shopee.import');
    Route::post('/shopee/sync-to-erp',  [ShopeeController::class, 'syncToErp'])->name('shopee.sync');
    Route::delete('/shopee/orders/{id}', [ShopeeController::class, 'deleteOrder'])->name('shopee.order.delete');

});

// ===== MARKETPLACE SYSTEM =====
Route::get('/marketplace', fn() => redirect()->route('marketplace.login'));
Route::get('/marketplace/login',  [MarketplaceController::class, 'loginPage'])->name('marketplace.login');
Route::post('/marketplace/login', [MarketplaceController::class, 'login'])->name('marketplace.login.post');
Route::get('/marketplace/logout', [MarketplaceController::class, 'logout'])->name('marketplace.logout');

Route::middleware('marketplace.auth')->group(function () {
    Route::get('/marketplace/dashboard', [MarketplaceController::class, 'dashboard'])->name('marketplace.dashboard');
    Route::get('/marketplace/{platform}/{page?}', [MarketplaceController::class, 'page'])->name('marketplace.page');
});

Route::get('/po-form', [PageController::class, 'poForm']);
Route::get('/admin', [PageController::class, 'admin']);
Route::get('/driver', [PageController::class, 'driver']);
Route::get('/loc/{token}', [PageController::class, 'location']);
Route::get('/products', [PageController::class, 'products']);
Route::get('/sales-dashboard', [PageController::class, 'salesDashboard']);
Route::get('/erp/dashboard', fn() => view('erp.owner-dashboard'));
Route::get('/erp/invoice', [PageController::class, 'erpInvoice']);
Route::get('/erp/laporan-divisi', [PageController::class, 'laporanDivisi']);
Route::get('/erp/laporan-penjualan', [PageController::class, 'laporanPenjualan']);
Route::get('/erp/integrasi', [PageController::class, 'integrasi']);
Route::get('/erp/riwayat-penjualan', [PageController::class, 'riwayatPenjualan']);
Route::get('/erp/data-penjualan-kledo', [PageController::class, 'dataPenjualanKledo']);
Route::get('/erp/stock-opname', [PageController::class, 'stockOpname'])->name('erp.stock-opname');
Route::get('/stock-opname', function () {
    return redirect('/erp/stock-opname');
});
// /pos sekarang dihandle oleh React POS App (lihat bagian bawah file)
Route::get('/api/kledo/data-penjualan', [KledoController::class, 'dataPenjualan']);

// ═══════════════════════════════════════════════════════
// REAL ERP MODULE ROUTES — replace coming-soon entries
// ═══════════════════════════════════════════════════════
Route::get('/erp/supplier',       fn() => view('erp.supplier'));
Route::get('/erp/purchase-order', fn() => view('erp.purchase-order'));
Route::get('/erp/cash-in',        fn() => view('erp.cash', ['title' => 'Kas Masuk', 'jenis' => 'masuk']));
Route::get('/erp/cash-out',       fn() => view('erp.cash', ['title' => 'Kas Keluar', 'jenis' => 'keluar']));
Route::get('/erp/profit-loss',    fn() => view('erp.profit-loss'));
Route::get('/erp/expense',        fn() => view('erp.expense'));
Route::get('/erp/employees',      fn() => view('erp.employees'));
Route::get('/erp/attendance',     fn() => view('erp.attendance'));
Route::get('/erp/retur',          fn() => view('erp.retur'));
Route::get('/erp/discount',       fn() => view('erp.discount'));
Route::get('/erp/stock-in',       fn() => view('erp.stock-in'));
Route::get('/erp/stock-out',      fn() => view('erp.stock-out'));
Route::get('/erp/analytics',      fn() => view('erp.analytics'));
Route::get('/erp/report-sales',   fn() => view('erp.report-sales'));
Route::get('/erp/report-finance', fn() => view('erp.report-finance'));
Route::get('/erp/report-driver',  fn() => view('erp.report-driver'));
Route::get('/erp/notifications',  fn() => view('erp.wa-logs'));
Route::get('/erp/chart-of-accounts', fn() => view('erp.coa'));
Route::get('/erp/coa',               fn() => view('erp.coa'));
Route::get('/erp/payroll',        fn() => view('erp.payroll'));
Route::get('/erp/quotation',      fn() => view('erp.quotation'));
// Asset and enterprise modules
Route::get('/erp/asset-dashboard', fn() => view('erp.asset-dashboard'));
Route::get('/erp/asset-registry', fn() => view('erp.crud', [
    'module' => 'assets',
    'title' => 'Asset Registry',
    'description' => 'Kelola daftar asset tetap, nilai depresiasi, lokasi, dan PIC.',
    'addLabel' => 'Tambah Asset',
    'statusField' => 'asset_status',
    'filterField' => 'asset_status',
    'filterOptions' => ['Aktif', 'In Maintenance', 'Rusak', 'Disposal', 'Dijual'],
    'formFields' => [
        ['name'=>'asset_code','label'=>'Asset Code','type'=>'text','required'=>true],
        ['name'=>'asset_name','label'=>'Asset Name','type'=>'text','required'=>true],
        ['name'=>'serial_number','label'=>'Serial Number','type'=>'text'],
        ['name'=>'category_id','label'=>'Category','type'=>'text'],
        ['name'=>'brand','label'=>'Brand','type'=>'text'],
        ['name'=>'purchase_date','label'=>'Purchase Date','type'=>'date'],
        ['name'=>'purchase_value','label'=>'Purchase Value','type'=>'number','step'=>'0.01'],
        ['name'=>'current_value','label'=>'Current Value','type'=>'number','step'=>'0.01'],
        ['name'=>'depreciation_method','label'=>'Depreciation Method','type'=>'select','options'=>['straight-line','declining-balance','sum-of-years','none']],
        ['name'=>'useful_life','label'=>'Useful Life (years)','type'=>'number'],
        ['name'=>'location','label'=>'Location','type'=>'text'],
        ['name'=>'department','label'=>'Department','type'=>'text'],
        ['name'=>'pic','label'=>'PIC','type'=>'text'],
        ['name'=>'asset_status','label'=>'Asset Status','type'=>'select','options'=>['Aktif','In Maintenance','Rusak','Disposal','Dijual']],
        ['name'=>'qr_code','label'=>'QR Code','type'=>'text'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
        ['name'=>'attachment','label'=>'Attachment','type'=>'text'],
    ],
    'tableFields' => [
        ['name'=>'asset_code','label'=>'Asset Code'],
        ['name'=>'asset_name','label'=>'Name'],
        ['name'=>'category_id','label'=>'Category'],
        ['name'=>'location','label'=>'Location'],
        ['name'=>'asset_status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/asset-categories', fn() => view('erp.crud', [
    'module' => 'asset-categories',
    'title' => 'Asset Categories',
    'description' => 'Daftar kategori asset untuk klasifikasi yang lebih baik.',
    'addLabel' => 'Tambah Kategori',
    'formFields' => [
        ['name'=>'kode','label'=>'Kode','type'=>'text','required'=>true],
        ['name'=>'nama','label'=>'Nama','type'=>'text','required'=>true],
        ['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'kode','label'=>'Kode'],
        ['name'=>'nama','label'=>'Nama'],
        ['name'=>'deskripsi','label'=>'Deskripsi'],
    ],
]));
Route::get('/erp/asset-depreciation', fn() => view('erp.generic-module', [
    'title' => 'Asset Depreciation',
    'description' => 'Kelola metode depresiasi dan nilai buku asset secara otomatis.',
    'features' => ['Depresiasi garis lurus', 'Perhitungan useful life', 'Update nilai buku', 'Integrasi ke Accounting']
]));
Route::get('/erp/asset-maintenance', fn() => view('erp.crud', [
    'module' => 'asset-maintenance',
    'title' => 'Asset Maintenance',
    'description' => 'Jadwal pemeliharaan asset dan catatan teknisi.',
    'addLabel' => 'Tambah Maintenance',
    'formFields' => [
        ['name'=>'maintenance_number','label'=>'Maintenance Number','type'=>'text','required'=>true],
        ['name'=>'asset_id','label'=>'Asset','type'=>'text','required'=>true],
        ['name'=>'maintenance_type','label'=>'Maintenance Type','type'=>'text'],
        ['name'=>'schedule_date','label'=>'Schedule Date','type'=>'date'],
        ['name'=>'vendor_id','label'=>'Vendor','type'=>'text'],
        ['name'=>'cost','label'=>'Cost','type'=>'number','step'=>'0.01'],
        ['name'=>'technician','label'=>'Technician','type'=>'text'],
        ['name'=>'result','label'=>'Result','type'=>'textarea'],
        ['name'=>'next_maintenance_date','label'=>'Next Maintenance Date','type'=>'date'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['scheduled','in-progress','completed','cancelled']],
    ],
    'tableFields' => [
        ['name'=>'maintenance_number','label'=>'No. Maintenance'],
        ['name'=>'asset_id','label'=>'Asset'],
        ['name'=>'schedule_date','label'=>'Schedule'],
        ['name'=>'technician','label'=>'Technician'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/asset-transfer', fn() => view('erp.crud', [
    'module' => 'asset-transfers',
    'title' => 'Asset Transfer',
    'description' => 'Kelola permintaan mutasi asset antar lokasi dan departemen.',
    'addLabel' => 'Tambah Transfer',
    'formFields' => [
        ['name'=>'transfer_number','label'=>'Transfer Number','type'=>'text','required'=>true],
        ['name'=>'asset_id','label'=>'Asset','type'=>'text','required'=>true],
        ['name'=>'from_location','label'=>'From Location','type'=>'text'],
        ['name'=>'to_location','label'=>'To Location','type'=>'text'],
        ['name'=>'from_department','label'=>'From Department','type'=>'text'],
        ['name'=>'to_department','label'=>'To Department','type'=>'text'],
        ['name'=>'transfer_date','label'=>'Transfer Date','type'=>'date'],
        ['name'=>'approved_by','label'=>'Approved By','type'=>'text'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['draft','requested','approved','completed','rejected']],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'transfer_number','label'=>'Transfer Number'],
        ['name'=>'asset_id','label'=>'Asset'],
        ['name'=>'from_location','label'=>'From'],
        ['name'=>'to_location','label'=>'To'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/asset-disposal', fn() => view('erp.crud', [
    'module' => 'asset-disposals',
    'title' => 'Asset Disposal',
    'description' => 'Catat proses disposal asset sekaligus nilai pelepasan.',
    'addLabel' => 'Tambah Disposal',
    'formFields' => [
        ['name'=>'disposal_number','label'=>'Disposal Number','type'=>'text','required'=>true],
        ['name'=>'asset_id','label'=>'Asset','type'=>'text','required'=>true],
        ['name'=>'disposal_date','label'=>'Disposal Date','type'=>'date'],
        ['name'=>'reason','label'=>'Reason','type'=>'textarea'],
        ['name'=>'disposal_value','label'=>'Disposal Value','type'=>'number','step'=>'0.01'],
        ['name'=>'approved_by','label'=>'Approved By','type'=>'text'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['draft','approved','disposed','cancelled']],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'disposal_number','label'=>'Disposal Number'],
        ['name'=>'asset_id','label'=>'Asset'],
        ['name'=>'disposal_date','label'=>'Date'],
        ['name'=>'disposal_value','label'=>'Disposal Value','format'=>'currency'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/asset-audit-log', fn() => view('erp.crud', [
    'module' => 'asset-audit-logs',
    'title' => 'Asset Audit Log',
    'description' => 'Audit log aktivitas asset untuk compliance dan pelacakan perubahan.',
    'addLabel' => 'Tambah Audit Log',
    'formFields' => [
        ['name'=>'asset_id','label'=>'Asset','type'=>'text','required'=>true],
        ['name'=>'action','label'=>'Action','type'=>'text','required'=>true],
        ['name'=>'performed_by','label'=>'Performed By','type'=>'text'],
        ['name'=>'performed_at','label'=>'Performed At','type'=>'date'],
        ['name'=>'details','label'=>'Details','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'asset_id','label'=>'Asset'],
        ['name'=>'action','label'=>'Action'],
        ['name'=>'performed_by','label'=>'Performed By'],
        ['name'=>'performed_at','label'=>'Performed At'],
    ],
]));
Route::get('/erp/project-dashboard', fn() => view('erp.project-dashboard'));
Route::get('/erp/projects', fn() => view('erp.crud', [
    'module' => 'projects',
    'title' => 'Projects',
    'description' => 'Kelola proyek, anggaran, prioritas, dan progres lintas divisi.',
    'addLabel' => 'Tambah Project',
    'statusField' => 'status',
    'filterField' => 'status',
    'filterOptions' => ['Draft','Active','On Hold','Completed','Cancelled'],
    'formFields' => [
        ['name'=>'project_code','label'=>'Project Code','type'=>'text','required'=>true],
        ['name'=>'project_name','label'=>'Project Name','type'=>'text','required'=>true],
        ['name'=>'customer_name','label'=>'Customer','type'=>'text'],
        ['name'=>'start_date','label'=>'Start Date','type'=>'date'],
        ['name'=>'end_date','label'=>'End Date','type'=>'date'],
        ['name'=>'budget','label'=>'Budget','type'=>'number','step'=>'0.01'],
        ['name'=>'pic','label'=>'PIC','type'=>'text'],
        ['name'=>'priority','label'=>'Priority','type'=>'select','options'=>['Low','Medium','High','Critical']],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Active','On Hold','Completed','Cancelled']],
        ['name'=>'progress','label'=>'Progress (%)','type'=>'number'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'project_code','label'=>'Code'],
        ['name'=>'project_name','label'=>'Name'],
        ['name'=>'customer_name','label'=>'Customer'],
        ['name'=>'status','label'=>'Status','badge'=>true],
        ['name'=>'progress','label'=>'Progress'],
    ],
]));
Route::get('/erp/project-tasks', fn() => view('erp.crud', [
    'module' => 'project-tasks',
    'title' => 'Project Tasks',
    'description' => 'Kelola pekerjaan proyek dengan deadline, dependensi, dan progres.',
    'addLabel' => 'Tambah Task',
    'statusField' => 'status',
    'filterField' => 'status',
    'filterOptions' => ['Todo','In Progress','Review','Done','Blocked'],
    'formFields' => [
        ['name'=>'task_name','label'=>'Task Name','type'=>'text','required'=>true],
        ['name'=>'project_id','label'=>'Project','type'=>'text','required'=>true],
        ['name'=>'assignee','label'=>'Assignee','type'=>'text'],
        ['name'=>'deadline','label'=>'Deadline','type'=>'date'],
        ['name'=>'progress','label'=>'Progress (%)','type'=>'number'],
        ['name'=>'dependency_id','label'=>'Dependency','type'=>'text'],
        ['name'=>'attachment','label'=>'Attachment','type'=>'text'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['Todo','In Progress','Review','Done','Blocked']],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'task_name','label'=>'Task'],
        ['name'=>'project_id','label'=>'Project'],
        ['name'=>'assignee','label'=>'Assignee'],
        ['name'=>'deadline','label'=>'Deadline'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/project-milestones', fn() => view('erp.crud', [
    'module' => 'project-milestones',
    'title' => 'Milestones',
    'description' => 'Kelola milestone proyek dan jadwal penyelesaian.',
    'addLabel' => 'Tambah Milestone',
    'statusField' => 'status',
    'filterField' => 'status',
    'filterOptions' => ['pending','completed','delayed'],
    'formFields' => [
        ['name'=>'project_id','label'=>'Project','type'=>'text','required'=>true],
        ['name'=>'title','label'=>'Milestone','type'=>'text','required'=>true],
        ['name'=>'due_date','label'=>'Due Date','type'=>'date'],
        ['name'=>'completed_at','label'=>'Completed At','type'=>'date'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['pending','completed','delayed']],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'title','label'=>'Milestone'],
        ['name'=>'project_id','label'=>'Project'],
        ['name'=>'due_date','label'=>'Due Date'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/project-costing', fn() => view('erp.crud', [
    'module' => 'project-costs',
    'title' => 'Project Costing',
    'description' => 'Catat biaya proyek untuk kontrol anggaran dan pelaporan.',
    'addLabel' => 'Tambah Cost',
    'formFields' => [
        ['name'=>'project_id','label'=>'Project','type'=>'text','required'=>true],
        ['name'=>'description','label'=>'Description','type'=>'text','required'=>true],
        ['name'=>'cost_type','label'=>'Cost Type','type'=>'text'],
        ['name'=>'amount','label'=>'Amount','type'=>'number','step'=>'0.01'],
        ['name'=>'incurred_date','label'=>'Incurred Date','type'=>'date'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'project_id','label'=>'Project'],
        ['name'=>'description','label'=>'Description'],
        ['name'=>'cost_type','label'=>'Type'],
        ['name'=>'amount','label'=>'Amount','format'=>'currency'],
    ],
]));
Route::get('/erp/timesheet', fn() => view('erp.crud', [
    'module' => 'project-timesheets',
    'title' => 'Timesheet',
    'description' => 'Catat waktu kerja untuk proyek dan analisa kapasitas resource.',
    'addLabel' => 'Tambah Timesheet',
    'formFields' => [
        ['name'=>'project_id','label'=>'Project','type'=>'text','required'=>true],
        ['name'=>'task_id','label'=>'Task','type'=>'text'],
        ['name'=>'employee_name','label'=>'Employee','type'=>'text'],
        ['name'=>'date','label'=>'Date','type'=>'date'],
        ['name'=>'hours','label'=>'Hours','type'=>'number','step'=>'0.01'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'project_id','label'=>'Project'],
        ['name'=>'employee_name','label'=>'Employee'],
        ['name'=>'date','label'=>'Date'],
        ['name'=>'hours','label'=>'Hours'],
    ],
]));
Route::get('/erp/resource-allocation', fn() => view('erp.generic-module', [
    'title' => 'Resource Allocation',
    'description' => 'Monitor alokasi resource karyawan ke proyek dan tugas.',
    'features' => ['Capacity planning', 'Utilization tracking', 'Workload balancing', 'Resource heatmap']
]));
Route::get('/erp/project-billing', fn() => view('erp.generic-module', [
    'title' => 'Project Billing',
    'description' => 'Kelola invoice proyek dan integrasi ke Finance & Sales.',
    'features' => ['Billing schedule', 'Invoice linking', 'Cost to revenue', 'Payment tracking']
]));
Route::get('/erp/documents', fn() => view('erp.crud', [
    'module' => 'documents',
    'title' => 'Document Repository',
    'description' => 'Simpan dan kelola dokumen penting dengan versioning dan retention.',
    'addLabel' => 'Tambah Document',
    'statusField' => 'approval_status',
    'filterField' => 'approval_status',
    'filterOptions' => ['Draft','Pending','Approved','Rejected'],
    'formFields' => [
        ['name'=>'document_number','label'=>'Document Number','type'=>'text','required'=>true],
        ['name'=>'document_type','label'=>'Document Type','type'=>'text'],
        ['name'=>'related_module','label'=>'Related Module','type'=>'text'],
        ['name'=>'upload_file','label'=>'Upload File','type'=>'text'],
        ['name'=>'version','label'=>'Version','type'=>'text'],
        ['name'=>'approval_status','label'=>'Approval Status','type'=>'select','options'=>['Draft','Pending','Approved','Rejected']],
        ['name'=>'expired_date','label'=>'Expired Date','type'=>'date'],
        ['name'=>'retention_period','label'=>'Retention Period','type'=>'text'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'document_number','label'=>'Number'],
        ['name'=>'document_type','label'=>'Type'],
        ['name'=>'related_module','label'=>'Module'],
        ['name'=>'approval_status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/document-templates', fn() => view('erp.crud', [
    'module' => 'document-templates',
    'title' => 'Document Templates',
    'description' => 'Kelola template dokumen yang dapat digunakan untuk approval workflow.',
    'addLabel' => 'Tambah Template',
    'formFields' => [
        ['name'=>'name','label'=>'Name','type'=>'text','required'=>true],
        ['name'=>'module','label'=>'Module','type'=>'text'],
        ['name'=>'description','label'=>'Description','type'=>'textarea'],
        ['name'=>'content','label'=>'Content','type'=>'textarea'],
        ['name'=>'is_active','label'=>'Active','type'=>'select','options'=>['1','0']],
    ],
    'tableFields' => [
        ['name'=>'name','label'=>'Name'],
        ['name'=>'module','label'=>'Module'],
        ['name'=>'is_active','label'=>'Active'],
    ],
]));
Route::get('/erp/document-approval', fn() => view('erp.generic-module', [
    'title' => 'Approval Workflow',
    'description' => 'Monitor persetujuan dokumen dan alur approval antar tim.',
    'features' => ['Multi-level approval', 'Rule-based routing', 'Approval history', 'Notification']
]));
Route::get('/erp/archive', fn() => view('erp.generic-module', [
    'title' => 'Archive',
    'description' => 'Arsip dokumen terpusat untuk retention dan compliance.',
    'features' => ['Retention periods', 'Document retrieval', 'Audit trail', 'Expiration reminders']
]));
Route::get('/erp/digital-signature', fn() => view('erp.generic-module', [
    'title' => 'Digital Signature',
    'description' => 'Kelola tanda tangan digital aman untuk dokumen penting.',
    'features' => ['Signature approval', 'Signed document tracking', 'Secure storage', 'Audit log']
]));
Route::get('/erp/inspection', fn() => view('erp.crud', [
    'module' => 'inspections',
    'title' => 'Inspection',
    'description' => 'Catat hasil inspeksi kualitas produk dan supplier.',
    'addLabel' => 'Tambah Inspection',
    'statusField' => 'status',
    'filterField' => 'status',
    'filterOptions' => ['Draft','Passed','Failed'],
    'formFields' => [
        ['name'=>'inspection_number','label'=>'Inspection Number','type'=>'text','required'=>true],
        ['name'=>'product','label'=>'Product','type'=>'text'],
        ['name'=>'supplier_id','label'=>'Supplier','type'=>'text'],
        ['name'=>'batch_number','label'=>'Batch Number','type'=>'text'],
        ['name'=>'inspection_result','label'=>'Inspection Result','type'=>'text'],
        ['name'=>'defect_qty','label'=>'Defect Qty','type'=>'number'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
        ['name'=>'inspector','label'=>'Inspector','type'=>'text'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Passed','Failed']],
    ],
    'tableFields' => [
        ['name'=>'inspection_number','label'=>'Number'],
        ['name'=>'product','label'=>'Product'],
        ['name'=>'supplier_id','label'=>'Supplier'],
        ['name'=>'inspection_result','label'=>'Result'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/ncr', fn() => view('erp.crud', [
    'module' => 'ncrs',
    'title' => 'NCR',
    'description' => 'Tindak lanjut Non-Conformance Report untuk tindakan perbaikan.',
    'addLabel' => 'Tambah NCR',
    'statusField' => 'status',
    'filterField' => 'status',
    'filterOptions' => ['Open','In Progress','Closed'],
    'formFields' => [
        ['name'=>'ncr_number','label'=>'NCR Number','type'=>'text','required'=>true],
        ['name'=>'inspection_id','label'=>'Related Inspection','type'=>'text'],
        ['name'=>'problem_description','label'=>'Problem Description','type'=>'textarea'],
        ['name'=>'root_cause','label'=>'Root Cause','type'=>'textarea'],
        ['name'=>'corrective_action','label'=>'Corrective Action','type'=>'textarea'],
        ['name'=>'preventive_action','label'=>'Preventive Action','type'=>'textarea'],
        ['name'=>'status','label'=>'Status','type'=>'select','options'=>['Open','In Progress','Closed']],
    ],
    'tableFields' => [
        ['name'=>'ncr_number','label'=>'NCR Number'],
        ['name'=>'inspection_id','label'=>'Inspection'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/capa', fn() => view('erp.generic-module', [
    'title' => 'CAPA',
    'description' => 'Corrective and Preventive Action untuk meningkatkan mutu dan operasional.',
    'features' => ['Identifikasi akar masalah', 'Tindakan korektif', 'Tindakan preventif', 'Review efektifitas']
]));
Route::get('/erp/supplier-quality', fn() => view('erp.crud', [
    'module' => 'supplier-quality',
    'title' => 'Supplier Quality',
    'description' => 'Penilaian kualitas supplier untuk pengadaan dan risiko.',
    'addLabel' => 'Tambah Vendor Score',
    'formFields' => [
        ['name'=>'supplier_id','label'=>'Supplier','type'=>'text','required'=>true],
        ['name'=>'rating','label'=>'Rating','type'=>'number'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'supplier_id','label'=>'Supplier'],
        ['name'=>'rating','label'=>'Rating'],
        ['name'=>'notes','label'=>'Notes'],
    ],
]));
Route::get('/erp/qc-reports', fn() => view('erp.generic-module', [
    'title' => 'QC Reports',
    'description' => 'Laporan kualitas lengkap untuk inspeksi dan NCR.',
    'features' => ['Trend defect', 'Supplier quality score', 'Inspection summary', 'CAPA performance']
]));
Route::get('/erp/mrp-planning', fn() => view('erp.crud', [
    'module' => 'mrp-planning',
    'title' => 'MRP Planning',
    'description' => 'Rencanakan bahan berdasarkan permintaan, stok, dan lead time.',
    'addLabel' => 'Tambah MRP Plan',
    'formFields' => [
        ['name'=>'product','label'=>'Product','type'=>'text','required'=>true],
        ['name'=>'forecast_demand','label'=>'Forecast Demand','type'=>'number','step'=>'0.01'],
        ['name'=>'current_stock','label'=>'Current Stock','type'=>'number','step'=>'0.01'],
        ['name'=>'safety_stock','label'=>'Safety Stock','type'=>'number','step'=>'0.01'],
        ['name'=>'lead_time','label'=>'Lead Time (days)','type'=>'number'],
        ['name'=>'suggested_purchase_qty','label'=>'Suggested Purchase Qty','type'=>'number','step'=>'0.01'],
        ['name'=>'warehouse_id','label'=>'Warehouse','type'=>'text'],
    ],
    'tableFields' => [
        ['name'=>'product','label'=>'Product'],
        ['name'=>'forecast_demand','label'=>'Forecast'],
        ['name'=>'current_stock','label'=>'Stock'],
        ['name'=>'suggested_purchase_qty','label'=>'Suggested Qty'],
    ],
]));
Route::get('/erp/demand-forecast', fn() => view('erp.generic-module', [
    'title' => 'Demand Forecast',
    'description' => 'Forecast permintaan untuk mengurangi stockout dan overstock.',
    'features' => ['Forecast model', 'Trend analysis', 'Seasonality detection', 'Forecast accuracy']
]));
Route::get('/erp/vendor-scorecard', fn() => view('erp.generic-module', [
    'title' => 'Vendor Scorecard',
    'description' => 'Review scorecard vendor untuk pengadaan berbasis performa.',
    'features' => ['Supplier rating', 'Delivery performance', 'Quality score', 'Risk classification']
]));
Route::get('/erp/lead-time-monitoring', fn() => view('erp.generic-module', [
    'title' => 'Lead Time Monitoring',
    'description' => 'Monitor lead time supplier untuk perencanaan purchasing yang akurat.',
    'features' => ['Lead time dashboard', 'Trend per supplier', 'Alert keterlambatan', 'Supplier comparison']
]));
Route::get('/erp/procurement-analytics', fn() => view('erp.generic-module', [
    'title' => 'Procurement Analytics',
    'description' => 'Analisa pengadaan untuk penghematan biaya dan optimisasi inventory.',
    'features' => ['Spend analysis','Supplier performance','Order cycle', 'Cost saving opportunities']
]));
Route::get('/erp/auto-reorder', fn() => view('erp.generic-module', [
    'title' => 'Auto Reorder',
    'description' => 'Automasi reorder ketika stok mendekati safety stock.',
    'features' => ['Reorder recommendations','Safety stock alerts','Supplier suggestions','Approval workflow']
]));
Route::get('/erp/executive-dashboard', fn() => view('erp.generic-module', [
    'title' => 'Executive Dashboard',
    'description' => 'Ringkasan KPI bisnis untuk pengambilan keputusan eksekutif.',
    'features' => ['Revenue summary','Profitability overview','Forecast analytics','Top risks']
]));
Route::get('/erp/data-analytics', fn() => view('erp.generic-module', [
    'title' => 'Data Analytics',
    'description' => 'Analisis data lintas modul untuk pemetaan performa bisnis.',
    'features' => ['Dashboard chart','Segmentation','Trend analysis','Anomaly detection']
]));
Route::get('/erp/kpi-monitoring', fn() => view('erp.generic-module', [
    'title' => 'KPI Monitoring',
    'description' => 'Monitor KPI utama dan jalur target setiap departemen.',
    'features' => ['KPI scorecards','Goal tracking','Alerts','Performance dashboards']
]));
Route::get('/erp/forecast-analytics', fn() => view('erp.generic-module', [
    'title' => 'Forecast Analytics',
    'description' => 'Prediksi bisnis dan perencanaan berdasarkan tren historis.',
    'features' => ['Revenue forecast','Demand forecast','Cash flow prediction','Scenario planning']
]));
Route::get('/erp/profitability-analysis', fn() => view('erp.generic-module', [
    'title' => 'Profitability Analysis',
    'description' => 'Analisa profitabilitas produk, cabang, dan pelanggan.',
    'features' => ['Gross margin','Cost drivers','Profit by segment','Contribution analysis']
]));
Route::get('/erp/custom-reports', fn() => view('erp.crud', [
    'module' => 'custom-reports',
    'title' => 'Custom Reports',
    'description' => 'Buat laporan kustom sesuai kebutuhan modul dan filter data.',
    'addLabel' => 'Tambah Report',
    'formFields' => [
        ['name'=>'report_name','label'=>'Report Name','type'=>'text','required'=>true],
        ['name'=>'module_source','label'=>'Module Source','type'=>'text'],
        ['name'=>'filters','label'=>'Filter','type'=>'textarea'],
        ['name'=>'grouping','label'=>'Grouping','type'=>'text'],
        ['name'=>'visualization_type','label'=>'Visualization Type','type'=>'select','options'=>['Table','Bar Chart','Line Chart','Pie Chart']],
        ['name'=>'schedule_report','label'=>'Schedule Report','type'=>'text'],
    ],
    'tableFields' => [
        ['name'=>'report_name','label'=>'Name'],
        ['name'=>'module_source','label'=>'Source'],
        ['name'=>'visualization_type','label'=>'Visual'],
    ],
]));
Route::get('/erp/vendor-dashboard', fn() => view('erp.generic-module', [
    'title' => 'Vendor Dashboard',
    'description' => 'Dashboard pusat vendor untuk monitoring kinerja, dokumen, dan invoice.',
    'features' => ['Vendor score','Registration status','Invoice tracking','Communication log']
]));
Route::get('/erp/vendor-registration', fn() => view('erp.crud', [
    'module' => 'vendors',
    'title' => 'Vendor Registration',
    'description' => 'Kelola vendor portal dengan data vendor, rating, dan kategori.',
    'addLabel' => 'Tambah Vendor',
    'formFields' => [
        ['name'=>'vendor_name','label'=>'Vendor Name','type'=>'text','required'=>true],
        ['name'=>'npwp','label'=>'NPWP','type'=>'text'],
        ['name'=>'address','label'=>'Address','type'=>'textarea'],
        ['name'=>'contact_person','label'=>'Contact Person','type'=>'text'],
        ['name'=>'email','label'=>'Email','type'=>'text'],
        ['name'=>'bank_account','label'=>'Bank Account','type'=>'text'],
        ['name'=>'vendor_category','label'=>'Vendor Category','type'=>'text'],
        ['name'=>'rating','label'=>'Rating','type'=>'number'],
    ],
    'tableFields' => [
        ['name'=>'vendor_name','label'=>'Vendor'],
        ['name'=>'contact_person','label'=>'PIC'],
        ['name'=>'vendor_category','label'=>'Category'],
        ['name'=>'status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/vendor-documents', fn() => view('erp.generic-module', [
    'title' => 'Vendor Documents',
    'description' => 'Kelola dokumen vendor dan persyaratan compliance.',
    'features' => ['Document repository','Expiry alerts','Approval status','Vendor attachments']
]));
Route::get('/erp/vendor-invoice', fn() => view('erp.generic-module', [
    'title' => 'Vendor Invoice',
    'description' => 'Monitor invoice vendor dan sinkronisasi ke Purchase.',
    'features' => ['Invoice tracking','Approval workflow','Payment status','Vendor history']
]));
Route::get('/erp/vendor-communication', fn() => view('erp.generic-module', [
    'title' => 'Vendor Communication',
    'description' => 'Catat komunikasi vendor untuk audit dan tindak lanjut.',
    'features' => ['Message history','Follow up reminder','Communication logs','Attachment support']
]));
Route::get('/erp/multi-entity', fn() => view('erp.generic-module', [
    'title' => 'Multi Entity',
    'description' => 'Kelola struktur entitas dan mata uang anak perusahaan.',
    'features' => ['Entity master','Intercompany mapping','Multi-currency','Consolidation ready']
]));
Route::get('/erp/intercompany-transaction', fn() => view('erp.generic-module', [
    'title' => 'Intercompany Transaction',
    'description' => 'Catat transaksi antar entitas dan konsolidasi balance sheet.',
    'features' => ['Intercompany journal','Clearing status','Intercompany approvals','Balance reconciliation']
]));
Route::get('/erp/consolidation', fn() => view('erp.generic-module', [
    'title' => 'Consolidation',
    'description' => 'Konversi laporan keuangan multi-entitas menjadi satu consolidated report.',
    'features' => ['Consolidated balance','Elimination entries','Segment reporting','Group KPI']
]));
Route::get('/erp/segment-reporting', fn() => view('erp.generic-module', [
    'title' => 'Segment Reporting',
    'description' => 'Laporan segmen bisnis untuk analisa performa unit usaha.',
    'features' => ['Revenue by segment','Expense by segment','Profit contribution','Segment dashboards']
]));
Route::get('/erp/mfa-settings', fn() => view('erp.crud', [
    'module' => 'mfa-settings',
    'title' => 'MFA Settings',
    'description' => 'Kelola pengaturan MFA untuk keamanan akses ERP.',
    'addLabel' => 'Tambah MFA Setting',
    'formFields' => [
        ['name'=>'username','label'=>'Username','type'=>'text','required'=>true],
        ['name'=>'enabled','label'=>'Enabled','type'=>'select','options'=>['0','1']],
        ['name'=>'method','label'=>'Method','type'=>'select','options'=>['sms','app','email']],
        ['name'=>'phone','label'=>'Phone','type'=>'text'],
    ],
    'tableFields' => [
        ['name'=>'username','label'=>'Username'],
        ['name'=>'enabled','label'=>'Enabled'],
        ['name'=>'method','label'=>'Method'],
    ],
]));
Route::get('/erp/login-activity', fn() => view('erp.generic-module', [
    'title' => 'Login Activity',
    'description' => 'Lacak aktivitas login untuk keamanan dan audit.',
    'features' => ['Login history','Failed attempts','Session location','Device log']
]));
Route::get('/erp/audit-trail', fn() => view('erp.crud', [
    'module' => 'audit-trails',
    'title' => 'Audit Trail',
    'description' => 'Dokumentasi aktivitas sistem dari semua modul ERP.',
    'addLabel' => 'Tambah Audit Record',
    'formFields' => [
        ['name'=>'module','label'=>'Module','type'=>'text','required'=>true],
        ['name'=>'action','label'=>'Action','type'=>'text','required'=>true],
        ['name'=>'reference','label'=>'Reference','type'=>'text'],
        ['name'=>'performed_by','label'=>'Performed By','type'=>'text'],
        ['name'=>'details','label'=>'Details','type'=>'textarea'],
        ['name'=>'ip_address','label'=>'IP Address','type'=>'text'],
        ['name'=>'performed_at','label'=>'Performed At','type'=>'date'],
    ],
    'tableFields' => [
        ['name'=>'module','label'=>'Module'],
        ['name'=>'action','label'=>'Action'],
        ['name'=>'performed_by','label'=>'User'],
        ['name'=>'performed_at','label'=>'Performed At'],
    ],
]));
Route::get('/erp/security-monitoring', fn() => view('erp.generic-module', [
    'title' => 'Security Monitoring',
    'description' => 'Monitoring keamanan sistem dan aktivitas mencurigakan.',
    'features' => ['Threat detection','Login anomalies','Audit alerts','Session monitoring']
]));
Route::get('/erp/role-matrix', fn() => view('erp.crud', [
    'module' => 'role-matrix',
    'title' => 'Role Matrix',
    'description' => 'Kelola akses modul dan hak approval per role.',
    'addLabel' => 'Tambah Role Matrix',
    'formFields' => [
        ['name'=>'role_name','label'=>'Role Name','type'=>'text','required'=>true],
        ['name'=>'allowed_module','label'=>'Allowed Module','type'=>'textarea'],
        ['name'=>'allowed_action','label'=>'Allowed Action','type'=>'textarea'],
        ['name'=>'approval_access','label'=>'Approval Access','type'=>'textarea'],
        ['name'=>'branch_access','label'=>'Branch Access','type'=>'textarea'],
        ['name'=>'notes','label'=>'Notes','type'=>'textarea'],
    ],
    'tableFields' => [
        ['name'=>'role_name','label'=>'Role Name'],
        ['name'=>'allowed_module','label'=>'Modules'],
    ],
]));
Route::get('/erp/session-management', fn() => view('erp.generic-module', [
    'title' => 'Session Management',
    'description' => 'Kelola sesi user dan hentikan sesi yang tidak sah.',
    'features' => ['Active sessions','Force logout','Device tracking','Session expiry']
]));
Route::get('/erp/driver-tracking', fn() => view('erp.generic-module', [
    'title' => 'Driver Tracking',
    'description' => 'Pantau real-time lokasi driver dan status pengiriman.',
    'features' => ['GPS tracking','Delivery status','ETA updates','Driver performance']
]));
Route::get('/erp/delivery-tracking', fn() => view('erp.crud', [
    'module' => 'delivery-tracking',
    'title' => 'Delivery Tracking',
    'description' => 'Catat informasi delivery tracking untuk pengiriman barang.',
    'addLabel' => 'Tambah Delivery Tracking',
    'formFields' => [
        ['name'=>'delivery_number','label'=>'Delivery Number','type'=>'text','required'=>true],
        ['name'=>'driver','label'=>'Driver','type'=>'text'],
        ['name'=>'vehicle','label'=>'Vehicle','type'=>'text'],
        ['name'=>'gps_location','label'=>'GPS Location','type'=>'text'],
        ['name'=>'delivery_status','label'=>'Delivery Status','type'=>'select','options'=>['Pending','On Route','Delivered','Failed','Returned']],
        ['name'=>'proof_of_delivery','label'=>'Proof of Delivery','type'=>'text'],
        ['name'=>'order_reference','label'=>'Order Reference','type'=>'text'],
    ],
    'tableFields' => [
        ['name'=>'delivery_number','label'=>'Number'],
        ['name'=>'driver','label'=>'Driver'],
        ['name'=>'vehicle','label'=>'Vehicle'],
        ['name'=>'delivery_status','label'=>'Status','badge'=>true],
    ],
]));
Route::get('/erp/mobile-sync', fn() => view('erp.generic-module', [
    'title' => 'Mobile Sync',
    'description' => 'Synchronize ERP data with mobile apps and drivers.',
    'features' => ['Real-time sync','Offline support','Push notification','Mobile approval']
]));
Route::get('/erp/barcode-scanner', fn() => view('erp.generic-module', [
    'title' => 'Barcode Scanner',
    'description' => 'Support scanning asset and product barcodes via mobile device.',
    'features' => ['Scan asset','Scan inventory','Mobile barcode support','QR integration']
]));
Route::get('/erp/mobile-approval', fn() => view('erp.generic-module', [
    'title' => 'Mobile Approval',
    'description' => 'Workflow approval via mobile device for managers on the move.',
    'features' => ['Approve requests','Reject tasks','Comments','Mobile notifications']
]));
// Goods receipt → generic with features
Route::get('/erp/goods-receipt',  fn() => view('erp.generic-module', [
    'title' => 'Penerimaan Barang', 'description' => 'Konfirmasi penerimaan barang dari supplier',
    'features' => ['Input penerimaan', 'Verifikasi terhadap PO', 'Notifikasi admin', 'Update stok otomatis']
]));
// Warehouse
Route::get('/erp/warehouse', fn() => view('erp.generic-module', [
    'title' => 'Manajemen Gudang', 'description' => 'Kelola zona dan lokasi penyimpanan gudang',
    'features' => ['Daftar gudang', 'Transfer antar gudang', 'Kapasitas gudang', 'Peta gudang']
]));
// Delivery proof
Route::get('/erp/delivery-proof', fn() => view('erp.generic-module', [
    'title' => 'Bukti Pengiriman', 'description' => 'Dokumentasi foto bukti pengiriman ke customer',
    'features' => ['Upload foto bukti', 'Status pengiriman', 'GPS tracking', 'Laporan driver']
]));
// Loyalty
Route::get('/erp/loyalty', fn() => view('erp.generic-module', [
    'title' => 'Loyalty Points', 'description' => 'Program poin reward untuk pelanggan setia',
    'features' => ['Akumulasi poin', 'Redeem poin', 'Level membership', 'Riwayat poin']
]));
// Users
Route::get('/erp/users', fn() => view('erp.generic-module', [
    'title' => 'Manajemen User', 'description' => 'Kelola user, role, dan hak akses sistem',
    'features' => ['Tambah user', 'Assign role', 'Hak akses per menu', 'Activity log']
]));

// ─── Coming Soon routes (remaining unbuilt modules) ──────────────────────
$comingSoon = [
    // NOTE: paths already handled by dedicated routes above are intentionally excluded
    'erp/ai-inventory'    => ['AI Inventory', 'Prediksi stok dan reorder otomatis berbasis AI.', ['Prediksi kebutuhan stok', 'Auto reorder saat stok menipis', 'Analisis tren demand', 'Rekomendasi supplier']],
    'erp/ai-analytics'    => ['AI Analytics', 'Dashboard analitik prediktif berbasis AI.', ['Prediksi penjualan 30 hari', 'Rekomendasi produk top', 'Customer lifetime value', 'Anomaly detection']],
    'erp/multi-branch'    => ['Multi Cabang', 'Kelola beberapa toko/cabang dalam satu sistem.', ['Dashboard per cabang', 'Transfer stok antar cabang', 'Laporan konsolidasi', 'Hak akses per cabang']],
    'erp/payment-gateway' => ['Payment Gateway', 'Integrasi pembayaran online Midtrans / Stripe.', ['Link pembayaran otomatis', 'Konfirmasi pembayaran real-time', 'Refund otomatis', 'Rekonsiliasi transaksi']],
    'erp/mobile-sync'     => ['Mobile App Sync', 'Sinkronisasi data ke aplikasi Android / iOS.', ['Sinkronisasi real-time', 'Mode offline', 'Push notification', 'Scan barcode via kamera']],
    'erp/chatbot'         => ['Chatbot AI', 'Asisten customer service berbasis AI.', ['Auto-reply WhatsApp', 'Cek status order via WA', 'FAQ otomatis', 'Eskalasi ke human agent']],
    'erp/tax-accounting'  => ['Pajak & Akuntansi', 'Modul pajak otomatis dan laporan akuntansi lengkap.', ['Perhitungan PPN otomatis', 'Laporan SPT', 'Jurnal akuntansi', 'Integrasi e-Faktur']],
];

// ── AI-only paths (stay as Coming Soon) ──────────────────────────────────
$aiOnlyPaths = [
    'erp/chatbot', 'erp/chatbot-ai', 'erp/ai-inventory', 'erp/ai-analytics',
    'erp/workflow-automation', 'erp/forecasting', 'erp/marketplace-chat-ai',
    'erp/marketplace-ai-analytics', 'erp/approval-workflow',
];

// ── Dedicated functional module routes ────────────────────────────────────
Route::get('/erp/supplier',            fn() => view('erp.supplier'));
Route::get('/erp/employees',           fn() => view('erp.employees'));
Route::get('/erp/purchase-order',      fn() => view('erp.purchase-order'));
Route::get('/erp/users',               fn() => view('erp.users'));
Route::get('/erp/roles',               fn() => view('erp.roles'));
Route::get('/erp/cash-in',             fn() => view('erp.cash-in'));
Route::get('/erp/cash-out',            fn() => view('erp.cash-out'));
Route::get('/erp/expense',             fn() => view('erp.expense'));
Route::get('/erp/profit-loss',         fn() => view('erp.profit-loss'));
Route::get('/erp/attendance',          fn() => view('erp.attendance'));
Route::get('/erp/payroll',             fn() => view('erp.payroll'));
Route::get('/erp/warehouse',           fn() => view('erp.warehouse'));
Route::get('/erp/analytics',           fn() => view('erp.analytics'));
Route::get('/erp/loyalty',             fn() => view('erp.loyalty'));
Route::get('/erp/service',             fn() => view('erp.service'));
Route::get('/erp/warranty',            fn() => view('erp.warranty'));
Route::get('/erp/marketplace-overview',fn() => view('erp.marketplace-overview'));
Route::get('/erp/marketplace-sync',    fn() => view('erp.marketplace-sync'));
Route::get('/erp/audit-log',           fn() => view('erp.audit-log'));
Route::get('/erp/chart-of-accounts',   fn() => view('erp.chart-of-accounts'));
Route::get('/erp/coa',                 fn() => view('erp.coa'));
Route::get('/erp/notifications',       fn() => view('erp.wa-logs'));
Route::get('/erp/retur',               fn() => view('erp.retur'));
Route::get('/erp/discount',            fn() => view('erp.discount'));
Route::get('/erp/stock-in',            fn() => view('erp.stock-in'));
Route::get('/erp/stock-out',           fn() => view('erp.stock-out'));
Route::get('/erp/report-sales',        fn() => view('erp.report-sales'));
Route::get('/erp/report-finance',      fn() => view('erp.report-finance'));
Route::get('/erp/report-driver',       fn() => view('erp.report-driver'));
Route::get('/erp/quotation',           fn() => view('erp.quotation'));
Route::get('/erp/goods-receipt',       fn() => view('erp.generic-module', [
    'title' => 'Penerimaan Barang', 'description' => 'Konfirmasi penerimaan barang dari supplier',
    'features' => ['Input penerimaan', 'Verifikasi terhadap PO', 'Notifikasi admin', 'Update stok otomatis']
]));
Route::get('/erp/delivery-proof',      fn() => view('erp.generic-module', [
    'title' => 'Bukti Pengiriman', 'description' => 'Dokumentasi foto bukti pengiriman ke customer',
    'features' => ['Upload foto bukti', 'Status pengiriman', 'GPS tracking', 'Laporan driver']
]));

foreach ($comingSoon as $path => [$title, $description, $features]) {
    $module = str_replace('erp/', '', $path);
    $isAi   = in_array($path, $aiOnlyPaths);
    Route::get('/' . $path, function () use ($isAi, $module, $title, $description, $features) {
        if ($isAi) return view('erp.coming-soon', compact('title', 'description', 'features'));
        return view('erp.module', compact('title', 'description', 'features', 'module'));
    });
}

// Active ERP routes
Route::get('/erp/customers', [PageController::class, 'customers'])->name('erp.customers');

// ===== NEW ERP MODULES - COMING SOON =====

// MASTER DATA
$masterDataComingSoon = [
    'erp/product-categories' => ['Kategori Produk', 'Manajemen kategori produk untuk mengorganisir inventory.', ['Tambah kategori', 'Sub-kategori', 'Kategori aktif/non-aktif']],
    'erp/brands' => ['Brand Produk', 'Database brand dan merek produk.', ['Daftar brand', 'Logo brand', 'Status brand']],
    'erp/units' => ['Satuan Barang', 'Manajemen satuan ukuran produk (pcs, kg, liter, dll).', ['Satuan dasar', 'Konversi satuan', 'Satuan aktif']],
    'erp/price-types' => ['Tipe Harga', 'Berbagai tipe harga jual (ecer, grosir, reseller).', ['Harga ecer', 'Harga grosir', 'Margin otomatis']],
    'erp/taxes' => ['Pajak', 'Konfigurasi pajak PPN, PPH, dan pajak lainnya.', ['PPN 11%', 'Pajak daerah', 'Pengecualian pajak']],
    'erp/branches' => ['Data Cabang', 'Manajemen multi-cabang dan lokasi toko.', ['Daftar cabang', 'Alamat cabang', 'Kontak cabang']],
    'erp/salesman' => ['Data Salesman', 'Database sales dan komisi penjualan.', ['Profil salesman', 'Target penjualan', 'Komisi otomatis']],
    'erp/payment-methods' => ['Metode Pembayaran', 'Konfigurasi cara pembayaran yang tersedia.', ['Transfer bank', 'Cash', 'E-wallet', 'Kredit']],
];

// AKUNTANSI — erp/chart-of-accounts handled by dedicated route above
$accountingComingSoon = [
    'erp/journal' => ['Jurnal Umum', 'Pencatatan jurnal transaksi harian.', ['Jurnal otomatis', 'Jurnal manual', 'Approval jurnal']],
    'erp/general-ledger' => ['Buku Besar', 'Laporan buku besar per akun.', ['Buku besar umum', 'Buku besar pembantu', 'Saldo akun']],
    'erp/balance-sheet' => ['Neraca', 'Laporan posisi keuangan perusahaan.', ['Aktiva lancar', 'Aktiva tetap', 'Pasiva', 'Ekuitas']],
    'erp/cash-flow' => ['Arus Kas', 'Laporan arus kas masuk dan keluar.', ['Arus kas operasi', 'Arus kas investasi', 'Arus kas pendanaan']],
    'erp/account-payable' => ['Hutang Supplier', 'Manajemen hutang kepada supplier.', ['Daftar hutang', 'Jatuh tempo', 'Pembayaran hutang']],
    'erp/account-receivable' => ['Piutang Customer', 'Manajemen piutang dari customer.', ['Daftar piutang', 'Jatuh tempo', 'Pengingat pembayaran']],
    'erp/bank-reconciliation' => ['Rekonsiliasi Bank', 'Pencocokan mutasi bank dengan pembukuan.', ['Mutasi bank', 'Pencocokan otomatis', 'Rekonsiliasi manual']],
];

// MANAJEMEN STOK
$inventoryComingSoon = [
    'erp/stock-mutation' => ['Mutasi Stok', 'Pencatatan perpindahan stok antar lokasi.', ['Mutasi masuk', 'Mutasi keluar', 'Riwayat mutasi']],
    'erp/warehouse-transfer' => ['Transfer Antar Gudang', 'Transfer stok antar gudang/cabang.', ['Transfer request', 'Approval transfer', 'Penerimaan transfer']],
    'erp/min-stock' => ['Minimum Stock Alert', 'Peringatan stok minimum dan reorder point.', ['Alert otomatis', 'Reorder point', 'Notifikasi stok rendah']],
    'erp/serial-number' => ['Serial Number / IMEI', 'Tracking produk dengan nomor seri.', ['Input serial number', 'Tracking per produk', 'Riwayat serial']],
    'erp/product-batch' => ['Batch Produk', 'Manajemen produk dengan batch/expired date.', ['Batch number', 'Expired date', 'FIFO tracking']],
    'erp/stock-history' => ['History Pergerakan Barang', 'Riwayat lengkap pergerakan inventory.', ['Stok masuk', 'Stok keluar', 'Adjustment stok']],
];

// PURCHASE FLOW
$purchaseFlowComingSoon = [
    'erp/purchase-request' => ['Permintaan Pembelian', 'Request pembelian dari departemen.', ['Buat PR', 'Approval PR', 'Konversi ke PO']],
    'erp/purchase-approval' => ['Approval Purchase', 'Workflow approval untuk pembelian.', ['Multi-level approval', 'Reject dengan alasan', 'History approval']],
    'erp/supplier-invoice' => ['Invoice Supplier', 'Pencatatan invoice dari supplier.', ['Input invoice', 'Matching dengan PO', 'Pembayaran invoice']],
    'erp/payable-due' => ['Hutang Jatuh Tempo', 'Monitoring hutang yang akan jatuh tempo.', ['Reminder otomatis', 'Overdue alert', 'Cash flow planning']],
];

// SALES FLOW — erp/quotation handled by dedicated route above
$salesFlowComingSoon = [
    'erp/sales-target' => ['Sales Target', 'Target penjualan per salesman/periode.', ['Target bulanan', 'Target tahunan', 'Tracking pencapaian']],
    'erp/sales-commission' => ['Komisi Sales', 'Perhitungan komisi penjualan otomatis.', ['Komisi per produk', 'Komisi per target', 'Pembayaran komisi']],
    'erp/sales-receivable' => ['Piutang Penjualan', 'Monitoring piutang dari penjualan.', ['Invoice outstanding', 'Collection tracking', 'Bad debt provision']],
    'erp/order-tracking' => ['Tracking Status Order', 'Monitoring status pesanan dari awal sampai selesai.', ['Status real-time', 'ETA estimation', 'Customer notification']],
];

// HR / KARYAWAN — all paths handled by dedicated routes, keeping array empty
$hrComingSoon = [];

// DASHBOARD ANALYTICS — handled by dedicated route above
$analyticsComingSoon = [];

// FITUR TOKO ELEKTRONIK — erp/service and erp/warranty handled by dedicated routes above
$electronicStoreComingSoon = [
    'erp/service-tracking' => ['Tracking Perbaikan', 'Monitoring progress perbaikan.', ['Repair status', 'Technician assignment', 'Completion tracking']],
    'erp/installment' => ['Kredit Customer', 'Fitur cicilan untuk pembelian.', ['Installment setup', 'Payment schedule', 'Interest calculation']],
    'erp/installment-due' => ['Jatuh Tempo Cicilan', 'Monitoring cicilan yang jatuh tempo.', ['Due date alert', 'Payment reminder', 'Overdue management']],
];

// FITUR ENTERPRISE
$enterpriseComingSoon = [
    'erp/approval-system' => ['Approval System', 'Sistem approval multi-level untuk berbagai proses.', ['Workflow designer', 'Multi-approver', 'Approval history']],
    'erp/workflow-automation' => ['Workflow Automation', 'Otomasi proses bisnis.', ['Process automation', 'Trigger setup', 'Integration automation']],
    'erp/export-pdf-excel' => ['Export PDF/Excel', 'Export laporan dalam berbagai format.', ['PDF export', 'Excel export', 'Custom template']],
    'erp/template-invoice' => ['Template Invoice', 'Template invoice yang dapat dikustomisasi.', ['Invoice designer', 'Branding', 'Multi-language']],
    'erp/multi-currency' => ['Multi Currency', 'Dukungan multi mata uang.', ['Currency conversion', 'Exchange rate', 'Currency reports']],
    'erp/multi-tax' => ['Multi Pajak', 'Konfigurasi pajak kompleks.', ['Tax rules', 'Tax calculation', 'Tax reporting']],
    'erp/backup-system' => ['Backup System', 'Sistem backup otomatis data.', ['Auto backup', 'Restore point', 'Cloud backup']],
    'erp/api-public' => ['API Public', 'API untuk integrasi eksternal.', ['REST API', 'API documentation', 'Rate limiting']],
    'erp/webhook' => ['Webhook', 'Notifikasi real-time ke sistem eksternal.', ['Event triggers', 'Payload customization', 'Security']],
    'erp/activity-timeline' => ['Activity Timeline', 'Timeline aktivitas sistem.', ['Activity feed', 'User timeline', 'Audit timeline']],
];

// Combine all coming soon arrays
$allComingSoon = array_merge(
    $masterDataComingSoon,
    $accountingComingSoon,
    $inventoryComingSoon,
    $purchaseFlowComingSoon,
    $salesFlowComingSoon,
    $hrComingSoon,
    $analyticsComingSoon,
    $electronicStoreComingSoon,
    $enterpriseComingSoon
);

foreach ($allComingSoon as $path => [$title, $description, $features]) {
    Route::get('/' . $path, function() use ($title, $description, $features) {
        return view('erp.coming-soon', compact('title', 'description', 'features'));
    });
}

// ===== ADDITIONAL ROUTES — FINAL UNIFIED MENU STRUCTURE =====
$extraComingSoon = [
    // Dashboard
    'erp/owner-dashboard'    => ['Dashboard Owner', 'Dashboard khusus pemilik bisnis dengan ringkasan finansial.', ['Omzet harian/bulanan', 'Profit overview', 'Hutang & piutang', 'Alert penting']],
    'erp/multi-branch-analytics' => ['Multi Branch Analytics', 'Analitik komparatif antar cabang.', ['Performa per cabang', 'Ranking cabang', 'Transfer stok', 'Laporan konsolidasi']],
    // Sales
    'erp/sales-order'        => ['Sales Order', 'Buat dan kelola sales order.', ['Buat SO', 'Approval SO', 'Konversi ke invoice', 'Tracking SO']],
    'erp/delivery-order'     => ['Delivery Order', 'Buat dan kelola delivery order.', ['Buat DO dari SO', 'Status pengiriman', 'Cetak surat jalan', 'Konfirmasi penerimaan']],
    'erp/membership'         => ['Membership Customer', 'Program membership dan tier customer.', ['Tier membership', 'Benefit per tier', 'Upgrade otomatis', 'Statistik member']],
    // Inventory
    'erp/sku'                => ['SKU Produk', 'Manajemen kode SKU produk.', ['Generate SKU', 'SKU unique', 'Mapping ke barcode', 'SKU per varian']],
    'erp/barcode'            => ['Barcode Produk', 'Manajemen barcode dan label produk.', ['Generate barcode', 'Print label', 'Scan barcode', 'Barcode per varian']],
    'erp/multi-warehouse'    => ['Multi Gudang', 'Manajemen beberapa gudang sekaligus.', ['Daftar gudang', 'Stok per gudang', 'Transfer antar gudang', 'Laporan per gudang']],
    'erp/rack'               => ['Rak Gudang', 'Manajemen lokasi rak dalam gudang.', ['Peta rak', 'Lokasi produk', 'Kapasitas rak', 'Pencarian lokasi']],
    'erp/stock-adjustment'   => ['Penyesuaian Stok', 'Koreksi stok manual.', ['Tambah stok', 'Kurangi stok', 'Alasan penyesuaian', 'Riwayat koreksi']],
    'erp/stock-card'         => ['Kartu Stok', 'Kartu stok per produk.', ['Kartu stok digital', 'Mutasi per produk', 'Saldo awal/akhir', 'Export kartu stok']],
    'erp/inventory-value'    => ['Nilai Persediaan', 'Laporan nilai persediaan saat ini.', ['Nilai per produk', 'Total nilai inventory', 'Metode FIFO/Average', 'Export laporan']],
    'erp/fast-moving'        => ['Fast Moving Item', 'Laporan produk dengan pergerakan cepat.', ['Top fast moving', 'Tren pergerakan', 'Reorder suggestion', 'Periode analisis']],
    'erp/slow-moving'        => ['Slow Moving Item', 'Laporan produk dengan pergerakan lambat.', ['Identifikasi slow moving', 'Dead stock alert', 'Rekomendasi clearance', 'Aging inventory']],
    'erp/production'         => ['Produksi', 'Manajemen proses produksi.', ['Work order', 'Bill of material', 'Progress produksi', 'Cost produksi']],
    'erp/assembly'           => ['Perakitan Barang', 'Proses perakitan komponen menjadi produk.', ['Assembly order', 'Komponen needed', 'Status assembly', 'Cost assembly']],
    'erp/production-formula' => ['Formula Produksi', 'Resep dan formula produksi.', ['Buat formula', 'Komposisi bahan', 'Varian formula', 'Cost per formula']],
    // Purchase
    'erp/purchase-return'    => ['Retur Pembelian', 'Retur barang ke supplier.', ['Buat retur', 'Alasan retur', 'Refund dari supplier', 'Laporan retur beli']],
    'erp/pay-supplier'       => ['Pembayaran Supplier', 'Proses pembayaran ke supplier.', ['Bayar hutang', 'Cicilan pembayaran', 'Rekap pembayaran', 'Konfirmasi pembayaran']],
    'erp/supplier-analytics' => ['Analisa Supplier', 'Analisis performa supplier.', ['Ketepatan pengiriman', 'Kualitas barang', 'Harga kompetitif', 'Ranking supplier']],
    // Finance — new cash types
    'erp/main-cash'          => ['Kas Besar', 'Pengelolaan kas besar perusahaan.', ['Saldo kas besar', 'Mutasi kas', 'Transfer ke kas kecil', 'Laporan kas besar']],
    'erp/petty-cash'         => ['Kas Kecil', 'Pengelolaan kas kecil operasional.', ['Pengajuan kas kecil', 'Reimbursement', 'Saldo kas kecil', 'Laporan petty cash']],
    'erp/electronic-cash'    => ['Kas Elektronik', 'Manajemen dompet digital dan e-money.', ['GoPay', 'OVO', 'Dana', 'ShopeePay']],
    'erp/building-cash'      => ['Kas Bahan Bangunan', 'Kas khusus divisi bahan bangunan.', ['Saldo divisi BB', 'Transaksi BB', 'Laporan divisi', 'Rekonsiliasi BB']],
    'erp/bank-account'       => ['Rekening Bank', 'Manajemen rekening bank perusahaan.', ['Daftar rekening', 'Saldo per rekening', 'Mutasi rekening', 'Rekonsiliasi']],
    'erp/bank-transfer'      => ['Transfer Bank', 'Proses transfer antar rekening.', ['Transfer internal', 'Transfer ke supplier', 'Bukti transfer', 'Riwayat transfer']],
    'erp/giro'               => ['Giro / Cek', 'Manajemen giro dan cek.', ['Input giro masuk', 'Giro keluar', 'Status giro', 'Jatuh tempo giro']],
    // Accounting
    'erp/trial-balance'      => ['Neraca Saldo', 'Laporan neraca saldo semua akun.', ['Neraca saldo percobaan', 'Cek balance', 'Per periode', 'Export laporan']],
    'erp/opening-balance'    => ['Saldo Awal', 'Input saldo awal periode akuntansi.', ['Saldo awal akun', 'Import saldo', 'Validasi saldo', 'Saldo per cabang']],
    'erp/accounting-period'  => ['Periode Akuntansi', 'Manajemen periode buku.', ['Buka/tutup periode', 'Periode aktif', 'Lock transaksi lama', 'Laporan per periode']],
    'erp/departments'        => ['Departemen', 'Manajemen departemen untuk alokasi biaya.', ['Daftar departemen', 'Budget per dept', 'Laporan per dept', 'Alokasi biaya']],
    'erp/projects'           => ['Proyek', 'Tracking biaya dan pendapatan per proyek.', ['Daftar proyek', 'Budget proyek', 'Actual vs budget', 'Laporan proyek']],
    'erp/budgeting'          => ['Budgeting', 'Perencanaan dan monitoring budget.', ['Budget tahunan', 'Budget per dept', 'Realisasi budget', 'Variance analysis']],
    'erp/audit-transaction'  => ['Audit Transaksi', 'Audit jejak semua transaksi keuangan.', ['Trail audit', 'Perubahan data', 'User yang mengubah', 'Export audit log']],
    // Tax
    'erp/vat'                => ['PPN', 'Manajemen pajak PPN 11%.', ['Hitung PPN', 'Faktur pajak masukan', 'Faktur pajak keluaran', 'Laporan PPN']],
    'erp/pph'                => ['PPh', 'Manajemen pajak penghasilan.', ['PPh 21', 'PPh 23', 'PPh Final', 'Laporan PPh']],
    'erp/tax-invoice'        => ['Faktur Pajak', 'Kelola faktur pajak masukan & keluaran.', ['Faktur masukan', 'Faktur keluaran', 'Matching faktur', 'Rekap faktur']],
    'erp/e-faktur'           => ['e-Faktur', 'Integrasi e-Faktur DJP Online.', ['Upload e-Faktur', 'Status e-Faktur', 'Sinkronisasi DJP', 'CSV export']],
    'erp/tax-report'         => ['Laporan Pajak', 'Laporan pajak komprehensif.', ['Laporan PPN', 'Laporan PPh', 'SPT Masa', 'Export untuk DJP']],
    // CRM extended
    'erp/customer-group'     => ['Customer Group', 'Segmentasi customer berdasarkan grup.', ['Buat grup', 'Assign customer', 'Harga khusus per grup', 'Statistik grup']],
    'erp/customer-credit'    => ['Customer Credit', 'Limit kredit per customer.', ['Set credit limit', 'Sisa limit', 'Alert over limit', 'History kredit']],
    'erp/customer-followup'  => ['Follow Up Customer', 'Jadwal follow up dan reminder.', ['Tambah jadwal FU', 'Reminder otomatis', 'Status follow up', 'Laporan FU']],
    'erp/whatsapp-blast'     => ['WhatsApp Blast', 'Kirim pesan massal via WhatsApp.', ['Pilih penerima', 'Template pesan', 'Jadwal blast', 'Statistik pengiriman']],
    'erp/payment-reminder'   => ['Reminder Pembayaran', 'Reminder otomatis untuk piutang jatuh tempo.', ['Setup reminder', 'Template reminder', 'Log pengiriman', 'Statistik reminder']],
    'erp/customer-complaint' => ['Customer Complaint', 'Manajemen keluhan customer.', ['Catat keluhan', 'Assign to team', 'Status penanganan', 'SLA monitoring']],
    'erp/chatbot-ai'         => ['Chatbot AI', 'Chatbot AI untuk customer service.', ['Auto-reply WA', 'FAQ otomatis', 'Escalate ke CS', 'Statistik chatbot']],
    'erp/customer-history'   => ['Customer History', 'Riwayat lengkap interaksi customer.', ['Riwayat order', 'Riwayat pembayaran', 'Riwayat komunikasi', 'Customer timeline']],
    // Delivery extended
    'erp/delivery-note'      => ['Surat Jalan', 'Buat dan kelola surat jalan.', ['Buat surat jalan', 'Status pengiriman', 'Tanda terima', 'Arsip surat jalan']],
    'erp/tracking'           => ['Tracking Pengiriman', 'Real-time tracking posisi pengiriman.', ['Map tracking', 'Status real-time', 'ETA estimation', 'Notifikasi customer']],
    'erp/fleet'              => ['Armada', 'Manajemen kendaraan armada pengiriman.', ['Data kendaraan', 'Status kendaraan', 'Perawatan kendaraan', 'Biaya operasional']],
    'erp/drivers'            => ['Data Driver', 'Database lengkap driver pengiriman.', ['Profil driver', 'Lisensi SIM', 'Performa driver', 'Penugasan area']],
    'erp/delivery-schedule'  => ['Jadwal Pengiriman', 'Perencanaan jadwal pengiriman harian.', ['Jadwal per driver', 'Rute optimal', 'Load balancing', 'Konfirmasi jadwal']],
    // Marketplace Dashboard — erp/marketplace-overview and erp/marketplace-sync handled by dedicated routes
    'erp/marketplace-mapping'        => ['Mapping Produk Marketplace', 'Pemetaan produk ERP ke marketplace.', ['Map per platform', 'Bulk mapping', 'Validasi mapping', 'Laporan mapping']],
    'erp/marketplace-warehouse-mapping' => ['Mapping Gudang Marketplace', 'Pemetaan gudang ke marketplace.', ['Map gudang Shopee', 'Map gudang TikTok', 'Map gudang Tokopedia', 'Map gudang Lazada']],
    'erp/marketplace-price-mapping'  => ['Mapping Harga Marketplace', 'Aturan harga per marketplace.', ['Harga dasar', 'Markup per platform', 'Harga promo', 'Sync harga otomatis']],
    'erp/multi-channel-order'        => ['Multi Channel Order', 'Kelola order dari semua marketplace.', ['Order masuk semua platform', 'Filter per platform', 'Proses massal', 'Status tracking']],
    'erp/multi-channel-chat'         => ['Multi Channel Chat', 'Chat terpadu dari semua marketplace.', ['Inbox terpadu', 'Template balasan', 'AI reply', 'SLA monitoring']],
    'erp/multi-channel-analytics'    => ['Multi Channel Analytics', 'Analitik terpadu semua marketplace.', ['Performa per platform', 'Trend penjualan', 'Margin per platform', 'Produk terlaris']],
    'erp/multi-channel-shipping'     => ['Multi Channel Shipping', 'Kelola pengiriman semua marketplace.', ['Print label massal', 'Pickup request', 'Tracking massal', 'Biaya kirim']],
    'erp/multi-channel-return'       => ['Multi Channel Return', 'Manajemen retur semua marketplace.', ['Retur masuk', 'Proses retur', 'Refund tracking', 'Laporan retur']],
    'erp/multi-channel-voucher'      => ['Multi Channel Voucher', 'Voucher untuk semua marketplace.', ['Buat voucher', 'Sync voucher', 'Performa voucher', 'Ekspirasi']],
    'erp/multi-channel-customer'     => ['Multi Channel Customer', 'CRM marketplace terpadu.', ['Database pembeli', 'Repeat buyer', 'Customer value', 'Segmentasi']],
    'erp/marketplace-realtime'       => ['Marketplace Realtime Dashboard', 'Monitor marketplace secara real-time.', ['Order masuk real-time', 'Notifikasi penting', 'Alert stok', 'Revenue real-time']],
    'erp/marketplace-performance'    => ['Marketplace Performance', 'Laporan performa toko marketplace.', ['Shop score', 'Rating toko', 'Response rate', 'Penalty alert']],
    'erp/marketplace-profit'         => ['Marketplace Profit Analytics', 'Analisis profit per marketplace.', ['Gross profit', 'Net profit setelah fee', 'Margin per produk', 'Perbandingan platform']],
    'erp/marketplace-fee-report'     => ['Marketplace Fee Report', 'Laporan biaya marketplace.', ['Admin fee', 'Layanan fee', 'Ongkir subsidi', 'Total biaya']],
    'erp/marketplace-settlement'     => ['Marketplace Settlement', 'Rekonsiliasi settlement marketplace.', ['Settlement per periode', 'Matching pembayaran', 'Selisih settlement', 'Laporan settlement']],
    'erp/marketplace-cod'            => ['Marketplace COD Monitoring', 'Monitor pesanan COD.', ['COD pending', 'COD selesai', 'COD gagal', 'Remittance COD']],
    'erp/marketplace-return'         => ['Marketplace Return Management', 'Kelola retur dari semua marketplace.', ['Return request', 'Approve/reject', 'Refund tracking', 'Laporan retur']],
    'erp/marketplace-dispute'        => ['Marketplace Dispute Center', 'Kelola sengketa/dispute marketplace.', ['Dispute aktif', 'Upload bukti', 'Status dispute', 'Laporan dispute']],
    'erp/marketplace-notification'   => ['Marketplace Notification Center', 'Pusat notifikasi marketplace.', ['Notifikasi order', 'Alert stok', 'Notifikasi rating', 'Push notification']],
    'erp/marketplace-logs'           => ['Marketplace Activity Logs', 'Log aktivitas marketplace.', ['Log API call', 'Log sync', 'Log error', 'Filter per platform']],
    'erp/marketplace-errors'         => ['Marketplace Error Logs', 'Log error marketplace.', ['Error API', 'Sync failed', 'Retry otomatis', 'Alert error kritis']],
    'erp/marketplace-scheduler'      => ['Marketplace Scheduler', 'Jadwal otomatis sinkronisasi.', ['Jadwal sync stok', 'Jadwal sync harga', 'Jadwal export', 'Cron job manager']],
    'erp/marketplace-auto-sync'      => ['Marketplace Auto Sync', 'Sinkronisasi otomatis berkelanjutan.', ['Auto sync stok', 'Trigger sync', 'Interval setting', 'Log auto sync']],
    'erp/marketplace-api-monitor'    => ['Marketplace API Monitoring', 'Monitor status API marketplace.', ['API health check', 'Response time', 'Error rate', 'Quota API']],
    'erp/marketplace-chat-ai'        => ['Marketplace Chat AI', 'AI untuk chat marketplace.', ['Auto reply cerdas', 'Template AI', 'Sentiment analysis', 'Eskalasi otomatis']],
    'erp/marketplace-auto-reply'     => ['Marketplace Auto Reply', 'Balasan otomatis chat marketplace.', ['Template per platform', 'Jam aktif', 'Keyword trigger', 'Statistik reply']],
    'erp/marketplace-broadcast'      => ['Marketplace Broadcast', 'Broadcast pesan ke pembeli.', ['Broadcast Shopee', 'Broadcast TikTok', 'Segmentasi penerima', 'Jadwal broadcast']],
    'erp/marketplace-campaign'       => ['Marketplace Campaign', 'Manajemen kampanye promosi.', ['Ikut campaign platform', 'Budget campaign', 'Performa campaign', 'ROI campaign']],
    'erp/marketplace-flashsale'      => ['Marketplace Flash Sale', 'Manajemen flash sale.', ['Daftar flash sale', 'Setup produk FS', 'Monitor FS real-time', 'Laporan flash sale']],
    'erp/marketplace-voucher-center' => ['Marketplace Voucher Center', 'Pusat manajemen voucher.', ['Voucher Shopee', 'Voucher TikTok', 'Voucher Tokopedia', 'Voucher Lazada']],
    'erp/marketplace-pickup'         => ['Marketplace Pickup Request', 'Request pickup semua marketplace.', ['Bulk pickup request', 'Jadwal pickup', 'Konfirmasi kurir', 'Tracking pickup']],
    'erp/marketplace-label'          => ['Marketplace Shipping Label', 'Print label pengiriman massal.', ['Print label Shopee', 'Print label TikTok', 'Bulk print', 'Label custom']],
    'erp/marketplace-sla'            => ['Marketplace SLA Monitoring', 'Monitor SLA pengiriman.', ['SLA per platform', 'Alert SLA breach', 'Laporan ketepatan', 'Penalty detection']],
    'erp/marketplace-finance-sync'   => ['Marketplace Finance Sync', 'Sinkronisasi keuangan marketplace.', ['Sync ke akuntansi', 'Pembukuan otomatis', 'Laporan keuangan MP', 'Rekonsiliasi']],
    'erp/marketplace-crm'            => ['Marketplace Omnichannel CRM', 'CRM terpadu untuk semua marketplace.', ['Database pembeli', 'Purchase history', 'Segmentasi', 'Loyalty program']],
    'erp/marketplace-ai-analytics'   => ['Marketplace AI Analytics', 'AI analytics untuk marketplace.', ['Prediksi penjualan', 'Rekomendasi harga', 'Trend produk', 'Kompetitor analysis']],
    'erp/marketplace-tv'             => ['Marketplace Dashboard TV', 'Dashboard TV untuk monitoring real-time.', ['Tampilan TV mode', 'Fullscreen dashboard', 'Auto refresh', 'Multi platform view']],
    // Service Center
    'erp/sparepart'          => ['Sparepart', 'Manajemen sparepart untuk servis.', ['Database sparepart', 'Stok sparepart', 'Harga sparepart', 'Ketersediaan']],
    'erp/technician'         => ['Teknisi', 'Manajemen teknisi servis.', ['Data teknisi', 'Spesialisasi', 'Jadwal teknisi', 'Performa teknisi']],
    'erp/service-schedule'   => ['Jadwal Service', 'Jadwal perbaikan dan servis.', ['Booking servis', 'Antrian servis', 'Estimasi selesai', 'Notifikasi customer']],
    'erp/service-history'    => ['Riwayat Service', 'Riwayat lengkap servis barang.', ['History per barang', 'History per customer', 'Biaya servis', 'Laporan servis']],
    // Reports extended
    'erp/report-purchase'    => ['Laporan Pembelian', 'Analisis data pembelian ke supplier.', ['Total pembelian', 'Per supplier', 'Per produk', 'Trend pembelian']],
    'erp/report-inventory'   => ['Laporan Inventori', 'Laporan lengkap kondisi inventori.', ['Nilai inventory', 'Fast/slow moving', 'Stok kritis', 'Perputaran stok']],
    'erp/report-tax'         => ['Laporan Pajak', 'Laporan pajak komprehensif.', ['PPN masukan/keluaran', 'PPh per periode', 'Rekap pajak', 'Export SPT']],
    'erp/profit-product'     => ['Profit Produk', 'Analisis profit per produk.', ['HPP per produk', 'Margin per produk', 'Kontribusi profit', 'Top profitable product']],
    'erp/profit-branch'      => ['Profit Cabang', 'Analisis profit per cabang.', ['Revenue per cabang', 'Cost per cabang', 'Net profit', 'Ranking cabang']],
    'erp/sales-trend'        => ['Trend Penjualan', 'Tren dan pola penjualan.', ['Daily/weekly/monthly trend', 'Seasonal pattern', 'Prediksi penjualan', 'Grafik interaktif']],
    'erp/export-pdf'         => ['Export PDF', 'Export laporan ke format PDF.', ['Pilih laporan', 'Kustomisasi layout', 'Download PDF', 'Email laporan']],
    'erp/export-excel'       => ['Export Excel', 'Export data ke format Excel.', ['Pilih data', 'Format Excel', 'Download xlsx', 'Auto schedule export']],
    // AI extended
    'erp/approval-workflow'  => ['Approval Workflow', 'Workflow approval yang dapat dikustomisasi.', ['Design workflow', 'Multi level approval', 'Notifikasi approver', 'Tracking status']],
    'erp/auto-reminder'      => ['Auto Reminder', 'Reminder otomatis untuk berbagai event.', ['Reminder jatuh tempo', 'Reminder follow up', 'Template reminder', 'Log reminder']],
    'erp/auto-sync'          => ['Auto Sync Marketplace', 'Sinkronisasi otomatis ke marketplace.', ['Sync real-time', 'Trigger based sync', 'Conflict resolution', 'Log sinkronisasi']],
    'erp/forecasting'        => ['Smart Forecasting', 'Prediksi cerdas berbasis AI.', ['Prediksi demand', 'Forecast penjualan', 'Recommendation engine', 'Akurasi prediksi']],
    // HRD extended
    'erp/incentive'          => ['Bonus & Insentif', 'Manajemen bonus dan insentif karyawan.', ['Perhitungan bonus', 'Insentif penjualan', 'Komisi tim', 'Laporan insentif']],
    'erp/division'           => ['Divisi', 'Manajemen divisi dan departemen.', ['Daftar divisi', 'Struktur organisasi', 'Budget divisi', 'KPI divisi']],
    'erp/work-schedule'      => ['Jadwal Kerja', 'Manajemen jadwal kerja karyawan.', ['Jadwal shift', 'Jadwal piket', 'Cuti & izin', 'Lembur']],
    'erp/login-activity'     => ['Login Activity', 'Monitoring aktivitas login user.', ['Log login', 'Perangkat login', 'Lokasi login', 'Suspicious activity']],
    'erp/device-management'  => ['Device Management', 'Manajemen perangkat yang digunakan.', ['Daftar perangkat', 'Revoke akses', 'Device trust', 'Aktivitas per perangkat']],
    // System extended
    'erp/integration/kledo'        => ['Kledo API', 'Konfigurasi integrasi Kledo.', ['API key setup', 'Sinkronisasi data', 'Mapping akun', 'Log sinkronisasi']],
    'erp/integration/accurate'     => ['Accurate API', 'Konfigurasi integrasi Accurate.', ['Setup koneksi', 'Sinkronisasi jurnal', 'Mapping COA', 'Status integrasi']],
    'erp/integration/shopee'       => ['Shopee API', 'Konfigurasi integrasi Shopee.', ['App ID & Secret', 'OAuth token', 'Webhook setup', 'Test koneksi']],
    'erp/integration/whatsapp'     => ['WhatsApp API', 'Konfigurasi integrasi WhatsApp.', ['Fonnte token', 'Template pesan', 'Webhook WA', 'Test kirim WA']],
    'erp/integration/telegram'     => ['Telegram Bot', 'Konfigurasi bot Telegram.', ['Bot token', 'Chat ID', 'Notifikasi via Telegram', 'Command bot']],
    'erp/integration/google-sheet' => ['Google Sheets', 'Integrasi dengan Google Sheets.', ['Authorize Google', 'Sheet ID', 'Auto export', 'Sync jadwal']],
    'erp/company-profile'          => ['Profil Perusahaan', 'Data dan informasi perusahaan.', ['Nama perusahaan', 'Alamat', 'Logo', 'Info pajak NPWP']],
    'erp/document-numbering'       => ['Penomoran Dokumen', 'Konfigurasi format nomor dokumen.', ['Format invoice', 'Format PO', 'Format DO', 'Reset counter']],
    'erp/sync'                     => ['Sinkronisasi', 'Sinkronisasi data antar sistem.', ['Sync manual', 'Status sync', 'Conflict resolution', 'Log sync']],
    'erp/theme'                    => ['Tema & Tampilan', 'Kustomisasi tampilan sistem.', ['Dark mode', 'Warna tema', 'Layout setting', 'Font size']],
    'erp/backup'                   => ['Backup System', 'Sistem backup otomatis.', ['Auto backup', 'Restore point', 'Download backup', 'Jadwal backup']],
];
foreach ($extraComingSoon as $path => [$title, $description, $features]) {
    Route::get('/' . $path, function() use ($title, $description, $features) {
        return view('erp.coming-soon', compact('title', 'description', 'features'));
    });
}

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVATED ERP MODULES — override coming-soon routes (last-registered wins)
// ══════════════════════════════════════════════════════════════════════════════

// ── Dashboard (dihapus duplikat — gunakan /erp/dashboard)
Route::get('/erp/multi-branch-analytics', fn() => view('erp.crud', [
    'title'=>'Multi Branch Analytics','description'=>'Analisa performa seluruh cabang','module'=>'multi-branch-analytics',
    'formFields'=>[['name'=>'cabang','label'=>'Cabang','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'profit','label'=>'Profit','type'=>'number','format'=>'currency'],['name'=>'total_order','label'=>'Total Order','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Sales Flow ─────────────────────────────────────────────────────────────
Route::get('/erp/sales-order', fn() => view('erp.crud', [
    'title'=>'Sales Order','description'=>'Manajemen sales order pelanggan','module'=>'sales-order',
    'formFields'=>[['name'=>'nomor','label'=>'No SO','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'total','label'=>'Total','type'=>'number','format'=>'currency'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Diproses','Dikirim','Selesai','Dibatalkan']]],
    'filterOptions'=>['Draft','Diproses','Dikirim','Selesai','Dibatalkan'],
]));
Route::get('/erp/delivery-order', fn() => view('erp.crud', [
    'title'=>'Delivery Order','description'=>'Manajemen surat pengiriman','module'=>'delivery-order',
    'formFields'=>[['name'=>'nomor','label'=>'No DO','type'=>'text','required'=>true],['name'=>'sales_order','label'=>'No SO','type'=>'text'],['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Menunggu','Dalam Perjalanan','Terkirim','Gagal']]],
    'filterOptions'=>['Menunggu','Dalam Perjalanan','Terkirim','Gagal'],
]));
Route::get('/erp/order-tracking', fn() => view('erp.crud', [
    'title'=>'Tracking Status Order','description'=>'Pantau status pengiriman order','module'=>'order-tracking',
    'formFields'=>[['name'=>'nomor_order','label'=>'No Order','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'lokasi','label'=>'Lokasi Terakhir','type'=>'text'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Menunggu','Diproses','Dikirim','Terkirim','Gagal']]],
    'filterOptions'=>['Menunggu','Diproses','Dikirim','Terkirim','Gagal'],
]));
Route::get('/erp/sales-target', fn() => view('erp.crud', [
    'title'=>'Sales Target','description'=>'Target penjualan per sales per periode','module'=>'sales-target',
    'formFields'=>[['name'=>'sales','label'=>'Nama Sales','type'=>'text','required'=>true],['name'=>'bulan','label'=>'Bulan','type'=>'text','required'=>true],['name'=>'tahun','label'=>'Tahun','type'=>'number','default'=>date('Y')],['name'=>'target_rp','label'=>'Target (Rp)','type'=>'number','format'=>'currency'],['name'=>'target_order','label'=>'Target Order','type'=>'number'],['name'=>'realisasi','label'=>'Realisasi (Rp)','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Berjalan','Selesai','Melebihi Target']]],
]));
Route::get('/erp/sales-commission', fn() => view('erp.crud', [
    'title'=>'Komisi Sales','description'=>'Perhitungan dan tracking komisi sales','module'=>'sales-commission',
    'formFields'=>[['name'=>'sales','label'=>'Nama Sales','type'=>'text','required'=>true],['name'=>'bulan','label'=>'Bulan','type'=>'text'],['name'=>'tahun','label'=>'Tahun','type'=>'number'],['name'=>'total_penjualan','label'=>'Total Penjualan','type'=>'number','format'=>'currency'],['name'=>'persen_komisi','label'=>'% Komisi','type'=>'number'],['name'=>'komisi','label'=>'Komisi (Rp)','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Disetujui','Dibayar']]],
    'filterOptions'=>['Pending','Disetujui','Dibayar'],
]));
Route::get('/erp/sales-receivable', fn() => view('erp.crud', [
    'title'=>'Piutang Penjualan','description'=>'Monitor piutang dari pelanggan','module'=>'sales-receivable',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Jatuh Tempo','Cicilan']]],
    'filterOptions'=>['Belum Lunas','Lunas','Jatuh Tempo'],
]));
Route::get('/erp/membership', fn() => view('erp.crud', [
    'title'=>'Membership Customer','description'=>'Program membership dan loyalitas pelanggan','module'=>'membership',
    'formFields'=>[['name'=>'nama','label'=>'Nama Member','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'level','label'=>'Level','type'=>'select','options'=>['Silver','Gold','Platinum']],['name'=>'poin','label'=>'Poin','type'=>'number','default'=>0],['name'=>'total_belanja','label'=>'Total Belanja','type'=>'number','format'=>'currency'],['name'=>'bergabung','label'=>'Tgl Bergabung','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/installment', fn() => view('erp.crud', [
    'title'=>'Cicilan','description'=>'Manajemen penjualan cicilan','module'=>'installment',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'total','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'dp','label'=>'DP','type'=>'number','format'=>'currency'],['name'=>'angsuran','label'=>'Angsuran/Bulan','type'=>'number','format'=>'currency'],['name'=>'tenor','label'=>'Tenor (bulan)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Berjalan','Lunas','Macet']]],
    'filterOptions'=>['Berjalan','Lunas','Macet'],
]));
Route::get('/erp/installment-due', fn() => view('erp.crud', [
    'title'=>'Cicilan Jatuh Tempo','description'=>'Cicilan yang akan/sudah jatuh tempo','module'=>'installment-due',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_angsuran','label'=>'Angsuran Ke','type'=>'number'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Terlambat']]],
    'filterOptions'=>['Belum Lunas','Lunas','Terlambat'],
]));

// ── Inventory ──────────────────────────────────────────────────────────────
Route::get('/erp/stock-mutation', fn() => view('erp.crud', [
    'title'=>'Mutasi Stok','description'=>'Riwayat pergerakan stok produk','module'=>'stock-mutation',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar','Transfer','Penyesuaian']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
    'filterOptions'=>['Masuk','Keluar','Transfer','Penyesuaian'],
]));
Route::get('/erp/warehouse-transfer', fn() => view('erp.crud', [
    'title'=>'Transfer Antar Gudang','description'=>'Pindah stok antar gudang','module'=>'warehouse-transfer',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'dari','label'=>'Dari Gudang','type'=>'text','required'=>true],['name'=>'ke','label'=>'Ke Gudang','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Diproses','Selesai']]],
]));
Route::get('/erp/min-stock', fn() => view('erp.crud', [
    'title'=>'Min Stock Alert','description'=>'Produk dengan stok di bawah minimum','module'=>'min-stock',
    'formFields'=>[['name'=>'produk','label'=>'Nama Produk','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'stok_minimum','label'=>'Stok Minimum','type'=>'number'],['name'=>'stok_sekarang','label'=>'Stok Sekarang','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Rendah','Kritis']]],
    'filterOptions'=>['Normal','Rendah','Kritis'],
]));
Route::get('/erp/serial-number', fn() => view('erp.crud', [
    'title'=>'Serial Number / IMEI','description'=>'Tracking serial number produk','module'=>'serial-number',
    'formFields'=>[['name'=>'serial','label'=>'Serial Number','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'tanggal_masuk','label'=>'Tgl Masuk','type'=>'date'],['name'=>'customer','label'=>'Customer (jika terjual)','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Tersedia','Terjual','Retur','Rusak']]],
    'filterOptions'=>['Tersedia','Terjual','Retur','Rusak'],
]));
Route::get('/erp/product-batch', fn() => view('erp.crud', [
    'title'=>'Batch Produk','description'=>'Tracking batch dan expired date produk','module'=>'product-batch',
    'formFields'=>[['name'=>'nomor_batch','label'=>'No Batch','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'tanggal_produksi','label'=>'Tgl Produksi','type'=>'date'],['name'=>'expired_date','label'=>'Expired Date','type'=>'date'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Kadaluarsa','Habis']]],
    'filterOptions'=>['Aktif','Kadaluarsa','Habis'],
]));
Route::get('/erp/stock-history', fn() => view('erp.crud', [
    'title'=>'History Pergerakan Stok','description'=>'Log lengkap pergerakan stok','module'=>'stock-history',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar','Transfer','Penyesuaian','Retur']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'stok_sebelum','label'=>'Stok Sebelum','type'=>'number'],['name'=>'stok_sesudah','label'=>'Stok Sesudah','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));
Route::get('/erp/stock-adjustment', fn() => view('erp.crud', [
    'title'=>'Penyesuaian Stok','description'=>'Koreksi stok fisik vs sistem','module'=>'stock-adjustment',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'stok_sistem','label'=>'Stok Sistem','type'=>'number'],['name'=>'stok_fisik','label'=>'Stok Fisik','type'=>'number'],['name'=>'selisih','label'=>'Selisih','type'=>'number'],['name'=>'alasan','label'=>'Alasan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Disetujui','Dibatalkan']]],
]));
Route::get('/erp/stock-card', fn() => view('erp.crud', [
    'title'=>'Kartu Stok','description'=>'Kartu stok per produk','module'=>'stock-card',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'stok_awal','label'=>'Stok Awal','type'=>'number','default'=>0],['name'=>'masuk','label'=>'Total Masuk','type'=>'number','default'=>0],['name'=>'keluar','label'=>'Total Keluar','type'=>'number','default'=>0],['name'=>'stok_akhir','label'=>'Stok Akhir','type'=>'number','default'=>0]],
]));
Route::get('/erp/inventory-value', fn() => view('erp.crud', [
    'title'=>'Nilai Persediaan','description'=>'Nilai total persediaan barang','module'=>'inventory-value',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'jumlah','label'=>'Jumlah Stok','type'=>'number'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'harga_rata','label'=>'Harga Rata-Rata','type'=>'number','format'=>'currency'],['name'=>'nilai_total','label'=>'Nilai Total','type'=>'number','format'=>'currency'],['name'=>'metode','label'=>'Metode','type'=>'select','options'=>['FIFO','LIFO','Average']]],
]));
Route::get('/erp/fast-moving', fn() => view('erp.crud', [
    'title'=>'Fast Moving Item','description'=>'Produk dengan perputaran stok cepat','module'=>'fast-moving',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'total_keluar','label'=>'Total Keluar','type'=>'number'],['name'=>'frekuensi','label'=>'Frekuensi Terjual','type'=>'number'],['name'=>'hari_rata','label'=>'Hari Rata Habis','type'=>'number'],['name'=>'perputaran','label'=>'Perputaran/Tahun','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Fast Moving','Normal','Slow Moving']]],
]));
Route::get('/erp/slow-moving', fn() => view('erp.crud', [
    'title'=>'Slow Moving Item','description'=>'Produk dengan perputaran stok lambat','module'=>'slow-moving',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'stok_sekarang','label'=>'Stok Sekarang','type'=>'number'],['name'=>'total_keluar','label'=>'Total Keluar 3 Bulan','type'=>'number'],['name'=>'hari_tidak_terjual','label'=>'Hari Tidak Terjual','type'=>'number'],['name'=>'nilai_tertahan','label'=>'Nilai Tertahan','type'=>'number','format'=>'currency'],['name'=>'rekomendasi','label'=>'Rekomendasi','type'=>'select','options'=>['Diskon','Bundling','Retur ke Supplier','Hapus']]],
]));
Route::get('/erp/sku', fn() => view('erp.crud', [
    'title'=>'SKU Produk','description'=>'Manajemen kode SKU produk','module'=>'sku',
    'formFields'=>[['name'=>'kode_sku','label'=>'Kode SKU','type'=>'text','required'=>true],['name'=>'produk','label'=>'Nama Produk','type'=>'text'],['name'=>'barcode','label'=>'Barcode','type'=>'text'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/barcode', fn() => view('erp.crud', [
    'title'=>'Barcode Produk','description'=>'Generate dan kelola barcode produk','module'=>'barcode',
    'formFields'=>[['name'=>'kode','label'=>'Kode Barcode','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['EAN-13','QR Code','Code 128','Code 39']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/multi-warehouse', fn() => view('erp.crud', [
    'title'=>'Multi Gudang','description'=>'Manajemen beberapa lokasi gudang','module'=>'multi-warehouse',
    'formFields'=>[['name'=>'nama','label'=>'Nama Gudang','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'lokasi','label'=>'Lokasi','type'=>'textarea'],['name'=>'kapasitas','label'=>'Kapasitas (unit)','type'=>'number'],['name'=>'manager','label'=>'Penanggung Jawab','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/rack', fn() => view('erp.crud', [
    'title'=>'Rak Gudang','description'=>'Manajemen rak dan lokasi penyimpanan','module'=>'rack',
    'formFields'=>[['name'=>'nama','label'=>'Nama Rak','type'=>'text','required'=>true],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'baris','label'=>'Baris','type'=>'text'],['name'=>'kolom','label'=>'Kolom','type'=>'text'],['name'=>'kapasitas','label'=>'Kapasitas','type'=>'number'],['name'=>'terisi','label'=>'Terisi','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Tersedia','Penuh','Non-Aktif']]],
]));
Route::get('/erp/production', fn() => view('erp.crud', [
    'title'=>'Produksi','description'=>'Work order dan manajemen produksi','module'=>'production',
    'formFields'=>[['name'=>'nomor_wo','label'=>'No Work Order','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk Jadi','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Target','type'=>'number'],['name'=>'mulai','label'=>'Tgl Mulai','type'=>'date'],['name'=>'selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'biaya_produksi','label'=>'Biaya Produksi','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Berjalan','Selesai','Dibatalkan']]],
    'filterOptions'=>['Draft','Berjalan','Selesai','Dibatalkan'],
]));
Route::get('/erp/assembly', fn() => view('erp.crud', [
    'title'=>'Perakitan Barang','description'=>'Proses assembly/perakitan produk','module'=>'assembly',
    'formFields'=>[['name'=>'nomor','label'=>'No Assembly','type'=>'text','required'=>true],['name'=>'produk_jadi','label'=>'Produk Jadi','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'biaya','label'=>'Biaya','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Proses','Selesai']]],
]));
Route::get('/erp/production-formula', fn() => view('erp.crud', [
    'title'=>'Formula Produksi','description'=>'Bill of materials dan formula produk','module'=>'production-formula',
    'formFields'=>[['name'=>'nama','label'=>'Nama Formula','type'=>'text','required'=>true],['name'=>'produk_jadi','label'=>'Produk Jadi','type'=>'text'],['name'=>'komponen','label'=>'Komponen Bahan','type'=>'textarea'],['name'=>'jumlah_bahan','label'=>'Jumlah Bahan','type'=>'text'],['name'=>'hasil','label'=>'Hasil Produksi','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Master Data ────────────────────────────────────────────────────────────
Route::get('/erp/product-categories', fn() => view('erp.crud', [
    'title'=>'Kategori Produk','description'=>'Master data kategori produk','module'=>'product-categories',
    'formFields'=>[['name'=>'nama','label'=>'Nama Kategori','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'parent','label'=>'Kategori Induk','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/brands', fn() => view('erp.crud', [
    'title'=>'Brand Produk','description'=>'Master data brand/merek produk','module'=>'brands',
    'formFields'=>[['name'=>'nama','label'=>'Nama Brand','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'pic','label'=>'PIC/Contact','type'=>'text'],['name'=>'negara_asal','label'=>'Negara Asal','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/units', fn() => view('erp.crud', [
    'title'=>'Satuan Barang','description'=>'Master data satuan ukuran produk','module'=>'units',
    'formFields'=>[['name'=>'nama','label'=>'Nama Satuan','type'=>'text','required'=>true],['name'=>'singkatan','label'=>'Singkatan','type'=>'text'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/salesman', fn() => view('erp.crud', [
    'title'=>'Data Salesman','description'=>'Master data salesman dan area','module'=>'salesman',
    'formFields'=>[['name'=>'nama','label'=>'Nama Salesman','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'email','label'=>'Email','type'=>'email'],['name'=>'area','label'=>'Area Tugas','type'=>'text'],['name'=>'target_bulanan','label'=>'Target Bulanan','type'=>'number','format'=>'currency'],['name'=>'komisi_persen','label'=>'% Komisi','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/branches', fn() => view('erp.crud', [
    'title'=>'Data Cabang','description'=>'Master data cabang dan lokasi','module'=>'branches',
    'formFields'=>[['name'=>'nama','label'=>'Nama Cabang','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'kota','label'=>'Kota','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'manager','label'=>'Manager','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/payment-methods', fn() => view('erp.crud', [
    'title'=>'Metode Pembayaran','description'=>'Master data metode pembayaran','module'=>'payment-methods',
    'formFields'=>[['name'=>'nama','label'=>'Nama Metode','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Tunai','Transfer','Kartu Debit','Kartu Kredit','E-Wallet','Giro','Cicilan']],['name'=>'biaya_admin','label'=>'Biaya Admin (%)','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/price-types', fn() => view('erp.crud', [
    'title'=>'Tipe Harga','description'=>'Multi price type untuk customer berbeda','module'=>'price-types',
    'formFields'=>[['name'=>'nama','label'=>'Nama Harga','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'margin_persen','label'=>'Margin (%)','type'=>'number'],['name'=>'diskon_persen','label'=>'Diskon (%)','type'=>'number','default'=>0],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/taxes', fn() => view('erp.crud', [
    'title'=>'Data Pajak','description'=>'Master data jenis pajak','module'=>'taxes',
    'formFields'=>[['name'=>'nama','label'=>'Nama Pajak','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'persentase','label'=>'Persentase (%)','type'=>'number'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['PPN','PPh 21','PPh 22','PPh 23','PPh 25','PPh Final']],['name'=>'akun_debet','label'=>'Akun Debet','type'=>'text'],['name'=>'akun_kredit','label'=>'Akun Kredit','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// ── Purchase ───────────────────────────────────────────────────────────────
Route::get('/erp/purchase-request', fn() => view('erp.crud', [
    'title'=>'Permintaan Pembelian','description'=>'Purchase request dari departemen','module'=>'purchase-request',
    'formFields'=>[['name'=>'nomor_pr','label'=>'No PR','type'=>'text','required'=>true],['name'=>'departemen','label'=>'Departemen','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi Kebutuhan','type'=>'textarea'],['name'=>'total_estimasi','label'=>'Total Estimasi','type'=>'number','format'=>'currency'],['name'=>'prioritas','label'=>'Prioritas','type'=>'select','options'=>['Rendah','Normal','Tinggi','Urgent']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Menunggu Approval','Disetujui','Ditolak']]],
    'filterOptions'=>['Draft','Menunggu Approval','Disetujui','Ditolak'],
]));
Route::get('/erp/purchase-approval', fn() => view('erp.crud', [
    'title'=>'Approval Purchase','description'=>'Persetujuan permintaan pembelian','module'=>'purchase-approval',
    'formFields'=>[['name'=>'nomor_pr','label'=>'No PR','type'=>'text','required'=>true],['name'=>'pemohon','label'=>'Pemohon','type'=>'text'],['name'=>'approver','label'=>'Approver','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'total','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'catatan','label'=>'Catatan Approver','type'=>'textarea'],['name'=>'status','label'=>'Keputusan','type'=>'select','options'=>['Menunggu','Disetujui','Ditolak','Revisi']]],
    'filterOptions'=>['Menunggu','Disetujui','Ditolak'],
]));
Route::get('/erp/supplier-invoice', fn() => view('erp.crud', [
    'title'=>'Invoice Supplier','description'=>'Invoice yang diterima dari supplier','module'=>'supplier-invoice',
    'formFields'=>[['name'=>'nomor','label'=>'No Invoice','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tgl Invoice','type'=>'date'],['name'=>'total','label'=>'Total','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Sebagian']]],
    'filterOptions'=>['Belum Lunas','Lunas','Sebagian'],
]));
Route::get('/erp/payable-due', fn() => view('erp.crud', [
    'title'=>'Hutang Jatuh Tempo','description'=>'Hutang yang sudah atau akan jatuh tempo','module'=>'payable-due',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Hutang','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'sisa_hari','label'=>'Sisa Hari','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Jatuh Tempo','Overdue','Lunas']]],
    'filterOptions'=>['Belum Lunas','Jatuh Tempo','Overdue'],
]));
Route::get('/erp/purchase-return', fn() => view('erp.crud', [
    'title'=>'Retur Pembelian','description'=>'Pengembalian barang ke supplier','module'=>'purchase-return',
    'formFields'=>[['name'=>'nomor','label'=>'No Retur','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'alasan','label'=>'Alasan Retur','type'=>'textarea'],['name'=>'total','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Proses','Diterima Supplier','Selesai']]],
]));
Route::get('/erp/pay-supplier', fn() => view('erp.crud', [
    'title'=>'Pembayaran Supplier','description'=>'Catat pembayaran hutang ke supplier','module'=>'pay-supplier',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Bayar','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Bayar','type'=>'date'],['name'=>'metode','label'=>'Metode','type'=>'select','options'=>['Transfer Bank','Tunai','Giro','E-Wallet']],['name'=>'rekening','label'=>'Rekening Tujuan','type'=>'text'],['name'=>'bukti','label'=>'No Bukti Bayar','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Terkirim','Dikonfirmasi']]],
]));
Route::get('/erp/supplier-analytics', fn() => view('erp.crud', [
    'title'=>'Analisa Supplier','description'=>'Performa dan analisa supplier','module'=>'supplier-analytics',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'total_po','label'=>'Total PO','type'=>'number'],['name'=>'total_nilai','label'=>'Total Nilai PO','type'=>'number','format'=>'currency'],['name'=>'on_time_persen','label'=>'On Time Delivery (%)','type'=>'number'],['name'=>'reject_persen','label'=>'Reject Rate (%)','type'=>'number'],['name'=>'rating','label'=>'Rating','type'=>'select','options'=>['A - Excellent','B - Good','C - Average','D - Poor']],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));

// ── Finance ────────────────────────────────────────────────────────────────
Route::get('/erp/cash-flow', fn() => view('erp.cash-flow'));
Route::get('/erp/main-cash', fn() => view('erp.crud', [
    'title'=>'Kas Besar','description'=>'Manajemen kas besar perusahaan','module'=>'main-cash',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'saldo','label'=>'Saldo','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
    'filterOptions'=>['Masuk','Keluar'],
]));
Route::get('/erp/petty-cash', fn() => view('erp.crud', [
    'title'=>'Kas Kecil','description'=>'Manajemen petty cash operasional','module'=>'petty-cash',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'bukti','label'=>'No Bukti','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
    'filterOptions'=>['Masuk','Keluar'],
]));
Route::get('/erp/electronic-cash', fn() => view('erp.crud', [
    'title'=>'Kas Elektronik','description'=>'Manajemen dompet digital dan e-wallet','module'=>'electronic-cash',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['GoPay','OVO','Dana','ShopeePay','LinkAja','Lainnya']],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
]));
Route::get('/erp/building-cash', fn() => view('erp.crud', [
    'title'=>'Kas Bangunan','description'=>'Kas untuk proyek dan bahan bangunan','module'=>'building-cash',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'proyek','label'=>'Proyek','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Masuk','Keluar']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
]));
Route::get('/erp/bank-account', fn() => view('erp.crud', [
    'title'=>'Rekening Bank','description'=>'Master data rekening bank perusahaan','module'=>'bank-account',
    'formFields'=>[['name'=>'nama_bank','label'=>'Nama Bank','type'=>'text','required'=>true],['name'=>'nomor_rekening','label'=>'No Rekening','type'=>'text','required'=>true],['name'=>'nama_pemilik','label'=>'Nama Pemilik','type'=>'text'],['name'=>'cabang','label'=>'Cabang Bank','type'=>'text'],['name'=>'saldo','label'=>'Saldo Awal','type'=>'number','format'=>'currency'],['name'=>'mata_uang','label'=>'Mata Uang','type'=>'select','options'=>['IDR','USD','SGD','EUR']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/bank-transfer', fn() => view('erp.crud', [
    'title'=>'Transfer Bank','description'=>'Catat transfer antar rekening bank','module'=>'bank-transfer',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'dari_rekening','label'=>'Dari Rekening','type'=>'text','required'=>true],['name'=>'ke_rekening','label'=>'Ke Rekening','type'=>'text','required'=>true],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'biaya_transfer','label'=>'Biaya Transfer','type'=>'number','default'=>0],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dikonfirmasi']]],
]));
Route::get('/erp/giro', fn() => view('erp.crud', [
    'title'=>'Giro / Cek','description'=>'Manajemen giro dan cek perusahaan','module'=>'giro',
    'formFields'=>[['name'=>'nomor','label'=>'No Giro/Cek','type'=>'text','required'=>true],['name'=>'bank','label'=>'Bank Penerbit','type'=>'text'],['name'=>'nominal','label'=>'Nominal','type'=>'number','format'=>'currency'],['name'=>'tanggal_terbit','label'=>'Tgl Terbit','type'=>'date'],['name'=>'tanggal_jatuh','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'penerima','label'=>'Penerima','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Cair','Sudah Cair','Dibatalkan','Bounced']]],
    'filterOptions'=>['Belum Cair','Sudah Cair','Dibatalkan','Bounced'],
]));
Route::get('/erp/account-payable', fn() => view('erp.crud', [
    'title'=>'Hutang Supplier','description'=>'Monitor hutang kepada supplier','module'=>'account-payable',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Hutang','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Invoice','type'=>'date'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Sebagian','Overdue']]],
    'filterOptions'=>['Belum Lunas','Lunas','Sebagian','Overdue'],
]));
Route::get('/erp/account-receivable', fn() => view('erp.crud', [
    'title'=>'Piutang Customer','description'=>'Monitor piutang dari pelanggan','module'=>'account-receivable',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Piutang','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Invoice','type'=>'date'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lunas','Lunas','Sebagian','Overdue']]],
    'filterOptions'=>['Belum Lunas','Lunas','Sebagian','Overdue'],
]));
Route::get('/erp/bank-reconciliation', fn() => view('erp.crud', [
    'title'=>'Rekonsiliasi Bank','description'=>'Rekonsiliasi buku besar vs rekening koran','module'=>'bank-reconciliation',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'rekening','label'=>'Rekening Bank','type'=>'text'],['name'=>'saldo_buku','label'=>'Saldo Buku','type'=>'number','format'=>'currency'],['name'=>'saldo_bank','label'=>'Saldo Rekening Koran','type'=>'number','format'=>'currency'],['name'=>'selisih','label'=>'Selisih','type'=>'number','format'=>'currency'],['name'=>'keterangan','label'=>'Keterangan Selisih','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Proses','Balance','Tidak Balance']]],
]));
Route::get('/erp/payment-gateway', fn() => view('erp.crud', [
    'title'=>'Payment Gateway','description'=>'Konfigurasi dan transaksi payment gateway','module'=>'payment-gateway',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['Midtrans','Xendit','Doku','Stripe','PayPal']],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'referensi','label'=>'No Referensi','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'biaya','label'=>'Biaya MDR','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Sukses','Pending','Gagal','Refund']]],
]));

// ── Accounting ─────────────────────────────────────────────────────────────
Route::get('/erp/balance-sheet', fn() => view('erp.balance-sheet'));
Route::get('/erp/trial-balance', fn() => view('erp.trial-balance'));
Route::get('/erp/journal', fn() => view('erp.crud', [
    'title'=>'Jurnal Umum','description'=>'Pencatatan jurnal transaksi harian','module'=>'journal',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'no_jurnal','label'=>'No Jurnal','type'=>'text','required'=>true],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea','required'=>true],['name'=>'akun_debet','label'=>'Akun Debet','type'=>'text'],['name'=>'akun_kredit','label'=>'Akun Kredit','type'=>'text'],['name'=>'nominal','label'=>'Nominal','type'=>'number','format'=>'currency'],['name'=>'referensi','label'=>'Referensi','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Posted','Void']]],
    'filterOptions'=>['Draft','Posted','Void'],
]));
Route::get('/erp/general-ledger', fn() => view('erp.crud', [
    'title'=>'Buku Besar','description'=>'Laporan buku besar per akun','module'=>'general-ledger',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'text','required'=>true],['name'=>'akun','label'=>'Akun','type'=>'text'],['name'=>'referensi','label'=>'Referensi','type'=>'text'],['name'=>'debet','label'=>'Debet','type'=>'number','format'=>'currency'],['name'=>'kredit','label'=>'Kredit','type'=>'number','format'=>'currency'],['name'=>'saldo','label'=>'Saldo','type'=>'number','format'=>'currency']],
]));
Route::get('/erp/opening-balance', fn() => view('erp.crud', [
    'title'=>'Saldo Awal','description'=>'Input saldo awal per akun saat mulai sistem','module'=>'opening-balance',
    'formFields'=>[['name'=>'akun','label'=>'Nama Akun','type'=>'text','required'=>true],['name'=>'kode_akun','label'=>'Kode Akun','type'=>'text'],['name'=>'saldo_debet','label'=>'Saldo Debet','type'=>'number','format'=>'currency'],['name'=>'saldo_kredit','label'=>'Saldo Kredit','type'=>'number','format'=>'currency'],['name'=>'tanggal','label'=>'Tgl Mulai','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));
Route::get('/erp/accounting-period', fn() => view('erp.crud', [
    'title'=>'Periode Akuntansi','description'=>'Manajemen periode tutup buku','module'=>'accounting-period',
    'formFields'=>[['name'=>'nama','label'=>'Nama Periode','type'=>'text','required'=>true],['name'=>'mulai','label'=>'Tgl Mulai','type'=>'date'],['name'=>'selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'tahun_fiskal','label'=>'Tahun Fiskal','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Buka','Tutup','Dalam Proses']]],
    'filterOptions'=>['Buka','Tutup'],
]));
Route::get('/erp/departments', fn() => view('erp.crud', [
    'title'=>'Departemen','description'=>'Master data departemen perusahaan','module'=>'departments',
    'formFields'=>[['name'=>'nama','label'=>'Nama Departemen','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'kepala','label'=>'Kepala Departemen','type'=>'text'],['name'=>'anggota','label'=>'Jumlah Anggota','type'=>'number','default'=>0],['name'=>'budget','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/projects', fn() => view('erp.crud', [
    'title'=>'Proyek','description'=>'Manajemen proyek dan cost center','module'=>'projects',
    'formFields'=>[['name'=>'nama','label'=>'Nama Proyek','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode Proyek','type'=>'text'],['name'=>'manager','label'=>'Project Manager','type'=>'text'],['name'=>'mulai','label'=>'Tgl Mulai','type'=>'date'],['name'=>'selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'budget','label'=>'Budget','type'=>'number','format'=>'currency'],['name'=>'realisasi','label'=>'Realisasi','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Perencanaan','Berjalan','Selesai','Ditunda']]],
    'filterOptions'=>['Perencanaan','Berjalan','Selesai','Ditunda'],
]));
Route::get('/erp/budgeting', fn() => view('erp.crud', [
    'title'=>'Budgeting','description'=>'Perencanaan dan monitoring anggaran','module'=>'budgeting',
    'formFields'=>[['name'=>'departemen','label'=>'Departemen','type'=>'text','required'=>true],['name'=>'akun','label'=>'Akun Biaya','type'=>'text'],['name'=>'tahun','label'=>'Tahun','type'=>'number','default'=>date('Y')],['name'=>'budget_tahunan','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'realisasi','label'=>'Realisasi','type'=>'number','format'=>'currency'],['name'=>'sisa','label'=>'Sisa Budget','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Disetujui','Aktif']]],
]));
Route::get('/erp/audit-transaction', fn() => view('erp.crud', [
    'title'=>'Audit Transaksi','description'=>'Audit trail semua transaksi keuangan','module'=>'audit-transaction',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'user','label'=>'User','type'=>'text'],['name'=>'aksi','label'=>'Aksi','type'=>'select','options'=>['Create','Update','Delete','Approve','Reject']],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'referensi','label'=>'No Referensi','type'=>'text'],['name'=>'nilai_lama','label'=>'Nilai Lama','type'=>'textarea'],['name'=>'nilai_baru','label'=>'Nilai Baru','type'=>'textarea']],
]));
Route::get('/erp/activity-timeline', fn() => view('erp.crud', [
    'title'=>'Activity Timeline','description'=>'Log aktivitas pengguna sistem','module'=>'activity-timeline',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'user','label'=>'User','type'=>'text','required'=>true],['name'=>'aktivitas','label'=>'Aktivitas','type'=>'text'],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'ip_address','label'=>'IP Address','type'=>'text'],['name'=>'device','label'=>'Device','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Sukses','Gagal']]],
]));
Route::get('/erp/approval-system', fn() => view('erp.crud', [
    'title'=>'Approval System','description'=>'Konfigurasi alur approval transaksi','module'=>'approval-system',
    'formFields'=>[['name'=>'nama','label'=>'Nama Workflow','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'select','options'=>['Purchase Request','Expense','Journal','Budget']],['name'=>'level','label'=>'Level Approval','type'=>'number','default'=>1],['name'=>'approver','label'=>'Approver','type'=>'text'],['name'=>'min_nilai','label'=>'Min Nilai','type'=>'number','format'=>'currency'],['name'=>'maks_nilai','label'=>'Maks Nilai','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/backup', fn() => view('erp.crud', [
    'title'=>'Backup System','description'=>'Manajemen backup data sistem','module'=>'backup',
    'formFields'=>[['name'=>'nama','label'=>'Nama Backup','type'=>'text','required'=>true],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Database','Files','Full System']],['name'=>'tanggal','label'=>'Tanggal Backup','type'=>'date'],['name'=>'ukuran','label'=>'Ukuran (MB)','type'=>'number'],['name'=>'lokasi','label'=>'Lokasi File','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Berhasil','Gagal','Sedang Proses']]],
    'filterOptions'=>['Berhasil','Gagal','Sedang Proses'],
]));

// ── Enterprise Features ────────────────────────────────────────────────────
Route::get('/erp/workflow-automation', fn() => view('erp.crud', [
    'title'=>'Workflow Automation','description'=>'Otomasi alur kerja bisnis','module'=>'workflow-automation',
    'formFields'=>[['name'=>'nama','label'=>'Nama Workflow','type'=>'text','required'=>true],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Approval','Notification','Task','Integration']],['name'=>'trigger','label'=>'Trigger','type'=>'text'],['name'=>'aksi','label'=>'Aksi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/multi-currency', fn() => view('erp.crud', [
    'title'=>'Multi Currency','description'=>'Manajemen multi mata uang','module'=>'multi-currency',
    'formFields'=>[['name'=>'kode','label'=>'Kode Mata Uang','type'=>'text','required'=>true],['name'=>'nama','label'=>'Nama Mata Uang','type'=>'text'],['name'=>'simbol','label'=>'Simbol','type'=>'text'],['name'=>'kurs','label'=>'Kurs ke IDR','type'=>'number'],['name'=>'tanggal_update','label'=>'Tgl Update Kurs','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/multi-branch-analytics', fn() => view('erp.crud', [
    'title'=>'Multi Branch Analytics','description'=>'Analitik performa multi cabang','module'=>'multi-branch-analytics',
    'formFields'=>[['name'=>'cabang','label'=>'Cabang','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'profit','label'=>'Profit','type'=>'number','format'=>'currency'],['name'=>'total_order','label'=>'Total Order','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));
Route::get('/erp/api-public', fn() => view('erp.crud', [
    'title'=>'API Public','description'=>'Manajemen API publik untuk integrasi','module'=>'api-public',
    'formFields'=>[['name'=>'nama','label'=>'Nama API','type'=>'text','required'=>true],['name'=>'endpoint','label'=>'Endpoint','type'=>'text'],['name'=>'metode','label'=>'Metode','type'=>'select','options'=>['GET','POST','PUT','DELETE']],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/webhook', fn() => view('erp.crud', [
    'title'=>'Webhook','description'=>'Konfigurasi webhook untuk notifikasi','module'=>'webhook',
    'formFields'=>[['name'=>'nama','label'=>'Nama Webhook','type'=>'text','required'=>true],['name'=>'url','label'=>'URL Endpoint','type'=>'text'],['name'=>'event','label'=>'Event','type'=>'select','options'=>['Order Created','Payment Received','Stock Low','Customer Registered']],['name'=>'format','label'=>'Format','type'=>'select','options'=>['JSON','XML']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/document-numbering', fn() => view('erp.crud', [
    'title'=>'Document Numbering','description'=>'Konfigurasi format penomoran dokumen','module'=>'document-numbering',
    'formFields'=>[['name'=>'tipe_dokumen','label'=>'Tipe Dokumen','type'=>'select','options'=>['Invoice','PO','SO','DO','Payment']],['name'=>'prefix','label'=>'Prefix','type'=>'text'],['name'=>'format','label'=>'Format','type'=>'text'],['name'=>'counter','label'=>'Counter Saat Ini','type'=>'number'],['name'=>'reset_tahunan','label'=>'Reset Tahunan','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/theme', fn() => view('erp.crud', [
    'title'=>'Theme & Appearance','description'=>'Kustomisasi tampilan sistem','module'=>'theme',
    'formFields'=>[['name'=>'nama','label'=>'Nama Theme','type'=>'text','required'=>true],['name'=>'warna_primary','label'=>'Warna Primary','type'=>'color'],['name'=>'warna_secondary','label'=>'Warna Secondary','type'=>'color'],['name'=>'font_family','label'=>'Font Family','type'=>'text'],['name'=>'dark_mode','label'=>'Dark Mode','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/sync', fn() => view('erp.crud', [
    'title'=>'Data Synchronization','description'=>'Sinkronisasi data antar sistem','module'=>'sync',
    'formFields'=>[['name'=>'nama','label'=>'Nama Sync','type'=>'text','required'=>true],['name'=>'sumber','label'=>'Sumber Data','type'=>'text'],['name'=>'tujuan','label'=>'Tujuan Data','type'=>'text'],['name'=>'jadwal','label'=>'Jadwal','type'=>'select','options'=>['Manual','Hourly','Daily','Weekly']],['name'=>'status_terakhir','label'=>'Status Terakhir','type'=>'select','options'=>['Berhasil','Gagal','Sedang Proses']],['name'=>'waktu_terakhir','label'=>'Waktu Terakhir','type'=>'datetime']],
    'filterOptions'=>['Berhasil','Gagal','Sedang Proses'],
]));

// ── Advanced Finance ───────────────────────────────────────────────────────
Route::get('/erp/pph', fn() => view('erp.crud', [
    'title'=>'PPh Management','description'=>'Manajemen pajak penghasilan','module'=>'pph',
    'formFields'=>[['name'=>'tipe','label'=>'Tipe PPh','type'=>'select','options'=>['PPh 21','PPh 22','PPh 23','PPh 25','PPh Final']],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'npwp','label'=>'NPWP','type'=>'text'],['name'=>'nama_wajib_pajak','label'=>'Nama Wajib Pajak','type'=>'text'],['name'=>'penghasilan','label'=>'Penghasilan','type'=>'number','format'=>'currency'],['name'=>'pph_terutang','label'=>'PPh Terutang','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Disetor','Lunas']]],
    'filterOptions'=>['Draft','Disetor','Lunas'],
]));
Route::get('/erp/tax-invoice', fn() => view('erp.crud', [
    'title'=>'Tax Invoice','description'=>'Manajemen faktur pajak','module'=>'tax-invoice',
    'formFields'=>[['name'=>'nomor_faktur','label'=>'No Faktur Pajak','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'npwp_penjual','label'=>'NPWP Penjual','type'=>'text'],['name'=>'nama_penjual','label'=>'Nama Penjual','type'=>'text'],['name'=>'npwp_pembeli','label'=>'NPWP Pembeli','type'=>'text'],['name'=>'nama_pembeli','label'=>'Nama Pembeli','type'=>'text'],['name'=>'dpp','label'=>'DPP','type'=>'number','format'=>'currency'],['name'=>'ppn','label'=>'PPN','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Approved','Rejected']]],
    'filterOptions'=>['Draft','Approved','Rejected'],
]));
Route::get('/erp/e-faktur', fn() => view('erp.crud', [
    'title'=>'e-Faktur','description'=>'Integrasi e-Faktur DJP','module'=>'e-faktur',
    'formFields'=>[['name'=>'nomor_faktur','label'=>'No Faktur','type'=>'text','required'=>true],['name'=>'status_upload','label'=>'Status Upload','type'=>'select','options'=>['Belum Upload','Berhasil','Gagal']],['name'=>'tanggal_upload','label'=>'Tgl Upload','type'=>'date'],['name'=>'approval_status','label'=>'Approval DJP','type'=>'select','options'=>['Pending','Approved','Rejected']],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
    'filterOptions'=>['Belum Upload','Berhasil','Gagal'],
]));
Route::get('/erp/tax-report', fn() => view('erp.crud', [
    'title'=>'Tax Report','description'=>'Laporan pajak komprehensif','module'=>'tax-report',
    'formFields'=>[['name'=>'jenis_laporan','label'=>'Jenis Laporan','type'=>'select','options'=>['PPN','PPh 21','PPh 23','SPT Tahunan']],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'total_pajak','label'=>'Total Pajak','type'=>'number','format'=>'currency'],['name'=>'status_pelaporan','label'=>'Status Pelaporan','type'=>'select','options'=>['Draft','Submitted','Accepted','Rejected']],['name'=>'tanggal_submit','label'=>'Tgl Submit','type'=>'date']],
    'filterOptions'=>['Draft','Submitted','Accepted','Rejected'],
]));
Route::get('/erp/fixed-asset', fn() => view('erp.crud', [
    'title'=>'Fixed Asset Management','description'=>'Manajemen aset tetap','module'=>'fixed-asset',
    'formFields'=>[['name'=>'nama_aset','label'=>'Nama Aset','type'=>'text','required'=>true],['name'=>'kode_aset','label'=>'Kode Aset','type'=>'text'],['name'=>'kategori','label'=>'Kategori','type'=>'select','options'=>['Tanah','Bangunan','Kendaraan','Mesin','Peralatan']],['name'=>'nilai_perolehan','label'=>'Nilai Perolehan','type'=>'number','format'=>'currency'],['name'=>'tanggal_perolehan','label'=>'Tgl Perolehan','type'=>'date'],['name'=>'umur_ekonomis','label'=>'Umur Ekonomis (tahun)','type'=>'number'],['name'=>'depresiasi_bulanan','label'=>'Depresiasi Bulanan','type'=>'number','format'=>'currency'],['name'=>'nilai_buku','label'=>'Nilai Buku','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Disusutkan','Dijual','Rusak']]],
    'filterOptions'=>['Aktif','Disusutkan','Dijual','Rusak'],
]));
Route::get('/erp/cost-center', fn() => view('erp.crud', [
    'title'=>'Cost Center Management','description'=>'Manajemen cost center','module'=>'cost-center',
    'formFields'=>[['name'=>'nama','label'=>'Nama Cost Center','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Departemen','Proyek','Divisi']],['name'=>'budget_tahunan','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'realisasi','label'=>'Realisasi','type'=>'number','format'=>'currency'],['name'=>'variance','label'=>'Variance','type'=>'number','format'=>'currency'],['name'=>'manager','label'=>'Manager','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));

// ── Advanced CRM ───────────────────────────────────────────────────────────
Route::get('/erp/omnichannel-crm', fn() => view('erp.crud', [
    'title'=>'Omnichannel CRM','description'=>'CRM terpadu semua channel','module'=>'omnichannel-crm',
    'formFields'=>[['name'=>'customer_id','label'=>'Customer ID','type'=>'text','required'=>true],['name'=>'nama','label'=>'Nama Customer','type'=>'text'],['name'=>'channel_utama','label'=>'Channel Utama','type'=>'select','options'=>['Website','Shopee','Tokopedia','WhatsApp','Toko Fisik']],['name'=>'total_transaksi','label'=>'Total Transaksi','type'=>'number'],['name'=>'total_nilai','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'last_interaction','label'=>'Last Interaction','type'=>'datetime'],['name'=>'loyalty_tier','label'=>'Loyalty Tier','type'=>'select','options'=>['Bronze','Silver','Gold','Platinum']]],
]));
Route::get('/erp/customer-segmentation', fn() => view('erp.crud', [
    'title'=>'Customer Segmentation','description'=>'Segmentasi customer otomatis','module'=>'customer-segmentation',
    'formFields'=>[['name'=>'nama_segment','label'=>'Nama Segment','type'=>'text','required'=>true],['name'=>'kriteria','label'=>'Kriteria','type'=>'textarea'],['name'=>'jumlah_customer','label'=>'Jumlah Customer','type'=>'number'],['name'=>'avg_order_value','label'=>'Avg Order Value','type'=>'number','format'=>'currency'],['name'=>'frequency','label'=>'Purchase Frequency','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/customer-journey', fn() => view('erp.crud', [
    'title'=>'Customer Journey Mapping','description'=>'Mapping perjalanan customer','module'=>'customer-journey',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'touchpoint','label'=>'Touchpoint','type'=>'select','options'=>['Website','Social Media','Email','WhatsApp','Toko Fisik']],['name'=>'aktivitas','label'=>'Aktivitas','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'durasi','label'=>'Durasi (menit)','type'=>'number'],['name'=>'hasil','label'=>'Hasil','type'=>'select','options'=>['Purchase','Inquiry','Complaint','Positive Feedback']]],
]));
Route::get('/erp/customer-portal', fn() => view('erp.crud', [
    'title'=>'Customer Portal','description'=>'Portal self-service customer','module'=>'customer-portal',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'fitur','label'=>'Fitur','type'=>'select','options'=>['Order History','Invoice Download','Support Ticket','Profile Update']],['name'=>'akses_count','label'=>'Jumlah Akses','type'=>'number'],['name'=>'last_login','label'=>'Last Login','type'=>'datetime'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Suspended']]],
    'filterOptions'=>['Aktif','Suspended'],
]));
Route::get('/erp/social-media-integration', fn() => view('erp.crud', [
    'title'=>'Social Media Integration','description'=>'Integrasi media sosial','module'=>'social-media-integration',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['Facebook','Instagram','Twitter','TikTok','LinkedIn']],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Posting','Monitoring','Ads','Analytics']],['name'=>'konten','label'=>'Konten','type'=>'textarea'],['name'=>'engagement','label'=>'Engagement','type'=>'number'],['name'=>'tanggal_post','label'=>'Tgl Post','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Scheduled','Posted','Failed']]],
    'filterOptions'=>['Scheduled','Posted','Failed'],
]));

// ── Advanced Inventory & Production ────────────────────────────────────────
Route::get('/erp/bom', fn() => view('erp.crud', [
    'title'=>'Bill of Materials','description'=>'Bill of materials untuk produksi','module'=>'bom',
    'formFields'=>[['name'=>'produk_jadi','label'=>'Produk Jadi','type'=>'text','required'=>true],['name'=>'versi','label'=>'Versi','type'=>'text'],['name'=>'komponen','label'=>'Komponen','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah','type'=>'number'],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'cost_per_unit','label'=>'Cost per Unit','type'=>'number','format'=>'currency'],['name'=>'total_cost','label'=>'Total Cost','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/quality-control', fn() => view('erp.crud', [
    'title'=>'Quality Control','description'=>'Kontrol kualitas produk','module'=>'quality-control',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'batch_number','label'=>'Batch Number','type'=>'text'],['name'=>'parameter','label'=>'Parameter QC','type'=>'text'],['name'=>'standar','label'=>'Standar','type'=>'text'],['name'=>'hasil','label'=>'Hasil','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pass','Fail','Pending']],['name'=>'tanggal_qc','label'=>'Tgl QC','type'=>'date'],['name'=>'qc_officer','label'=>'QC Officer','type'=>'text']],
    'filterOptions'=>['Pass','Fail','Pending'],
]));
Route::get('/erp/advanced-warehousing', fn() => view('erp.crud', [
    'title'=>'Advanced Warehousing','description'=>'Manajemen gudang advanced','module'=>'advanced-warehousing',
    'formFields'=>[['name'=>'gudang','label'=>'Gudang','type'=>'text','required'=>true],['name'=>'lokasi','label'=>'Lokasi','type'=>'text'],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'stok','label'=>'Stok','type'=>'number'],['name'=>'kapasitas','label'=>'Kapasitas','type'=>'number'],['name'=>'utilisasi','label'=>'Utilisasi (%)','type'=>'number'],['name'=>'slotting_score','label'=>'Slotting Score','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Optimal','Overstock','Understock']]],
    'filterOptions'=>['Optimal','Overstock','Understock'],
]));
Route::get('/erp/supplier-quality', fn() => view('erp.crud', [
    'title'=>'Supplier Quality Management','description'=>'Manajemen kualitas supplier','module'=>'supplier-quality',
    'formFields'=>[['name'=>'supplier','label'=>'Supplier','type'=>'text','required'=>true],['name'=>'metrik','label'=>'Metrik','type'=>'select','options'=>['On-Time Delivery','Quality Score','Defect Rate','Response Time']],['name'=>'nilai','label'=>'Nilai','type'=>'number'],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'rating','label'=>'Rating','type'=>'select','options'=>['A - Excellent','B - Good','C - Average','D - Poor']],['name'=>'tren','label'=>'Tren','type'=>'select','options'=>['Improving','Stable','Declining']]],
    'filterOptions'=>['A - Excellent','B - Good','C - Average','D - Poor'],
]));
Route::get('/erp/production-planning', fn() => view('erp.crud', [
    'title'=>'Production Planning','description'=>'Perencanaan produksi MRP','module'=>'production-planning',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'demand_forecast','label'=>'Demand Forecast','type'=>'number'],['name'=>'current_stock','label'=>'Current Stock','type'=>'number'],['name'=>'safety_stock','label'=>'Safety Stock','type'=>'number'],['name'=>'planned_production','label'=>'Planned Production','type'=>'number'],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Approved','In Production']]],
    'filterOptions'=>['Draft','Approved','In Production'],
]));
Route::get('/erp/work-order', fn() => view('erp.crud', [
    'title'=>'Work Order Management','description'=>'Manajemen work order produksi','module'=>'work-order',
    'formFields'=>[['name'=>'nomor_wo','label'=>'No Work Order','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'quantity','label'=>'Quantity','type'=>'number'],['name'=>'start_date','label'=>'Start Date','type'=>'date'],['name'=>'end_date','label'=>'End Date','type'=>'date'],['name'=>'assigned_to','label'=>'Assigned To','type'=>'text'],['name'=>'progress','label'=>'Progress (%)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Planned','In Progress','Completed','Cancelled']]],
    'filterOptions'=>['Planned','In Progress','Completed','Cancelled'],
]));
Route::get('/erp/maintenance-management', fn() => view('erp.crud', [
    'title'=>'Maintenance Management','description'=>'Manajemen maintenance preventif','module'=>'maintenance-management',
    'formFields'=>[['name'=>'aset','label'=>'Aset','type'=>'text','required'=>true],['name'=>'tipe_maintenance','label'=>'Tipe Maintenance','type'=>'select','options'=>['Preventive','Corrective','Predictive']],['name'=>'jadwal','label'=>'Jadwal','type'=>'date'],['name'=>'teknisi','label'=>'Teknisi','type'=>'text'],['name'=>'biaya','label'=>'Biaya','type'=>'number','format'=>'currency'],['name'=>'durasi','label'=>'Durasi (jam)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Scheduled','In Progress','Completed','Overdue']]],
    'filterOptions'=>['Scheduled','In Progress','Completed','Overdue'],
]));

// ── Advanced HR ────────────────────────────────────────────────────────────
Route::get('/erp/advanced-payroll', fn() => view('erp.crud', [
    'title'=>'Advanced Payroll','description'=>'Payroll dengan tax calculation','module'=>'advanced-payroll',
    'formFields'=>[['name'=>'employee','label'=>'Employee','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'gaji_pokok','label'=>'Gaji Pokok','type'=>'number','format'=>'currency'],['name'=>'tunjangan','label'=>'Tunjangan','type'=>'number','format'=>'currency'],['name'=>'lembur','label'=>'Lembur','type'=>'number','format'=>'currency'],['name'=>'potongan','label'=>'Potongan','type'=>'number','format'=>'currency'],['name'=>'pph21','label'=>'PPh 21','type'=>'number','format'=>'currency'],['name'=>'bpjs','label'=>'BPJS','type'=>'number','format'=>'currency'],['name'=>'take_home_pay','label'=>'Take Home Pay','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Processed','Paid']]],
    'filterOptions'=>['Draft','Processed','Paid'],
]));
Route::get('/erp/performance-management', fn() => view('erp.crud', [
    'title'=>'Performance Management','description'=>'Manajemen performa karyawan','module'=>'performance-management',
    'formFields'=>[['name'=>'employee','label'=>'Employee','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'kpi','label'=>'KPI','type'=>'text'],['name'=>'target','label'=>'Target','type'=>'text'],['name'=>'achievement','label'=>'Achievement','type'=>'text'],['name'=>'score','label'=>'Score','type'=>'number'],['name'=>'reviewer','label'=>'Reviewer','type'=>'text'],['name'=>'tanggal_review','label'=>'Tgl Review','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Submitted','Approved']]],
    'filterOptions'=>['Draft','Submitted','Approved'],
]));
Route::get('/erp/training-management', fn() => view('erp.crud', [
    'title'=>'Training Management','description'=>'Manajemen pelatihan karyawan','module'=>'training-management',
    'formFields'=>[['name'=>'nama_training','label'=>'Nama Training','type'=>'text','required'=>true],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Internal','External','Online']],['name'=>'peserta','label'=>'Peserta','type'=>'text'],['name'=>'trainer','label'=>'Trainer','type'=>'text'],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'durasi','label'=>'Durasi (jam)','type'=>'number'],['name'=>'biaya','label'=>'Biaya','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Planned','Ongoing','Completed','Cancelled']]],
    'filterOptions'=>['Planned','Ongoing','Completed','Cancelled'],
]));
Route::get('/erp/recruitment', fn() => view('erp.crud', [
    'title'=>'Recruitment','description'=>'Manajemen rekrutmen karyawan','module'=>'recruitment',
    'formFields'=>[['name'=>'posisi','label'=>'Posisi','type'=>'text','required'=>true],['name'=>'departemen','label'=>'Departemen','type'=>'text'],['name'=>'pelamar','label'=>'Pelamar','type'=>'text'],['name'=>'status_lamaran','label'=>'Status Lamaran','type'=>'select','options'=>['Applied','Screening','Interview','Offered','Hired','Rejected']],['name'=>'tanggal_apply','label'=>'Tgl Apply','type'=>'date'],['name'=>'interviewer','label'=>'Interviewer','type'=>'text'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea']],
    'filterOptions'=>['Applied','Screening','Interview','Offered','Hired','Rejected'],
]));
Route::get('/erp/employee-self-service', fn() => view('erp.crud', [
    'title'=>'Employee Self Service','description'=>'Portal self-service karyawan','module'=>'employee-self-service',
    'formFields'=>[['name'=>'employee','label'=>'Employee','type'=>'text','required'=>true],['name'=>'fitur','label'=>'Fitur','type'=>'select','options'=>['Leave Request','Payroll View','Training Registration','Profile Update']],['name'=>'tanggal_request','label'=>'Tgl Request','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Approved','Rejected']],['name'=>'approver','label'=>'Approver','type'=>'text'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea']],
    'filterOptions'=>['Pending','Approved','Rejected'],
]));
Route::get('/erp/succession-planning', fn() => view('erp.crud', [
    'title'=>'Succession Planning','description'=>'Perencanaan suksesi kepemimpinan','module'=>'succession-planning',
    'formFields'=>[['name'=>'posisi','label'=>'Posisi','type'=>'text','required'=>true],['name'=>'incumbent','label'=>'Pemegang Saat Ini','type'=>'text'],['name'=>'successor','label'=>'Calon Pengganti','type'=>'text'],['name'=>'readiness_level','label'=>'Readiness Level','type'=>'select','options'=>['Low','Medium','High']],['name'=>'development_plan','label'=>'Development Plan','type'=>'textarea'],['name'=>'target_date','label'=>'Target Date','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Identified','Developing','Ready']]],
    'filterOptions'=>['Identified','Developing','Ready'],
]));
Route::get('/erp/workforce-analytics', fn() => view('erp.crud', [
    'title'=>'Workforce Analytics','description'=>'Analitik tenaga kerja','module'=>'workforce-analytics',
    'formFields'=>[['name'=>'metrik','label'=>'Metrik','type'=>'select','options'=>['Headcount','Turnover Rate','Absenteeism','Productivity']],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'departemen','label'=>'Departemen','type'=>'text'],['name'=>'nilai','label'=>'Nilai','type'=>'number'],['name'=>'target','label'=>'Target','type'=>'number'],['name'=>'variance','label'=>'Variance','type'=>'number'],['name'=>'tren','label'=>'Tren','type'=>'select','options'=>['Improving','Stable','Declining']]],
]));

// ── Advanced Delivery & Logistics ──────────────────────────────────────────
Route::get('/erp/route-optimization', fn() => view('erp.crud', [
    'title'=>'Route Optimization','description'=>'Optimasi rute pengiriman','module'=>'route-optimization',
    'formFields'=>[['name'=>'rute','label'=>'Rute','type'=>'text','required'=>true],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'titik_pickup','label'=>'Titik Pickup','type'=>'number'],['name'=>'jarak','label'=>'Jarak (km)','type'=>'number'],['name'=>'estimasi_waktu','label'=>'Estimasi Waktu','type'=>'number'],['name'=>'biaya_bahan_bakar','label'=>'Biaya BBM','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Optimized','Manual','In Progress']]],
    'filterOptions'=>['Optimized','Manual','In Progress'],
]));
Route::get('/erp/fleet-management-advanced', fn() => view('erp.crud', [
    'title'=>'Advanced Fleet Management','description'=>'Manajemen armada advanced','module'=>'fleet-management-advanced',
    'formFields'=>[['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text','required'=>true],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Truck','Motor','Mobil']],['name'=>'plat_nomor','label'=>'Plat Nomor','type'=>'text'],['name'=>'km_terakhir','label'=>'KM Terakhir','type'=>'number'],['name'=>'jadwal_service','label'=>'Jadwal Service','type'=>'date'],['name'=>'biaya_operasional','label'=>'Biaya Operasional','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Maintenance','Out of Service']]],
    'filterOptions'=>['Active','Maintenance','Out of Service'],
]));
Route::get('/erp/last-mile-delivery', fn() => view('erp.crud', [
    'title'=>'Last Mile Delivery','description'=>'Pengiriman last mile','module'=>'last-mile-delivery',
    'formFields'=>[['name'=>'order_id','label'=>'Order ID','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'eta','label'=>'ETA','type'=>'datetime'],['name'=>'attempt_count','label'=>'Attempt Count','type'=>'number'],['name'=>'delivery_status','label'=>'Delivery Status','type'=>'select','options'=>['Out for Delivery','Delivered','Failed','Rescheduled']],['name'=>'pod','label'=>'Proof of Delivery','type'=>'text'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea']],
    'filterOptions'=>['Out for Delivery','Delivered','Failed','Rescheduled'],
]));
Route::get('/erp/reverse-logistics', fn() => view('erp.crud', [
    'title'=>'Reverse Logistics','description'=>'Manajemen return & reverse logistics','module'=>'reverse-logistics',
    'formFields'=>[['name'=>'return_id','label'=>'Return ID','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'alasan','label'=>'Alasan Return','type'=>'select','options'=>['Defective','Wrong Item','Customer Request','Expired']],['name'=>'kondisi','label'=>'Kondisi','type'=>'select','options'=>['New','Used','Damaged']],['name'=>'tindakan','label'=>'Tindakan','type'=>'select','options'=>['Refund','Replace','Repair','Destroy']],['name'=>'biaya','label'=>'Biaya','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Received','Inspected','Processed','Completed']]],
    'filterOptions'=>['Received','Inspected','Processed','Completed'],
]));
Route::get('/erp/supply-chain-visibility', fn() => view('erp.crud', [
    'title'=>'Supply Chain Visibility','description'=>'Visibilitas rantai pasok end-to-end','module'=>'supply-chain-visibility',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text'],['name'=>'gudang','label'=>'Gudang','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Ordered','In Transit','In Warehouse','Out of Stock']],['name'=>'lead_time','label'=>'Lead Time (hari)','type'=>'number'],['name'=>'last_update','label'=>'Last Update','type'=>'datetime'],['name'=>'next_delivery','label'=>'Next Delivery','type'=>'date'],['name'=>'alert','label'=>'Alert','type'=>'select','options'=>['Normal','Low Stock','Delayed','Critical']]],
    'filterOptions'=>['Normal','Low Stock','Delayed','Critical'],
]));
Route::get('/erp/carrier-management', fn() => view('erp.crud', [
    'title'=>'Carrier Management','description'=>'Manajemen carrier/ekspedisi','module'=>'carrier-management',
    'formFields'=>[['name'=>'nama_carrier','label'=>'Nama Carrier','type'=>'text','required'=>true],['name'=>'tipe_layanan','label'=>'Tipe Layanan','type'=>'select','options'=>['Express','Regular','Economy']],['name'=>'zona','label'=>'Zona','type'=>'text'],['name'=>'tarif_per_kg','label'=>'Tarif per KG','type'=>'number','format'=>'currency'],['name'=>'estimasi_pengiriman','label'=>'Estimasi (hari)','type'=>'number'],['name'=>'on_time_rate','label'=>'On Time Rate (%)','type'=>'number'],['name'=>'rating','label'=>'Rating','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive','Blacklisted']]],
    'filterOptions'=>['Active','Inactive','Blacklisted'],
]));
Route::get('/erp/customs-compliance', fn() => view('erp.crud', [
    'title'=>'Customs & Compliance','description'=>'Manajemen bea cukai dan compliance','module'=>'customs-compliance',
    'formFields'=>[['name'=>'nomor_pib','label'=>'No PIB','type'=>'text','required'=>true],['name'=>'produk','label'=>'Produk','type'=>'text'],['name'=>'hs_code','label'=>'HS Code','type'=>'text'],['name'=>'nilai_import','label'=>'Nilai Import','type'=>'number','format'=>'currency'],['name'=>'bea_masuk','label'=>'Bea Masuk','type'=>'number','format'=>'currency'],['name'=>'ppn_import','label'=>'PPN Import','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Submitted','Cleared','Rejected']],['name'=>'tanggal_clearance','label'=>'Tgl Clearance','type'=>'date']],
    'filterOptions'=>['Draft','Submitted','Cleared','Rejected'],
]));
Route::get('/erp/sustainability-tracking', fn() => view('erp.crud', [
    'title'=>'Sustainability Tracking','description'=>'Tracking sustainability logistics','module'=>'sustainability-tracking',
    'formFields'=>[['name'=>'pengiriman','label'=>'Pengiriman','type'=>'text','required'=>true],['name'=>'jarak','label'=>'Jarak (km)','type'=>'number'],['name'=>'emisi_co2','label'=>'Emisi CO2 (kg)','type'=>'number'],['name'=>'jenis_kendaraan','label'=>'Jenis Kendaraan','type'=>'select','options'=>['Diesel','Electric','Hybrid']],['name'=>'efisiensi_bahan_bakar','label'=>'Efisiensi BBM','type'=>'number'],['name'=>'carbon_offset','label'=>'Carbon Offset','type'=>'number'],['name'=>'rating_sustainability','label'=>'Rating Sustainability','type'=>'select','options'=>['A - Excellent','B - Good','C - Average','D - Poor']]],
]));

// ── System Integration ─────────────────────────────────────────────────────
Route::get('/erp/kledo-integration', fn() => view('erp.crud', [
    'title'=>'Kledo Integration','description'=>'Konfigurasi integrasi Kledo','module'=>'kledo-integration',
    'formFields'=>[['name'=>'api_key','label'=>'API Key','type'=>'text','required'=>true],['name'=>'api_secret','label'=>'API Secret','type'=>'text'],['name'=>'sync_products','label'=>'Sync Products','type'=>'boolean'],['name'=>'sync_invoices','label'=>'Sync Invoices','type'=>'boolean'],['name'=>'sync_inventory','label'=>'Sync Inventory','type'=>'boolean'],['name'=>'last_sync','label'=>'Last Sync','type'=>'datetime'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Connected','Disconnected','Error']]],
    'filterOptions'=>['Connected','Disconnected','Error'],
]));
Route::get('/erp/accurate-integration', fn() => view('erp.crud', [
    'title'=>'Accurate Integration','description'=>'Konfigurasi integrasi Accurate','module'=>'accurate-integration',
    'formFields'=>[['name'=>'database_id','label'=>'Database ID','type'=>'text','required'=>true],['name'=>'username','label'=>'Username','type'=>'text'],['name'=>'password','label'=>'Password','type'=>'password'],['name'=>'sync_journal','label'=>'Sync Journal','type'=>'boolean'],['name'=>'sync_coa','label'=>'Sync COA','type'=>'boolean'],['name'=>'last_sync','label'=>'Last Sync','type'=>'datetime'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Connected','Disconnected','Error']]],
    'filterOptions'=>['Connected','Disconnected','Error'],
]));
Route::get('/erp/whatsapp-business-api', fn() => view('erp.crud', [
    'title'=>'WhatsApp Business API','description'=>'Integrasi WhatsApp Business API','module'=>'whatsapp-business-api',
    'formFields'=>[['name'=>'phone_number_id','label'=>'Phone Number ID','type'=>'text','required'=>true],['name'=>'access_token','label'=>'Access Token','type'=>'text'],['name'=>'webhook_url','label'=>'Webhook URL','type'=>'text'],['name'=>'template_messages','label'=>'Template Messages','type'=>'boolean'],['name'=>'bulk_messaging','label'=>'Bulk Messaging','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Connected','Disconnected','Error']]],
    'filterOptions'=>['Connected','Disconnected','Error'],
]));
Route::get('/erp/telegram-advanced', fn() => view('erp.crud', [
    'title'=>'Advanced Telegram Bot','description'=>'Bot Telegram advanced','module'=>'telegram-advanced',
    'formFields'=>[['name'=>'bot_token','label'=>'Bot Token','type'=>'text','required'=>true],['name'=>'chat_id','label'=>'Chat ID','type'=>'text'],['name'=>'commands','label'=>'Commands','type'=>'textarea'],['name'=>'notifications','label'=>'Notifications','type'=>'boolean'],['name'=>'auto_reply','label'=>'Auto Reply','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive']]],
    'filterOptions'=>['Active','Inactive'],
]));
Route::get('/erp/google-workspace', fn() => view('erp.crud', [
    'title'=>'Google Workspace Integration','description'=>'Integrasi Google Workspace','module'=>'google-workspace',
    'formFields'=>[['name'=>'service_account','label'=>'Service Account','type'=>'text','required'=>true],['name'=>'spreadsheet_id','label'=>'Spreadsheet ID','type'=>'text'],['name'=>'calendar_id','label'=>'Calendar ID','type'=>'text'],['name'=>'sync_contacts','label'=>'Sync Contacts','type'=>'boolean'],['name'=>'sync_calendar','label'=>'Sync Calendar','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Connected','Disconnected','Error']]],
    'filterOptions'=>['Connected','Disconnected','Error'],
]));
Route::get('/erp/payment-gateway-integration', fn() => view('erp.crud', [
    'title'=>'Payment Gateway Integration','description'=>'Integrasi payment gateway','module'=>'payment-gateway-integration',
    'formFields'=>[['name'=>'gateway','label'=>'Gateway','type'=>'select','options'=>['Midtrans','Xendit','Doku','Stripe','Gopay']],['name'=>'merchant_id','label'=>'Merchant ID','type'=>'text'],['name'=>'client_key','label'=>'Client Key','type'=>'text'],['name'=>'server_key','label'=>'Server Key','type'=>'text'],['name'=>'sandbox_mode','label'=>'Sandbox Mode','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive','Error']]],
    'filterOptions'=>['Active','Inactive','Error'],
]));
Route::get('/erp/sms-gateway', fn() => view('erp.crud', [
    'title'=>'SMS Gateway','description'=>'Integrasi SMS gateway','module'=>'sms-gateway',
    'formFields'=>[['name'=>'provider','label'=>'Provider','type'=>'select','options'=>['Twilio','Nexmo','Telnyx','Local']],['name'=>'api_key','label'=>'API Key','type'=>'text'],['name'=>'api_secret','label'=>'API Secret','type'=>'text'],['name'=>'sender_id','label'=>'Sender ID','type'=>'text'],['name'=>'bulk_sms','label'=>'Bulk SMS','type'=>'boolean'],['name'=>'otp_service','label'=>'OTP Service','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive']]],
    'filterOptions'=>['Active','Inactive'],
]));
Route::get('/erp/email-marketing', fn() => view('erp.crud', [
    'title'=>'Email Marketing','description'=>'Integrasi email marketing','module'=>'email-marketing',
    'formFields'=>[['name'=>'provider','label'=>'Provider','type'=>'select','options'=>['Mailchimp','Sendinblue','ActiveCampaign']],['name'=>'api_key','label'=>'API Key','type'=>'text'],['name'=>'list_id','label'=>'List ID','type'=>'text'],['name'=>'campaigns','label'=>'Campaigns','type'=>'boolean'],['name'=>'automation','label'=>'Automation','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Connected','Disconnected','Error']]],
    'filterOptions'=>['Connected','Disconnected','Error'],
]));
Route::get('/erp/social-media-apis', fn() => view('erp.crud', [
    'title'=>'Social Media APIs','description'=>'Integrasi API media sosial','module'=>'social-media-apis',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['Facebook','Instagram','Twitter','LinkedIn']],['name'=>'app_id','label'=>'App ID','type'=>'text'],['name'=>'app_secret','label'=>'App Secret','type'=>'text'],['name'=>'access_token','label'=>'Access Token','type'=>'text'],['name'=>'posting','label'=>'Auto Posting','type'=>'boolean'],['name'=>'monitoring','label'=>'Social Monitoring','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Connected','Disconnected','Error']]],
    'filterOptions'=>['Connected','Disconnected','Error'],
]));
Route::get('/erp/iot-integration', fn() => view('erp.crud', [
    'title'=>'IoT Integration','description'=>'Integrasi Internet of Things','module'=>'iot-integration',
    'formFields'=>[['name'=>'device','label'=>'Device','type'=>'text','required'=>true],['name'=>'sensor_type','label'=>'Sensor Type','type'=>'select','options'=>['Temperature','Humidity','Motion','GPS','RFID']],['name'=>'device_id','label'=>'Device ID','type'=>'text'],['name'=>'location','label'=>'Location','type'=>'text'],['name'=>'data_stream','label'=>'Data Stream','type'=>'text'],['name'=>'alert_threshold','label'=>'Alert Threshold','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Online','Offline','Error']]],
    'filterOptions'=>['Online','Offline','Error'],
]));

// ── Mobile & Offline Features ──────────────────────────────────────────────
Route::get('/erp/mobile-app', fn() => view('erp.crud', [
    'title'=>'Mobile App','description'=>'Manajemen aplikasi mobile','module'=>'mobile-app',
    'formFields'=>[['name'=>'platform','label'=>'Platform','type'=>'select','options'=>['iOS','Android','PWA']],['name'=>'version','label'=>'Version','type'=>'text'],['name'=>'features','label'=>'Features','type'=>'textarea'],['name'=>'download_count','label'=>'Download Count','type'=>'number'],['name'=>'rating','label'=>'Rating','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Development','Beta','Released','Deprecated']]],
    'filterOptions'=>['Development','Beta','Released','Deprecated'],
]));
Route::get('/erp/offline-mode', fn() => view('erp.crud', [
    'title'=>'Offline Mode','description'=>'Konfigurasi mode offline','module'=>'offline-mode',
    'formFields'=>[['name'=>'module','label'=>'Module','type'=>'select','options'=>['Sales','Inventory','HR','Finance']],['name'=>'sync_interval','label'=>'Sync Interval','type'=>'select','options'=>['Real-time','Hourly','Daily','Manual']],['name'=>'data_retention','label'=>'Data Retention (days)','type'=>'number'],['name'=>'conflict_resolution','label'=>'Conflict Resolution','type'=>'select','options'=>['Server Wins','Client Wins','Manual']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Enabled','Disabled']]],
    'filterOptions'=>['Enabled','Disabled'],
]));
Route::get('/erp/pwa-support', fn() => view('erp.crud', [
    'title'=>'PWA Support','description'=>'Progressive Web App support','module'=>'pwa-support',
    'formFields'=>[['name'=>'feature','label'=>'Feature','type'=>'select','options'=>['Offline Cache','Push Notifications','Install Prompt','Background Sync']],['name'=>'implementation','label'=>'Implementation','type'=>'select','options'=>['Implemented','Planned','Not Supported']],['name'=>'browser_support','label'=>'Browser Support','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive']]],
    'filterOptions'=>['Active','Inactive'],
]));
Route::get('/erp/mobile-dashboard', fn() => view('erp.crud', [
    'title'=>'Mobile Dashboard','description'=>'Dashboard mobile-optimized','module'=>'mobile-dashboard',
    'formFields'=>[['name'=>'widget','label'=>'Widget','type'=>'select','options'=>['Sales Summary','Inventory Alert','Task List','Quick Actions']],['name'=>'position','label'=>'Position','type'=>'select','options'=>['Top','Middle','Bottom']],['name'=>'size','label'=>'Size','type'=>'select','options'=>['Small','Medium','Large']],['name'=>'visibility','label'=>'Visibility','type'=>'select','options'=>['All Users','Admin Only','Manager Only']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive']]],
    'filterOptions'=>['Active','Inactive'],
]));
Route::get('/erp/push-notifications', fn() => view('erp.crud', [
    'title'=>'Push Notifications','description'=>'Manajemen push notifications','module'=>'push-notifications',
    'formFields'=>[['name'=>'title','label'=>'Title','type'=>'text','required'=>true],['name'=>'message','label'=>'Message','type'=>'textarea'],['name'=>'target_users','label'=>'Target Users','type'=>'select','options'=>['All','Admin','Sales','Warehouse']],['name'=>'schedule_time','label'=>'Schedule Time','type'=>'datetime'],['name'=>'delivery_status','label'=>'Delivery Status','type'=>'select','options'=>['Pending','Sent','Failed']],['name'=>'open_rate','label'=>'Open Rate (%)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Scheduled','Sent']]],
    'filterOptions'=>['Draft','Scheduled','Sent'],
]));
Route::get('/erp/barcode-scanning', fn() => view('erp.crud', [
    'title'=>'Barcode Scanning','description'=>'Konfigurasi barcode scanning','module'=>'barcode-scanning',
    'formFields'=>[['name'=>'module','label'=>'Module','type'=>'select','options'=>['Inventory','Sales','Production']],['name'=>'barcode_type','label'=>'Barcode Type','type'=>'select','options'=>['EAN-13','QR Code','Code 128','Data Matrix']],['name'=>'camera_quality','label'=>'Camera Quality','type'=>'select','options'=>['Low','Medium','High']],['name'=>'auto_lookup','label'=>'Auto Lookup','type'=>'boolean'],['name'=>'batch_scan','label'=>'Batch Scan','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Enabled','Disabled']]],
    'filterOptions'=>['Enabled','Disabled'],
]));

// ── Advanced Reporting & BI ────────────────────────────────────────────────
Route::get('/erp/business-intelligence', fn() => view('erp.crud', [
    'title'=>'Business Intelligence','description'=>'Dashboard BI dan advanced analytics','module'=>'business-intelligence',
    'formFields'=>[['name'=>'dashboard_name','label'=>'Dashboard Name','type'=>'text','required'=>true],['name'=>'data_source','label'=>'Data Source','type'=>'select','options'=>['Sales','Inventory','Finance','HR']],['name'=>'visualization_type','label'=>'Visualization Type','type'=>'select','options'=>['Chart','Table','KPI','Map']],['name'=>'refresh_interval','label'=>'Refresh Interval','type'=>'select','options'=>['Real-time','Hourly','Daily']],['name'=>'user_access','label'=>'User Access','type'=>'select','options'=>['All','Admin','Manager']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Inactive']]],
    'filterOptions'=>['Active','Inactive'],
]));
Route::get('/erp/custom-dashboards', fn() => view('erp.crud', [
    'title'=>'Custom Dashboards','description'=>'Dashboard kustom untuk user','module'=>'custom-dashboards',
    'formFields'=>[['name'=>'dashboard_title','label'=>'Dashboard Title','type'=>'text','required'=>true],['name'=>'owner','label'=>'Owner','type'=>'text'],['name'=>'widgets','label'=>'Widgets','type'=>'textarea'],['name'=>'layout','label'=>'Layout','type'=>'select','options'=>['Grid','Freeform']],['name'=>'is_public','label'=>'Is Public','type'=>'boolean'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Published','Archived']]],
    'filterOptions'=>['Draft','Published','Archived'],
]));
Route::get('/erp/advanced-analytics', fn() => view('erp.crud', [
    'title'=>'Advanced Analytics','description'=>'Analitik advanced dengan ML','module'=>'advanced-analytics',
    'formFields'=>[['name'=>'analysis_type','label'=>'Analysis Type','type'=>'select','options'=>['Trend Analysis','Predictive','Correlation','Clustering']],['name'=>'data_set','label'=>'Data Set','type'=>'text'],['name'=>'algorithm','label'=>'Algorithm','type'=>'select','options'=>['Linear Regression','Decision Tree','Neural Network']],['name'=>'accuracy_score','label'=>'Accuracy Score','type'=>'number'],['name'=>'last_run','label'=>'Last Run','type'=>'datetime'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Running','Completed','Failed']]],
    'filterOptions'=>['Running','Completed','Failed'],
]));
Route::get('/erp/real-time-monitoring', fn() => view('erp.crud', [
    'title'=>'Real-time Monitoring','description'=>'Monitoring real-time sistem','module'=>'real-time-monitoring',
    'formFields'=>[['name'=>'metric','label'=>'Metric','type'=>'select','options'=>['CPU Usage','Memory','Response Time','Error Rate']],['name'=>'threshold','label'=>'Threshold','type'=>'number'],['name'=>'alert_type','label'=>'Alert Type','type'=>'select','options'=>['Email','SMS','Dashboard']],['name'=>'current_value','label'=>'Current Value','type'=>'number'],['name'=>'last_alert','label'=>'Last Alert','type'=>'datetime'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Warning','Critical']]],
    'filterOptions'=>['Normal','Warning','Critical'],
]));
Route::get('/erp/automated-reports', fn() => view('erp.crud', [
    'title'=>'Automated Reports','description'=>'Laporan otomatis terjadwal','module'=>'automated-reports',
    'formFields'=>[['name'=>'report_name','label'=>'Report Name','type'=>'text','required'=>true],['name'=>'report_type','label'=>'Report Type','type'=>'select','options'=>['Sales','Finance','Inventory','HR']],['name'=>'schedule','label'=>'Schedule','type'=>'select','options'=>['Daily','Weekly','Monthly']],['name'=>'recipients','label'=>'Recipients','type'=>'textarea'],['name'=>'format','label'=>'Format','type'=>'select','options'=>['PDF','Excel','Email']],['name'=>'last_sent','label'=>'Last Sent','type'=>'datetime'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Active','Paused','Error']]],
    'filterOptions'=>['Active','Paused','Error'],
]));
Route::get('/erp/approval-workflow', fn() => view('erp.crud', [
    'title'=>'Approval Workflow','description'=>'Konfigurasi alur approval transaksi','module'=>'approval-workflow',
    'formFields'=>[['name'=>'nama','label'=>'Nama Workflow','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'select','options'=>['Purchase Request','Expense','Journal','Budget']],['name'=>'level','label'=>'Level Approval','type'=>'number','default'=>1],['name'=>'approver','label'=>'Approver','type'=>'text'],['name'=>'min_nilai','label'=>'Min Nilai','type'=>'number','format'=>'currency'],['name'=>'maks_nilai','label'=>'Maks Nilai','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));

// ── Tax ────────────────────────────────────────────────────────────────────
Route::get('/erp/vat', fn() => view('erp.crud', [
    'title'=>'PPN (Value Added Tax)','description'=>'Manajemen pajak pertambahan nilai','module'=>'vat',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'ppn_masukan','label'=>'PPN Masukan','type'=>'number','format'=>'currency'],['name'=>'ppn_keluaran','label'=>'PPN Keluaran','type'=>'number','format'=>'currency'],['name'=>'ppn_terutang','label'=>'PPN Terutang','type'=>'number','format'=>'currency'],['name'=>'tanggal_lapor','label'=>'Tgl Lapor','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lapor','Sudah Lapor','Lebih Bayar']]],
    'filterOptions'=>['Belum Lapor','Sudah Lapor'],
]));
Route::get('/erp/pph', fn() => view('erp.crud', [
    'title'=>'PPh (Pajak Penghasilan)','description'=>'Manajemen pajak penghasilan','module'=>'pph',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'jenis_pph','label'=>'Jenis PPh','type'=>'select','options'=>['PPh 21','PPh 22','PPh 23','PPh 25','PPh Final']],['name'=>'nama_wp','label'=>'Nama WP','type'=>'text'],['name'=>'npwp','label'=>'NPWP','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah PPh','type'=>'number','format'=>'currency'],['name'=>'tanggal_lapor','label'=>'Tgl Lapor','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Belum Lapor','Sudah Lapor']]],
]));
Route::get('/erp/tax-invoice', fn() => view('erp.crud', [
    'title'=>'Faktur Pajak','description'=>'Manajemen faktur pajak PPN','module'=>'tax-invoice',
    'formFields'=>[['name'=>'nomor','label'=>'No Faktur','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'lawan_transaksi','label'=>'Lawan Transaksi','type'=>'text'],['name'=>'npwp_lawan','label'=>'NPWP Lawan','type'=>'text'],['name'=>'dpp','label'=>'DPP','type'=>'number','format'=>'currency'],['name'=>'ppn','label'=>'PPN','type'=>'number','format'=>'currency'],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Faktur Keluaran','Faktur Masukan']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Pengganti','Batal']]],
]));
Route::get('/erp/e-faktur', fn() => view('erp.crud', [
    'title'=>'e-Faktur','description'=>'Upload dan rekap e-Faktur ke DJP','module'=>'e-faktur',
    'formFields'=>[['name'=>'nomor','label'=>'No Faktur','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'file_csv','label'=>'File CSV','type'=>'text'],['name'=>'referensi','label'=>'Referensi','type'=>'text'],['name'=>'total_ppn','label'=>'Total PPN','type'=>'number','format'=>'currency'],['name'=>'status_upload','label'=>'Status Upload','type'=>'select','options'=>['Belum Upload','Sukses','Gagal','Revisi']]],
    'filterOptions'=>['Belum Upload','Sukses','Gagal'],
]));
Route::get('/erp/tax-report', fn() => view('erp.crud', [
    'title'=>'Laporan Pajak','description'=>'Rekap laporan pajak perusahaan','module'=>'tax-report',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis Pajak','type'=>'select','options'=>['PPN','PPh 21','PPh 23','PPh 25','PPh Final']],['name'=>'ppn_in','label'=>'PPN Masukan','type'=>'number','format'=>'currency'],['name'=>'ppn_out','label'=>'PPN Keluaran','type'=>'number','format'=>'currency'],['name'=>'pph','label'=>'Total PPh','type'=>'number','format'=>'currency'],['name'=>'total','label'=>'Total Pajak','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dilaporkan']]],
]));

// ── CRM Extended ───────────────────────────────────────────────────────────
Route::get('/erp/customer-group', fn() => view('erp.crud', [
    'title'=>'Customer Group','description'=>'Kelompokkan customer berdasarkan segmen','module'=>'customer-group',
    'formFields'=>[['name'=>'nama','label'=>'Nama Grup','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'diskon','label'=>'Diskon (%)','type'=>'number','default'=>0],['name'=>'limit_kredit','label'=>'Limit Kredit','type'=>'number','format'=>'currency'],['name'=>'syarat_bayar','label'=>'Syarat Bayar (hari)','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/customer-credit', fn() => view('erp.crud', [
    'title'=>'Customer Credit','description'=>'Manajemen limit kredit pelanggan','module'=>'customer-credit',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'limit_kredit','label'=>'Limit Kredit','type'=>'number','format'=>'currency'],['name'=>'terpakai','label'=>'Terpakai','type'=>'number','format'=>'currency'],['name'=>'sisa','label'=>'Sisa Kredit','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Mendekati Limit','Melebihi Limit','Blacklist']]],
    'filterOptions'=>['Normal','Mendekati Limit','Melebihi Limit','Blacklist'],
]));
Route::get('/erp/customer-followup', fn() => view('erp.crud', [
    'title'=>'Follow Up Customer','description'=>'Jadwal dan log follow up customer','module'=>'customer-followup',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tgl Follow Up','type'=>'date'],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Telepon','WhatsApp','Email','Kunjungan']],['name'=>'pic','label'=>'PIC Sales','type'=>'text'],['name'=>'catatan','label'=>'Catatan','type'=>'textarea'],['name'=>'follow_up_berikut','label'=>'Follow Up Berikutnya','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Dijadwalkan','Selesai','Batal']]],
    'filterOptions'=>['Dijadwalkan','Selesai','Batal'],
]));
Route::get('/erp/customer-history', fn() => view('erp.crud', [
    'title'=>'Customer History','description'=>'Riwayat interaksi dan transaksi customer','module'=>'customer-history',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Pembelian','Pembayaran','Keluhan','Follow Up','Retur']],['name'=>'deskripsi','label'=>'Deskripsi','type'=>'textarea'],['name'=>'nilai','label'=>'Nilai Transaksi','type'=>'number','format'=>'currency'],['name'=>'pic','label'=>'PIC','type'=>'text']],
]));
Route::get('/erp/customer-complaint', fn() => view('erp.crud', [
    'title'=>'Customer Complaint','description'=>'Catat dan tangani keluhan pelanggan','module'=>'customer-complaint',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tgl Keluhan','type'=>'date'],['name'=>'keluhan','label'=>'Keluhan','type'=>'textarea'],['name'=>'kategori','label'=>'Kategori','type'=>'select','options'=>['Produk','Pengiriman','Pelayanan','Tagihan','Lainnya']],['name'=>'prioritas','label'=>'Prioritas','type'=>'select','options'=>['Rendah','Normal','Tinggi','Kritis']],['name'=>'pic','label'=>'PIC Handler','type'=>'text'],['name'=>'resolusi','label'=>'Resolusi','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Open','Proses','Resolved','Closed']]],
    'filterOptions'=>['Open','Proses','Resolved','Closed'],
]));
Route::get('/erp/whatsapp-blast', fn() => view('erp.crud', [
    'title'=>'WhatsApp Blast','description'=>'Kirim pesan massal ke customer via WhatsApp','module'=>'whatsapp-blast',
    'formFields'=>[['name'=>'nama_kampanye','label'=>'Nama Kampanye','type'=>'text','required'=>true],['name'=>'template','label'=>'Template Pesan','type'=>'textarea'],['name'=>'target_segment','label'=>'Target Segmen','type'=>'text'],['name'=>'jumlah_target','label'=>'Jumlah Target','type'=>'number'],['name'=>'tanggal_kirim','label'=>'Jadwal Kirim','type'=>'date'],['name'=>'terkirim','label'=>'Terkirim','type'=>'number','default'=>0],['name'=>'gagal','label'=>'Gagal','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dijadwalkan','Berjalan','Selesai','Dibatalkan']]],
    'filterOptions'=>['Draft','Dijadwalkan','Berjalan','Selesai'],
]));
Route::get('/erp/payment-reminder', fn() => view('erp.crud', [
    'title'=>'Reminder Pembayaran','description'=>'Otomasi reminder tagihan ke customer','module'=>'payment-reminder',
    'formFields'=>[['name'=>'customer','label'=>'Customer','type'=>'text','required'=>true],['name'=>'nomor_invoice','label'=>'No Invoice','type'=>'text'],['name'=>'jumlah','label'=>'Jumlah Tagihan','type'=>'number','format'=>'currency'],['name'=>'jatuh_tempo','label'=>'Jatuh Tempo','type'=>'date'],['name'=>'metode','label'=>'Metode Reminder','type'=>'select','options'=>['WhatsApp','SMS','Email']],['name'=>'tanggal_kirim','label'=>'Tgl Kirim','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Terjadwal','Terkirim','Gagal']]],
    'filterOptions'=>['Terjadwal','Terkirim','Gagal'],
]));

// ── Delivery Extended ──────────────────────────────────────────────────────
Route::get('/erp/delivery-note', fn() => view('erp.crud', [
    'title'=>'Surat Jalan','description'=>'Manajemen surat jalan pengiriman','module'=>'delivery-note',
    'formFields'=>[['name'=>'nomor','label'=>'No Surat Jalan','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'alamat','label'=>'Alamat Tujuan','type'=>'textarea'],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'total_item','label'=>'Total Item','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dalam Perjalanan','Terkirim','Gagal']]],
    'filterOptions'=>['Draft','Dalam Perjalanan','Terkirim','Gagal'],
]));
Route::get('/erp/tracking', fn() => view('erp.crud', [
    'title'=>'Tracking Pengiriman','description'=>'Pantau lokasi dan status pengiriman','module'=>'tracking',
    'formFields'=>[['name'=>'nomor_order','label'=>'No Order/SJ','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'driver','label'=>'Driver','type'=>'text'],['name'=>'lokasi_terakhir','label'=>'Lokasi Terakhir','type'=>'text'],['name'=>'estimasi_tiba','label'=>'Estimasi Tiba','type'=>'date'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Menunggu Pickup','Dalam Perjalanan','Terkirim','Gagal']]],
    'filterOptions'=>['Menunggu Pickup','Dalam Perjalanan','Terkirim','Gagal'],
]));
Route::get('/erp/fleet', fn() => view('erp.crud', [
    'title'=>'Armada Kendaraan','description'=>'Manajemen kendaraan pengiriman','module'=>'fleet',
    'formFields'=>[['name'=>'nomor_plat','label'=>'No Plat','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis','type'=>'select','options'=>['Motor','Mobil Box','Truk','Pickup']],['name'=>'merek','label'=>'Merek/Model','type'=>'text'],['name'=>'driver','label'=>'Driver Tetap','type'=>'text'],['name'=>'kapasitas','label'=>'Kapasitas (kg)','type'=>'number'],['name'=>'servis_terakhir','label'=>'Servis Terakhir','type'=>'date'],['name'=>'servis_berikut','label'=>'Servis Berikutnya','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Servis','Rusak','Non-Aktif']]],
    'filterOptions'=>['Aktif','Servis','Rusak','Non-Aktif'],
]));
Route::get('/erp/drivers', fn() => view('erp.crud', [
    'title'=>'Data Driver','description'=>'Master data driver pengiriman','module'=>'drivers',
    'formFields'=>[['name'=>'nama','label'=>'Nama Driver','type'=>'text','required'=>true],['name'=>'nomor_sim','label'=>'No SIM','type'=>'text'],['name'=>'jenis_sim','label'=>'Tipe SIM','type'=>'select','options'=>['SIM A','SIM B1','SIM B2','SIM C']],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'area','label'=>'Area Pengiriman','type'=>'text'],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Off','Non-Aktif']]],
    'filterOptions'=>['Aktif','Off','Non-Aktif'],
]));
Route::get('/erp/delivery-schedule', fn() => view('erp.crud', [
    'title'=>'Jadwal Pengiriman','description'=>'Jadwal dan rute pengiriman driver','module'=>'delivery-schedule',
    'formFields'=>[['name'=>'tanggal','label'=>'Tanggal','type'=>'date'],['name'=>'driver','label'=>'Driver','type'=>'text','required'=>true],['name'=>'kendaraan','label'=>'Kendaraan','type'=>'text'],['name'=>'area','label'=>'Area Tujuan','type'=>'text'],['name'=>'jumlah_order','label'=>'Jumlah Order','type'=>'number'],['name'=>'estimasi_jam','label'=>'Estimasi Berangkat','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Terjadwal','Berangkat','Selesai','Dibatalkan']]],
    'filterOptions'=>['Terjadwal','Berangkat','Selesai'],
]));

// ── HRD Extended ───────────────────────────────────────────────────────────
Route::get('/erp/incentive', fn() => view('erp.crud', [
    'title'=>'Insentif Karyawan','description'=>'Manajemen insentif dan bonus karyawan','module'=>'incentive',
    'formFields'=>[['name'=>'karyawan','label'=>'Nama Karyawan','type'=>'text','required'=>true],['name'=>'bulan','label'=>'Bulan','type'=>'text'],['name'=>'tahun','label'=>'Tahun','type'=>'number','default'=>date('Y')],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['Komisi','Bonus Kinerja','Bonus Proyek','THR','Lainnya']],['name'=>'jumlah','label'=>'Jumlah','type'=>'number','format'=>'currency'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Pending','Disetujui','Dibayar']]],
    'filterOptions'=>['Pending','Disetujui','Dibayar'],
]));
Route::get('/erp/division', fn() => view('erp.crud', [
    'title'=>'Divisi','description'=>'Master data divisi perusahaan','module'=>'division',
    'formFields'=>[['name'=>'nama','label'=>'Nama Divisi','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'kepala_divisi','label'=>'Kepala Divisi','type'=>'text'],['name'=>'jumlah_anggota','label'=>'Jumlah Anggota','type'=>'number','default'=>0],['name'=>'budget','label'=>'Budget Tahunan','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
    'filterOptions'=>['Aktif','Non-Aktif'],
]));
Route::get('/erp/login-activity', fn() => view('erp.crud', [
    'title'=>'Login Activity','description'=>'Log aktivitas login pengguna','module'=>'login-activity',
    'formFields'=>[['name'=>'user','label'=>'User','type'=>'text','required'=>true],['name'=>'tanggal','label'=>'Tanggal Login','type'=>'date'],['name'=>'waktu','label'=>'Waktu','type'=>'text'],['name'=>'ip_address','label'=>'IP Address','type'=>'text'],['name'=>'device','label'=>'Device/Browser','type'=>'text'],['name'=>'lokasi','label'=>'Lokasi','type'=>'text'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Sukses','Gagal']]],
    'filterOptions'=>['Sukses','Gagal'],
]));
Route::get('/erp/device-management', fn() => view('erp.crud', [
    'title'=>'Device Management','description'=>'Kelola perangkat yang terdaftar','module'=>'device-management',
    'formFields'=>[['name'=>'nama','label'=>'Nama Device','type'=>'text','required'=>true],['name'=>'tipe','label'=>'Tipe','type'=>'select','options'=>['PC','Laptop','Smartphone','Tablet']],['name'=>'user','label'=>'User','type'=>'text'],['name'=>'sistem_operasi','label'=>'OS','type'=>'text'],['name'=>'terakhir_aktif','label'=>'Terakhir Aktif','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Tidak Aktif','Diblokir']]],
    'filterOptions'=>['Aktif','Tidak Aktif','Diblokir'],
]));

// ── Service Center ─────────────────────────────────────────────────────────
Route::get('/erp/sparepart', fn() => view('erp.crud', [
    'title'=>'Sparepart','description'=>'Stok dan manajemen sparepart service center','module'=>'sparepart',
    'formFields'=>[['name'=>'nama','label'=>'Nama Sparepart','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode','type'=>'text'],['name'=>'merek','label'=>'Merek/Kompatibel','type'=>'text'],['name'=>'stok','label'=>'Stok','type'=>'number','default'=>0],['name'=>'satuan','label'=>'Satuan','type'=>'text'],['name'=>'harga_beli','label'=>'Harga Beli','type'=>'number','format'=>'currency'],['name'=>'harga_jual','label'=>'Harga Jual','type'=>'number','format'=>'currency'],['name'=>'min_stok','label'=>'Min Stok','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Tersedia','Habis','Discontinue']]],
    'filterOptions'=>['Tersedia','Habis','Discontinue'],
]));
Route::get('/erp/technician', fn() => view('erp.crud', [
    'title'=>'Teknisi','description'=>'Data teknisi dan spesialisasi servis','module'=>'technician',
    'formFields'=>[['name'=>'nama','label'=>'Nama Teknisi','type'=>'text','required'=>true],['name'=>'kode','label'=>'Kode Teknisi','type'=>'text'],['name'=>'spesialisasi','label'=>'Spesialisasi','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'sertifikasi','label'=>'Sertifikasi','type'=>'text'],['name'=>'beban_kerja','label'=>'Beban Kerja Sekarang','type'=>'number','default'=>0],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Sibuk','Libur','Non-Aktif']]],
    'filterOptions'=>['Aktif','Sibuk','Libur'],
]));
Route::get('/erp/service-schedule', fn() => view('erp.crud', [
    'title'=>'Jadwal Service','description'=>'Jadwal penerimaan dan pengerjaan servis','module'=>'service-schedule',
    'formFields'=>[['name'=>'nomor','label'=>'No Service','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'barang','label'=>'Barang','type'=>'text'],['name'=>'keluhan','label'=>'Keluhan','type'=>'textarea'],['name'=>'tanggal_masuk','label'=>'Tgl Masuk','type'=>'date'],['name'=>'teknisi','label'=>'Teknisi','type'=>'text'],['name'=>'estimasi_selesai','label'=>'Estimasi Selesai','type'=>'date'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Antri','Dikerjakan','Selesai','Diambil','Batal']]],
    'filterOptions'=>['Antri','Dikerjakan','Selesai'],
]));
Route::get('/erp/service-history', fn() => view('erp.crud', [
    'title'=>'Riwayat Service','description'=>'Histori lengkap pengerjaan servis','module'=>'service-history',
    'formFields'=>[['name'=>'nomor','label'=>'No Service','type'=>'text','required'=>true],['name'=>'customer','label'=>'Customer','type'=>'text'],['name'=>'barang','label'=>'Barang','type'=>'text'],['name'=>'keluhan','label'=>'Keluhan','type'=>'textarea'],['name'=>'solusi','label'=>'Solusi','type'=>'textarea'],['name'=>'teknisi','label'=>'Teknisi','type'=>'text'],['name'=>'tanggal_masuk','label'=>'Tgl Masuk','type'=>'date'],['name'=>'tanggal_selesai','label'=>'Tgl Selesai','type'=>'date'],['name'=>'biaya_jasa','label'=>'Biaya Jasa','type'=>'number','format'=>'currency'],['name'=>'biaya_sparepart','label'=>'Biaya Sparepart','type'=>'number','format'=>'currency'],['name'=>'total','label'=>'Total','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Selesai','Garansi','Dikembalikan']]],
]));

// ── Reports ────────────────────────────────────────────────────────────────
Route::get('/erp/report-purchase', fn() => view('erp.crud', [
    'title'=>'Laporan Pembelian','description'=>'Rekap laporan pembelian dari supplier','module'=>'report-purchase',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'supplier','label'=>'Supplier','type'=>'text'],['name'=>'jumlah_po','label'=>'Jumlah PO','type'=>'number'],['name'=>'total_nilai','label'=>'Total Nilai','type'=>'number','format'=>'currency'],['name'=>'on_time','label'=>'On Time (%)','type'=>'number'],['name'=>'keterangan','label'=>'Keterangan','type'=>'textarea']],
]));
Route::get('/erp/report-inventory', fn() => view('erp.crud', [
    'title'=>'Laporan Inventori','description'=>'Rekap laporan stok dan nilai persediaan','module'=>'report-inventory',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'stok','label'=>'Stok Saat Ini','type'=>'number'],['name'=>'nilai_inventory','label'=>'Nilai Inventory','type'=>'number','format'=>'currency'],['name'=>'perputaran','label'=>'Perputaran/Tahun','type'=>'number'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Normal','Rendah','Lebih']]],
]));
Route::get('/erp/report-tax', fn() => view('erp.crud', [
    'title'=>'Laporan Pajak','description'=>'Rekap semua kewajiban pajak','module'=>'report-tax',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'jenis','label'=>'Jenis Pajak','type'=>'text'],['name'=>'ppn_in','label'=>'PPN Masukan','type'=>'number','format'=>'currency'],['name'=>'ppn_out','label'=>'PPN Keluaran','type'=>'number','format'=>'currency'],['name'=>'pph','label'=>'PPh Terutang','type'=>'number','format'=>'currency'],['name'=>'total','label'=>'Total Pajak','type'=>'number','format'=>'currency'],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Draft','Dilaporkan']]],
]));
Route::get('/erp/profit-product', fn() => view('erp.crud', [
    'title'=>'Profit per Produk','description'=>'Analisa profit margin per produk','module'=>'profit-product',
    'formFields'=>[['name'=>'produk','label'=>'Produk','type'=>'text','required'=>true],['name'=>'kategori','label'=>'Kategori','type'=>'text'],['name'=>'total_terjual','label'=>'Qty Terjual','type'=>'number'],['name'=>'hpp','label'=>'HPP','type'=>'number','format'=>'currency'],['name'=>'harga_jual','label'=>'Harga Jual Rata','type'=>'number','format'=>'currency'],['name'=>'margin_persen','label'=>'Margin (%)','type'=>'number'],['name'=>'total_profit','label'=>'Total Profit','type'=>'number','format'=>'currency']],
]));
Route::get('/erp/profit-branch', fn() => view('erp.crud', [
    'title'=>'Profit per Cabang','description'=>'Analisa profitabilitas per cabang','module'=>'profit-branch',
    'formFields'=>[['name'=>'cabang','label'=>'Cabang','type'=>'text','required'=>true],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'hpp','label'=>'HPP','type'=>'number','format'=>'currency'],['name'=>'biaya_operasional','label'=>'Biaya Operasional','type'=>'number','format'=>'currency'],['name'=>'profit','label'=>'Profit Bersih','type'=>'number','format'=>'currency'],['name'=>'margin','label'=>'Margin (%)','type'=>'number']],
]));
Route::get('/erp/sales-trend', fn() => view('erp.crud', [
    'title'=>'Trend Penjualan','description'=>'Analisa tren dan pola penjualan','module'=>'sales-trend',
    'formFields'=>[['name'=>'periode','label'=>'Periode','type'=>'text','required'=>true],['name'=>'omzet','label'=>'Omzet','type'=>'number','format'=>'currency'],['name'=>'jumlah_order','label'=>'Jumlah Order','type'=>'number'],['name'=>'rata_per_order','label'=>'Rata per Order','type'=>'number','format'=>'currency'],['name'=>'growth_persen','label'=>'Growth (%)','type'=>'number'],['name'=>'top_produk','label'=>'Top Produk','type'=>'text']],
]));
Route::get('/erp/export-pdf', fn() => view('erp.crud', [
    'title'=>'Export PDF','description'=>'Generate dan download laporan PDF','module'=>'export-pdf',
    'formFields'=>[['name'=>'nama_laporan','label'=>'Nama Laporan','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'tanggal_export','label'=>'Tgl Export','type'=>'date'],['name'=>'format','label'=>'Format','type'=>'select','options'=>['PDF','PDF + Kop Surat','PDF Landscape']],['name'=>'ukuran','label'=>'Ukuran Kertas','type'=>'select','options'=>['A4','Letter','F4']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Antri','Diproses','Selesai','Gagal']]],
]));
Route::get('/erp/export-excel', fn() => view('erp.crud', [
    'title'=>'Export Excel','description'=>'Generate dan download laporan Excel','module'=>'export-excel',
    'formFields'=>[['name'=>'nama_laporan','label'=>'Nama Laporan','type'=>'text','required'=>true],['name'=>'modul','label'=>'Modul','type'=>'text'],['name'=>'periode','label'=>'Periode','type'=>'text'],['name'=>'tanggal_export','label'=>'Tgl Export','type'=>'date'],['name'=>'format','label'=>'Format','type'=>'select','options'=>['XLSX','XLS','CSV']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Antri','Diproses','Selesai','Gagal']]],
]));

// ── System ─────────────────────────────────────────────────────────────────
Route::get('/erp/company-profile', fn() => view('erp.crud', [
    'title'=>'Profil Perusahaan','description'=>'Informasi dan identitas perusahaan','module'=>'company-profile',
    'formFields'=>[['name'=>'nama_perusahaan','label'=>'Nama Perusahaan','type'=>'text','required'=>true],['name'=>'npwp','label'=>'NPWP','type'=>'text'],['name'=>'alamat','label'=>'Alamat','type'=>'textarea'],['name'=>'kota','label'=>'Kota','type'=>'text'],['name'=>'telepon','label'=>'Telepon','type'=>'text'],['name'=>'email','label'=>'Email','type'=>'email'],['name'=>'website','label'=>'Website','type'=>'text'],['name'=>'direktur','label'=>'Direktur','type'=>'text']],
]));
Route::get('/erp/document-numbering', fn() => view('erp.crud', [
    'title'=>'Penomoran Dokumen','description'=>'Format dan counter nomor dokumen','module'=>'document-numbering',
    'formFields'=>[['name'=>'modul','label'=>'Modul/Dokumen','type'=>'text','required'=>true],['name'=>'prefix','label'=>'Prefix','type'=>'text'],['name'=>'format','label'=>'Format','type'=>'text','placeholder'=>'PO/{YYYY}/{MM}/{NNN}'],['name'=>'urutan_terakhir','label'=>'Urutan Terakhir','type'=>'number','default'=>0],['name'=>'panjang_angka','label'=>'Panjang Angka','type'=>'number','default'=>3],['name'=>'reset_tahunan','label'=>'Reset Tahunan?','type'=>'select','options'=>['Ya','Tidak']],['name'=>'status','label'=>'Status','type'=>'select','options'=>['Aktif','Non-Aktif']]],
]));

// Marketplace sub-platform wildcard routes (Shopee/TikTok/Tokopedia/Lazada under /erp/)
$platformPageTitles = [
    'dashboard'       => 'Dashboard',
    'orders'          => 'Orders',
    'pending-orders'  => 'Pending Orders',
    'process-orders'  => 'Process Orders',
    'completed-orders'=> 'Completed Orders',
    'cancel-orders'   => 'Cancel Orders',
    'return-refund'   => 'Return & Refund',
    'products'        => 'Products',
    'product-mapping' => 'Product Mapping',
    'product-draft'   => 'Product Draft',
    'bulk-upload'     => 'Bulk Upload Product',
    'product-sync'    => 'Product Sync',
    'stocks'          => 'Stocks',
    'stock-sync'      => 'Stock Sync',
    'stock-buffer'    => 'Stock Buffer',
    'chat'            => 'Chat',
    'chat-ai'         => 'Chat AI Reply',
    'chat-broadcast'  => 'Chat Broadcast',
    'shipping'        => 'Shipping',
    'shipping-label'  => 'Shipping Label',
    'pickup'          => 'Pickup Request',
    'voucher'         => 'Voucher',
    'campaign'        => 'Campaign',
    'flash-sale'      => 'Flash Sale',
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
        return response('<html><body style="font-family:sans-serif;padding:40px">
            <h2>POS System</h2>
            <p>Build belum tersedia. Jalankan: <code>cd frontend/artifacts/pos-app && pnpm build</code></p>
        </body></html>', 200)->header('Content-Type', 'text/html');
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

    if ($errno || $httpCode === 0) {
        return response()->view('pos-placeholder')->header('Content-Type', 'text/html');
    }

    $headers = substr($response, 0, $headerSize);
    $body    = substr($response, $headerSize);

    $contentType = 'text/html';
    foreach (explode("\r\n", $headers) as $header) {
        if (stripos($header, 'content-type:') === 0) {
            $contentType = trim(substr($header, 13));
            break;
        }
    }

    return response($body, $httpCode)->header('Content-Type', $contentType);
})->where('path', '.*');

// ===== POS SYSTEM =====
use App\Http\Controllers\PosController;
Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
Route::post('/pos/store', [PosController::class, 'store'])->name('pos.store');
Route::get('/pos/receipt/{id}', [PosController::class, 'receipt'])->name('pos.receipt');

// ===== INTEGRATION DASHBOARD =====
use App\Http\Controllers\IntegrationDashboardController;
Route::get('/integration/dashboard', [IntegrationDashboardController::class, 'index'])->name('integration.dashboard');
Route::post('/integration/manual-sync', [IntegrationDashboardController::class, 'manualSync'])->name('integration.manual-sync');
Route::get('/integration/api-status', [IntegrationDashboardController::class, 'apiStatus'])->name('integration.api-status');

?>
