<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'username' => 'user',
                'email' => 'artur.bartres@inslapineda.cat',
                'phone' => '685238140',
                'userType' => 'user',
                'password' => Hash::make('user'),
            ],
            [
                'username' => 'admin',
                'email' => 'adnersonstiven.jimenez@inslapineda.cat',
                'phone' => '',
                'userType' => 'admin',
                'password' => Hash::make('admin'),
            ],
        ]);
    }
}
