<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Pos\PosRole;
use App\Models\Pos\PosPermission;
use App\Models\Pos\PosUser;
use App\Models\Pos\PosCategory;
use App\Models\Pos\PosUnit;
use App\Models\Pos\PosPriceTier;
use App\Models\Pos\PosWarehouse;
use App\Models\Pos\PosSupplier;
use App\Models\Pos\PosCustomer;
use App\Models\Pos\PosProduct;
use App\Models\Pos\PosInventory;

class PosSeeder extends Seeder
{
    public function run(): void
    {
        // ── Roles ──────────────────────────────────────────────────────────
        $roles = [
            ['name' => 'owner',   'label' => 'Owner'],
            ['name' => 'admin',   'label' => 'Administrator'],
            ['name' => 'kasir',   'label' => 'Kasir'],
            ['name' => 'gudang',  'label' => 'Gudang'],
            ['name' => 'sales',   'label' => 'Sales'],
        ];
        foreach ($roles as $r) {
            PosRole::firstOrCreate(['name' => $r['name']], $r);
        }

        // ── Permissions ────────────────────────────────────────────────────
        $permissions = [
            ['name'=>'dashboard.view',    'label'=>'Lihat Dashboard',       'module'=>'dashboard'],
            ['name'=>'pos.access',        'label'=>'Akses Kasir',           'module'=>'pos'],
            ['name'=>'products.view',     'label'=>'Lihat Produk',          'module'=>'products'],
            ['name'=>'products.manage',   'label'=>'Kelola Produk',         'module'=>'products'],
            ['name'=>'inventory.view',    'label'=>'Lihat Stok',            'module'=>'inventory'],
            ['name'=>'inventory.manage',  'label'=>'Kelola Stok',           'module'=>'inventory'],
            ['name'=>'customers.view',    'label'=>'Lihat Customer',        'module'=>'customers'],
            ['name'=>'customers.manage',  'label'=>'Kelola Customer',       'module'=>'customers'],
            ['name'=>'suppliers.view',    'label'=>'Lihat Supplier',        'module'=>'suppliers'],
            ['name'=>'suppliers.manage',  'label'=>'Kelola Supplier',       'module'=>'suppliers'],
            ['name'=>'purchases.view',    'label'=>'Lihat Pembelian',       'module'=>'purchases'],
            ['name'=>'purchases.manage',  'label'=>'Kelola Pembelian',      'module'=>'purchases'],
            ['name'=>'sales.view',        'label'=>'Lihat Penjualan',       'module'=>'sales'],
            ['name'=>'sales.manage',      'label'=>'Kelola Penjualan',      'module'=>'sales'],
            ['name'=>'reports.view',      'label'=>'Lihat Laporan',         'module'=>'reports'],
            ['name'=>'users.manage',      'label'=>'Kelola User',           'module'=>'users'],
        ];
        foreach ($permissions as $p) {
            PosPermission::firstOrCreate(['name' => $p['name']], $p);
        }

        // Assign all permissions to owner & admin
        $owner = PosRole::where('name', 'owner')->first();
        $admin = PosRole::where('name', 'admin')->first();
        $kasir = PosRole::where('name', 'kasir')->first();
        $gudang = PosRole::where('name', 'gudang')->first();
        $salesRole = PosRole::where('name', 'sales')->first();

        $allPerms    = PosPermission::pluck('id')->toArray();
        $kasirPerms  = PosPermission::whereIn('name', ['dashboard.view','pos.access','products.view','customers.view','customers.manage','sales.view'])->pluck('id')->toArray();
        $gudangPerms = PosPermission::whereIn('name', ['dashboard.view','products.view','products.manage','inventory.view','inventory.manage','purchases.view'])->pluck('id')->toArray();
        $salesPerms  = PosPermission::whereIn('name', ['dashboard.view','products.view','customers.view','customers.manage','sales.view','reports.view'])->pluck('id')->toArray();

        $owner->permissions()->sync($allPerms);
        $admin->permissions()->sync($allPerms);
        $kasir->permissions()->sync($kasirPerms);
        $gudang->permissions()->sync($gudangPerms);
        $salesRole->permissions()->sync($salesPerms);

        // ── Users ──────────────────────────────────────────────────────────
        $users = [
            ['name'=>'Owner Toko',    'email'=>'owner@toko.com',  'username'=>'owner',  'password'=>Hash::make('password'), 'role_id'=>$owner->id],
            ['name'=>'Admin Toko',    'email'=>'admin@toko.com',  'username'=>'admin',  'password'=>Hash::make('password'), 'role_id'=>$admin->id],
            ['name'=>'Kasir 1',       'email'=>'kasir@toko.com',  'username'=>'kasir',  'password'=>Hash::make('password'), 'role_id'=>$kasir->id],
            ['name'=>'Petugas Gudang','email'=>'gudang@toko.com', 'username'=>'gudang', 'password'=>Hash::make('password'), 'role_id'=>$gudang->id],
            ['name'=>'Sales 1',       'email'=>'sales@toko.com',  'username'=>'sales',  'password'=>Hash::make('password'), 'role_id'=>$salesRole->id],
        ];
        foreach ($users as $u) {
            PosUser::firstOrCreate(['email' => $u['email']], $u);
        }

        // ── Price Tiers ────────────────────────────────────────────────────
        foreach ([
            ['name'=>'retail',     'label'=>'Harga Eceran',  'min_qty'=>1,   'sort_order'=>1],
            ['name'=>'wholesale',  'label'=>'Harga Grosir',  'min_qty'=>10,  'sort_order'=>2],
            ['name'=>'contractor', 'label'=>'Harga Kontraktor','min_qty'=>50,'sort_order'=>3],
        ] as $pt) {
            PosPriceTier::firstOrCreate(['name' => $pt['name']], $pt);
        }

        // ── Warehouses ─────────────────────────────────────────────────────
        $wh = PosWarehouse::firstOrCreate(['code'=>'GDG-01'], [
            'name'=>'Gudang Utama', 'address'=>'Jl. Raya Toko No. 1', 'is_default'=>true, 'is_active'=>true,
        ]);

        // ── Units ──────────────────────────────────────────────────────────
        $units = [
            ['name'=>'Pieces',  'abbreviation'=>'pcs'],
            ['name'=>'Dus',     'abbreviation'=>'dus'],
            ['name'=>'Sak',     'abbreviation'=>'sak'],
            ['name'=>'Meter',   'abbreviation'=>'m'],
            ['name'=>'Kilogram','abbreviation'=>'kg'],
            ['name'=>'Liter',   'abbreviation'=>'ltr'],
            ['name'=>'Roll',    'abbreviation'=>'roll'],
            ['name'=>'Batang',  'abbreviation'=>'btg'],
            ['name'=>'Lembar',  'abbreviation'=>'lbr'],
            ['name'=>'Lonjor',  'abbreviation'=>'lnj'],
            ['name'=>'Set',     'abbreviation'=>'set'],
            ['name'=>'Karton',  'abbreviation'=>'ktn'],
        ];
        foreach ($units as $u) {
            PosUnit::firstOrCreate(['abbreviation' => $u['abbreviation']], $u);
        }
        $pcs  = PosUnit::where('abbreviation', 'pcs')->first();
        $sak  = PosUnit::where('abbreviation', 'sak')->first();
        $kg   = PosUnit::where('abbreviation', 'kg')->first();
        $m    = PosUnit::where('abbreviation', 'm')->first();
        $ltr  = PosUnit::where('abbreviation', 'ltr')->first();
        $btg  = PosUnit::where('abbreviation', 'btg')->first();
        $lbr  = PosUnit::where('abbreviation', 'lbr')->first();

        // ── Categories ─────────────────────────────────────────────────────
        $cats = [
            ['name'=>'Semen & Beton',  'slug'=>'semen-beton',   'color'=>'#EF4444', 'icon'=>'🏗️'],
            ['name'=>'Keramik & Batu', 'slug'=>'keramik-batu',  'color'=>'#F97316', 'icon'=>'🪨'],
            ['name'=>'Cat & Pelapis',  'slug'=>'cat-pelapis',   'color'=>'#EAB308', 'icon'=>'🎨'],
            ['name'=>'Besi & Baja',    'slug'=>'besi-baja',     'color'=>'#64748B', 'icon'=>'🔩'],
            ['name'=>'Kayu & Triplek', 'slug'=>'kayu-triplek',  'color'=>'#92400E', 'icon'=>'🪵'],
            ['name'=>'Pipa & Sanitasi','slug'=>'pipa-sanitasi', 'color'=>'#3B82F6', 'icon'=>'🚿'],
            ['name'=>'Listrik',        'slug'=>'listrik',       'color'=>'#F59E0B', 'icon'=>'⚡'],
            ['name'=>'Alat Tangan',   'slug'=>'alat-tangan',   'color'=>'#8B5CF6', 'icon'=>'🔨'],
            ['name'=>'Atap & Genteng', 'slug'=>'atap-genteng',  'color'=>'#10B981', 'icon'=>'🏠'],
            ['name'=>'Kunci & Aksesoris','slug'=>'kunci-aksesoris','color'=>'#06B6D4','icon'=>'🔑'],
        ];
        foreach ($cats as $c) {
            PosCategory::firstOrCreate(['slug' => $c['slug']], $c);
        }

        // ── Suppliers ──────────────────────────────────────────────────────
        $suppliers = [
            ['code'=>'SUP00001','name'=>'PT Indocement','company'=>'PT Indocement Tunggal Prakasa','phone'=>'021-123456','city'=>'Jakarta','payment_term_days'=>30],
            ['code'=>'SUP00002','name'=>'PT Semen Indonesia','company'=>'PT Semen Indonesia (Persero)','phone'=>'031-654321','city'=>'Surabaya','payment_term_days'=>30],
            ['code'=>'SUP00003','name'=>'Toko Besi Jaya','phone'=>'0271-111222','city'=>'Solo','payment_term_days'=>14],
            ['code'=>'SUP00004','name'=>'CV Keramik Nusantara','phone'=>'0274-333444','city'=>'Yogyakarta','payment_term_days'=>21],
            ['code'=>'SUP00005','name'=>'PT Cat Mowilex','company'=>'PT Mowilex Indonesia','phone'=>'021-987654','city'=>'Jakarta','payment_term_days'=>30],
        ];
        foreach ($suppliers as $s) {
            PosSupplier::firstOrCreate(['code' => $s['code']], $s);
        }

        // ── Customers ──────────────────────────────────────────────────────
        $customers = [
            ['code'=>'CST00001','name'=>'Umum / Walk-in','type'=>'retail','membership_tier'=>'regular'],
            ['code'=>'CST00002','name'=>'Budi Konstruksi','type'=>'contractor','phone'=>'08111222333','city'=>'Jakarta','membership_tier'=>'gold','credit_limit'=>50000000,'payment_term_days'=>30],
            ['code'=>'CST00003','name'=>'Toko Makmur','type'=>'store','phone'=>'08222333444','city'=>'Bogor','membership_tier'=>'silver','credit_limit'=>20000000,'payment_term_days'=>14],
            ['code'=>'CST00004','name'=>'Pak Santoso','type'=>'retail','phone'=>'08333444555','city'=>'Depok','membership_tier'=>'regular'],
            ['code'=>'CST00005','name'=>'CV Maju Jaya','type'=>'contractor','phone'=>'08444555666','city'=>'Tangerang','membership_tier'=>'platinum','credit_limit'=>100000000,'payment_term_days'=>45],
        ];
        foreach ($customers as $c) {
            PosCustomer::firstOrCreate(['code' => $c['code']], $c);
        }

        // ── Products ───────────────────────────────────────────────────────
        $semenCat  = PosCategory::where('slug','semen-beton')->first();
        $keramikCat= PosCategory::where('slug','keramik-batu')->first();
        $catCat    = PosCategory::where('slug','cat-pelapis')->first();
        $besiCat   = PosCategory::where('slug','besi-baja')->first();
        $pipaCat   = PosCategory::where('slug','pipa-sanitasi')->first();
        $sup1      = PosSupplier::where('code','SUP00001')->first();
        $sup2      = PosSupplier::where('code','SUP00002')->first();
        $sup3      = PosSupplier::where('code','SUP00003')->first();
        $sup4      = PosSupplier::where('code','SUP00004')->first();
        $sup5      = PosSupplier::where('code','SUP00005')->first();

        $products = [
            ['sku'=>'SMN-001','name'=>'Semen Tiga Roda 40kg','category_id'=>$semenCat->id,'unit_id'=>$sak->id,'supplier_id'=>$sup1->id,'cost_price'=>62000,'selling_price'=>67000,'wholesale_price'=>65000,'min_stock_alert'=>20,'brand'=>'Tiga Roda','barcode'=>'8991234567001'],
            ['sku'=>'SMN-002','name'=>'Semen Gresik 40kg','category_id'=>$semenCat->id,'unit_id'=>$sak->id,'supplier_id'=>$sup2->id,'cost_price'=>61000,'selling_price'=>66000,'wholesale_price'=>64000,'min_stock_alert'=>20,'brand'=>'Gresik','barcode'=>'8991234567002'],
            ['sku'=>'SMN-003','name'=>'Semen Merah Putih 50kg','category_id'=>$semenCat->id,'unit_id'=>$sak->id,'supplier_id'=>$sup1->id,'cost_price'=>75000,'selling_price'=>82000,'wholesale_price'=>79000,'min_stock_alert'=>15,'brand'=>'Merah Putih'],
            ['sku'=>'KRM-001','name'=>'Keramik Lantai 40x40 Putih','category_id'=>$keramikCat->id,'unit_id'=>$pcs->id,'supplier_id'=>$sup4->id,'cost_price'=>40000,'selling_price'=>48000,'wholesale_price'=>44000,'min_stock_alert'=>50,'brand'=>'Roman','size'=>'40x40'],
            ['sku'=>'KRM-002','name'=>'Keramik Lantai 60x60 Granite','category_id'=>$keramikCat->id,'unit_id'=>$pcs->id,'supplier_id'=>$sup4->id,'cost_price'=>85000,'selling_price'=>95000,'wholesale_price'=>90000,'min_stock_alert'=>30,'brand'=>'Asia Tile','size'=>'60x60'],
            ['sku'=>'KRM-003','name'=>'Keramik Dinding 25x40 Motif','category_id'=>$keramikCat->id,'unit_id'=>$pcs->id,'supplier_id'=>$sup4->id,'cost_price'=>22000,'selling_price'=>28000,'wholesale_price'=>25000,'min_stock_alert'=>40,'brand'=>'Mulia'],
            ['sku'=>'CAT-001','name'=>'Cat Tembok Vinilex 5kg Putih','category_id'=>$catCat->id,'unit_id'=>$pcs->id,'supplier_id'=>$sup5->id,'cost_price'=>65000,'selling_price'=>75000,'wholesale_price'=>70000,'min_stock_alert'=>10,'brand'=>'Vinilex','color'=>'Putih'],
            ['sku'=>'CAT-002','name'=>'Cat Tembok Dulux 20kg','category_id'=>$catCat->id,'unit_id'=>$pcs->id,'supplier_id'=>$sup5->id,'cost_price'=>195000,'selling_price'=>220000,'wholesale_price'=>210000,'min_stock_alert'=>5,'brand'=>'Dulux'],
            ['sku'=>'CAT-003','name'=>'Cat Besi Glotex 1L','category_id'=>$catCat->id,'unit_id'=>$ltr->id,'supplier_id'=>$sup5->id,'cost_price'=>45000,'selling_price'=>55000,'wholesale_price'=>50000,'min_stock_alert'=>10,'brand'=>'Glotex'],
            ['sku'=>'BSI-001','name'=>'Besi Beton Ulir D10 12m','category_id'=>$besiCat->id,'unit_id'=>$btg->id,'supplier_id'=>$sup3->id,'cost_price'=>78000,'selling_price'=>88000,'wholesale_price'=>83000,'min_stock_alert'=>50,'size'=>'D10'],
            ['sku'=>'BSI-002','name'=>'Besi Beton Polos D8 12m','category_id'=>$besiCat->id,'unit_id'=>$btg->id,'supplier_id'=>$sup3->id,'cost_price'=>55000,'selling_price'=>65000,'wholesale_price'=>60000,'min_stock_alert'=>50,'size'=>'D8'],
            ['sku'=>'BSI-003','name'=>'Hollow Besi 4x8 2mm','category_id'=>$besiCat->id,'unit_id'=>$btg->id,'supplier_id'=>$sup3->id,'cost_price'=>95000,'selling_price'=>110000,'wholesale_price'=>103000,'min_stock_alert'=>20],
            ['sku'=>'PPA-001','name'=>'Pipa PVC AW 4" (10cm)','category_id'=>$pipaCat->id,'unit_id'=>$btg->id,'cost_price'=>55000,'selling_price'=>68000,'wholesale_price'=>62000,'min_stock_alert'=>20,'brand'=>'Wavin'],
            ['sku'=>'PPA-002','name'=>'Pipa PVC D 1/2" (1.5cm)','category_id'=>$pipaCat->id,'unit_id'=>$btg->id,'cost_price'=>15000,'selling_price'=>20000,'wholesale_price'=>18000,'min_stock_alert'=>30,'brand'=>'Rucika'],
            ['sku'=>'PPA-003','name'=>'Pipa PPR PN10 3/4"','category_id'=>$pipaCat->id,'unit_id'=>$btg->id,'cost_price'=>85000,'selling_price'=>105000,'wholesale_price'=>95000,'min_stock_alert'=>15,'brand'=>'Interlon'],
        ];

        foreach ($products as $p) {
            $product = PosProduct::firstOrCreate(['sku' => $p['sku']], array_merge($p, [
                'slug' => \Illuminate\Support\Str::slug($p['name']) . '-' . strtolower(\Illuminate\Support\Str::random(4)),
                'track_stock' => true,
                'is_active'   => true,
            ]));

            PosInventory::firstOrCreate(
                ['product_id' => $product->id, 'warehouse_id' => $wh->id],
                ['qty_on_hand' => rand(20, 200), 'qty_reserved' => 0]
            );
        }

        $this->command->info('✅ POS seed selesai! User tersedia: owner/admin/kasir/gudang/sales (password: password)');
    }
}
