<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Warehouse;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $warehouses = [
            [
                'code' => 'WH00001',
                'name' => 'Gudang Utama Jakarta',
                'address' => 'Jl. Industri No. 123, Jakarta Utara',
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'description' => 'Gudang utama untuk penyimpanan produk elektronik',
                'capacity' => 10000.00,
                'status' => 'active',
                'manager_name' => 'Agus Setiawan',
                'manager_phone' => '081234567890',
            ],
            [
                'code' => 'WH00002',
                'name' => 'Gudang Cabang Yogyakarta',
                'address' => 'Jl. Malioboro No. 45, Yogyakarta',
                'city' => 'Yogyakarta',
                'province' => 'DI Yogyakarta',
                'description' => 'Gudang cabang untuk wilayah Jawa Tengah',
                'capacity' => 5000.00,
                'status' => 'active',
                'manager_name' => 'Sari Dewi',
                'manager_phone' => '081987654321',
            ],
            [
                'code' => 'WH00003',
                'name' => 'Gudang Bahan Bangunan',
                'address' => 'Jl. Raya Industri No. 67, Bandung',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'description' => 'Gudang khusus untuk bahan bangunan dan konstruksi',
                'capacity' => 8000.00,
                'status' => 'active',
                'manager_name' => 'Rudi Hartono',
                'manager_phone' => '081345678901',
            ],
        ];

        foreach ($warehouses as $warehouse) {
            Warehouse::create($warehouse);
        }
    }
}
