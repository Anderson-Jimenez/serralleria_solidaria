<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->integer('discount')->nullable();
            $table->boolean('highlighted')->default(false);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->enum('product_type', ['simple', 'pack']);
            $table->boolean('status')->default(true);
            $table->timestamps();
            
            // Índices para búsquedas frecuentes
            $table->index('category_id');
            $table->index('highlighted');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};