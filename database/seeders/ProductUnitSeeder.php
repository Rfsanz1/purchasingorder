<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductUnit;

class ProductUnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            [
                'code' => 'UNT0001',
                'name' => 'Pieces',
                'symbol' => 'pcs',
                'description' => 'Unit per buah',
                'status' => 'active',
            ],
            [
                'code' => 'UNT0002',
                'name' => 'Kilogram',
                'symbol' => 'kg',
                'description' => 'Unit berat kilogram',
                'status' => 'active',
            ],
            [
                'code' => 'UNT0003',
                'name' => 'Liter',
                'symbol' => 'L',
                'description' => 'Unit volume liter',
                'status' => 'active',
            ],
            [
                'code' => 'UNT0004',
                'name' => 'Meter',
                'symbol' => 'm',
                'description' => 'Unit panjang meter',
                'status' => 'active',
            ],
            [
                'code' => 'UNT0005',
                'name' => 'Box',
                'symbol' => 'box',
                'description' => 'Unit kemasan box',
                'status' => 'active',
            ],
            [
                'code' => 'UNT0006',
                'name' => 'Pack',
                'symbol' => 'pack',
                'description' => 'Unit kemasan pack',
                'status' => 'active',
            ],
        ];

        foreach ($units as $unit) {
            ProductUnit::create($unit);
        }
    }
}
