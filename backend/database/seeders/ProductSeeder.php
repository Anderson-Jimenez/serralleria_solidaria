<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'code' => 'PROD-001',
                'name' => 'Portàtil Gaming Pro',
                'description' => 'Processador darrer model amb 32GB de RAM.',
                'price' => 1250.00,
                'stock' => 15,
                'discount' => 10,
                'highlighted' => true,
                'category_id' => 1,
                'product_type' => 'simple',
                'status' => true,
            ],
            [
                'code' => 'PACK-BASIC-01',
                'name' => 'Pack Oficina Estudiant',
                'description' => 'Inclou ratolí, teclat i catifa.',
                'price' => 45.50,
                'stock' => 50,
                'discount' => null,
                'highlighted' => false,
                'category_id' => 2,
                'product_type' => 'pack',
                'status' => true,
            ],
            [
                'code' => 'PROD-003',
                'name' => 'Monitor 27" 4K',
                'description' => 'Resolució ultra nítida per a dissenyadors.',
                'price' => 320.00,
                'stock' => 8,
                'discount' => 5,
                'highlighted' => true,
                'category_id' => 1,
                'product_type' => 'simple',
                'status' => true,
            ],
        ]);
    }
}
