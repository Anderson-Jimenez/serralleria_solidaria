<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('orders')->insert([
            [
                'user_id' => 1,
                'total_price' => 1000,
                'observations' => 'Ninguna observaicó',
            ],
            [
                'user_id' => 2,
                'total_price' => 2000,
                'observations' => 'Ninguna observaicó',
            ],
            [
                'user_id' => 1,
                'total_price' => 3000,
                'observations' => 'Ninguna observaicó',
            ],
        ]);
    }
}
