<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('categories')->insert([
            [
                'code' => 'CAT001',
                'name' => 'Cilindres',
                'description' => 'Cilindres de diferents tipus i mides',
                'status' => 1
            ],
            [
                'code' => 'CAT002',
                'name' => 'Escut',
                'description' => 'Escuts de seguretat per a portes',
                'status' => 1
            ],
            [
                'code' => 'CAT003',
                'name' => 'Segon pany',
                'description' => 'Segons panys de seguretat',
                'status' => 1
            ]
        ]);
    }
}