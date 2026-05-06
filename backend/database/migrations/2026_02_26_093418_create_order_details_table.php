<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                ->unique()
                ->constrained()
                ->onDelete('cascade');

            $table->date('requested_delivery_date')
                ->nullable();

            $table->boolean('installation')
                ->default(false);

            $table->text('shipping_address')
                ->nullable();

            $table->text('installation_address')
                ->nullable();

            $table->text('billing_address')
                ->nullable();

            $table->foreignId('installation_price_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->timestamps();

            $table->index('order_id');
            $table->index('requested_delivery_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};