FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev libzip-dev libonig-dev zip unzip curl git \
    && docker-php-ext-install pdo pdo_pgsql pdo_mysql zip mbstring bcmath pcntl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Configure PHP for production
RUN echo "opcache.enable=1" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=7963" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.revalidate_freq=0" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.jit=tracing" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.jit_buffer_size=100M" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini \
    && echo "max_execution_time=300" >> /usr/local/etc/php/conf.d/docker-php-maxexec.ini \
    && echo "upload_max_filesize=50M" >> /usr/local/etc/php/conf.d/docker-php-upload.ini \
    && echo "post_max_size=55M" >> /usr/local/etc/php/conf.d/docker-php-upload.ini

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

# Copy composer files first for better layer caching
COPY composer.json composer.lock ./

# Copy everything else
COPY . .

# Create required directories with proper permissions
RUN mkdir -p bootstrap/cache storage/framework/{sessions,views,cache} storage/logs \
    && chmod -R 775 bootstrap/cache storage

# Create .env from example for build-time artisan commands
RUN cp .env.example .env \
    && sed -i 's/^APP_DEBUG=.*/APP_DEBUG=false/' .env \
    && sed -i 's/^LOG_CHANNEL=.*/LOG_CHANNEL=stderr/' .env \
    && sed -i 's/^APP_ENV=.*/APP_ENV=production/' .env

# Install PHP dependencies (optimized for production)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Generate app key (will be overridden at runtime if APP_KEY env var is set)
RUN php artisan key:generate --force \
    && chmod +x start-production.sh

EXPOSE 8080

CMD ["bash", "start-production.sh"]
