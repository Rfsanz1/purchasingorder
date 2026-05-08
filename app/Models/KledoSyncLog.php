<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KledoSyncLog extends Model
{
    public $timestamps = false;

    protected $table = 'kledo_sync_logs';

    protected $fillable = [
        'kledo_invoice_id',
        'ref_number',
        'trans_date',
        'contact_name',
        'alamat',
        'total',
        'diskon',
        'pajak',
        'status',
        'metode_pembayaran',
        'sales',
        'memo',
        'items',
        'raw_data',
        'synced_at',
        'updated_at',
    ];

    protected $casts = [
        'raw_data'   => 'array',
        'items'      => 'array',
        'total'      => 'integer',
        'diskon'     => 'integer',
        'pajak'      => 'integer',
        'synced_at'  => 'datetime',
        'updated_at' => 'datetime',
    ];
}
