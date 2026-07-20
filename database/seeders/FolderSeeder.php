<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Folder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FolderSeeder extends Seeder
{
    public function run(): void
    {
        $folders = [
            'Module 1 — Welcome & Company Overview',
            'Module 2 — Employment Terms & HR Policies (DOLE‑Aligned)',
            'Module 3 — Workplace Safety & OSH Compliance (RA 11058)',
            'Module 4 — Data Privacy & Confidentiality (RA 10173)',
            'Module 5 — Job‑Specific Training',
            'Module 6 — Product, Service, and Compliance Training',
            'Module 7 — Anti‑Harassment, Anti‑Bullying, and Ethics',
            'Module 8 — IT, Cybersecurity & Acceptable Use',
        ];
 
        $companies = Company::all();
 
        if ($companies->isEmpty()) {
            $this->command->warn('No companies found. Run CompanyJobPositionSeeder first.');
            return;
        }
 
        foreach ($folders as $index => $name) {
            $order = $index + 1;
 
            $folder = Folder::firstOrCreate(
                ['slug' => Str::slug($name)],
                [
                    'name' => $name,
                    'order' => $order,
                ]
            );
 
            foreach ($companies as $company) {
                $folder->targets()->firstOrCreate(
                    [
                        'company_id' => $company->id,
                        'job_position_id' => null,
                    ],
                    [
                        'order' => $order,
                    ]
                );
            }
        }
    }
}
