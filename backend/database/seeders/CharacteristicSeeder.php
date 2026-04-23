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
                'description' => 'Securemme',
                'characteristic_types_id' => 1,
            ],
            [
                'description' => 'M&C',
                'characteristic_types_id' => 1,
            ],
            [
                'description' => 'Keso',
                'characteristic_types_id' => 1,
            ],
            [
                'description' => 'Abus',
                'characteristic_types_id' => 1,
            ],
            [
                'description' => 'DMC',
                'characteristic_types_id' => 1,
            ],
            [
                'description' => 'Disec',
                'characteristic_types_id' => 1,
            ],
            [
                'description' => 'Si',
                'characteristic_types_id' => 2,
            ],
            [
                'description' => 'No',
                'characteristic_types_id' => 2,
            ],
            [
                'description' => 'Plata',
                'characteristic_types_id' => 3,
            ],
            [
                'description' => 'Daurat',
                'characteristic_types_id' => 3,
            ],
            [
                'description' => 'Punts copiable',
                'characteristic_types_id' => 4,
            ],
            [
                'description' => 'Punts incopiable',
                'characteristic_types_id' => 4,
            ],
            [
                'description' => 'Element Mòvil',
                'characteristic_types_id' => 4,
            ],
            [
                'description' => 'Codif. Magnèt.',
                'characteristic_types_id' => 4,
            ],
            [
                'description' => 'Si',
                'characteristic_types_id' => 5,
            ],
            [
                'description' => 'No',
                'characteristic_types_id' => 5,
            ],
            [
                'description' => 'Si',
                'characteristic_types_id' => 6,
            ],
            [
                'description' => 'No',
                'characteristic_types_id' => 6,
            ],
            [
                'description' => 'Seguretat',
                'characteristic_types_id' => 8,
            ],
            [
                'description' => 'Alta Seguretat',
                'characteristic_types_id' => 8,
            ],
            [
                'description' => 'MOLT ALTA SEGURETAT',
                'characteristic_types_id' => 8,
            ],
        ]);

    }
}
