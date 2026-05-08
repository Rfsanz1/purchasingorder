<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    public $timestamps = false;

    const CREATED_AT = 'created_at';
    const UPDATED_AT = null;

    protected $fillable = [
        'order_id',
        'nama_kontak',
        'nomor_telepon',
        'alamat',
        'patokan_lokasi',
        'nama_produk',
        'jumlah_produk',
        'harga_produk',
        'biaya_pengiriman',
        'total_harga',
        'sales_person',
        'metode_pembayaran',
        'keterangan_pembayaran',
        'whatsapp_sent',
        'status_pengiriman',
        'driver_name',
        'metode_pengiriman',
        'kategori_produk',
        'customer_lat',
        'customer_lng',
        'customer_loc_token',
        'customer_loc_shared_at',
        'bukti_transfer_data',
        'payment_splits',
        'bukti_transfer_list',
        'dp_amount',
        'sisa_pembayaran',
        'kledo_invoice_id',
        'raw_items',
        'created_at',
    ];

    protected $casts = [
        'jumlah_produk'      => 'integer',
        'harga_produk'       => 'integer',
        'biaya_pengiriman'   => 'integer',
        'total_harga'        => 'integer',
        'dp_amount'          => 'integer',
        'sisa_pembayaran'    => 'integer',
        'kledo_invoice_id'   => 'integer',
        'payment_splits'     => 'array',
        'bukti_transfer_list' => 'array',
        'raw_items'          => 'array',
        'customer_loc_shared_at' => 'datetime',
        'created_at'         => 'datetime',
    ];

    protected $hidden = [
        'bukti_transfer_data',
        'bukti_transfer_list',
    ];

    public function getHasBuktiTfAttribute(): bool
    {
        return !empty($this->bukti_transfer_data);
    }

    public function scopeByDriver($query, string $driver)
    {
        return $query->where('driver_name', $driver);
    }

    public function scopeByStatus($query, string $status)
    {
        return $query->where('status_pengiriman', $status);
    }

    public function scopeLatest($query)
    {
        return $query->orderByDesc('created_at');
    }

    public function saleItems()
    {
        return $this->hasMany(\App\Models\SaleItem::class, 'order_id', 'order_id');
    }
}
