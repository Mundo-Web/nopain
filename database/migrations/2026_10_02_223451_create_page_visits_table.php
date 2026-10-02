<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('page_visits', function (Blueprint $table) {
            $table->id();
            $table->string('ip_address', 45)->nullable()->index();
            $table->string('session_id', 64)->nullable()->index();
            $table->string('url', 500)->default('/');
            $table->string('path', 255)->default('/')->index();
            $table->string('method', 10)->default('GET');
            $table->string('device', 20)->default('desktop')->index();
            $table->string('browser', 50)->nullable();
            $table->string('os', 50)->nullable();
            $table->text('referer')->nullable();
            $table->string('country', 50)->default('Perú');
            $table->string('city', 100)->nullable();
            $table->dateTime('visited_at')->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('page_visits');
    }
};
