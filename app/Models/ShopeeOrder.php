<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShopeeOrder extends Model
{
    protected $table = 'shopee_orders';

    protected $fillable = [
        'shopee_order_sn',
        'shopee_shop_name',
        'status',
        'buyer_username',
        'buyer_name',
        'recipient_name',
        'shipping_address',
        'phone',
        'product_name',
        'qty',
        'original_price',
        'deal_price',
        'subtotal',
        'shipping_fee',
        'voucher_discount',
        'total_amount',
        'logistic_name',
        'tracking_number',
        'payment_method',
        'order_created_at',
        'order_paid_at',
        'synced_to_erp',
        'erp_order_id',
        'raw_data',
    ];

    protected $casts = [
        'synced_to_erp'    => 'boolean',
        'order_created_at' => 'datetime',
        'order_paid_at'    => 'datetime',
        'total_amount'     => 'decimal:2',
        'subtotal'         => 'decimal:2',
        'shipping_fee'     => 'decimal:2',
        'voucher_discount' => 'decimal:2',
    ];
}
