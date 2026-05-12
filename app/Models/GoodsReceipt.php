<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class GoodsReceipt extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'gr_number',
        'purchase_order_id',
        'receipt_date',
        'description',
        'status',
        'received_by',
        'verified_by',
        'notes'
    ];

    protected $casts = [
        'receipt_date' => 'date',
    ];

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function items()
    {
        return $this->hasMany(GoodsReceiptItem::class);
    }

    public static function generateNumber()
    {
        $year = date('Y');
        $month = date('m');
        $latest = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->latest('id')
            ->first();
        
        $sequence = $latest ? (int) substr($latest->gr_number, -4) + 1 : 1;
        return 'GR/' . $year . '/' . $month . '/' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
