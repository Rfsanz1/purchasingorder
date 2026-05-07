<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Parse DATABASE_URL for PostgreSQL
        // Format: postgresql://user:pass@host/db?options
        $databaseUrl = env('DATABASE_URL');
        if ($databaseUrl) {
            $parsed = parse_url($databaseUrl);
            if ($parsed) {
                config([
                    'database.connections.pgsql.host'     => $parsed['host'] ?? '127.0.0.1',
                    'database.connections.pgsql.port'     => $parsed['port'] ?? 5432,
                    'database.connections.pgsql.database' => ltrim($parsed['path'] ?? '/laravel', '/'),
                    'database.connections.pgsql.username' => $parsed['user'] ?? 'postgres',
                    'database.connections.pgsql.password' => $parsed['pass'] ?? '',
                    'database.connections.pgsql.sslmode'  => 'prefer',
                ]);
            }
        }
    }
}
