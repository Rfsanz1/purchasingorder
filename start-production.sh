#!/bin/bash

cd "$(dirname "$0")"

echo "=== Laravel Production Start ==="

# Buat direktori yang dibutuhkan
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Buat .env dari .env.example jika belum ada
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
  else
    cat > .env << 'MINENV'
APP_NAME="Gentong Mas ERP"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=http://localhost
LOG_CHANNEL=stderr
LOG_LEVEL=error
DB_CONNECTION=pgsql
SESSION_DRIVER=file
CACHE_STORE=array
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
MINENV
  fi
fi

# Fungsi set/update env (tidak pernah fail)
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
  set_env APP_URL "https://$(echo "$REPLIT_DOMAINS" | cut -d',' -f1)"
elif [ -n "$RENDER_EXTERNAL_URL" ]; then
  set_env APP_URL "$RENDER_EXTERNAL_URL"
fi

# APP_KEY
if ! grep -q "^APP_KEY=base64:" .env 2>/dev/null; then
  if [ -n "$APP_KEY" ]; then
    echo "Menggunakan APP_KEY dari environment..."
    set_env APP_KEY "$APP_KEY"
  else
    echo "Generating APP_KEY baru..."
    php artisan key:generate --force 2>/dev/null || true
  fi
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

# Database config dari DATABASE_URL atau MYSQL_URL
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
  " 2>/dev/null)" || true
  set_env DB_HOST     "${_DB_HOST:-127.0.0.1}"
  set_env DB_PORT     "${_DB_PORT:-3306}"
  set_env DB_DATABASE "${_DB_NAME:-laravel}"
  set_env DB_USERNAME "${_DB_USER:-root}"
  set_env DB_PASSWORD "${_DB_PASS:-}"
  echo "DB MySQL: ${_DB_USER}@${_DB_HOST}:${_DB_PORT}/${_DB_NAME}"

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
  " 2>/dev/null)" || true
  set_env DB_HOST     "${_DB_HOST:-127.0.0.1}"
  set_env DB_PORT     "${_DB_PORT:-5432}"
  set_env DB_DATABASE "${_DB_NAME:-laravel}"
  set_env DB_USERNAME "${_DB_USER:-postgres}"
  set_env DB_PASSWORD "${_DB_PASS:-}"
  set_env DB_SSLMODE  "${_DB_SSL:-require}"
  echo "DB PostgreSQL: ${_DB_USER}@${_DB_HOST}:${_DB_PORT}/${_DB_NAME} (ssl=${_DB_SSL})"

else
  echo "PERINGATAN: DATABASE_URL dan MYSQL_URL tidak ditemukan — app jalan tanpa DB."
fi

# Clear cache lama (jangan pakai cache supaya env selalu fresh)
php artisan config:clear  2>/dev/null || true
php artisan route:clear   2>/dev/null || true
php artisan view:clear    2>/dev/null || true

# ── START SERVER SEKARANG agar healthcheck langsung lolos ─────────────────────
PORT="${PORT:-8080}"
echo "Starting Laravel on port $PORT..."
php artisan serve --host=0.0.0.0 --port="$PORT" &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Tunggu server benar-benar siap merespons HTTP
echo "Menunggu server siap..."
MAX_WAIT=60
for i in $(seq 1 $MAX_WAIT); do
  if curl -sf "http://127.0.0.1:$PORT/health" > /dev/null 2>&1; then
    echo "Server siap merespons! ($i detik)"
    break
  fi
  if ! kill -0 $SERVER_PID 2>/dev/null; then
    echo "ERROR: Server process mati! Mencoba restart..."
    php artisan serve --host=0.0.0.0 --port="$PORT" &
    SERVER_PID=$!
  fi
  sleep 1
done

# ── Migrasi & Sync di Background (server sudah jalan) ─────────────────────────
(
  echo "=== Background: Migrasi & Sync ==="

  MAX_DB_TRIES=30
  COUNT=0
  until php artisan db:show --json > /dev/null 2>&1; do
    COUNT=$((COUNT + 1))
    if [ "$COUNT" -ge "$MAX_DB_TRIES" ]; then
      echo "PERINGATAN: Database tidak siap setelah ${MAX_DB_TRIES} percobaan."
      break
    fi
    echo "Menunggu database... ($COUNT/$MAX_DB_TRIES)"
    sleep 3
  done

  echo "Running migrations..."
  php artisan migrate --no-interaction --force 2>&1 || echo "PERINGATAN: Migrasi gagal."
  echo "Migrasi selesai."

  # Auto-sync Kledo jika tabel kosong
  if [ -n "$KLEDO_TOKEN" ]; then
    COUNT_SYNC=$(php artisan tinker --no-interaction --execute="echo App\Models\KledoSyncLog::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
    if [ "${COUNT_SYNC:-0}" -lt "100" ]; then
      echo "Auto-sync data Kledo dari 2026-04-18..."
      START_DATE="2026-04-18"
      END_DATE=$(date +%Y-%m-%d)
      php artisan kledo:sync --start="$START_DATE" --end="$END_DATE" --pages=10 2>&1 || echo "PERINGATAN: Sync Kledo gagal."
      echo "Auto-sync selesai."
    fi
  fi
) &

# Tunggu server utama (container tetap hidup)
wait $SERVER_PID
EXIT_CODE=$?
echo "Server berhenti dengan exit code: $EXIT_CODE"
exit $EXIT_CODE
