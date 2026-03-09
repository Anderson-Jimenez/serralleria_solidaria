<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CharacteristicSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('characteristics')->insert([
            [
                'type' => 'Premium',
                'description' => 'Accés total a totes les funcionalitats i suport 24/7.',
            ],
            [
                'type' => 'Estàndard',
                'description' => 'Accés limitat a les eines bàsiques de la plataforma.',
            ],
            [
                'type' => 'Demo',
                'description' => null, 
            ],
        ]);

    }
}
