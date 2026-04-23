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
        DB::table('characteristic_types')->insert([
            [
                'type' => 'Marca',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Doble Embrague',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Color',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Tipus de clau',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Duplicat de clau',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Tarjeta',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Pes',
                'filterType' => 'moreLess',
            ],
            [
                'type' => 'Nivell de Seguretat',
                'filterType' => 'checkbox',
            ],
        ]);
    }
}
