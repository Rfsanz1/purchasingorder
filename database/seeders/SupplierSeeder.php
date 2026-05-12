<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $suppliers = [
            [
                'supplier_code' => 'SUP0001',
                'name' => 'PT. Maju Jaya Elektronik',
                'contact_person' => 'Budi Santoso',
                'email' => 'budi@majujaya.com',
                'phone' => '081234567890',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'city' => 'Jakarta',
                'province' => 'DKI Jakarta',
                'postal_code' => '10110',
                'bank_name' => 'BCA',
                'bank_account_name' => 'PT. Maju Jaya Elektronik',
                'bank_account_number' => '1234567890',
                'discount_percentage' => 5.00,
                'payment_term_days' => 30,
                'status' => 'active',
                'rating' => 5,
                'notes' => 'Supplier elektronik terpercaya dengan pengiriman tepat waktu',
            ],
            [
                'supplier_code' => 'SUP0002',
                'name' => 'CV. Berkah Abadi',
                'contact_person' => 'Siti Aminah',
                'email' => 'siti@berkahabadi.com',
                'phone' => '081987654321',
                'address' => 'Jl. Malioboro No. 45, Yogyakarta',
                'city' => 'Yogyakarta',
                'province' => 'DI Yogyakarta',
                'postal_code' => '55281',
                'bank_name' => 'Mandiri',
                'bank_account_name' => 'CV. Berkah Abadi',
                'bank_account_number' => '0987654321',
                'discount_percentage' => 3.50,
                'payment_term_days' => 15,
                'status' => 'active',
                'rating' => 4,
                'notes' => 'Supplier bahan bangunan dengan harga kompetitif',
            ],
            [
                'supplier_code' => 'SUP0003',
                'name' => 'PT. Teknologi Nusantara',
                'contact_person' => 'Ahmad Rahman',
                'email' => 'ahmad@teknus.com',
                'phone' => '081345678901',
                'address' => 'Jl. Gatot Subroto No. 67, Bandung',
                'city' => 'Bandung',
                'province' => 'Jawa Barat',
                'postal_code' => '40262',
                'bank_name' => 'BNI',
                'bank_account_name' => 'PT. Teknologi Nusantara',
                'bank_account_number' => '1122334455',
                'discount_percentage' => 7.00,
                'payment_term_days' => 45,
                'status' => 'active',
                'rating' => 5,
                'notes' => 'Supplier gadget dan aksesoris dengan kualitas premium',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}
