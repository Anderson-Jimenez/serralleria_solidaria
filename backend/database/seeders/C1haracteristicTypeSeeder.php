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
                'type' => 'Marca',
            ],
            [
                'type' => 'Doble Embrague',
            ],
            [
                'type' => 'Color',
            ],
            [
                'type' => 'Tipus de clau',
            ],
            [
                'type' => 'Duplicat de clau',
            ],
            [
                'type' => 'Tarjeta',
            ],
            [
                'type' => 'Pes',
            ],
            [
                'type' => 'Nivell de Seguretat',
            ],
        ]);
    }
}
