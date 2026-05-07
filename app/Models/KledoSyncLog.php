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
        'total',
        'status',
        'sales',
        'memo',
        'raw_data',
        'synced_at',
        'updated_at',
    ];

    protected $casts = [
        'raw_data'   => 'array',
        'total'      => 'integer',
        'synced_at'  => 'datetime',
        'updated_at' => 'datetime',
    ];
}
