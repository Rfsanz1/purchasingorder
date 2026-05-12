<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'po_number',
        'supplier_id',
        'po_date',
        'expected_delivery_date',
        'actual_delivery_date',
        'description',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'total_amount',
        'status',
        'payment_status',
        'created_by',
        'approved_by',
        'approved_at',
        'notes'
    ];

    protected $casts = [
        'po_date' => 'date',
        'expected_delivery_date' => 'date',
        'actual_delivery_date' => 'date',
        'approved_at' => 'datetime',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function goodsReceipt()
    {
        return $this->hasOne(GoodsReceipt::class);
    }

    public static function generateNumber()
    {
        $year = date('Y');
        $month = date('m');
        $latest = self::whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->latest('id')
            ->first();
        
        $sequence = $latest ? (int) substr($latest->po_number, -4) + 1 : 1;
        return 'PO/' . $year . '/' . $month . '/' . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['sent', 'acknowledged', 'partial', 'received']);
    }
}
