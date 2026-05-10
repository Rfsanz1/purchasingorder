FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libonig-dev zip unzip curl \
    && docker-php-ext-install pdo pdo_pgsql zip mbstring bcmath pcntl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure PHP for better performance
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.max_accelerated_files=7963" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.revalidate_freq=0" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.jit=tracing" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "opcache.jit_buffer_size=100M" >> /usr/local/etc/php/conf.d/opcache.ini && \
    echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/php.ini && \
    echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/php.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

COPY . .

RUN mkdir -p bootstrap/cache storage/framework/{sessions,views,cache} storage/logs \
    && chmod -R 775 bootstrap/cache storage \
    && chown -R www-data:www-data bootstrap/cache storage

# Buat .env dulu (tanpa artisan) agar package:discover saat composer install bisa boot Laravel
RUN cp .env.example .env \
    && sed -i 's/APP_DEBUG=true/APP_DEBUG=false/' .env \
    && sed -i 's/LOG_CHANNEL=stack/LOG_CHANNEL=stderr/' .env

# Composer install — vendor/ dibuat di sini; post-install script (package:discover) butuh .env di atas
RUN composer install --verbose --optimize-autoloader --no-interaction --prefer-dist

# Sekarang vendor/ sudah ada, baru jalankan artisan
# config/route/view:cache TIDAK dijalankan di build — env vars belum ada saat build
RUN php artisan key:generate --force \
    && chmod +x start-production.sh

EXPOSE 8080

CMD ["bash", "start-production.sh"]
