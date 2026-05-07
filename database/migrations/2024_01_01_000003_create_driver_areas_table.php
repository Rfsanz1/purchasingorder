<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('driver_areas')) {
            Schema::create('driver_areas', function (Blueprint $table) {
                $table->id();
                $table->string('driver_name', 100)->index();
                $table->string('area_name', 200);
                $table->unique(['driver_name', 'area_name']);
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_areas');
    }
};
