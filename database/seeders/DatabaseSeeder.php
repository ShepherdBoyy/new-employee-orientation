<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name'       => 'System Admin',
            'email'      => 'admin@neo.com',
            'password'   => 'password',
            'role'       => 'admin',
            'company_id' => null,
            'expires_at' => null,
        ]);

        $this->call([CompanyJobPositionSeeder::class]);

        $this->call([FolderSeeder::class]);
    }
}