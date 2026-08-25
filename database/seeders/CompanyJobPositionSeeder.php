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
                    'IT Staff' => 'non_field',
                    'Messenger/Utility' => 'non_field',
                    'Supply Chain Head' => 'non_field',
                    'Assistant Supply Chain Specialist' => 'non_field',
                    'Online Support Executive/Receptionist' => 'non_field',
                    // field-based
                    'Product Manager' => 'field_based',
                    'Division Manager' => 'field_based',
                    'Product Specialist' => 'field_based',
                    'Division Specialist' => 'field_based',
                    'Collector' => 'field_based',
                ],
            ],
            'Progressive Medical Corporation' => [
                'theme' => 'lush_fields',
                'positions' => [
                    'Account Executive' => 'non_field',
                    'Delivery Helper' => 'non_field',
                    'Division Manager' => 'non_field',
                    'Division Specialist' => 'non_field',
                    'Encoder' => 'non_field',
                    'Executive Assistant (Data & Sales Analytics Support)' => 'non_field',
                    'Telesales Executive' => 'non_field',
                    'Utility' => 'non_field',
                    'Warehouse Driver' => 'non_field',
                    'Warehouse Packer' => 'non_field',
                    'Warehouse Supervisor' => 'non_field',
                ],
            ],
            'Panamed Philippines Inc.' => [
                'theme' => 'void_spark',
                'positions' => [
                    'Clinical Application Specialist' => 'non_field',
                    'Maintenance Helper' => 'non_field',
                    'Area Sales Manager' => 'field_based',
                    'Healthcare Product Specialist' => 'field_based',
                    'Business Development Manager' => 'field_based',
                    'Product Specialist' => 'field_based',
                    'Collector' => 'field_based',
                ],
            ],
            'Inmed Corporation' => [
                'theme' => 'orange_heat',
                'positions' => [
                    'Customer Service Officer (CSO)' => 'non_field',
                    'Deliveryman' => 'non_field',
                    'Driver' => 'non_field',
                    'Regulatory Assistant' => 'non_field',
                    'Warehouse Operations Manager' => 'non_field',
                    'Professional Reseller Specialist' => 'field_based',
                    'Collector/Liaison Officer' => 'field_based',
                ],
            ],
            'Medbanc Inc.' => [
                'theme' => 'lime_rush',
                'positions' => [
                    'Accounting Staff' => 'non_field',
                    'Sales and Marketing Assistant' => 'non_field',
                    'Professional Sales Representative' => 'field_based',
                    'Sales Manager' => 'field_based',
                    'Biomedical Engineer' => 'field_based',
                ],
            ],
        ];

        foreach ($data as $companyName => $details) {
            $company = Company::updateOrCreate(
                ['slug' => Str::slug($companyName)],
                [
                    'name' => $companyName,
                    'logo_path' => null,
                    'header_theme' => $details['theme'],
                ]
            );

            foreach ($details['positions'] as $positionName => $type) {
                $jobPosition = JobPosition::firstOrNew(['name' => $positionName]);

                if (!$jobPosition->exists) {
                    $jobPosition->slug = Str::slug($positionName);
                }

                if (!$jobPosition->exists || $type === 'field_based') {
                    $jobPosition->employee_type = $type;
                }

                $jobPosition->save();

                $company->jobs()->syncWithoutDetaching([$jobPosition->id]);
            }
        }
    }
}