#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "=== Laravel Production Start ==="

mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Buat .env jika belum ada
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i 's/APP_ENV=local/APP_ENV=production/' .env
  sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env
  sed -i 's/LOG_CHANNEL=stack/LOG_CHANNEL=stderr/' .env
fi

# ── Database dari DATABASE_URL ─────────────────────────────────────────────
if [ -n "$DATABASE_URL" ]; then
  eval "$(php -r "
    \$u = parse_url(getenv('DATABASE_URL'));
    \$q = \$u['query'] ?? '';
    parse_str(\$q, \$p);
    echo 'export _H=' . escapeshellarg(\$u['host'] ?? '127.0.0.1') . PHP_EOL;
    echo 'export _P=' . escapeshellarg(\$u['port'] ?? 5432) . PHP_EOL;
    echo 'export _D=' . escapeshellarg(ltrim(\$u['path'] ?? '', '/')) . PHP_EOL;
    echo 'export _U=' . escapeshellarg(\$u['user'] ?? 'postgres') . PHP_EOL;
    echo 'export _W=' . escapeshellarg(\$u['pass'] ?? '') . PHP_EOL;
    echo 'export _S=' . escapeshellarg(\$p['sslmode'] ?? 'require') . PHP_EOL;
  ")"
  sed -i "s|^DB_CONNECTION=.*|DB_CONNECTION=pgsql|" .env
  sed -i "s|^#\?DB_HOST=.*|DB_HOST=$_H|" .env
  sed -i "s|^#\?DB_PORT=.*|DB_PORT=$_P|" .env
  sed -i "s|^#\?DB_DATABASE=.*|DB_DATABASE=$_D|" .env
  sed -i "s|^#\?DB_USERNAME=.*|DB_USERNAME=$_U|" .env
  sed -i "s|^#\?DB_PASSWORD=.*|DB_PASSWORD=$_W|" .env
  echo "DB: $_U@$_H:$_P/$_D (ssl=$_S)"
fi

# ── Secrets dari environment ───────────────────────────────────────────────
[ -n "$APP_KEY" ]               && sed -i "s|^APP_KEY=.*|APP_KEY=$APP_KEY|" .env
[ -n "$ADMIN_PASSWORD" ]        && sed -i "s|^ADMIN_PASSWORD=.*|ADMIN_PASSWORD=$ADMIN_PASSWORD|" .env
[ -n "$KLEDO_TOKEN" ]           && sed -i "s|^KLEDO_TOKEN=.*|KLEDO_TOKEN=$KLEDO_TOKEN|" .env
[ -n "$FONNTE_TOKEN" ]          && sed -i "s|^FONNTE_TOKEN=.*|FONNTE_TOKEN=$FONNTE_TOKEN|" .env
[ -n "$FONNTE_TOKEN_GROUP" ]    && sed -i "s|^FONNTE_TOKEN_GROUP=.*|FONNTE_TOKEN_GROUP=$FONNTE_TOKEN_GROUP|" .env
[ -n "$FONNTE_TOKEN_CUSTOMER" ] && sed -i "s|^FONNTE_TOKEN_CUSTOMER=.*|FONNTE_TOKEN_CUSTOMER=$FONNTE_TOKEN_CUSTOMER|" .env
[ -n "$FONNTE_GROUP_INVOICE" ]  && sed -i "s|^FONNTE_GROUP_INVOICE=.*|FONNTE_GROUP_INVOICE=$FONNTE_GROUP_INVOICE|" .env
[ -n "$FONNTE_GROUP_BUKTI_TF" ] && sed -i "s|^FONNTE_GROUP_BUKTI_TF=.*|FONNTE_GROUP_BUKTI_TF=$FONNTE_GROUP_BUKTI_TF|" .env

# ── APP_URL otomatis dari Railway ──────────────────────────────────────────
[ -n "$RAILWAY_PUBLIC_DOMAIN" ] && sed -i "s|^APP_URL=.*|APP_URL=https://$RAILWAY_PUBLIC_DOMAIN|" .env

# ── APP_KEY generate jika kosong ───────────────────────────────────────────
if ! grep -q "^APP_KEY=.\+" .env 2>/dev/null; then
  php artisan key:generate --force
fi

php artisan config:clear 2>/dev/null || true

# ── Migrasi database ───────────────────────────────────────────────────────
echo "Running migrations..."
php artisan migrate --no-interaction --force 2>&1 || echo "WARN: Migrasi gagal, lanjut..."

# ── Start server ───────────────────────────────────────────────────────────
PORT="${PORT:-8080}"
echo "Starting on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port="$PORT"
