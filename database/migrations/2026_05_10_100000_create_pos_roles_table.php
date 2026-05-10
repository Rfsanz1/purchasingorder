<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pos_roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label');
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('pos_permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('label');
            $table->string('module')->index();
            $table->timestamps();
        });

        Schema::create('pos_role_permissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('pos_roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained('pos_permissions')->cascadeOnDelete();
            $table->unique(['role_id', 'permission_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pos_role_permissions');
        Schema::dropIfExists('pos_permissions');
        Schema::dropIfExists('pos_roles');
    }
};
