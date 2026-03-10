<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CharacteristicTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('characteristics')->insert([
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
