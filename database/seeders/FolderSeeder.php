<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Folder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FolderSeeder extends Seeder
{
    private array $companyWideTopics = [
        'Module 1 — Welcome & Company Overview' => [
            'Company history, mission, vision, values',
            'Organizational structure',
            'Code of discipline overview',
        ],
        'Module 2 — Employment Terms & HR Policies (DOLE-Aligned)' => [
            'Employment classification (probationary, regular)',
            'Working hours, breaks, overtime rules (Labor Code)',
            'Leave benefits (SL/VL, maternity/paternity, solo parent, etc.)',
            'Pay periods, deductions, government contributions',
            'Company rules on attendance, tardiness, and timekeeping',
            'Disciplinary policy and due process',
        ],
        'Module 3 — Workplace Safety & OSH Compliance (RA 11058)' => [
            'Emergency procedures and evacuation routes',
            'Drug-free workplace policy',
        ],
        'Module 4 — Data Privacy & Confidentiality (RA 10173)' => [
            'How data is stored, used, and protected',
            'Prohibited acts (sharing passwords, exposing client data, etc.)',
        ],
        'Module 6 — Product, Service, and Compliance Training' => [
            'Field Etiquette',
            'Product portfolio overview',
            'Sales Expectations (Quota and Incentive Scheme)',
            'Client Marketing',
        ],
        'Module 7 — Anti-Harassment, Anti-Bullying, and Ethics' => [
            'RA 7877 (Anti-Sexual Harassment Act)',
            'Anti-bullying and anti-discrimination',
            'Ethics hotline and reporting channels',
        ],
        'Module 8 — IT, Cybersecurity & Acceptable Use' => [
            'Email and system access rules',
            'Password policy',
            'Prohibited online behavior',
            'Reporting IT incidents',
        ],
    ];

    private array $jobSpecificTopics = [
        'Job description and KPIs',
        'Tools, Systems, and Equipments (Tarkie Policy and EzLife Roadshow)',
        'Department Workflow and SOPs',
        'Performance evaluation process',
    ];

    public function run(): void
    {
        $companies = Company::all();

        if ($companies->isEmpty()) {
            $this->command->warn("No companies found. Run CompanyJobPositionSeeder first.");
            return;
        }

        foreach ($companies as $company) {
            if (!Folder::forCompany($company->id)->exists()) {
                Folder::seedDefaultsForCompany($company);
            }

            foreach ($this->companyWideTopics as $moduleName => $topics) {
                $folder = Folder::forCompany($company->id)
                    ->companyWide()
                    ->where("name", $moduleName)
                    ->first();

                if (!$folder) {
                    $this->command->warn("Folder \"{$moduleName}\" not found {$company->name}, skipping.");
                    continue;
                }

                if ($folder->keyTopics()->exists()) {
                    continue;
                }

                foreach ($topics as $order => $label) {
                    $folder->keyTopics()->create([
                        "label" => $label,
                        "slug" => Str::slug($label),
                        "order" => $order + 1
                    ]);
                }
            }

            $moduleFiveFolders = Folder::forCompany($company->id)
                ->whereNotNull("employee_type")
                ->get();

            foreach ($moduleFiveFolders as $folder) {
                if ($folder->keyTopics()->exists()) {
                    continue;
                }

                foreach ($this->jobSpecificTopics as $order => $label) {
                    $folder->keyTopics()->create([
                        "label" => $label,
                        "slug" => Str::slug($label),
                        "order" => $order + 1
                    ]);
                }
            }
        }
    }
}