#!/bin/bash
set -e

echo "=== Post-merge setup ==="

mkdir -p bootstrap/cache storage/framework/{sessions,views,cache} storage/logs
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

if [ -f composer.json ]; then
  composer install --no-interaction --prefer-dist 2>&1 | tail -5
fi

php artisan config:clear 2>/dev/null || true
php artisan migrate --no-interaction --force 2>&1 | tail -10

echo "Post-merge setup complete"
