<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Folder;
use Illuminate\Database\Seeder;

class FolderSeeder extends Seeder
{
    public function run(): void
    {
        $companyWideModules = [
            'Module 1 — Welcome & Company Overview',
            'Module 2 — Employment Terms & HR Policies (DOLE‑Aligned)',
            'Module 3 — Workplace Safety & OSH Compliance (RA 11058)',
            'Module 4 — Data Privacy & Confidentiality (RA 10173)',
            // Module 5 is job-specific — handled separately below
            'Module 6 — Product, Service, and Compliance Training',
            'Module 7 — Anti‑Harassment, Anti‑Bullying, and Ethics',
            'Module 8 — IT, Cybersecurity & Acceptable Use',
        ];

        $companies = Company::with('jobs')->get();

        if ($companies->isEmpty()) {
            $this->command->warn('No companies found. Run CompanyJobPositionSeeder first.');
            return;
        }

        foreach ($companies as $company) {
            $order = 0;

            foreach ($companyWideModules as $index => $name) {
                $order++;

                // Module 5 sits between index 3 (Module 4) and index 4 (Module 6)
                // in natural numeric order, so we insert it here for each position.
                if ($index === 4) {
                    if ($company->jobs->isEmpty()) {
                        $this->command->warn(
                            "Skipping Module 5 for {$company->name} — no job positions assigned."
                        );
                    } else {
                        foreach ($company->jobs as $position) {
                            Folder::create([
                                'company_id'      => $company->id,
                                'job_position_id' => $position->id,
                                'name'            => 'Module 5 — Job-Specific Training',
                                'order'           => $order,
                            ]);
                        }
                        $order++;
                    }
                }

                Folder::create([
                    'company_id' => $company->id,
                    'name'       => $name,
                    'order'      => $order,
                ]);
            }
        }
    }
}