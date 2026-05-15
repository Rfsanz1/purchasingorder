<?php
/**
 * Konfigurasi semua Odoo Apps — sub-menu, field, stats, kanban
 * Dipakai oleh routes/web.php → view('erp.odoo-app', ['app' => ...])
 */
return [

    // ══════════════════════════════════════════════════════════════════
    // CRM
    // ══════════════════════════════════════════════════════════════════
    'crm' => [
        'title' => 'CRM',
        'color' => '#875A7B',
        'menus' => [
            [
                'label' => 'Pipeline', 'icon' => '📊', 'module' => 'crm-pipeline', 'addLabel' => 'Buat Peluang',
                'hasKanban' => true, 'filterField' => 'tahap', 'filterOptions' => ['Qualification','Proposition','Won','Lost'],
                'stats' => [
                    ['label' => 'Total Peluang', 'type' => 'count', 'icon' => '🤝', 'color' => '#875A7B'],
                    ['label' => 'Won', 'type' => 'count_where', 'field' => 'tahap', 'value' => 'Won', 'icon' => '🏆', 'color' => '#22c55e'],
                    ['label' => 'Total Nilai', 'type' => 'sum', 'field' => 'nilai', 'format' => 'currency', 'icon' => '💰', 'color' => '#0ea5e9'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Peluang', 'type' => 'text', 'required' => true],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text'],
                    ['name' => 'sales', 'label' => 'Salesperson', 'type' => 'text'],
                    ['name' => 'nilai', 'label' => 'Estimasi Nilai', 'type' => 'number'],
                    ['name' => 'probabilitas', 'label' => 'Probabilitas (%)', 'type' => 'number'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'type' => 'date'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'sumber', 'label' => 'Sumber', 'type' => 'select', 'options' => ['Website','Referral','Cold Call','Social Media','Event','Iklan','Lainnya']],
                    ['name' => 'tahap', 'label' => 'Tahap', 'type' => 'select', 'options' => ['Qualification','Proposition','Won','Lost']],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Peluang'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'nilai', 'label' => 'Nilai', 'format' => 'currency'],
                    ['name' => 'probabilitas', 'label' => 'Prob.'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'tahap', 'label' => 'Tahap', 'badge' => true],
                ],
            ],
            [
                'label' => 'Leads', 'icon' => '🎯', 'module' => 'crm-leads', 'addLabel' => 'Tambah Lead',
                'filterField' => 'status', 'filterOptions' => ['New','Qualified','Converted','Lost'],
                'stats' => [
                    ['label' => 'Total Leads', 'type' => 'count', 'icon' => '🎯', 'color' => '#875A7B'],
                    ['label' => 'New', 'type' => 'count_where', 'field' => 'status', 'value' => 'New', 'icon' => '🆕', 'color' => '#f59e0b'],
                    ['label' => 'Qualified', 'type' => 'count_where', 'field' => 'status', 'value' => 'Qualified', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama_lead', 'label' => 'Nama Lead/Perusahaan', 'type' => 'text', 'required' => true],
                    ['name' => 'kontak', 'label' => 'Nama Kontak', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'sumber', 'label' => 'Sumber', 'type' => 'select', 'options' => ['Website','Referral','Cold Call','Social Media','Event','Lainnya']],
                    ['name' => 'nilai', 'label' => 'Estimasi Nilai', 'type' => 'number'],
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','Qualified','Converted','Lost']],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                ],
                'tableFields' => [
                    ['name' => 'nama_lead', 'label' => 'Lead'],
                    ['name' => 'kontak', 'label' => 'Kontak'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'nilai', 'label' => 'Nilai', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pelanggan', 'icon' => '👥', 'module' => 'crm-customers', 'addLabel' => 'Tambah Pelanggan',
                'filterField' => 'tipe', 'filterOptions' => ['Individual','Perusahaan'],
                'stats' => [
                    ['label' => 'Total Pelanggan', 'type' => 'count', 'icon' => '👥', 'color' => '#ec4899'],
                    ['label' => 'Perusahaan', 'type' => 'count_where', 'field' => 'tipe', 'value' => 'Perusahaan', 'icon' => '🏢', 'color' => '#0ea5e9'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe', 'type' => 'select', 'options' => ['Individual','Perusahaan']],
                    ['name' => 'perusahaan', 'label' => 'Perusahaan', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'mobile', 'label' => 'HP', 'type' => 'text'],
                    ['name' => 'alamat', 'label' => 'Alamat', 'type' => 'textarea'],
                    ['name' => 'kota', 'label' => 'Kota', 'type' => 'text'],
                    ['name' => 'npwp', 'label' => 'NPWP', 'type' => 'text'],
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text'],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Nama'],
                    ['name' => 'tipe', 'label' => 'Tipe', 'badge' => true],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'telepon', 'label' => 'Telepon'],
                    ['name' => 'kota', 'label' => 'Kota'],
                ],
            ],
            [
                'label' => 'Aktivitas', 'icon' => '📅', 'module' => 'crm-activities', 'addLabel' => 'Tambah Aktivitas',
                'filterField' => 'status', 'filterOptions' => ['Planned','Done','Overdue','Cancelled'],
                'formFields' => [
                    ['name' => 'tipe', 'label' => 'Tipe Aktivitas', 'type' => 'select', 'options' => ['Telepon','Email','Meeting','Demo','Follow Up','WhatsApp','Lainnya']],
                    ['name' => 'judul', 'label' => 'Judul', 'type' => 'text', 'required' => true],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text'],
                    ['name' => 'peluang', 'label' => 'Peluang', 'type' => 'text'],
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Planned','Done','Overdue','Cancelled']],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                ],
                'tableFields' => [
                    ['name' => 'judul', 'label' => 'Aktivitas'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // SALES
    // ══════════════════════════════════════════════════════════════════
    'sales' => [
        'title' => 'Sales',
        'color' => '#00A09D',
        'menus' => [
            [
                'label' => 'Quotations', 'icon' => '📄', 'module' => 'sales-quotations', 'addLabel' => 'Buat Quotation',
                'filterField' => 'status', 'filterOptions' => ['Draft','Sent','Sales Order','Cancelled'],
                'stats' => [
                    ['label' => 'Total Quotation', 'type' => 'count', 'icon' => '📄', 'color' => '#00A09D'],
                    ['label' => 'Sent', 'type' => 'count_where', 'field' => 'status', 'value' => 'Sent', 'icon' => '📤', 'color' => '#0ea5e9'],
                    ['label' => 'Total Nilai', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Quotation', 'type' => 'text'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'expire', 'label' => 'Berlaku Sampai', 'type' => 'date'],
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text'],
                    ['name' => 'pricelist', 'label' => 'Pricelist', 'type' => 'text'],
                    ['name' => 'produk', 'label' => 'Produk', 'type' => 'textarea'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Sent','Sales Order','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Sales Orders', 'icon' => '📦', 'module' => 'sales-orders', 'addLabel' => 'Buat Sales Order',
                'filterField' => 'status', 'filterOptions' => ['Sales Order','Locked','Cancelled'],
                'stats' => [
                    ['label' => 'Total SO', 'type' => 'count', 'icon' => '📦', 'color' => '#00A09D'],
                    ['label' => 'Total Nilai', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor SO', 'type' => 'text'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal Order', 'type' => 'date'],
                    ['name' => 'tanggal_kirim', 'label' => 'Tanggal Kirim', 'type' => 'date'],
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text'],
                    ['name' => 'gudang', 'label' => 'Gudang', 'type' => 'text'],
                    ['name' => 'produk', 'label' => 'Produk & Qty', 'type' => 'textarea'],
                    ['name' => 'subtotal', 'label' => 'Subtotal', 'type' => 'number'],
                    ['name' => 'diskon', 'label' => 'Diskon', 'type' => 'number'],
                    ['name' => 'pajak', 'label' => 'Pajak', 'type' => 'number'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Sales Order','Locked','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor SO'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pelanggan', 'icon' => '👥', 'module' => 'sales-customers', 'addLabel' => 'Tambah Pelanggan',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif','Blacklist'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'alamat', 'label' => 'Alamat', 'type' => 'textarea'],
                    ['name' => 'kota', 'label' => 'Kota', 'type' => 'text'],
                    ['name' => 'npwp', 'label' => 'NPWP', 'type' => 'text'],
                    ['name' => 'limit_kredit', 'label' => 'Limit Kredit', 'type' => 'number'],
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text'],
                    ['name' => 'pricelist', 'label' => 'Pricelist', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif','Blacklist']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Nama'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'telepon', 'label' => 'Telepon'],
                    ['name' => 'kota', 'label' => 'Kota'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Produk', 'icon' => '🛍️', 'module' => 'sales-products', 'addLabel' => 'Tambah Produk',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Arsip'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Produk', 'type' => 'text', 'required' => true],
                    ['name' => 'kode', 'label' => 'Kode/SKU', 'type' => 'text'],
                    ['name' => 'kategori', 'label' => 'Kategori', 'type' => 'text'],
                    ['name' => 'brand', 'label' => 'Brand', 'type' => 'text'],
                    ['name' => 'harga_jual', 'label' => 'Harga Jual', 'type' => 'number'],
                    ['name' => 'harga_beli', 'label' => 'Harga Beli', 'type' => 'number'],
                    ['name' => 'satuan', 'label' => 'Satuan', 'type' => 'text'],
                    ['name' => 'stok', 'label' => 'Stok', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Arsip']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Produk'],
                    ['name' => 'kode', 'label' => 'SKU'],
                    ['name' => 'kategori', 'label' => 'Kategori'],
                    ['name' => 'harga_jual', 'label' => 'Harga Jual', 'format' => 'currency'],
                    ['name' => 'stok', 'label' => 'Stok'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pricelist', 'icon' => '💲', 'module' => 'sales-pricelist', 'addLabel' => 'Buat Pricelist',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Pricelist', 'type' => 'text', 'required' => true],
                    ['name' => 'mata_uang', 'label' => 'Mata Uang', 'type' => 'select', 'options' => ['IDR','USD','SGD','EUR']],
                    ['name' => 'tipe', 'label' => 'Tipe Diskon', 'type' => 'select', 'options' => ['Persentase','Harga Tetap','Rumus']],
                    ['name' => 'diskon', 'label' => 'Diskon (%)', 'type' => 'number'],
                    ['name' => 'berlaku_dari', 'label' => 'Berlaku Dari', 'type' => 'date'],
                    ['name' => 'berlaku_sampai', 'label' => 'Berlaku Sampai', 'type' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Pricelist'],
                    ['name' => 'mata_uang', 'label' => 'Mata Uang'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'diskon', 'label' => 'Diskon (%)'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Komisi', 'icon' => '💰', 'module' => 'sales-commission', 'addLabel' => 'Tambah Komisi',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Paid'],
                'stats' => [
                    ['label' => 'Total Komisi', 'type' => 'sum', 'field' => 'komisi', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'salesperson', 'label' => 'Salesperson', 'type' => 'text', 'required' => true],
                    ['name' => 'periode', 'label' => 'Periode', 'type' => 'text'],
                    ['name' => 'total_penjualan', 'label' => 'Total Penjualan', 'type' => 'number'],
                    ['name' => 'persen', 'label' => 'Persen Komisi (%)', 'type' => 'number'],
                    ['name' => 'komisi', 'label' => 'Komisi', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Paid']],
                ],
                'tableFields' => [
                    ['name' => 'salesperson', 'label' => 'Salesperson'],
                    ['name' => 'periode', 'label' => 'Periode'],
                    ['name' => 'total_penjualan', 'label' => 'Total Penjualan', 'format' => 'currency'],
                    ['name' => 'komisi', 'label' => 'Komisi', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // ACCOUNTING
    // ══════════════════════════════════════════════════════════════════
    'accounting' => [
        'title' => 'Accounting',
        'color' => '#7C7BAD',
        'menus' => [
            [
                'label' => 'Invoice Pelanggan', 'icon' => '🧾', 'module' => 'acc-customer-invoices', 'addLabel' => 'Buat Invoice',
                'filterField' => 'status', 'filterOptions' => ['Draft','Posted','Paid','Cancelled'],
                'stats' => [
                    ['label' => 'Total Invoice', 'type' => 'count', 'icon' => '🧾', 'color' => '#7C7BAD'],
                    ['label' => 'Belum Lunas', 'type' => 'count_where', 'field' => 'status', 'value' => 'Posted', 'icon' => '⏳', 'color' => '#ef4444'],
                    ['label' => 'Total Tagihan', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Invoice', 'type' => 'text'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal Invoice', 'type' => 'date'],
                    ['name' => 'jatuh_tempo', 'label' => 'Jatuh Tempo', 'type' => 'date'],
                    ['name' => 'produk', 'label' => 'Produk / Deskripsi', 'type' => 'textarea'],
                    ['name' => 'subtotal', 'label' => 'Subtotal', 'type' => 'number'],
                    ['name' => 'ppn', 'label' => 'PPN (11%)', 'type' => 'number'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'metode_bayar', 'label' => 'Metode Pembayaran', 'type' => 'select', 'options' => ['Transfer','Tunai','Giro','QRIS']],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Posted','Paid','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jatuh_tempo', 'label' => 'Jatuh Tempo', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Tagihan Supplier', 'icon' => '📥', 'module' => 'acc-vendor-bills', 'addLabel' => 'Buat Bill Supplier',
                'filterField' => 'status', 'filterOptions' => ['Draft','Posted','Paid','Cancelled'],
                'stats' => [
                    ['label' => 'Total Bill', 'type' => 'count', 'icon' => '📥', 'color' => '#ef4444'],
                    ['label' => 'Total Hutang', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '💸', 'color' => '#ef4444'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Bill', 'type' => 'text'],
                    ['name' => 'supplier', 'label' => 'Supplier', 'type' => 'text', 'required' => true],
                    ['name' => 'no_ref', 'label' => 'No. Ref Supplier', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal Bill', 'type' => 'date'],
                    ['name' => 'jatuh_tempo', 'label' => 'Jatuh Tempo', 'type' => 'date'],
                    ['name' => 'deskripsi', 'label' => 'Produk / Deskripsi', 'type' => 'textarea'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Posted','Paid','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'supplier', 'label' => 'Supplier'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jatuh_tempo', 'label' => 'Jatuh Tempo', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pembayaran', 'icon' => '💳', 'module' => 'acc-payments', 'addLabel' => 'Catat Pembayaran',
                'filterField' => 'status', 'filterOptions' => ['Draft','Posted','Cancelled'],
                'stats' => [
                    ['label' => 'Total Pembayaran', 'type' => 'sum', 'field' => 'jumlah', 'format' => 'currency', 'icon' => '💳', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'tipe', 'label' => 'Tipe', 'type' => 'select', 'options' => ['Pelanggan','Supplier']],
                    ['name' => 'mitra', 'label' => 'Pelanggan/Supplier', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'jumlah', 'label' => 'Jumlah', 'type' => 'number'],
                    ['name' => 'metode', 'label' => 'Metode', 'type' => 'select', 'options' => ['Transfer','Tunai','Giro','QRIS','Cek']],
                    ['name' => 'rekening', 'label' => 'Rekening Bank', 'type' => 'text'],
                    ['name' => 'referensi', 'label' => 'Referensi', 'type' => 'text'],
                    ['name' => 'memo', 'label' => 'Memo', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Posted','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'mitra', 'label' => 'Pelanggan/Supplier'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jumlah', 'label' => 'Jumlah', 'format' => 'currency'],
                    ['name' => 'metode', 'label' => 'Metode'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Jurnal', 'icon' => '📔', 'module' => 'acc-journal-entries', 'addLabel' => 'Buat Jurnal',
                'filterField' => 'status', 'filterOptions' => ['Draft','Posted','Cancelled'],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Jurnal', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'jurnal', 'label' => 'Jurnal', 'type' => 'select', 'options' => ['Penjualan','Pembelian','Kas','Bank','Penyesuaian']],
                    ['name' => 'referensi', 'label' => 'Referensi', 'type' => 'text'],
                    ['name' => 'debit', 'label' => 'Total Debit', 'type' => 'number'],
                    ['name' => 'kredit', 'label' => 'Total Kredit', 'type' => 'number'],
                    ['name' => 'keterangan', 'label' => 'Keterangan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Posted','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jurnal', 'label' => 'Jurnal'],
                    ['name' => 'referensi', 'label' => 'Referensi'],
                    ['name' => 'debit', 'label' => 'Debit', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Bank & Kas', 'icon' => '🏦', 'module' => 'acc-bank', 'addLabel' => 'Tambah Rekening',
                'filterField' => 'tipe', 'filterOptions' => ['Bank','Kas','E-Wallet'],
                'stats' => [
                    ['label' => 'Total Rekening', 'type' => 'count', 'icon' => '🏦', 'color' => '#0ea5e9'],
                    ['label' => 'Total Saldo', 'type' => 'sum', 'field' => 'saldo', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Rekening', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe', 'type' => 'select', 'options' => ['Bank','Kas','E-Wallet']],
                    ['name' => 'bank', 'label' => 'Nama Bank', 'type' => 'text'],
                    ['name' => 'no_rekening', 'label' => 'No. Rekening', 'type' => 'text'],
                    ['name' => 'atas_nama', 'label' => 'Atas Nama', 'type' => 'text'],
                    ['name' => 'saldo', 'label' => 'Saldo Awal', 'type' => 'number'],
                    ['name' => 'mata_uang', 'label' => 'Mata Uang', 'type' => 'select', 'options' => ['IDR','USD','SGD']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Rekening'],
                    ['name' => 'tipe', 'label' => 'Tipe', 'badge' => true],
                    ['name' => 'bank', 'label' => 'Bank'],
                    ['name' => 'no_rekening', 'label' => 'No. Rekening'],
                    ['name' => 'saldo', 'label' => 'Saldo', 'format' => 'currency'],
                ],
            ],
            [
                'label' => 'Chart of Accounts', 'icon' => '🗂️', 'module' => 'acc-chart-accounts', 'addLabel' => 'Tambah Akun',
                'filterField' => 'tipe', 'filterOptions' => ['Aktiva','Kewajiban','Ekuitas','Pendapatan','Beban'],
                'formFields' => [
                    ['name' => 'kode', 'label' => 'Kode Akun', 'type' => 'text', 'required' => true],
                    ['name' => 'nama', 'label' => 'Nama Akun', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe Akun', 'type' => 'select', 'options' => ['Aktiva','Kewajiban','Ekuitas','Pendapatan','Beban']],
                    ['name' => 'jenis', 'label' => 'Jenis', 'type' => 'select', 'options' => ['Debit Normal','Kredit Normal']],
                    ['name' => 'saldo_awal', 'label' => 'Saldo Awal', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                ],
                'tableFields' => [
                    ['name' => 'kode', 'label' => 'Kode'],
                    ['name' => 'nama', 'label' => 'Nama Akun'],
                    ['name' => 'tipe', 'label' => 'Tipe', 'badge' => true],
                    ['name' => 'jenis', 'label' => 'Jenis'],
                    ['name' => 'saldo_awal', 'label' => 'Saldo Awal', 'format' => 'currency'],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // INVENTORY (Products page)
    // ══════════════════════════════════════════════════════════════════
    'inventory' => [
        'title' => 'Inventory',
        'color' => '#F06050',
        'menus' => [
            [
                'label' => 'Produk', 'icon' => '📦', 'module' => 'inv-products', 'addLabel' => 'Tambah Produk',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Arsip'],
                'stats' => [
                    ['label' => 'Total Produk', 'type' => 'count', 'icon' => '📦', 'color' => '#F06050'],
                    ['label' => 'Stok Kritis', 'type' => 'count_where', 'field' => 'status', 'value' => 'Arsip', 'icon' => '⚠️', 'color' => '#ef4444'],
                    ['label' => 'Nilai Stok', 'type' => 'sum', 'field' => 'nilai_stok', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Produk', 'type' => 'text', 'required' => true],
                    ['name' => 'kode', 'label' => 'Kode/SKU', 'type' => 'text'],
                    ['name' => 'kategori', 'label' => 'Kategori', 'type' => 'text'],
                    ['name' => 'brand', 'label' => 'Brand', 'type' => 'text'],
                    ['name' => 'satuan', 'label' => 'Satuan', 'type' => 'text'],
                    ['name' => 'harga_beli', 'label' => 'Harga Beli', 'type' => 'number'],
                    ['name' => 'harga_jual', 'label' => 'Harga Jual', 'type' => 'number'],
                    ['name' => 'stok', 'label' => 'Stok', 'type' => 'number'],
                    ['name' => 'stok_min', 'label' => 'Stok Min', 'type' => 'number'],
                    ['name' => 'gudang', 'label' => 'Gudang', 'type' => 'text'],
                    ['name' => 'nilai_stok', 'label' => 'Nilai Stok', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Arsip']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Produk'],
                    ['name' => 'kode', 'label' => 'SKU'],
                    ['name' => 'kategori', 'label' => 'Kategori'],
                    ['name' => 'stok', 'label' => 'Stok'],
                    ['name' => 'harga_jual', 'label' => 'Harga Jual', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Penerimaan', 'icon' => '📥', 'module' => 'inv-receipts', 'addLabel' => 'Buat Penerimaan',
                'filterField' => 'status', 'filterOptions' => ['Draft','Ready','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor GRN', 'type' => 'text'],
                    ['name' => 'supplier', 'label' => 'Supplier', 'type' => 'text', 'required' => true],
                    ['name' => 'po_ref', 'label' => 'Ref. PO', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'gudang', 'label' => 'Gudang Tujuan', 'type' => 'text'],
                    ['name' => 'produk', 'label' => 'Produk & Qty', 'type' => 'textarea'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Ready','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor GRN'],
                    ['name' => 'supplier', 'label' => 'Supplier'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'gudang', 'label' => 'Gudang'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pengiriman', 'icon' => '🚚', 'module' => 'inv-deliveries', 'addLabel' => 'Buat Pengiriman',
                'filterField' => 'status', 'filterOptions' => ['Draft','Waiting','Ready','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor DO', 'type' => 'text'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'so_ref', 'label' => 'Ref. SO', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal Kirim', 'type' => 'date'],
                    ['name' => 'gudang', 'label' => 'Gudang Asal', 'type' => 'text'],
                    ['name' => 'alamat_kirim', 'label' => 'Alamat Pengiriman', 'type' => 'textarea'],
                    ['name' => 'produk', 'label' => 'Produk & Qty', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Waiting','Ready','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor DO'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'gudang', 'label' => 'Gudang'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Transfer Internal', 'icon' => '🔀', 'module' => 'inv-transfers', 'addLabel' => 'Buat Transfer',
                'filterField' => 'status', 'filterOptions' => ['Draft','Ready','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Transfer', 'type' => 'text'],
                    ['name' => 'dari', 'label' => 'Dari Gudang', 'type' => 'text', 'required' => true],
                    ['name' => 'ke', 'label' => 'Ke Gudang', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'produk', 'label' => 'Produk & Qty', 'type' => 'textarea'],
                    ['name' => 'alasan', 'label' => 'Alasan', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Ready','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'dari', 'label' => 'Dari'],
                    ['name' => 'ke', 'label' => 'Ke'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Stock Opname', 'icon' => '🔍', 'module' => 'inv-stock-opname', 'addLabel' => 'Buat Opname',
                'filterField' => 'status', 'filterOptions' => ['Draft','In Progress','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Opname', 'type' => 'text'],
                    ['name' => 'gudang', 'label' => 'Gudang', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'penanggung_jawab', 'label' => 'Penanggung Jawab', 'type' => 'text'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','In Progress','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'gudang', 'label' => 'Gudang'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'penanggung_jawab', 'label' => 'PIC'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Gudang', 'icon' => '🏭', 'module' => 'inv-warehouses', 'addLabel' => 'Tambah Gudang',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Gudang', 'type' => 'text', 'required' => true],
                    ['name' => 'kode', 'label' => 'Kode', 'type' => 'text'],
                    ['name' => 'alamat', 'label' => 'Alamat', 'type' => 'textarea'],
                    ['name' => 'kota', 'label' => 'Kota', 'type' => 'text'],
                    ['name' => 'pic', 'label' => 'Penanggung Jawab', 'type' => 'text'],
                    ['name' => 'kapasitas', 'label' => 'Kapasitas', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Gudang'],
                    ['name' => 'kode', 'label' => 'Kode'],
                    ['name' => 'kota', 'label' => 'Kota'],
                    ['name' => 'pic', 'label' => 'PIC'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // MANUFACTURING
    // ══════════════════════════════════════════════════════════════════
    'manufacturing' => [
        'title' => 'Manufacturing',
        'color' => '#f59e0b',
        'menus' => [
            [
                'label' => 'Production Orders', 'icon' => '🏭', 'module' => 'mfg-orders', 'addLabel' => 'Buat MO',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','In Progress','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total MO', 'type' => 'count', 'icon' => '🏭', 'color' => '#f59e0b'],
                    ['label' => 'In Progress', 'type' => 'count_where', 'field' => 'status', 'value' => 'In Progress', 'icon' => '⚙️', 'color' => '#f97316'],
                    ['label' => 'Done', 'type' => 'count_where', 'field' => 'status', 'value' => 'Done', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor MO', 'type' => 'text'],
                    ['name' => 'produk', 'label' => 'Produk Jadi', 'type' => 'text', 'required' => true],
                    ['name' => 'qty', 'label' => 'Qty', 'type' => 'number'],
                    ['name' => 'bom', 'label' => 'Bill of Materials', 'type' => 'text'],
                    ['name' => 'work_center', 'label' => 'Work Center', 'type' => 'text'],
                    ['name' => 'tanggal_mulai', 'label' => 'Tanggal Mulai', 'type' => 'date'],
                    ['name' => 'tanggal_selesai', 'label' => 'Tanggal Selesai', 'type' => 'date'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','In Progress','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor MO'],
                    ['name' => 'produk', 'label' => 'Produk'],
                    ['name' => 'qty', 'label' => 'Qty'],
                    ['name' => 'tanggal_mulai', 'label' => 'Mulai', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Bill of Materials', 'icon' => '📋', 'module' => 'mfg-bom', 'addLabel' => 'Tambah BOM',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Draft','Obsolete'],
                'formFields' => [
                    ['name' => 'produk', 'label' => 'Produk Jadi', 'type' => 'text', 'required' => true],
                    ['name' => 'qty', 'label' => 'Qty Produksi', 'type' => 'number'],
                    ['name' => 'tipe', 'label' => 'Tipe BOM', 'type' => 'select', 'options' => ['Manufacture','Kit','Subcontracting']],
                    ['name' => 'komponen', 'label' => 'Komponen & Qty', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'routing', 'label' => 'Routing', 'type' => 'text'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Draft','Obsolete']],
                ],
                'tableFields' => [
                    ['name' => 'produk', 'label' => 'Produk'],
                    ['name' => 'qty', 'label' => 'Qty'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'routing', 'label' => 'Routing'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Work Orders', 'icon' => '⚙️', 'module' => 'mfg-work-orders', 'addLabel' => 'Buat Work Order',
                'filterField' => 'status', 'filterOptions' => ['Draft','Ready','In Progress','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'mo_ref', 'label' => 'Ref. Manufacturing Order', 'type' => 'text'],
                    ['name' => 'operasi', 'label' => 'Operasi', 'type' => 'text', 'required' => true],
                    ['name' => 'work_center', 'label' => 'Work Center', 'type' => 'text'],
                    ['name' => 'operator', 'label' => 'Operator', 'type' => 'text'],
                    ['name' => 'durasi_rencana', 'label' => 'Durasi Rencana (menit)', 'type' => 'number'],
                    ['name' => 'durasi_aktual', 'label' => 'Durasi Aktual (menit)', 'type' => 'number'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Ready','In Progress','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'mo_ref', 'label' => 'MO'],
                    ['name' => 'operasi', 'label' => 'Operasi'],
                    ['name' => 'work_center', 'label' => 'Work Center'],
                    ['name' => 'operator', 'label' => 'Operator'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Work Centers', 'icon' => '🏗️', 'module' => 'mfg-work-centers', 'addLabel' => 'Tambah Work Center',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Work Center', 'type' => 'text', 'required' => true],
                    ['name' => 'kode', 'label' => 'Kode', 'type' => 'text'],
                    ['name' => 'kapasitas', 'label' => 'Kapasitas (jam/hari)', 'type' => 'number'],
                    ['name' => 'biaya_per_jam', 'label' => 'Biaya/Jam', 'type' => 'number'],
                    ['name' => 'pic', 'label' => 'PIC', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Work Center'],
                    ['name' => 'kode', 'label' => 'Kode'],
                    ['name' => 'kapasitas', 'label' => 'Kapasitas (jam)'],
                    ['name' => 'biaya_per_jam', 'label' => 'Biaya/Jam', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Scraps', 'icon' => '🗑️', 'module' => 'mfg-scraps', 'addLabel' => 'Catat Scrap',
                'filterField' => 'status', 'filterOptions' => ['Draft','Done'],
                'formFields' => [
                    ['name' => 'produk', 'label' => 'Produk', 'type' => 'text', 'required' => true],
                    ['name' => 'qty', 'label' => 'Qty Scrap', 'type' => 'number'],
                    ['name' => 'satuan', 'label' => 'Satuan', 'type' => 'text'],
                    ['name' => 'asal', 'label' => 'Lokasi Asal', 'type' => 'text'],
                    ['name' => 'alasan', 'label' => 'Alasan Scrap', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Done']],
                ],
                'tableFields' => [
                    ['name' => 'produk', 'label' => 'Produk'],
                    ['name' => 'qty', 'label' => 'Qty Scrap'],
                    ['name' => 'asal', 'label' => 'Dari'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // PURCHASE
    // ══════════════════════════════════════════════════════════════════
    'purchase' => [
        'title' => 'Purchase',
        'color' => '#F4A460',
        'menus' => [
            [
                'label' => 'RFQ', 'icon' => '📨', 'module' => 'pur-rfq', 'addLabel' => 'Buat RFQ',
                'filterField' => 'status', 'filterOptions' => ['Draft','Sent','Purchase Order','Cancelled'],
                'stats' => [
                    ['label' => 'Total RFQ', 'type' => 'count', 'icon' => '📨', 'color' => '#F4A460'],
                    ['label' => 'Menunggu', 'type' => 'count_where', 'field' => 'status', 'value' => 'Sent', 'icon' => '⏳', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor RFQ', 'type' => 'text'],
                    ['name' => 'supplier', 'label' => 'Supplier', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'deadline', 'label' => 'Deadline Penawaran', 'type' => 'date'],
                    ['name' => 'produk', 'label' => 'Produk & Qty', 'type' => 'textarea'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Sent','Purchase Order','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor RFQ'],
                    ['name' => 'supplier', 'label' => 'Supplier'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Purchase Orders', 'icon' => '🛒', 'module' => 'pur-orders', 'addLabel' => 'Buat PO',
                'filterField' => 'status', 'filterOptions' => ['Purchase Order','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total PO', 'type' => 'count', 'icon' => '🛒', 'color' => '#F4A460'],
                    ['label' => 'Total Nilai', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor PO', 'type' => 'text'],
                    ['name' => 'supplier', 'label' => 'Supplier', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal Order', 'type' => 'date'],
                    ['name' => 'tanggal_terima', 'label' => 'Est. Penerimaan', 'type' => 'date'],
                    ['name' => 'produk', 'label' => 'Produk & Qty', 'type' => 'textarea'],
                    ['name' => 'subtotal', 'label' => 'Subtotal', 'type' => 'number'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'termin', 'label' => 'Termin Pembayaran', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Purchase Order','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor PO'],
                    ['name' => 'supplier', 'label' => 'Supplier'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Supplier', 'icon' => '🤝', 'module' => 'pur-suppliers', 'addLabel' => 'Tambah Supplier',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif','Blacklist'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Supplier', 'type' => 'text', 'required' => true],
                    ['name' => 'kode', 'label' => 'Kode Supplier', 'type' => 'text'],
                    ['name' => 'kontak', 'label' => 'Nama Kontak', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'alamat', 'label' => 'Alamat', 'type' => 'textarea'],
                    ['name' => 'kota', 'label' => 'Kota', 'type' => 'text'],
                    ['name' => 'npwp', 'label' => 'NPWP', 'type' => 'text'],
                    ['name' => 'termin', 'label' => 'Termin Pembayaran', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif','Blacklist']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Supplier'],
                    ['name' => 'kontak', 'label' => 'Kontak'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'telepon', 'label' => 'Telepon'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // EMPLOYEES (HR)
    // ══════════════════════════════════════════════════════════════════
    'employees' => [
        'title' => 'Employees',
        'color' => '#00C09D',
        'menus' => [
            [
                'label' => 'Karyawan', 'icon' => '👤', 'module' => 'hr-employees', 'addLabel' => 'Tambah Karyawan',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Cuti','Tidak Aktif'],
                'stats' => [
                    ['label' => 'Total Karyawan', 'type' => 'count', 'icon' => '👤', 'color' => '#00C09D'],
                    ['label' => 'Aktif', 'type' => 'count_where', 'field' => 'status', 'value' => 'Aktif', 'icon' => '✅', 'color' => '#22c55e'],
                    ['label' => 'Cuti', 'type' => 'count_where', 'field' => 'status', 'value' => 'Cuti', 'icon' => '🌴', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Lengkap', 'type' => 'text', 'required' => true],
                    ['name' => 'nik', 'label' => 'NIK Karyawan', 'type' => 'text'],
                    ['name' => 'jabatan', 'label' => 'Jabatan', 'type' => 'text'],
                    ['name' => 'departemen', 'label' => 'Departemen', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email Kerja', 'type' => 'email'],
                    ['name' => 'mobile', 'label' => 'HP', 'type' => 'text'],
                    ['name' => 'tanggal_masuk', 'label' => 'Tanggal Masuk', 'type' => 'date'],
                    ['name' => 'kontrak', 'label' => 'Tipe Kontrak', 'type' => 'select', 'options' => ['PKWTT','PKWT','Freelance','Magang']],
                    ['name' => 'gaji_pokok', 'label' => 'Gaji Pokok', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Cuti','Tidak Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Nama'],
                    ['name' => 'nik', 'label' => 'NIK'],
                    ['name' => 'jabatan', 'label' => 'Jabatan'],
                    ['name' => 'departemen', 'label' => 'Departemen'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Departemen', 'icon' => '🏬', 'module' => 'hr-departments', 'addLabel' => 'Tambah Departemen',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Departemen', 'type' => 'text', 'required' => true],
                    ['name' => 'kode', 'label' => 'Kode', 'type' => 'text'],
                    ['name' => 'manajer', 'label' => 'Manajer', 'type' => 'text'],
                    ['name' => 'parent', 'label' => 'Departemen Induk', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Departemen'],
                    ['name' => 'kode', 'label' => 'Kode'],
                    ['name' => 'manajer', 'label' => 'Manajer'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Kontrak', 'icon' => '📝', 'module' => 'hr-contracts', 'addLabel' => 'Buat Kontrak',
                'filterField' => 'status', 'filterOptions' => ['New','Active','Expired','Cancelled'],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'jabatan', 'label' => 'Jabatan', 'type' => 'text'],
                    ['name' => 'tipe', 'label' => 'Tipe Kontrak', 'type' => 'select', 'options' => ['PKWTT','PKWT','Freelance','Magang']],
                    ['name' => 'mulai', 'label' => 'Tanggal Mulai', 'type' => 'date'],
                    ['name' => 'selesai', 'label' => 'Tanggal Selesai', 'type' => 'date'],
                    ['name' => 'gaji', 'label' => 'Gaji Pokok', 'type' => 'number'],
                    ['name' => 'tunjangan', 'label' => 'Total Tunjangan', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','Active','Expired','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'mulai', 'label' => 'Mulai', 'format' => 'date'],
                    ['name' => 'selesai', 'label' => 'Selesai', 'format' => 'date'],
                    ['name' => 'gaji', 'label' => 'Gaji Pokok', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Absensi', 'icon' => '🕐', 'module' => 'hr-attendance', 'addLabel' => 'Tambah Absensi',
                'filterField' => 'status', 'filterOptions' => ['Hadir','Terlambat','Alpha','Cuti','Izin','Sakit'],
                'stats' => [
                    ['label' => 'Total Hari', 'type' => 'count', 'icon' => '📅', 'color' => '#0ea5e9'],
                    ['label' => 'Hadir', 'type' => 'count_where', 'field' => 'status', 'value' => 'Hadir', 'icon' => '✅', 'color' => '#22c55e'],
                    ['label' => 'Alpha', 'type' => 'count_where', 'field' => 'status', 'value' => 'Alpha', 'icon' => '❌', 'color' => '#ef4444'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'jam_masuk', 'label' => 'Jam Masuk', 'type' => 'text'],
                    ['name' => 'jam_keluar', 'label' => 'Jam Keluar', 'type' => 'text'],
                    ['name' => 'lembur', 'label' => 'Lembur (jam)', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Hadir','Terlambat','Alpha','Cuti','Izin','Sakit']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jam_masuk', 'label' => 'Jam Masuk'],
                    ['name' => 'jam_keluar', 'label' => 'Jam Keluar'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // PAYROLL
    // ══════════════════════════════════════════════════════════════════
    'payroll' => [
        'title' => 'Payroll',
        'color' => '#22c55e',
        'menus' => [
            [
                'label' => 'Slip Gaji', 'icon' => '💰', 'module' => 'pay-slips', 'addLabel' => 'Buat Slip Gaji',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total Payslip', 'type' => 'count', 'icon' => '💰', 'color' => '#22c55e'],
                    ['label' => 'Total Gaji', 'type' => 'sum', 'field' => 'netto', 'format' => 'currency', 'icon' => '💵', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'periode', 'label' => 'Periode', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'gaji_pokok', 'label' => 'Gaji Pokok', 'type' => 'number'],
                    ['name' => 'tunjangan', 'label' => 'Total Tunjangan', 'type' => 'number'],
                    ['name' => 'lembur', 'label' => 'Lembur', 'type' => 'number'],
                    ['name' => 'bonus', 'label' => 'Bonus', 'type' => 'number'],
                    ['name' => 'bpjs_kes', 'label' => 'BPJS Kesehatan', 'type' => 'number'],
                    ['name' => 'bpjs_tk', 'label' => 'BPJS TK', 'type' => 'number'],
                    ['name' => 'pph21', 'label' => 'PPh 21', 'type' => 'number'],
                    ['name' => 'potongan_lain', 'label' => 'Potongan Lain', 'type' => 'number'],
                    ['name' => 'netto', 'label' => 'Netto (Take Home Pay)', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'periode', 'label' => 'Periode'],
                    ['name' => 'gaji_pokok', 'label' => 'Gaji Pokok', 'format' => 'currency'],
                    ['name' => 'netto', 'label' => 'Netto', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Struktur Gaji', 'icon' => '📊', 'module' => 'pay-structures', 'addLabel' => 'Buat Struktur',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Struktur', 'type' => 'text', 'required' => true],
                    ['name' => 'gaji_pokok', 'label' => 'Gaji Pokok', 'type' => 'number'],
                    ['name' => 'tj_jabatan', 'label' => 'Tunjangan Jabatan', 'type' => 'number'],
                    ['name' => 'tj_transport', 'label' => 'Tunjangan Transport', 'type' => 'number'],
                    ['name' => 'tj_makan', 'label' => 'Tunjangan Makan', 'type' => 'number'],
                    ['name' => 'bpjs_kes', 'label' => 'BPJS Kesehatan (%)', 'type' => 'number'],
                    ['name' => 'bpjs_tk', 'label' => 'BPJS TK (%)', 'type' => 'number'],
                    ['name' => 'pph_method', 'label' => 'Metode PPh 21', 'type' => 'select', 'options' => ['Gross','Gross Up','Net']],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Struktur Gaji'],
                    ['name' => 'gaji_pokok', 'label' => 'Gaji Pokok', 'format' => 'currency'],
                    ['name' => 'pph_method', 'label' => 'Metode PPh'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Batch Payroll', 'icon' => '📦', 'module' => 'pay-batches', 'addLabel' => 'Buat Batch',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Done'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Batch', 'type' => 'text', 'required' => true],
                    ['name' => 'periode', 'label' => 'Periode', 'type' => 'text'],
                    ['name' => 'tanggal_bayar', 'label' => 'Tanggal Pembayaran', 'type' => 'date'],
                    ['name' => 'jumlah_karyawan', 'label' => 'Jumlah Karyawan', 'type' => 'number'],
                    ['name' => 'total_gaji', 'label' => 'Total Gaji', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Done']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Batch'],
                    ['name' => 'periode', 'label' => 'Periode'],
                    ['name' => 'jumlah_karyawan', 'label' => 'Karyawan'],
                    ['name' => 'total_gaji', 'label' => 'Total Gaji', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // RECRUITMENT
    // ══════════════════════════════════════════════════════════════════
    'recruitment' => [
        'title' => 'Recruitment',
        'color' => '#875A7B',
        'menus' => [
            [
                'label' => 'Lowongan', 'icon' => '📢', 'module' => 'rec-jobs', 'addLabel' => 'Buat Lowongan',
                'filterField' => 'status', 'filterOptions' => ['Draft','Aktif','Ditutup'],
                'stats' => [
                    ['label' => 'Total Lowongan', 'type' => 'count', 'icon' => '📢', 'color' => '#875A7B'],
                    ['label' => 'Aktif', 'type' => 'count_where', 'field' => 'status', 'value' => 'Aktif', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'posisi', 'label' => 'Posisi', 'type' => 'text', 'required' => true],
                    ['name' => 'departemen', 'label' => 'Departemen', 'type' => 'text'],
                    ['name' => 'jumlah', 'label' => 'Jumlah Dibutuhkan', 'type' => 'number'],
                    ['name' => 'tipe', 'label' => 'Tipe Pekerjaan', 'type' => 'select', 'options' => ['Full Time','Part Time','Freelance','Magang']],
                    ['name' => 'gaji_min', 'label' => 'Gaji Min', 'type' => 'number'],
                    ['name' => 'gaji_max', 'label' => 'Gaji Max', 'type' => 'number'],
                    ['name' => 'deadline', 'label' => 'Deadline Lamar', 'type' => 'date'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi Pekerjaan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Aktif','Ditutup']],
                ],
                'tableFields' => [
                    ['name' => 'posisi', 'label' => 'Posisi'],
                    ['name' => 'departemen', 'label' => 'Departemen'],
                    ['name' => 'jumlah', 'label' => 'Kebutuhan'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pelamar', 'icon' => '🧑‍💼', 'module' => 'rec-applications', 'addLabel' => 'Tambah Pelamar',
                'hasKanban' => true, 'filterField' => 'tahap', 'filterOptions' => ['New','Qualification','Interview','Offer','Contract Signed','Refused'],
                'stats' => [
                    ['label' => 'Total Pelamar', 'type' => 'count', 'icon' => '🧑‍💼', 'color' => '#875A7B'],
                    ['label' => 'Interview', 'type' => 'count_where', 'field' => 'tahap', 'value' => 'Interview', 'icon' => '🎤', 'color' => '#f59e0b'],
                    ['label' => 'Diterima', 'type' => 'count_where', 'field' => 'tahap', 'value' => 'Contract Signed', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Pelamar', 'type' => 'text', 'required' => true],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'posisi', 'label' => 'Posisi Dilamar', 'type' => 'text'],
                    ['name' => 'pendidikan', 'label' => 'Pendidikan', 'type' => 'select', 'options' => ['SMA/SMK','D3','S1','S2','S3']],
                    ['name' => 'pengalaman', 'label' => 'Pengalaman (tahun)', 'type' => 'number'],
                    ['name' => 'gaji_ekspektasi', 'label' => 'Ekspektasi Gaji', 'type' => 'number'],
                    ['name' => 'sumber', 'label' => 'Sumber Lamaran', 'type' => 'select', 'options' => ['LinkedIn','Jobstreet','Referral','Walk In','Website','Lainnya']],
                    ['name' => 'tahap', 'label' => 'Tahap', 'type' => 'select', 'options' => ['New','Qualification','Interview','Offer','Contract Signed','Refused']],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Nama'],
                    ['name' => 'posisi', 'label' => 'Posisi'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'sumber', 'label' => 'Sumber'],
                    ['name' => 'tahap', 'label' => 'Tahap', 'badge' => true],
                ],
            ],
            [
                'label' => 'Interview', 'icon' => '🎤', 'module' => 'rec-interviews', 'addLabel' => 'Jadwalkan Interview',
                'filterField' => 'status', 'filterOptions' => ['Scheduled','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'pelamar', 'label' => 'Nama Pelamar', 'type' => 'text', 'required' => true],
                    ['name' => 'posisi', 'label' => 'Posisi', 'type' => 'text'],
                    ['name' => 'pewawancara', 'label' => 'Pewawancara', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal & Jam', 'type' => 'date'],
                    ['name' => 'tipe', 'label' => 'Tipe Interview', 'type' => 'select', 'options' => ['HR Interview','User Interview','Psikotes','Technical Test']],
                    ['name' => 'lokasi', 'label' => 'Lokasi/Platform', 'type' => 'text'],
                    ['name' => 'hasil', 'label' => 'Hasil', 'type' => 'select', 'options' => ['Lulus','Tidak Lulus','Pending']],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Scheduled','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'pelamar', 'label' => 'Pelamar'],
                    ['name' => 'posisi', 'label' => 'Posisi'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // TIME OFF
    // ══════════════════════════════════════════════════════════════════
    'time-off' => [
        'title' => 'Time Off',
        'color' => '#00A09D',
        'menus' => [
            [
                'label' => 'Pengajuan Cuti', 'icon' => '🌴', 'module' => 'leave-requests', 'addLabel' => 'Ajukan Cuti',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Approved','Refused','Cancelled'],
                'stats' => [
                    ['label' => 'Total Pengajuan', 'type' => 'count', 'icon' => '🌴', 'color' => '#00A09D'],
                    ['label' => 'Menunggu Approval', 'type' => 'count_where', 'field' => 'status', 'value' => 'Confirmed', 'icon' => '⏳', 'color' => '#f59e0b'],
                    ['label' => 'Disetujui', 'type' => 'count_where', 'field' => 'status', 'value' => 'Approved', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'jenis', 'label' => 'Jenis Cuti', 'type' => 'select', 'options' => ['Cuti Tahunan','Cuti Sakit','Izin','Cuti Melahirkan','Cuti Ayah','Cuti Khusus']],
                    ['name' => 'dari', 'label' => 'Dari Tanggal', 'type' => 'date'],
                    ['name' => 'sampai', 'label' => 'Sampai Tanggal', 'type' => 'date'],
                    ['name' => 'durasi', 'label' => 'Durasi (hari)', 'type' => 'number'],
                    ['name' => 'alasan', 'label' => 'Alasan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Approved','Refused','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'jenis', 'label' => 'Jenis'],
                    ['name' => 'dari', 'label' => 'Dari', 'format' => 'date'],
                    ['name' => 'sampai', 'label' => 'Sampai', 'format' => 'date'],
                    ['name' => 'durasi', 'label' => 'Hari'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Alokasi Cuti', 'icon' => '📆', 'module' => 'leave-allocations', 'addLabel' => 'Alokasi Cuti',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Approved','Refused'],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'jenis', 'label' => 'Jenis Cuti', 'type' => 'select', 'options' => ['Cuti Tahunan','Cuti Sakit','Cuti Khusus']],
                    ['name' => 'jumlah', 'label' => 'Jumlah Hari', 'type' => 'number'],
                    ['name' => 'tahun', 'label' => 'Tahun', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Approved','Refused']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'jenis', 'label' => 'Jenis'],
                    ['name' => 'jumlah', 'label' => 'Hari'],
                    ['name' => 'tahun', 'label' => 'Tahun'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // APPRAISALS
    // ══════════════════════════════════════════════════════════════════
    'appraisals' => [
        'title' => 'Appraisals',
        'color' => '#f59e0b',
        'menus' => [
            [
                'label' => 'Penilaian', 'icon' => '⭐', 'module' => 'appraisal-list', 'addLabel' => 'Buat Penilaian',
                'filterField' => 'status', 'filterOptions' => ['New','Confirmed','Done'],
                'stats' => [
                    ['label' => 'Total Penilaian', 'type' => 'count', 'icon' => '⭐', 'color' => '#f59e0b'],
                    ['label' => 'Selesai', 'type' => 'count_where', 'field' => 'status', 'value' => 'Done', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'penilai', 'label' => 'Penilai', 'type' => 'text'],
                    ['name' => 'periode', 'label' => 'Periode', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal Penilaian', 'type' => 'date'],
                    ['name' => 'nilai', 'label' => 'Nilai (1-10)', 'type' => 'number'],
                    ['name' => 'kelebihan', 'label' => 'Kelebihan', 'type' => 'textarea'],
                    ['name' => 'area_perbaikan', 'label' => 'Area Perbaikan', 'type' => 'textarea'],
                    ['name' => 'target', 'label' => 'Target Berikutnya', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','Confirmed','Done']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'penilai', 'label' => 'Penilai'],
                    ['name' => 'periode', 'label' => 'Periode'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'nilai', 'label' => 'Nilai'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Target Kinerja', 'icon' => '🎯', 'module' => 'appraisal-goals', 'addLabel' => 'Tambah Target',
                'filterField' => 'status', 'filterOptions' => ['Draft','In Progress','Done'],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'target', 'label' => 'Target/Goal', 'type' => 'text', 'required' => true],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'type' => 'date'],
                    ['name' => 'progress', 'label' => 'Progress (%)', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','In Progress','Done']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'target', 'label' => 'Target'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'progress', 'label' => 'Progress (%)'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // HELPDESK
    // ══════════════════════════════════════════════════════════════════
    'helpdesk' => [
        'title' => 'Helpdesk',
        'color' => '#875A7B',
        'menus' => [
            [
                'label' => 'Tiket', 'icon' => '🎫', 'module' => 'hd-tickets', 'addLabel' => 'Buat Tiket',
                'hasKanban' => true, 'filterField' => 'status', 'filterOptions' => ['New','In Progress','Solved','Closed','Cancelled'],
                'stats' => [
                    ['label' => 'Total Tiket', 'type' => 'count', 'icon' => '🎫', 'color' => '#875A7B'],
                    ['label' => 'Open', 'type' => 'count_where', 'field' => 'status', 'value' => 'New', 'icon' => '🆕', 'color' => '#f59e0b'],
                    ['label' => 'In Progress', 'type' => 'count_where', 'field' => 'status', 'value' => 'In Progress', 'icon' => '⚙️', 'color' => '#0ea5e9'],
                    ['label' => 'Solved', 'type' => 'count_where', 'field' => 'status', 'value' => 'Solved', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'No. Tiket', 'type' => 'text'],
                    ['name' => 'subjek', 'label' => 'Subjek', 'type' => 'text', 'required' => true],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'type' => 'select', 'options' => ['Low','Normal','High','Urgent']],
                    ['name' => 'kategori', 'label' => 'Kategori', 'type' => 'select', 'options' => ['Teknis','Pembayaran','Pengiriman','Produk','Lainnya']],
                    ['name' => 'ditugaskan', 'label' => 'Ditugaskan ke', 'type' => 'text'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi Masalah', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','In Progress','Solved','Closed','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Tiket'],
                    ['name' => 'subjek', 'label' => 'Subjek'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'badge' => true],
                    ['name' => 'ditugaskan', 'label' => 'Assigned'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Tim', 'icon' => '👥', 'module' => 'hd-teams', 'addLabel' => 'Tambah Tim',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Tim', 'type' => 'text', 'required' => true],
                    ['name' => 'ketua', 'label' => 'Ketua Tim', 'type' => 'text'],
                    ['name' => 'anggota', 'label' => 'Anggota', 'type' => 'textarea'],
                    ['name' => 'sla', 'label' => 'SLA (jam)', 'type' => 'number'],
                    ['name' => 'kategori', 'label' => 'Kategori Tiket', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Tim'],
                    ['name' => 'ketua', 'label' => 'Ketua'],
                    ['name' => 'sla', 'label' => 'SLA (jam)'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'SLA Policy', 'icon' => '⏱️', 'module' => 'hd-sla', 'addLabel' => 'Buat SLA Policy',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Policy', 'type' => 'text', 'required' => true],
                    ['name' => 'tim', 'label' => 'Tim Helpdesk', 'type' => 'text'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'type' => 'select', 'options' => ['Low','Normal','High','Urgent']],
                    ['name' => 'target_jam', 'label' => 'Target Penyelesaian (jam)', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Policy'],
                    ['name' => 'tim', 'label' => 'Tim'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'badge' => true],
                    ['name' => 'target_jam', 'label' => 'Target (jam)'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // PROJECT
    // ══════════════════════════════════════════════════════════════════
    'projects' => [
        'title' => 'Project',
        'color' => '#00A0D0',
        'menus' => [
            [
                'label' => 'Proyek', 'icon' => '📌', 'module' => 'proj-projects', 'addLabel' => 'Buat Proyek',
                'filterField' => 'status', 'filterOptions' => ['In Progress','On Hold','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total Proyek', 'type' => 'count', 'icon' => '📌', 'color' => '#00A0D0'],
                    ['label' => 'In Progress', 'type' => 'count_where', 'field' => 'status', 'value' => 'In Progress', 'icon' => '🔄', 'color' => '#f59e0b'],
                    ['label' => 'Done', 'type' => 'count_where', 'field' => 'status', 'value' => 'Done', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Proyek', 'type' => 'text', 'required' => true],
                    ['name' => 'klien', 'label' => 'Klien', 'type' => 'text'],
                    ['name' => 'manajer', 'label' => 'Manajer Proyek', 'type' => 'text'],
                    ['name' => 'mulai', 'label' => 'Tanggal Mulai', 'type' => 'date'],
                    ['name' => 'selesai', 'label' => 'Tanggal Selesai', 'type' => 'date'],
                    ['name' => 'anggaran', 'label' => 'Anggaran', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['In Progress','On Hold','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Proyek'],
                    ['name' => 'klien', 'label' => 'Klien'],
                    ['name' => 'manajer', 'label' => 'Manajer'],
                    ['name' => 'selesai', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'anggaran', 'label' => 'Anggaran', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Tasks', 'icon' => '✅', 'module' => 'proj-tasks', 'addLabel' => 'Tambah Task',
                'hasKanban' => true, 'filterField' => 'status', 'filterOptions' => ['To Do','In Progress','Review','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total Tasks', 'type' => 'count', 'icon' => '✅', 'color' => '#00A0D0'],
                    ['label' => 'In Progress', 'type' => 'count_where', 'field' => 'status', 'value' => 'In Progress', 'icon' => '🔄', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Task', 'type' => 'text', 'required' => true],
                    ['name' => 'proyek', 'label' => 'Proyek', 'type' => 'text'],
                    ['name' => 'penugasan', 'label' => 'Ditugaskan ke', 'type' => 'text'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'type' => 'date'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'type' => 'select', 'options' => ['Low','Normal','High','Urgent']],
                    ['name' => 'estimasi', 'label' => 'Estimasi Jam', 'type' => 'number'],
                    ['name' => 'aktual', 'label' => 'Aktual Jam', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['To Do','In Progress','Review','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Task'],
                    ['name' => 'proyek', 'label' => 'Proyek'],
                    ['name' => 'penugasan', 'label' => 'Ditugaskan'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'badge' => true],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Timesheets', 'icon' => '⏱️', 'module' => 'proj-timesheets', 'addLabel' => 'Catat Waktu',
                'filterField' => 'status', 'filterOptions' => ['Draft','Validated'],
                'stats' => [
                    ['label' => 'Total Jam', 'type' => 'sum', 'field' => 'jam', 'icon' => '⏱️', 'color' => '#00A0D0'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'proyek', 'label' => 'Proyek', 'type' => 'text'],
                    ['name' => 'task', 'label' => 'Task', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'jam', 'label' => 'Jam', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi Pekerjaan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Validated']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'proyek', 'label' => 'Proyek'],
                    ['name' => 'task', 'label' => 'Task'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jam', 'label' => 'Jam'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // FIELD SERVICE
    // ══════════════════════════════════════════════════════════════════
    'field-service' => [
        'title' => 'Field Service',
        'color' => '#e74c3c',
        'menus' => [
            [
                'label' => 'Penugasan', 'icon' => '🔧', 'module' => 'fs-tasks', 'addLabel' => 'Buat Penugasan',
                'filterField' => 'status', 'filterOptions' => ['New','In Progress','Completed','Cancelled'],
                'stats' => [
                    ['label' => 'Total Penugasan', 'type' => 'count', 'icon' => '🔧', 'color' => '#e74c3c'],
                    ['label' => 'In Progress', 'type' => 'count_where', 'field' => 'status', 'value' => 'In Progress', 'icon' => '⚙️', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'No. Penugasan', 'type' => 'text'],
                    ['name' => 'judul', 'label' => 'Judul Tugas', 'type' => 'text', 'required' => true],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text'],
                    ['name' => 'teknisi', 'label' => 'Teknisi', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Jadwal', 'type' => 'date'],
                    ['name' => 'lokasi', 'label' => 'Lokasi', 'type' => 'textarea'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea'],
                    ['name' => 'biaya', 'label' => 'Biaya Servis', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','In Progress','Completed','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'No.'],
                    ['name' => 'judul', 'label' => 'Tugas'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'teknisi', 'label' => 'Teknisi'],
                    ['name' => 'tanggal', 'label' => 'Jadwal', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Teknisi', 'icon' => '👨‍🔧', 'module' => 'fs-technicians', 'addLabel' => 'Tambah Teknisi',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Teknisi', 'type' => 'text', 'required' => true],
                    ['name' => 'karyawan', 'label' => 'Link Karyawan', 'type' => 'text'],
                    ['name' => 'spesialisasi', 'label' => 'Spesialisasi', 'type' => 'text'],
                    ['name' => 'wilayah', 'label' => 'Wilayah Kerja', 'type' => 'text'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Teknisi'],
                    ['name' => 'spesialisasi', 'label' => 'Spesialisasi'],
                    ['name' => 'wilayah', 'label' => 'Wilayah'],
                    ['name' => 'telepon', 'label' => 'Telepon'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // FLEET
    // ══════════════════════════════════════════════════════════════════
    'fleet-app' => [
        'title' => 'Fleet',
        'color' => '#f97316',
        'menus' => [
            [
                'label' => 'Kendaraan', 'icon' => '🚛', 'module' => 'fleet-vehicles', 'addLabel' => 'Tambah Kendaraan',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Dalam Servis','Tidak Aktif'],
                'stats' => [
                    ['label' => 'Total Kendaraan', 'type' => 'count', 'icon' => '🚛', 'color' => '#f97316'],
                    ['label' => 'Aktif', 'type' => 'count_where', 'field' => 'status', 'value' => 'Aktif', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama/Nomor Kendaraan', 'type' => 'text', 'required' => true],
                    ['name' => 'plat', 'label' => 'Nomor Plat', 'type' => 'text'],
                    ['name' => 'merk', 'label' => 'Merk', 'type' => 'text'],
                    ['name' => 'model', 'label' => 'Model', 'type' => 'text'],
                    ['name' => 'tahun', 'label' => 'Tahun', 'type' => 'number'],
                    ['name' => 'driver', 'label' => 'Driver/Pengemudi', 'type' => 'text'],
                    ['name' => 'stnk_exp', 'label' => 'STNK Exp', 'type' => 'date'],
                    ['name' => 'km', 'label' => 'Kilometer Saat Ini', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Dalam Servis','Tidak Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Kendaraan'],
                    ['name' => 'plat', 'label' => 'Plat'],
                    ['name' => 'merk', 'label' => 'Merk'],
                    ['name' => 'driver', 'label' => 'Driver'],
                    ['name' => 'km', 'label' => 'KM'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Servis', 'icon' => '🔧', 'module' => 'fleet-services', 'addLabel' => 'Catat Servis',
                'filterField' => 'status', 'filterOptions' => ['Scheduled','In Progress','Done','Cancelled'],
                'formFields' => [
                    ['name' => 'kendaraan', 'label' => 'Kendaraan', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe Servis', 'type' => 'select', 'options' => ['Rutin','Perbaikan','Ganti Oli','Ban','Lainnya']],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'vendor', 'label' => 'Vendor Servis', 'type' => 'text'],
                    ['name' => 'km', 'label' => 'KM Saat Servis', 'type' => 'number'],
                    ['name' => 'biaya', 'label' => 'Biaya', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Scheduled','In Progress','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'kendaraan', 'label' => 'Kendaraan'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'biaya', 'label' => 'Biaya', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Kontrak Kendaraan', 'icon' => '📝', 'module' => 'fleet-contracts', 'addLabel' => 'Buat Kontrak',
                'filterField' => 'status', 'filterOptions' => ['New','Active','Expired','Cancelled'],
                'formFields' => [
                    ['name' => 'kendaraan', 'label' => 'Kendaraan', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe Kontrak', 'type' => 'select', 'options' => ['Leasing','Sewa','Milik']],
                    ['name' => 'mulai', 'label' => 'Mulai', 'type' => 'date'],
                    ['name' => 'selesai', 'label' => 'Selesai', 'type' => 'date'],
                    ['name' => 'biaya_bulanan', 'label' => 'Biaya Bulanan', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','Active','Expired','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'kendaraan', 'label' => 'Kendaraan'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'mulai', 'label' => 'Mulai', 'format' => 'date'],
                    ['name' => 'selesai', 'label' => 'Selesai', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // EXPENSES
    // ══════════════════════════════════════════════════════════════════
    'expenses-app' => [
        'title' => 'Expenses',
        'color' => '#00A09D',
        'menus' => [
            [
                'label' => 'Expense Saya', 'icon' => '🧾', 'module' => 'exp-my', 'addLabel' => 'Tambah Expense',
                'filterField' => 'status', 'filterOptions' => ['Draft','Submitted','Approved','Refused','Posted'],
                'stats' => [
                    ['label' => 'Total Expense', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '🧾', 'color' => '#00A09D'],
                    ['label' => 'Menunggu', 'type' => 'count_where', 'field' => 'status', 'value' => 'Submitted', 'icon' => '⏳', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Deskripsi Pengeluaran', 'type' => 'text', 'required' => true],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'kategori', 'label' => 'Kategori', 'type' => 'select', 'options' => ['Transport','Akomodasi','Makan','Komunikasi','ATK','Lainnya']],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'metode', 'label' => 'Metode Bayar', 'type' => 'select', 'options' => ['Own Money','Company Money']],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Submitted','Approved','Refused','Posted']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Pengeluaran'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'kategori', 'label' => 'Kategori'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Expense Report', 'icon' => '📊', 'module' => 'exp-reports', 'addLabel' => 'Buat Report',
                'filterField' => 'status', 'filterOptions' => ['Draft','Submitted','Approved','Posted'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Report', 'type' => 'text', 'required' => true],
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text'],
                    ['name' => 'manajer', 'label' => 'Manajer', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Submitted','Approved','Posted']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Report'],
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // SUBSCRIPTIONS
    // ══════════════════════════════════════════════════════════════════
    'subscriptions' => [
        'title' => 'Subscriptions',
        'color' => '#e5622c',
        'menus' => [
            [
                'label' => 'Langganan', 'icon' => '🔁', 'module' => 'sub-list', 'addLabel' => 'Buat Langganan',
                'filterField' => 'status', 'filterOptions' => ['Draft','Active','Paused','Cancelled'],
                'stats' => [
                    ['label' => 'Total Aktif', 'type' => 'count_where', 'field' => 'status', 'value' => 'Active', 'icon' => '🔁', 'color' => '#e5622c'],
                    ['label' => 'MRR', 'type' => 'sum', 'field' => 'harga', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'paket', 'label' => 'Paket', 'type' => 'text'],
                    ['name' => 'harga', 'label' => 'Harga/Bulan', 'type' => 'number'],
                    ['name' => 'mulai', 'label' => 'Tanggal Mulai', 'type' => 'date'],
                    ['name' => 'renewal', 'label' => 'Tanggal Renewal', 'type' => 'date'],
                    ['name' => 'periode', 'label' => 'Periode', 'type' => 'select', 'options' => ['Bulanan','Triwulan','Tahunan']],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Active','Paused','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'paket', 'label' => 'Paket'],
                    ['name' => 'harga', 'label' => 'Harga/Bulan', 'format' => 'currency'],
                    ['name' => 'renewal', 'label' => 'Renewal', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Paket', 'icon' => '📦', 'module' => 'sub-plans', 'addLabel' => 'Tambah Paket',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Paket', 'type' => 'text', 'required' => true],
                    ['name' => 'harga_bulan', 'label' => 'Harga Bulanan', 'type' => 'number'],
                    ['name' => 'harga_tahun', 'label' => 'Harga Tahunan', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'fitur', 'label' => 'Fitur Termasuk', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Paket'],
                    ['name' => 'harga_bulan', 'label' => 'Bulanan', 'format' => 'currency'],
                    ['name' => 'harga_tahun', 'label' => 'Tahunan', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // RENTAL
    // ══════════════════════════════════════════════════════════════════
    'rental' => [
        'title' => 'Rental',
        'color' => '#5e9e6e',
        'menus' => [
            [
                'label' => 'Order Sewa', 'icon' => '🏠', 'module' => 'rental-orders', 'addLabel' => 'Buat Order Sewa',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Picked Up','Returned','Cancelled'],
                'stats' => [
                    ['label' => 'Total Order', 'type' => 'count', 'icon' => '🏠', 'color' => '#5e9e6e'],
                    ['label' => 'Aktif', 'type' => 'count_where', 'field' => 'status', 'value' => 'Picked Up', 'icon' => '🔑', 'color' => '#f59e0b'],
                    ['label' => 'Total Nilai', 'type' => 'sum', 'field' => 'total', 'format' => 'currency', 'icon' => '💰', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor Order', 'type' => 'text'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'produk', 'label' => 'Produk Disewa', 'type' => 'text'],
                    ['name' => 'mulai', 'label' => 'Mulai Sewa', 'type' => 'date'],
                    ['name' => 'selesai', 'label' => 'Selesai Sewa', 'type' => 'date'],
                    ['name' => 'harga', 'label' => 'Harga/Hari', 'type' => 'number'],
                    ['name' => 'deposit', 'label' => 'Deposit', 'type' => 'number'],
                    ['name' => 'total', 'label' => 'Total', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Picked Up','Returned','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nomor', 'label' => 'Nomor'],
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'produk', 'label' => 'Produk'],
                    ['name' => 'mulai', 'label' => 'Mulai', 'format' => 'date'],
                    ['name' => 'total', 'label' => 'Total', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // EVENTS
    // ══════════════════════════════════════════════════════════════════
    'events' => [
        'title' => 'Events',
        'color' => '#e74c3c',
        'menus' => [
            [
                'label' => 'Event', 'icon' => '🎪', 'module' => 'evt-events', 'addLabel' => 'Buat Event',
                'filterField' => 'status', 'filterOptions' => ['Draft','Published','Ended','Cancelled'],
                'stats' => [
                    ['label' => 'Total Event', 'type' => 'count', 'icon' => '🎪', 'color' => '#e74c3c'],
                    ['label' => 'Aktif', 'type' => 'count_where', 'field' => 'status', 'value' => 'Published', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Event', 'type' => 'text', 'required' => true],
                    ['name' => 'penyelenggara', 'label' => 'Penyelenggara', 'type' => 'text'],
                    ['name' => 'mulai', 'label' => 'Tanggal Mulai', 'type' => 'date'],
                    ['name' => 'selesai', 'label' => 'Tanggal Selesai', 'type' => 'date'],
                    ['name' => 'lokasi', 'label' => 'Lokasi', 'type' => 'text'],
                    ['name' => 'kapasitas', 'label' => 'Kapasitas Peserta', 'type' => 'number'],
                    ['name' => 'harga_tiket', 'label' => 'Harga Tiket', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Published','Ended','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Event'],
                    ['name' => 'mulai', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'lokasi', 'label' => 'Lokasi'],
                    ['name' => 'kapasitas', 'label' => 'Kapasitas'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Pendaftaran', 'icon' => '📋', 'module' => 'evt-registrations', 'addLabel' => 'Tambah Peserta',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Attended','Cancelled'],
                'formFields' => [
                    ['name' => 'event', 'label' => 'Event', 'type' => 'text', 'required' => true],
                    ['name' => 'nama', 'label' => 'Nama Peserta', 'type' => 'text', 'required' => true],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'perusahaan', 'label' => 'Perusahaan', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Attended','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Peserta'],
                    ['name' => 'event', 'label' => 'Event'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'telepon', 'label' => 'Telepon'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // SURVEYS
    // ══════════════════════════════════════════════════════════════════
    'surveys' => [
        'title' => 'Surveys',
        'color' => '#875A7B',
        'menus' => [
            [
                'label' => 'Survei', 'icon' => '📊', 'module' => 'srv-surveys', 'addLabel' => 'Buat Survei',
                'filterField' => 'status', 'filterOptions' => ['Draft','Active','Closed'],
                'formFields' => [
                    ['name' => 'judul', 'label' => 'Judul Survei', 'type' => 'text', 'required' => true],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'deadline', 'label' => 'Deadline', 'type' => 'date'],
                    ['name' => 'require_login', 'label' => 'Login Diperlukan', 'type' => 'select', 'options' => ['Ya','Tidak']],
                    ['name' => 'scoring', 'label' => 'Mode Scoring', 'type' => 'select', 'options' => ['No Score','Score','Score with Answers']],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Active','Closed']],
                ],
                'tableFields' => [
                    ['name' => 'judul', 'label' => 'Survei'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'scoring', 'label' => 'Scoring'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Respons', 'icon' => '✉️', 'module' => 'srv-responses', 'addLabel' => 'Tambah Respons',
                'filterField' => 'status', 'filterOptions' => ['Draft','Done'],
                'formFields' => [
                    ['name' => 'survei', 'label' => 'Survei', 'type' => 'text', 'required' => true],
                    ['name' => 'responden', 'label' => 'Responden', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'nilai', 'label' => 'Nilai', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Done']],
                ],
                'tableFields' => [
                    ['name' => 'responden', 'label' => 'Responden'],
                    ['name' => 'survei', 'label' => 'Survei'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'nilai', 'label' => 'Nilai'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // LUNCH
    // ══════════════════════════════════════════════════════════════════
    'lunch' => [
        'title' => 'Lunch',
        'color' => '#e74c3c',
        'menus' => [
            [
                'label' => 'Order Makan', 'icon' => '🍱', 'module' => 'lunch-orders', 'addLabel' => 'Pesan Makan',
                'filterField' => 'status', 'filterOptions' => ['Ordered','Received','Cancelled'],
                'stats' => [
                    ['label' => 'Total Order Hari Ini', 'type' => 'count', 'icon' => '🍱', 'color' => '#e74c3c'],
                    ['label' => 'Total Biaya', 'type' => 'sum', 'field' => 'harga', 'format' => 'currency', 'icon' => '💰', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'menu', 'label' => 'Menu', 'type' => 'text'],
                    ['name' => 'vendor', 'label' => 'Vendor Makanan', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'harga', 'label' => 'Harga', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan/Alergi', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Ordered','Received','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'menu', 'label' => 'Menu'],
                    ['name' => 'vendor', 'label' => 'Vendor'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'harga', 'label' => 'Harga', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Menu', 'icon' => '🍽️', 'module' => 'lunch-menus', 'addLabel' => 'Tambah Menu',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Menu', 'type' => 'text', 'required' => true],
                    ['name' => 'vendor', 'label' => 'Vendor', 'type' => 'text'],
                    ['name' => 'kategori', 'label' => 'Kategori', 'type' => 'select', 'options' => ['Makanan','Minuman','Snack']],
                    ['name' => 'harga', 'label' => 'Harga', 'type' => 'number'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Menu'],
                    ['name' => 'vendor', 'label' => 'Vendor'],
                    ['name' => 'kategori', 'label' => 'Kategori'],
                    ['name' => 'harga', 'label' => 'Harga', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // PLANNING
    // ══════════════════════════════════════════════════════════════════
    'planning' => [
        'title' => 'Planning',
        'color' => '#00C09D',
        'menus' => [
            [
                'label' => 'Jadwal', 'icon' => '📅', 'module' => 'plan-slots', 'addLabel' => 'Tambah Jadwal',
                'filterField' => 'status', 'filterOptions' => ['Draft','Confirmed','Cancelled'],
                'stats' => [
                    ['label' => 'Total Jadwal', 'type' => 'count', 'icon' => '📅', 'color' => '#00C09D'],
                    ['label' => 'Confirmed', 'type' => 'count_where', 'field' => 'status', 'value' => 'Confirmed', 'icon' => '✅', 'color' => '#22c55e'],
                ],
                'formFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan', 'type' => 'text', 'required' => true],
                    ['name' => 'peran', 'label' => 'Peran', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'jam_mulai', 'label' => 'Jam Mulai', 'type' => 'text'],
                    ['name' => 'jam_selesai', 'label' => 'Jam Selesai', 'type' => 'text'],
                    ['name' => 'proyek', 'label' => 'Proyek/Tugas', 'type' => 'text'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Confirmed','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'karyawan', 'label' => 'Karyawan'],
                    ['name' => 'peran', 'label' => 'Peran'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jam_mulai', 'label' => 'Mulai'],
                    ['name' => 'proyek', 'label' => 'Proyek'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // APPOINTMENTS
    // ══════════════════════════════════════════════════════════════════
    'appointments' => [
        'title' => 'Appointments',
        'color' => '#f59e0b',
        'menus' => [
            [
                'label' => 'Janji Temu', 'icon' => '📆', 'module' => 'apt-appointments', 'addLabel' => 'Buat Janji',
                'filterField' => 'status', 'filterOptions' => ['Booked','Confirmed','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total Janji', 'type' => 'count', 'icon' => '📆', 'color' => '#f59e0b'],
                    ['label' => 'Hari Ini', 'type' => 'count_where', 'field' => 'status', 'value' => 'Confirmed', 'icon' => '📅', 'color' => '#0ea5e9'],
                ],
                'formFields' => [
                    ['name' => 'pelanggan', 'label' => 'Pelanggan', 'type' => 'text', 'required' => true],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'layanan', 'label' => 'Layanan', 'type' => 'text'],
                    ['name' => 'staf', 'label' => 'Staf', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'jam', 'label' => 'Jam', 'type' => 'text'],
                    ['name' => 'durasi', 'label' => 'Durasi (menit)', 'type' => 'number'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Booked','Confirmed','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'pelanggan', 'label' => 'Pelanggan'],
                    ['name' => 'layanan', 'label' => 'Layanan'],
                    ['name' => 'staf', 'label' => 'Staf'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'jam', 'label' => 'Jam'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Jenis Layanan', 'icon' => '🛠️', 'module' => 'apt-services', 'addLabel' => 'Tambah Layanan',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Layanan', 'type' => 'text', 'required' => true],
                    ['name' => 'durasi', 'label' => 'Durasi Default (menit)', 'type' => 'number'],
                    ['name' => 'harga', 'label' => 'Harga', 'type' => 'number'],
                    ['name' => 'staf', 'label' => 'Staf yang Bisa Handle', 'type' => 'textarea'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Layanan'],
                    ['name' => 'durasi', 'label' => 'Durasi (menit)'],
                    ['name' => 'harga', 'label' => 'Harga', 'format' => 'currency'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // MAINTENANCE
    // ══════════════════════════════════════════════════════════════════
    'maintenance' => [
        'title' => 'Maintenance',
        'color' => '#6b7280',
        'menus' => [
            [
                'label' => 'Permintaan', 'icon' => '🔧', 'module' => 'mnt-requests', 'addLabel' => 'Buat Permintaan',
                'filterField' => 'status', 'filterOptions' => ['New','In Progress','Done','Cancelled'],
                'stats' => [
                    ['label' => 'Total Permintaan', 'type' => 'count', 'icon' => '🔧', 'color' => '#6b7280'],
                    ['label' => 'Open', 'type' => 'count_where', 'field' => 'status', 'value' => 'New', 'icon' => '🆕', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Permintaan', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe', 'type' => 'select', 'options' => ['Corrective','Preventive']],
                    ['name' => 'peralatan', 'label' => 'Peralatan/Mesin', 'type' => 'text'],
                    ['name' => 'teknisi', 'label' => 'Teknisi', 'type' => 'text'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'type' => 'select', 'options' => ['Low','Normal','High','Urgent']],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi Masalah', 'type' => 'textarea', 'span' => 2],
                    ['name' => 'biaya', 'label' => 'Biaya', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New','In Progress','Done','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Permintaan'],
                    ['name' => 'tipe', 'label' => 'Tipe'],
                    ['name' => 'peralatan', 'label' => 'Peralatan'],
                    ['name' => 'teknisi', 'label' => 'Teknisi'],
                    ['name' => 'prioritas', 'label' => 'Prioritas', 'badge' => true],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
            [
                'label' => 'Peralatan', 'icon' => '⚙️', 'module' => 'mnt-equipment', 'addLabel' => 'Tambah Peralatan',
                'filterField' => 'status', 'filterOptions' => ['Aktif','Rusak','Non-Aktif'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Peralatan', 'type' => 'text', 'required' => true],
                    ['name' => 'kategori', 'label' => 'Kategori', 'type' => 'text'],
                    ['name' => 'lokasi', 'label' => 'Lokasi', 'type' => 'text'],
                    ['name' => 'sn', 'label' => 'Serial Number', 'type' => 'text'],
                    ['name' => 'beli', 'label' => 'Tanggal Beli', 'type' => 'date'],
                    ['name' => 'garansi', 'label' => 'Garansi Sampai', 'type' => 'date'],
                    ['name' => 'nilai', 'label' => 'Nilai Aset', 'type' => 'number'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Aktif','Rusak','Non-Aktif']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Peralatan'],
                    ['name' => 'kategori', 'label' => 'Kategori'],
                    ['name' => 'lokasi', 'label' => 'Lokasi'],
                    ['name' => 'garansi', 'label' => 'Garansi', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // DOCUMENTS
    // ══════════════════════════════════════════════════════════════════
    'documents' => [
        'title' => 'Documents',
        'color' => '#00A09D',
        'menus' => [
            [
                'label' => 'Semua Dokumen', 'icon' => '📁', 'module' => 'doc-all', 'addLabel' => 'Upload Dokumen',
                'filterField' => 'tipe', 'filterOptions' => ['Kontrak','Invoice','PO','SPK','SOP','Lainnya'],
                'stats' => [
                    ['label' => 'Total Dokumen', 'type' => 'count', 'icon' => '📁', 'color' => '#00A09D'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Dokumen', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe', 'type' => 'select', 'options' => ['Kontrak','Invoice','PO','SPK','SOP','Lainnya']],
                    ['name' => 'no_dokumen', 'label' => 'Nomor Dokumen', 'type' => 'text'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'type' => 'date'],
                    ['name' => 'expire', 'label' => 'Expired', 'type' => 'date'],
                    ['name' => 'pemilik', 'label' => 'Pemilik', 'type' => 'text'],
                    ['name' => 'tag', 'label' => 'Tag', 'type' => 'text'],
                    ['name' => 'deskripsi', 'label' => 'Deskripsi', 'type' => 'textarea', 'span' => 2],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Dokumen'],
                    ['name' => 'tipe', 'label' => 'Tipe', 'badge' => true],
                    ['name' => 'no_dokumen', 'label' => 'Nomor'],
                    ['name' => 'tanggal', 'label' => 'Tanggal', 'format' => 'date'],
                    ['name' => 'expire', 'label' => 'Expired', 'format' => 'date'],
                    ['name' => 'pemilik', 'label' => 'Pemilik'],
                ],
            ],
            [
                'label' => 'Tanda Tangan', 'icon' => '✍️', 'module' => 'doc-sign', 'addLabel' => 'Kirim untuk TTD',
                'filterField' => 'status', 'filterOptions' => ['Draft','Sent','Signed','Cancelled'],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama Dokumen', 'type' => 'text', 'required' => true],
                    ['name' => 'penandatangan', 'label' => 'Penandatangan', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'deadline', 'label' => 'Deadline TTD', 'type' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft','Sent','Signed','Cancelled']],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Dokumen'],
                    ['name' => 'penandatangan', 'label' => 'Penandatangan'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'deadline', 'label' => 'Deadline', 'format' => 'date'],
                    ['name' => 'status', 'label' => 'Status', 'badge' => true],
                ],
            ],
        ],
    ],

    // ══════════════════════════════════════════════════════════════════
    // CONTACTS
    // ══════════════════════════════════════════════════════════════════
    'contacts' => [
        'title' => 'Contacts',
        'color' => '#6366f1',
        'menus' => [
            [
                'label' => 'Kontak', 'icon' => '👤', 'module' => 'con-all', 'addLabel' => 'Tambah Kontak',
                'filterField' => 'tipe', 'filterOptions' => ['Pelanggan','Supplier','Karyawan','Mitra','Lainnya'],
                'stats' => [
                    ['label' => 'Total Kontak', 'type' => 'count', 'icon' => '👤', 'color' => '#6366f1'],
                    ['label' => 'Pelanggan', 'type' => 'count_where', 'field' => 'tipe', 'value' => 'Pelanggan', 'icon' => '🛍️', 'color' => '#ec4899'],
                    ['label' => 'Supplier', 'type' => 'count_where', 'field' => 'tipe', 'value' => 'Supplier', 'icon' => '🏭', 'color' => '#f59e0b'],
                ],
                'formFields' => [
                    ['name' => 'nama', 'label' => 'Nama', 'type' => 'text', 'required' => true],
                    ['name' => 'tipe', 'label' => 'Tipe', 'type' => 'select', 'options' => ['Pelanggan','Supplier','Karyawan','Mitra','Lainnya']],
                    ['name' => 'perusahaan', 'label' => 'Perusahaan', 'type' => 'text'],
                    ['name' => 'jabatan', 'label' => 'Jabatan', 'type' => 'text'],
                    ['name' => 'email', 'label' => 'Email', 'type' => 'email'],
                    ['name' => 'telepon', 'label' => 'Telepon', 'type' => 'text'],
                    ['name' => 'mobile', 'label' => 'HP', 'type' => 'text'],
                    ['name' => 'website', 'label' => 'Website', 'type' => 'text'],
                    ['name' => 'alamat', 'label' => 'Alamat', 'type' => 'textarea'],
                    ['name' => 'kota', 'label' => 'Kota', 'type' => 'text'],
                    ['name' => 'npwp', 'label' => 'NPWP', 'type' => 'text'],
                    ['name' => 'catatan', 'label' => 'Catatan', 'type' => 'textarea'],
                ],
                'tableFields' => [
                    ['name' => 'nama', 'label' => 'Nama'],
                    ['name' => 'tipe', 'label' => 'Tipe', 'badge' => true],
                    ['name' => 'perusahaan', 'label' => 'Perusahaan'],
                    ['name' => 'email', 'label' => 'Email'],
                    ['name' => 'telepon', 'label' => 'Telepon'],
                    ['name' => 'kota', 'label' => 'Kota'],
                ],
            ],
        ],
    ],

];
