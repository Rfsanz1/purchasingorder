<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'email',
        'telepon',
        'alamat',
        'tanggal_lahir',
        'jenis_kelamin',
        'pekerjaan',
        'perusahaan',
        'status',
        'catatan',
        'total_order',
        'total_nilai_order',
        'last_order_at',
        'kledo_id',
        'kledo_data',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'last_order_at' => 'datetime',
        'total_order' => 'integer',
        'total_nilai_order' => 'integer',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class, 'nama_kontak', 'nama');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'Aktif');
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('nama', 'ilike', "%{$search}%")
              ->orWhere('telepon', 'ilike', "%{$search}%")
              ->orWhere('email', 'ilike', "%{$search}%");
        });
    }
}
