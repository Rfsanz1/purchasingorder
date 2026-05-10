<?php

namespace App\Models\Pos;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PosCashierSession extends Model
{
    protected $table = 'pos_cashier_sessions';
    protected $fillable = [
        'session_code','user_id','warehouse_id','opening_cash',
        'closing_cash','expected_cash','cash_difference','opened_at','closed_at','status','notes',
    ];
    protected $casts = [
        'opening_cash'=>'decimal:2','closing_cash'=>'decimal:2',
        'expected_cash'=>'decimal:2','cash_difference'=>'decimal:2',
        'opened_at'=>'datetime','closed_at'=>'datetime',
    ];

    public function user(): BelongsTo { return $this->belongsTo(PosUser::class,'user_id'); }
    public function warehouse(): BelongsTo { return $this->belongsTo(PosWarehouse::class,'warehouse_id'); }
    public function sales(): HasMany { return $this->hasMany(PosSale::class,'session_id'); }
}
