#!/bin/bash

cd "$(dirname "$0")"

echo "=== Laravel Production Start ==="

# Pastikan direktori storage tersedia
mkdir -p storage/framework/{sessions,views,cache} storage/logs bootstrap/cache
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Buat .env dari .env.example jika belum ada (penting di deployment environment)
if [ ! -f .env ]; then
  echo "File .env tidak ditemukan, membuat dari .env.example..."
  cp .env.example .env
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

# ── 1. Konfigurasi .env dari environment variables ──────────────────────────
echo "Mengkonfigurasi environment..."

# APP_KEY dari environment atau generate baru
if [ -n "$APP_KEY" ]; then
  set_env APP_KEY "$APP_KEY"
elif ! grep -q "^APP_KEY=.\+" .env 2>/dev/null; then
  echo "Generating APP_KEY..."
  php artisan key:generate --force
fi

# APP_URL dari Railway/Replit
if [ -n "$RAILWAY_PUBLIC_DOMAIN" ]; then
  set_env APP_URL "https://$RAILWAY_PUBLIC_DOMAIN"
elif [ -n "$RAILWAY_STATIC_URL" ]; then
  set_env APP_URL "https://$RAILWAY_STATIC_URL"
elif [ -n "$REPLIT_DOMAINS" ]; then
  FIRST_DOMAIN=$(echo "$REPLIT_DOMAINS" | cut -d',' -f1 | tr -d ' ')
  set_env APP_URL "https://$FIRST_DOMAIN"
elif [ -n "$REPLIT_DEV_DOMAIN" ]; then
  set_env APP_URL "https://$REPLIT_DEV_DOMAIN"
fi

# Set production mode
set_env APP_ENV production
set_env APP_DEBUG false
set_env LOG_CHANNEL stderr

# Forward secrets ke .env
for VAR in FONNTE_TOKEN FONNTE_TOKEN_GROUP FONNTE_TOKEN_CUSTOMER \
           KLEDO_TOKEN ADMIN_PASSWORD \
           FONNTE_GROUP_INVOICE FONNTE_GROUP_BUKTI_TF; do
  VAL="$(printenv "$VAR" 2>/dev/null || true)"
  [ -n "$VAL" ] && set_env "$VAR" "$VAL"
done

# ── 2. Konfigurasi Database (SYNC — sebelum server start) ───────────────────
if [ -n "$MYSQL_URL" ]; then
  echo "Menggunakan MySQL..."
  set_env DB_CONNECTION mysql
  eval "$(php -r "
    \$u = parse_url(getenv('MYSQL_URL'));
    echo 'export H=' . escapeshellarg(\$u['host'] ?? '127.0.0.1') . PHP_EOL;
    echo 'export P=' . escapeshellarg(\$u['port'] ?? 3306) . PHP_EOL;
    echo 'export D=' . escapeshellarg(ltrim(\$u['path'] ?? '', '/')) . PHP_EOL;
    echo 'export U=' . escapeshellarg(\$u['user'] ?? 'root') . PHP_EOL;
    echo 'export W=' . escapeshellarg(\$u['pass'] ?? '') . PHP_EOL;
  " 2>/dev/null)" || true
  set_env DB_HOST "${H:-127.0.0.1}"
  set_env DB_PORT "${P:-3306}"
  set_env DB_DATABASE "${D:-laravel}"
  set_env DB_USERNAME "${U:-root}"
  set_env DB_PASSWORD "${W:-}"
  echo "DB MySQL: ${U}@${H}:${P}/${D}"

elif [ -n "$DATABASE_URL" ]; then
  echo "Menggunakan PostgreSQL dari DATABASE_URL..."
  set_env DB_CONNECTION pgsql
  eval "$(php -r "
    \$u = parse_url(getenv('DATABASE_URL'));
    \$q = \$u['query'] ?? '';
    parse_str(\$q, \$params);
    echo 'export H=' . escapeshellarg(\$u['host'] ?? '127.0.0.1') . PHP_EOL;
    echo 'export P=' . escapeshellarg(\$u['port'] ?? 5432) . PHP_EOL;
    echo 'export D=' . escapeshellarg(ltrim(\$u['path'] ?? '', '/')) . PHP_EOL;
    echo 'export U=' . escapeshellarg(\$u['user'] ?? 'postgres') . PHP_EOL;
    echo 'export W=' . escapeshellarg(\$u['pass'] ?? '') . PHP_EOL;
    echo 'export S=' . escapeshellarg(\$params['sslmode'] ?? 'require') . PHP_EOL;
  " 2>/dev/null)" || true
  set_env DB_HOST "${H:-127.0.0.1}"
  set_env DB_PORT "${P:-5432}"
  set_env DB_DATABASE "${D:-laravel}"
  set_env DB_USERNAME "${U:-postgres}"
  set_env DB_PASSWORD "${W:-}"
  set_env DB_SSLMODE  "${S:-require}"
  echo "DB PostgreSQL: ${U}@${H}:${P}/${D} (ssl=${S})"
else
  echo "PERINGATAN: DATABASE_URL tidak ditemukan, menggunakan fallback dari .env"
fi

# ── 3. Bersihkan config cache setelah env selesai dikonfigurasi ──────────────
php artisan config:clear 2>/dev/null || true
php artisan route:clear  2>/dev/null || true
php artisan view:clear   2>/dev/null || true

# ── 4. START SERVER SEKARANG ─────────────────────────────────────────────────
PORT="${PORT:-8080}"
echo "Starting Laravel on port $PORT..."
php artisan serve --host=0.0.0.0 --port="$PORT" &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# ── 5. Tunggu server siap merespons /health ──────────────────────────────────
echo "Menunggu server siap..."
MAX_WAIT=30
COUNT=0
until curl -sf "http://127.0.0.1:${PORT}/health" > /dev/null 2>&1; do
  COUNT=$((COUNT+1))
  if [ "$COUNT" -ge "$MAX_WAIT" ]; then
    echo "PERINGATAN: Server tidak merespons setelah ${MAX_WAIT}s, lanjut..."
    break
  fi
  sleep 1
done
echo "Server siap."

# ── 6. Migrasi & operasi DB di background ────────────────────────────────────
(
  echo "=== Background: Migrasi DB ==="

  # Tunggu database siap
  MAX=20; COUNT=0
  until php artisan db:show --json > /dev/null 2>&1; do
    COUNT=$((COUNT+1))
    [ "$COUNT" -ge "$MAX" ] && echo "PERINGATAN: DB tidak siap." && exit 1
    echo "Menunggu database... ($COUNT/$MAX)"
    sleep 3
  done

  echo "Running migrations..."
  php artisan migrate --no-interaction --force 2>&1 || echo "PERINGATAN: Migrasi gagal."
  echo "Migrasi selesai."

  # Auto-sync Kledo jika token tersedia dan data masih sedikit
  if [ -n "$KLEDO_TOKEN" ]; then
    COUNT_SYNC=$(php artisan tinker --no-interaction --execute="echo App\Models\KledoSyncLog::count();" 2>/dev/null | tail -1 | tr -d '[:space:]')
    if [ "${COUNT_SYNC:-0}" -lt "100" ]; then
      echo "Auto-sync data Kledo..."
      php artisan kledo:sync --start="2026-04-08" --end="$(date +%Y-%m-%d)" --pages=10 2>&1 || echo "PERINGATAN: Sync Kledo gagal."
      echo "Auto-sync selesai."
    fi
  fi
) &

# ── 7. Tunggu server utama (container tetap hidup) ────────────────────────────
wait $SERVER_PID
EXIT_CODE=$?
echo "Server berhenti (exit: $EXIT_CODE)"
exit $EXIT_CODE
