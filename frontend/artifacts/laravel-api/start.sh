#!/bin/bash
set -e

cd "$(dirname "$0")"

# Copy .env if not exists (already written with correct values)
if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

# Set APP_URL from REPLIT_DEV_DOMAIN
if [ -n "$REPLIT_DEV_DOMAIN" ]; then
  export APP_URL="https://$REPLIT_DEV_DOMAIN"
fi

# Clear caches
php artisan config:clear 2>/dev/null || true
php artisan route:clear   2>/dev/null || true

# Run migrations (skip existing tables)
php artisan migrate --no-interaction --force 2>&1 || true

# Start server on PORT (default 8080)
PORT="${PORT:-8080}"
echo "Starting Laravel API on port $PORT..."
php artisan serve --host=0.0.0.0 --port="$PORT"
