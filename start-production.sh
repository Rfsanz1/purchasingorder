#!/bin/bash

cd "$(dirname "$0")"

echo "=== Laravel Production Start ==="

mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Install PHP dependencies jika vendor/ belum ada
if [ ! -f vendor/autoload.php ]; then
  echo "Installing PHP dependencies..."
  composer install --no-dev --optimize-autoloader --no-interaction 2>&1 || \
  composer install --optimize-autoloader --no-interaction 2>&1
fi

# Buat .env jika belum ada
if [ ! -f .env ]; then
  cp .env.example .env
fi

# Paksa production mode
sed -i "s|^APP_ENV=.*|APP_ENV=production|" .env
sed -i "s|^APP_DEBUG=.*|APP_DEBUG=false|" .env
sed -i "s|^LOG_CHANNEL=.*|LOG_CHANNEL=stderr|" .env

# ── Secrets dari Railway env vars ──────────────────────────────────────────
update_env() {
  local KEY="$1" VAL="$2"
  if [ -n "$VAL" ]; then
    if grep -q "^${KEY}=" .env 2>/dev/null; then
      sed -i "s|^${KEY}=.*|${KEY}=${VAL}|" .env
    else
      echo "${KEY}=${VAL}" >> .env
    fi
  fi
}

update_env APP_KEY        "$APP_KEY"
update_env ADMIN_PASSWORD "$ADMIN_PASSWORD"
update_env KLEDO_TOKEN    "$KLEDO_TOKEN"
update_env FONNTE_TOKEN   "$FONNTE_TOKEN"
update_env FONNTE_TOKEN_GROUP    "$FONNTE_TOKEN_GROUP"
update_env FONNTE_TOKEN_CUSTOMER "$FONNTE_TOKEN_CUSTOMER"
update_env FONNTE_GROUP_INVOICE  "$FONNTE_GROUP_INVOICE"
update_env FONNTE_GROUP_BUKTI_TF "$FONNTE_GROUP_BUKTI_TF"

# ── Validasi KLEDO_TOKEN ──────────────────────────────────────────────────
if [ -z "$KLEDO_TOKEN" ] || [ "$KLEDO_TOKEN" = "your_kledo_personal_access_token_here" ]; then
  echo "⚠️  WARNING: KLEDO_TOKEN belum di-set atau masih default!"
  echo "   Integrasi Kledo tidak akan aktif."
  echo "   Set di Railway Variables: KLEDO_TOKEN = <token dari Kledo API>"
fi

# ── DATABASE_URL → DB_* ────────────────────────────────────────────────────
if [ -n "$DATABASE_URL" ]; then
  echo "Parsing DATABASE_URL..."
  DB_PARSED=$(php -r "
    \$u = parse_url(getenv('DATABASE_URL'));
    if (!\$u) { echo 'PARSE_FAILED'; exit(1); }
    echo implode('|', [
      \$u['host'] ?? '127.0.0.1',
      \$u['port'] ?? 5432,
      ltrim(\$u['path'] ?? '/railway', '/'),
      \$u['user'] ?? 'postgres',
      \$u['pass'] ?? '',
    ]);
  " 2>/dev/null)

  if [ -n "$DB_PARSED" ] && [ "$DB_PARSED" != "PARSE_FAILED" ]; then
    DB_HOST=$(echo "$DB_PARSED" | cut -d'|' -f1)
    DB_PORT=$(echo "$DB_PARSED" | cut -d'|' -f2)
    DB_NAME=$(echo "$DB_PARSED" | cut -d'|' -f3)
    DB_USER=$(echo "$DB_PARSED" | cut -d'|' -f4)
    DB_PASS=$(echo "$DB_PARSED" | cut -d'|' -f5)

    update_env DB_CONNECTION pgsql
    update_env DB_HOST       "$DB_HOST"
    update_env DB_PORT       "$DB_PORT"
    update_env DB_DATABASE   "$DB_NAME"
    update_env DB_USERNAME   "$DB_USER"
    update_env DB_PASSWORD   "$DB_PASS"
    echo "DB: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
  else
    echo "WARN: Gagal parse DATABASE_URL, pakai DB_* yang sudah ada"
  fi
fi

# ── APP_URL dari Railway atau Replit ──────────────────────────────────────
if [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
  update_env APP_URL "https://$RAILWAY_PUBLIC_DOMAIN"
elif [ -n "$REPLIT_DOMAINS" ]; then
  # Ambil domain pertama (production .replit.app)
  REPLIT_PRIMARY_DOMAIN=$(echo "$REPLIT_DOMAINS" | cut -d',' -f1)
  update_env APP_URL "https://$REPLIT_PRIMARY_DOMAIN"
fi

# ── APP_KEY generate jika kosong ───────────────────────────────────────────
if ! grep -q "^APP_KEY=.\+" .env 2>/dev/null; then
  echo "Generating APP_KEY..."
  php artisan key:generate --force 2>/dev/null || true
fi

php artisan config:clear 2>/dev/null || true
php artisan route:clear 2>/dev/null || true
php artisan view:clear 2>/dev/null || true

# ── Migrasi ────────────────────────────────────────────────────────────────
echo "Running migrations..."
MAX_RETRIES=3
RETRY=0
while [ $RETRY -lt $MAX_RETRIES ]; do
  php artisan migrate --no-interaction --force 2>&1
  MIGRATE_STATUS=$?
  
  if [ $MIGRATE_STATUS -eq 0 ]; then
    echo "✅ Migrasi berhasil"
    break
  else
    RETRY=$((RETRY + 1))
    if [ $RETRY -lt $MAX_RETRIES ]; then
      echo "⚠️  Migrasi gagal, retry... ($RETRY/$MAX_RETRIES)"
      sleep 2
    else
      echo "❌ Migrasi gagal setelah $MAX_RETRIES percobaan"
      # Don't exit, let app start try to work anyway
      break
    fi
  fi
done

# ── Cache setelah env vars tersedia ────────────────────────────────────────
echo "Caching config..."
php artisan config:cache 2>&1 || echo "⚠️ Config cache failed - continuing with uncached config"
# Skip route:cache dan view:cache untuk development/testing - mereka perlu full setup
# php artisan route:cache 2>&1 || echo "Route cache failed - continuing"
# php artisan view:cache 2>&1 || echo "View cache failed - continuing"

# ── Start server ───────────────────────────────────────────────────────────
PORT="${PORT:-8080}"
echo "Starting on port $PORT..."
exec php artisan serve --host=0.0.0.0 --port="$PORT"
