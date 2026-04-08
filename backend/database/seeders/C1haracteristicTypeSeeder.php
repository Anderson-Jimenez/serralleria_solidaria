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
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Doble Embrague',
                'filterType' => 'select',
            ],
            [
                'type' => 'Color',
                'filterType' => 'checkbox',
            ],
            [
                'type' => 'Tipus de clau',
                'filterType' => 'select',
            ],
            [
                'type' => 'Duplicat de clau',
                'filterType' => 'select',
            ],
            [
                'type' => 'Tarjeta',
                'filterType' => 'select',
            ],
            [
                'type' => 'Pes',
                'filterType' => 'moreLess',
            ],
            [
                'type' => 'Nivell de Seguretat',
                'filterType' => 'select',
            ],
        ]);
    }
}
