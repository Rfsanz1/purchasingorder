<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // Auto sync dari Kledo ke ERP setiap jam
        $schedule->command('kledo:auto-sync --hours=1')
                ->hourly()
                ->withoutOverlapping()
                ->runInBackground();

        // Backup database harian
        // $schedule->command('backup:run')->daily();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}