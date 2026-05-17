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
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'M&C',
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'Keso',
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'Abus',
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'DMC',
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'Disec',
                'characteristic_type_id' => 1,
            ],
            [
                'description' => 'Si',
                'characteristic_type_id' => 2,
            ],
            [
                'description' => 'No',
                'characteristic_type_id' => 2,
            ],
            [
                'description' => 'Plata',
                'characteristic_type_id' => 3,
            ],
            [
                'description' => 'Daurat',
                'characteristic_type_id' => 3,
            ],
            [
                'description' => 'Punts copiable',
                'characteristic_type_id' => 4,
            ],
            [
                'description' => 'Punts incopiable',
                'characteristic_type_id' => 4,
            ],
            [
                'description' => 'Element Mòvil',
                'characteristic_type_id' => 4,
            ],
            [
                'description' => 'Codif. Magnèt.',
                'characteristic_type_id' => 4,
            ],
            [
                'description' => 'Si',
                'characteristic_type_id' => 5,
            ],
            [
                'description' => 'No',
                'characteristic_type_id' => 5,
            ],
            [
                'description' => 'Si',
                'characteristic_type_id' => 6,
            ],
            [
                'description' => 'No',
                'characteristic_type_id' => 6,
            ],
            [
                'description' => 'Seguretat',
                'characteristic_type_id' => 8,
            ],
            [
                'description' => 'Alta Seguretat',
                'characteristic_type_id' => 8,
            ],
            [
                'description' => 'MOLT ALTA SEGURETAT',
                'characteristic_type_id' => 8,
            ],
            [
                'description' => '30x30',
                'characteristic_type_id' => 9,
            ],
            [
                'description' => '32x32',
                'characteristic_type_id' => 9,
            ],
            [
                'description' => '30x40',
                'characteristic_type_id' => 9,
            ],
        ]);

    }
}
