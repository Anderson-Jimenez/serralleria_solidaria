<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_img', function (Blueprint $table) {
            $table->id();
            $table->foreignId('form_id')->constrained('contact_forms')->onDelete('cascade');
            $table->string('path');
            $table->timestamps();
            
            $table->index('form_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_img');
    }
};