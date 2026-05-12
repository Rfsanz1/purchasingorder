<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductCategory extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'parent_id',
        'status'
    ];

    public function parent()
    {
        return $this->belongsTo(ProductCategory::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(ProductCategory::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }

    public static function generateCode()
    {
        $latest = self::latest('id')->first();
        $nextId = $latest ? $latest->id + 1 : 1;
        return 'CAT' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
