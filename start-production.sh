#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== Laravel Production Start ==="

# Buat .env dari .env.example jika belum ada
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
  else
    cat > .env << 'MINENV'
APP_NAME="Purchase Order"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost
LOG_CHANNEL=stderr
LOG_LEVEL=error
DB_CONNECTION=mysql
SESSION_DRIVER=file
CACHE_STORE=array
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
MINENV
  fi
fi

# Fungsi set/update env
set_env() {
  local KEY="$1" VAL="$2"
  if grep -q "^#\?${KEY}=" .env 2>/dev/null; then
    sed -i "s|^#\?${KEY}=.*|${KEY}=${VAL}|" .env
  else
    echo "${KEY}=${VAL}" >> .env
  fi
}

# Production settings
set_env APP_ENV production
set_env APP_DEBUG false
set_env LOG_CHANNEL stderr
set_env LOG_LEVEL error
set_env SESSION_DRIVER file
set_env CACHE_STORE array
set_env QUEUE_CONNECTION sync
set_env SESSION_SAME_SITE none
set_env SESSION_SECURE_COOKIE true
set_env FILESYSTEM_DISK local

# APP_URL
if [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
  set_env APP_URL "https://$RAILWAY_PUBLIC_DOMAIN"
elif [ -n "$RAILWAY_STATIC_URL" ]; then
  set_env APP_URL "https://$RAILWAY_STATIC_URL"
elif [ -n "$REPLIT_DOMAINS" ]; then
  FIRST_DOMAIN=$(echo "$REPLIT_DOMAINS" | cut -d',' -f1)
  set_env APP_URL "https://$FIRST_DOMAIN"
elif [ -n "$RENDER_EXTERNAL_URL" ]; then
  set_env APP_URL "$RENDER_EXTERNAL_URL"
elif [ -n "$KOYEB_PUBLIC_DOMAIN" ]; then
  set_env APP_URL "https://$KOYEB_PUBLIC_DOMAIN"
fi

# APP_KEY: generate jika kosong
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
  echo "Generating APP_KEY..."
  php artisan key:generate --force
fi

# ── Deteksi database: MySQL atau PostgreSQL ────────────────────────────────────
if [ -n "$MYSQL_URL" ]; then
  echo "Menggunakan MySQL via MYSQL_URL..."
  set_env DB_CONNECTION mysql

  eval "$(php -r "
    \$url = parse_url(getenv('MYSQL_URL'));
    echo 'export _DB_HOST=' . escapeshellarg(\$url['host'] ?? '127.0.0.1') . PHP_EOL;
    echo 'export _DB_PORT=' . escapeshellarg(\$url['port'] ?? 3306) . PHP_EOL;
    echo 'export _DB_NAME=' . escapeshellarg(ltrim(\$url['path'] ?? 'laravel', '/')) . PHP_EOL;
    echo 'export _DB_USER=' . escapeshellarg(\$url['user'] ?? 'root') . PHP_EOL;
    echo 'export _DB_PASS=' . escapeshellarg(\$url['pass'] ?? '') . PHP_EOL;
  ")"

  set_env DB_HOST     "$_DB_HOST"
  set_env DB_PORT     "$_DB_PORT"
  set_env DB_DATABASE "$_DB_NAME"
  set_env DB_USERNAME "$_DB_USER"
  set_env DB_PASSWORD "$_DB_PASS"
  echo "DB MySQL: $_DB_USER@$_DB_HOST:$_DB_PORT/$_DB_NAME"

elif [ -n "$DATABASE_URL" ]; then
  echo "Menggunakan PostgreSQL via DATABASE_URL..."
  set_env DB_CONNECTION pgsql

  eval "$(php -r "
    \$url = parse_url(getenv('DATABASE_URL'));
    echo 'export _DB_HOST=' . escapeshellarg(\$url['host'] ?? '127.0.0.1') . PHP_EOL;
    echo 'export _DB_PORT=' . escapeshellarg(\$url['port'] ?? 5432) . PHP_EOL;
    echo 'export _DB_NAME=' . escapeshellarg(ltrim(\$url['path'] ?? 'laravel', '/')) . PHP_EOL;
    echo 'export _DB_USER=' . escapeshellarg(\$url['user'] ?? 'postgres') . PHP_EOL;
    echo 'export _DB_PASS=' . escapeshellarg(\$url['pass'] ?? '') . PHP_EOL;
    \$query = \$url['query'] ?? '';
    parse_str(\$query, \$params);
    echo 'export _DB_SSL=' . escapeshellarg(\$params['sslmode'] ?? 'require') . PHP_EOL;
  ")"

  set_env DB_HOST     "$_DB_HOST"
  set_env DB_PORT     "$_DB_PORT"
  set_env DB_DATABASE "$_DB_NAME"
  set_env DB_USERNAME "$_DB_USER"
  set_env DB_PASSWORD "$_DB_PASS"
  set_env DB_SSLMODE  "$_DB_SSL"
  echo "DB PostgreSQL: $_DB_USER@$_DB_HOST:$_DB_PORT/$_DB_NAME (ssl=$_DB_SSL)"

else
  echo "ERROR: Set MYSQL_URL atau DATABASE_URL!"
  exit 1
fi

# Forward secrets dari environment ke .env
for VAR in FONNTE_TOKEN FONNTE_TOKEN_GROUP FONNTE_TOKEN_CUSTOMER \
           KLEDO_TOKEN ADMIN_PASSWORD \
           FONNTE_GROUP_INVOICE FONNTE_GROUP_BUKTI_TF; do
  VAL="$(printenv "$VAR" 2>/dev/null || true)"
  if [ -n "$VAL" ]; then
    set_env "$VAR" "$VAL"
  fi
done

# Storage permissions
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

php artisan config:clear  2>/dev/null || true
php artisan route:clear   2>/dev/null || true
php artisan view:clear    2>/dev/null || true
php artisan config:cache  2>/dev/null || true

PORT="${PORT:-8080}"
echo "Starting Laravel on port $PORT..."

# Jalankan server DULU agar healthcheck langsung lolos
php artisan serve --host=0.0.0.0 --port="$PORT" &
SERVER_PID=$!

# Tunggu server benar-benar siap (maks 20 detik)
echo "Menunggu server siap..."
for i in $(seq 1 20); do
  sleep 1
  if kill -0 $SERVER_PID 2>/dev/null; then
    echo "Server sudah jalan (PID: $SERVER_PID)"
    break
  fi
done

# Jalankan migrasi + sync data di background setelah server siap
(
  echo "Menunggu database siap..."
  MAX_TRIES=30
  COUNT=0
  until php artisan db:show --json > /dev/null 2>&1; do
    COUNT=$((COUNT + 1))
    if [ "$COUNT" -ge "$MAX_TRIES" ]; then
      echo "PERINGATAN: Database tidak siap setelah ${MAX_TRIES} percobaan."
      break
    fi
    echo "Database belum siap, coba lagi... ($COUNT/$MAX_TRIES)"
    sleep 2
  done

  echo "Running migrations..."
  php artisan migrate --no-interaction --force 2>&1 || echo "PERINGATAN: Migrasi gagal."
  echo "Migrasi selesai!"

  # Auto-sync data Kledo 20 hari terakhir jika tabel baru dibuat (kosong)
  COUNT_SYNC=$(php artisan tinker --no-interaction --execute="echo App\Models\KledoSyncLog::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
  if [ -n "$KLEDO_TOKEN" ] && [ "${COUNT_SYNC:-0}" -lt "100" ]; then
    echo "DB kosong — auto-sync data Kledo 20 hari terakhir..."
    START_DATE=$(date -d "20 days ago" +%Y-%m-%d 2>/dev/null || date -v-20d +%Y-%m-%d 2>/dev/null || echo "2026-04-18")
    END_DATE=$(date +%Y-%m-%d)
    php artisan kledo:sync --start="$START_DATE" --end="$END_DATE" --pages=10 2>&1 || echo "PERINGATAN: Sync Kledo gagal."
    echo "Auto-sync selesai!"
  fi
) &

# Tunggu server process (container tetap hidup)
wait $SERVER_PID
