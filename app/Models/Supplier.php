<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'supplier_code',
        'name',
        'contact_person',
        'email',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'notes',
        'bank_name',
        'bank_account_name',
        'bank_account_number',
        'discount_percentage',
        'payment_term_days',
        'status',
        'rating',
        'total_purchase_amount',
        'total_transactions'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function invoices()
    {
        return $this->hasMany(SupplierInvoice::class);
    }

    /**
     * Generate unique supplier code
     */
    public static function generateCode()
    {
        $latest = self::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        return 'SUP' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }
}
