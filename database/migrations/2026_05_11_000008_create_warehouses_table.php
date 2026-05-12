<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('warehouses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('province')->nullable();
            $table->text('description')->nullable();
            $table->decimal('capacity', 15, 2)->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->string('manager_name')->nullable();
            $table->string('manager_phone')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('code');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('warehouses');
    }
};
