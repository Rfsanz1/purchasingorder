#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== Laravel Start ==="

# Fungsi set/update env
set_env() {
  local KEY="$1" VAL="$2"
  if grep -q "^#\?${KEY}=" .env 2>/dev/null; then
    sed -i "s|^#\?${KEY}=.*|${KEY}=${VAL}|" .env
  else
    echo "${KEY}=${VAL}" >> .env
  fi
}

# Buat .env jika belum ada
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Generate APP_KEY jika belum ada
if ! grep -q "^APP_KEY=.\+" .env 2>/dev/null; then
  php artisan key:generate --force
fi

# APP_URL untuk Replit preview
if [ -n "$REPLIT_DEV_DOMAIN" ]; then
  set_env APP_URL "https://$REPLIT_DEV_DOMAIN"
fi

set_env SESSION_DRIVER file
set_env CACHE_STORE file
set_env QUEUE_CONNECTION sync
set_env SESSION_SAME_SITE none
set_env SESSION_SECURE_COOKIE true

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
    echo 'export _DB_SSL=' . escapeshellarg(\$params['sslmode'] ?? 'prefer') . PHP_EOL;
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

# Storage permissions
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Forward secrets dari environment ke .env
for VAR in FONNTE_TOKEN FONNTE_TOKEN_GROUP FONNTE_TOKEN_CUSTOMER \
           KLEDO_TOKEN ADMIN_PASSWORD \
           FONNTE_GROUP_INVOICE FONNTE_GROUP_BUKTI_TF; do
  VAL="$(printenv "$VAR" 2>/dev/null || true)"
  if [ -n "$VAL" ]; then
    set_env "$VAR" "$VAL"
  fi
done

php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true

echo "Running migrations..."
php artisan migrate --no-interaction --force 2>&1 | tail -10

# Start Laravel
PORT="${PORT:-5000}"
echo "Starting Laravel on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port="$PORT"
