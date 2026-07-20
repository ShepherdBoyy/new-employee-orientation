<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobPosition;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CompanyJobPositionSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'PMC Group of Companies' => [
                'theme' => 'ocean_dust',
                'positions' => [
                    'IT Staff',
                    'Messenger/Utility',
                    'Supply Chain Head',
                    'Assistant Supply Chain Specialist',
                    'Online Support Executive/Receptionist',
                ],
            ],
            'Progressive Medical Corporation' => [
                'theme' => 'lush_fields',
                'positions' => [
                    'Account Executive',
                    'Delivery Helper',
                    'Division Manager',
                    'Division Specialist',
                    'Encoder',
                    'Executive Assistant (Data & Sales Analytics Support)',
                    'Telesales Executive',
                    'Utility',
                    'Warehouse Driver',
                    'Warehouse Packer',
                    'Warehouse Supervisor',
                ],
            ],
            'Panamed Philippines Inc.' => [
                'theme' => 'void_spark',
                'positions' => [
                    'Area Sales Manager',
                    'Clinical Application Specialist',
                    'Healthcare Product Specialist',
                    'Maintenance Helper',
                    'Product Specialist',
                ],
            ],
            'Inmed Corporation' => [
                'theme' => 'orange_heat',
                'positions' => [
                    'Customer Service Officer (CSO)',
                    'Deliveryman',
                    'Driver',
                    'Professional Reseller Specialist',
                    'Regulatory Assistant',
                    'Warehouse Operations Manager',
                ],
            ],
            'Medbanc Inc.' => [
                'theme' => 'lime_rush',
                'positions' => [
                    'Accounting Staff',
                    'Professional Sales Representative',
                    'Sales and Marketing Assistant',
                    'Sales Manager',
                ],
            ],
        ];

        foreach ($data as $companyName => $details) {
            $company = Company::create([
                "name" => $companyName,
                "slug" => Str::slug($companyName),
                "logo_path" => null,
                "header_theme" => $details["theme"]
            ]);

            foreach ($details["positions"] as $positionName) {
                $jobPosition = JobPosition::firstOrCreate(
                    ["name" => $positionName],
                    ["slug" => Str::slug($positionName)]
                );
                
                $company->jobs()->syncWithoutDetaching([$jobPosition->id]);
            }
        }
    }
}