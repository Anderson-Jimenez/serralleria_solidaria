<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class C1haracteristicTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('characteristic_types')->insert([
            [
                'type' => 'Premium',
            ],
            [
                'type' => 'Estàndard',
            ],
            [
                'type' => 'Demo',
            ],
        ]);
    }
}
