FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    libonig-dev \
    libgd-dev \
    zip unzip curl git \
    && docker-php-ext-install \
        pdo \
        pdo_pgsql \
        pdo_mysql \
        zip \
        mbstring \
        bcmath \
        pcntl \
        opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

COPY composer.json composer.lock ./

RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --no-autoloader

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/{sessions,views,cache} storage/logs \
    && chmod -R 775 bootstrap/cache storage

# Buat .env dengan APP_KEY yang sudah di-generate saat build
RUN cp .env.example .env \
    && sed -i 's/APP_ENV=local/APP_ENV=production/' .env \
    && sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env \
    && sed -i 's/LOG_CHANNEL=stack/LOG_CHANNEL=stderr/' .env \
    && php artisan key:generate --force \
    && composer dump-autoload --no-dev --optimize \
    && php artisan package:discover --ansi

RUN chmod +x start-production.sh

EXPOSE 8080

CMD ["bash", "start-production.sh"]
