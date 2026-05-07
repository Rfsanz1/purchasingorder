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

# Salin composer files dulu untuk layer caching yang efisien
COPY composer.json composer.lock ./

# Install dependencies tanpa menjalankan scripts
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts --no-autoloader

# Salin semua file aplikasi
COPY . .

# Buat direktori yang dibutuhkan
RUN mkdir -p bootstrap/cache storage/framework/{sessions,views,cache} storage/logs \
    && chmod -R 775 bootstrap/cache storage

# Generate autoloader + package discovery
RUN composer dump-autoload --no-dev --optimize \
    && cp .env.example .env \
    && php artisan package:discover --ansi \
    && rm .env

RUN chmod +x start-production.sh

EXPOSE 8080

CMD ["bash", "start-production.sh"]
