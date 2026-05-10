<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class PosProduct extends Model
{
    protected $table = 'pos_products';

    protected $fillable = [
        'sku', 'barcode', 'name', 'slug', 'description', 'image',
        'category_id', 'unit_id', 'supplier_id', 'cost_price',
        'selling_price', 'wholesale_price', 'min_selling_price',
        'min_stock_alert', 'track_stock', 'has_variants', 'is_bundled',
        'tax_rate', 'is_active', 'brand', 'model', 'color', 'size', 'sort_order',
    ];

    protected $casts = [
        'cost_price'       => 'decimal:2',
        'selling_price'    => 'decimal:2',
        'wholesale_price'  => 'decimal:2',
        'min_selling_price'=> 'decimal:2',
        'tax_rate'         => 'decimal:2',
        'track_stock'      => 'boolean',
        'has_variants'     => 'boolean',
        'is_bundled'       => 'boolean',
        'is_active'        => 'boolean',
    ];

    protected static function boot(): void
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->slug)) {
                $model->slug = Str::slug($model->name) . '-' . Str::random(6);
            }
            if (empty($model->sku)) {
                $model->sku = strtoupper(Str::random(8));
            }
        });
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(PosCategory::class, 'category_id');
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(PosUnit::class, 'unit_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(PosSupplier::class, 'supplier_id');
    }

    public function productUnits(): HasMany
    {
        return $this->hasMany(PosProductUnit::class, 'product_id');
    }

    public function prices(): HasMany
    {
        return $this->hasMany(PosProductPrice::class, 'product_id');
    }

    public function inventories(): HasMany
    {
        return $this->hasMany(PosInventory::class, 'product_id');
    }

    public function stockMovements(): HasMany
    {
        return $this->hasMany(PosStockMovement::class, 'product_id');
    }

    public function getTotalStockAttribute(): float
    {
        return (float) $this->inventories()->sum('qty_on_hand');
    }

    public function getStockInWarehouse(int $warehouseId): float
    {
        $inv = $this->inventories()->where('warehouse_id', $warehouseId)->first();
        return $inv ? (float) $inv->qty_on_hand : 0;
    }
}
