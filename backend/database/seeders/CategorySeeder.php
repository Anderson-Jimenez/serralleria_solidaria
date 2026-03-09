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
                'name' => 'Eines',
                'status' => 1
            ],
            [
                'code' => 'CAT002',
                'name' => 'Accessoris',
                'status' => 1
            ],
            [
                'code' => 'CAT003',
                'name' => 'Seguretat',
                'status' => 1
            ]
        ]);
    }
}