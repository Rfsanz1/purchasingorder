FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libonig-dev zip unzip curl \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring bcmath pcntl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/{sessions,views,cache} storage/logs \
    && chmod -R 775 bootstrap/cache storage

RUN composer install --no-dev --optimize-autoloader --no-interaction

RUN cp .env.example .env \
    && sed -i 's/APP_ENV=local/APP_ENV=production/' .env \
    && sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env \
    && sed -i 's/LOG_CHANNEL=stack/LOG_CHANNEL=stderr/' .env \
    && php artisan key:generate --force \
    && php artisan package:discover --ansi \
    && chmod +x start-production.sh

EXPOSE 8080

CMD ["bash", "start-production.sh"]
