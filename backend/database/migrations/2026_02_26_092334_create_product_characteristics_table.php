<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_characteristics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            $table->foreignId('characteristic_id')->constrained()->onDelete('cascade');
            $table->string('value')->nullable();
            $table->timestamps();
            
            // Evitar duplicados de la misma característica para un producto
            $table->unique(['product_id', 'characteristic_id']);
            
            $table->index('product_id');
            $table->index('characteristic_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_characteristics');
    }
};