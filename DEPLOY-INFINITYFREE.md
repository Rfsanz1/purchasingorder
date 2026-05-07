# Panduan Deploy ke InfinityFree

## Persiapan di Komputer Kamu

### 1. Download semua file project ini
Download/export semua file dari Replit ke komputer kamu.

### 2. Install dependencies dulu (butuh Composer di komputer)
```bash
composer install --no-dev --optimize-autoloader
```

---

## Di InfinityFree

### 1. Daftar akun
- Buka https://infinityfree.com
- Daftar gratis, tidak perlu kartu
- Buat hosting account baru → pilih subdomain gratis (contoh: `gentongmas.rf.gd`)

### 2. Buat database MySQL
- Di panel InfinityFree → **MySQL Databases**
- Buat database baru, catat:
  - Host (biasanya: `sqlXXX.infinityfree.com`)
  - Nama database
  - Username
  - Password

### 3. Upload file via FTP
Gunakan **FileZilla** (gratis) untuk upload:
- Host: FTP host dari panel InfinityFree
- Username & Password: dari panel InfinityFree

**Yang perlu diupload:**
```
app/
bootstrap/
config/
database/
public/          ← isi folder ini masuk ke htdocs/
resources/
routes/
storage/
vendor/          ← hasil composer install tadi
artisan
composer.json
```

**PENTING:** Isi folder `public/` harus masuk ke folder `htdocs/` di InfinityFree.
File lainnya (app/, config/, dll) taruh di LUAR `htdocs/`, satu level di atasnya.

Struktur di server InfinityFree:
```
/home/username/
  htdocs/              ← isi dari folder public/ kamu
    index.php
    .htaccess
    favicon.ico
  app/
  bootstrap/
  config/
  database/
  resources/
  routes/
  storage/
  vendor/
  artisan
```

### 4. Edit index.php di htdocs
Setelah upload, edit file `htdocs/index.php`, ubah path-nya:
```php
// Ganti baris ini:
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Menjadi (sesuaikan dengan username InfinityFree kamu):
require __DIR__.'/../../vendor/autoload.php';
$app = require_once __DIR__.'/../../bootstrap/app.php';
```

### 5. Buat file .env di root server
Buat file `.env` di `/home/username/` (bukan di htdocs) dengan isi:
```
APP_NAME="Purchase Order"
APP_ENV=production
APP_KEY=        ← generate dulu (lihat langkah 6)
APP_DEBUG=false
APP_URL=https://namadomain.rf.gd

DB_CONNECTION=mysql
DB_HOST=sqlXXX.infinityfree.com
DB_PORT=3306
DB_DATABASE=nama_database_kamu
DB_USERNAME=username_database_kamu
DB_PASSWORD=password_database_kamu

SESSION_DRIVER=file
CACHE_STORE=file
QUEUE_CONNECTION=sync

ADMIN_PASSWORD=password_admin_kamu
KLEDO_TOKEN=token_kledo_kamu
FONNTE_TOKEN=token_fonnte_kamu
```

### 6. Generate APP_KEY
Di komputer kamu (bukan di server), jalankan:
```bash
php artisan key:generate --show
```
Copy hasilnya ke `.env` di bagian `APP_KEY=`

### 7. Jalankan migrasi database
InfinityFree tidak punya SSH, jadi gunakan cara ini:

Buat file sementara `htdocs/migrate.php`:
```php
<?php
require __DIR__.'/../../vendor/autoload.php';
$app = require __DIR__.'/../../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('migrate', ['--force' => true]);
echo "Migrasi selesai!";
```
Akses via browser: `https://namadomain.rf.gd/migrate.php`
**Setelah selesai, hapus file migrate.php ini!**

### 8. Set permission storage
Buat file sementara `htdocs/permission.php`:
```php
<?php
$dirs = [
  '../../storage/framework/sessions',
  '../../storage/framework/views',
  '../../storage/framework/cache',
  '../../storage/logs',
  '../../bootstrap/cache',
];
foreach ($dirs as $dir) {
  @mkdir($dir, 0775, true);
  echo "OK: $dir\n";
}
echo "Selesai!";
```
Akses via browser, lalu **hapus file ini**.

---

## Setup UptimeRobot (agar tidak lambat)

1. Daftar gratis di https://uptimerobot.com
2. **New Monitor** → HTTP(s)
3. URL: `https://namadomain.rf.gd`
4. Interval: **5 menit**
5. Save

Ini akan ping website kamu tiap 5 menit agar server tetap "hangat".

---

## Selesai!
Buka `https://namadomain.rf.gd` di browser — ERP Gentong Mas siap dipakai!
