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
            [
                'name' => 'Module 1 — Welcome & Company Overview',
                'key_topics' => [
                    'Company history, mission, vision, values',
                    'Organizational structure',
                    'Code of conduct overview',
                ],
            ],
            [
                'name' => 'Module 2 — Employment Terms & HR Policies (DOLE-Aligned)',
                'key_topics' => [
                    'Employment classification (probationary, regular)',
                    'Working hours, breaks, overtime rules (Labor Code)',
                    'Leave benefits (SL/VL, maternity/paternity, solo parent, etc.)',
                    'Pay periods, deductions, government contributions',
                    'Company rules on attendance, tardiness, and timekeeping',
                    'Disciplinary policy and due process',
                ],
            ],
            [
                'name' => 'Module 3 — Workplace Safety & OSH Compliance (RA 11058)',
                'key_topics' => [
                    'Emergency procedures and evacuation routes',
                    'Incident reporting',
                    'Drug-free workplace policy',
                ],
            ],
            [
                'name' => 'Module 4 — Data Privacy & Confidentiality (RA 10173)',
                'key_topics' => [
                    'How data is stored, used, and protected',
                    'Prohibited acts (sharing passwords, exposing client data, etc.)',
                ],
            ],
            [
                'name' => 'Module 6 — Product, Service, and Compliance Training',
                'key_topics' => [
                    'Field Etiquette',
                    'Product portfolio overview',
                    'Sales Expectations (Quota and Incentive Scheme)',
                    'Client Marketing'
                ],
            ],
            [
                'name' => 'Module 7 — Anti-Harassment, Anti-Bullying, and Ethics',
                'key_topics' => [
                    'RA 7877 (Anti-Sexual Harassment Act)',
                    'Anti-bullying and anti-discrimination',
                    'Ethics hotline and reporting channels',
                ],
            ],
            [
                'name' => 'Module 8 - IT, Cybersecurity & Acceptable Use',
                'key_topics' => [
                    'Email and system access rules',
                    'Password policy',
                    'Prohibited online behavior',
                    'Reporting IT incidents',
                ],
            ],
        ];

        $companies = Company::with('jobs')->get();

        if ($companies->isEmpty()) {
            $this->command->warn('No companies found. Run CompanyJobPositionSeeder first.');
            return;
        }

        foreach ($companies as $company) {
            $order = 0;

            foreach ($companyWideModules as $index => $module) {
                $order++;

                if ($index === 4) {
                    if ($company->jobs->isEmpty()) {
                        $this->command->warn(
                            "Skipping Module 5 for {$company->name} — no job positions assigned."
                        );
                    } else {
                        foreach ($company->jobs as $position) {
                            Folder::create([
                                'company_id' => $company->id,
                                'job_position_id' => $position->id,
                                'name' => 'Module 5 — Job-Specific Training',
                                "key_topics" => Folder::DEFAULT_JOB_SPECIFIC_KEY_TOPICS,
                                'order' => $order,
                            ]);
                        }
                        $order++;
                    }
                }

                Folder::create([
                    'company_id' => $company->id,
                    'name' => $module["name"],
                    "key_topics" => $module["key_topics"],
                    'order' => $order,
                ]);
            }
        }
    }
}