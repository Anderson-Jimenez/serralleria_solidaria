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
                'description' => 'Accés total a totes les funcionalitats i suport 24/7.',
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'Accés limitat a les eines bàsiques de la plataforma.',
                'characteristic_type_id' => 2,
            ],
            [
                'description' => 'Per exemple',
                'characteristic_type_id' => 3,
            ],
        ]);

    }
}
