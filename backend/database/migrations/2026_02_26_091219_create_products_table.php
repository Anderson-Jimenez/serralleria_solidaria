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

            // Descuentos
            $table->unsignedTinyInteger('discount_percentage')->nullable();
            $table->timestamp('discount_starts_at')->nullable();
            $table->timestamp('discount_ends_at')->nullable();

            $table->boolean('highlighted')->default(false);
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->enum('product_type', ['simple', 'pack']);
            $table->string('int_size')->nullable();
            $table->string('ext_size')->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();

            $table->index('category_id');
            $table->index('highlighted');
            $table->index('status');
            $table->index('discount_ends_at'); // útil para queries de descuentos activos
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};