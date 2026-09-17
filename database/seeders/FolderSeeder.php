<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Folder;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class FolderSeeder extends Seeder
{
    private array $defaultFolders = [
        ['name' => 'Welcome & Company Overview', 'employee_type' => 'both'],
        ['name' => 'Employment Terms & HR Policies (DOLE-Aligned)', 'employee_type' => 'both'],
        ['name' => 'Workplace Safety & OSH Compliance (RA 11058)', 'employee_type' => 'both'],
        ['name' => 'Data Privacy & Confidentiality (RA 10173)', 'employee_type' => 'both'],
        ['name' => 'Job-Specific Training', 'employee_type' => 'both'],
        ['name' => 'Sales & Marketing', 'employee_type' => 'field'],
        ['name' => 'Anti-Harassment, Anti-Bullying, and Ethics', 'employee_type' => 'both'],
        ['name' => 'IT, Cybersecurity & Acceptable Use', 'employee_type' => 'both'],
    ];

    private array $topicsByModule = [
        'Welcome & Company Overview' => [
            'Company history, mission, vision, values',
            'Organizational structure',
            'Code of discipline overview',
        ],
        'Employment Terms & HR Policies (DOLE-Aligned)' => [
            'Employment classification (probationary, regular)',
            'Working hours, breaks, overtime rules (Labor Code)',
            'Leave benefits (SL/VL, maternity/paternity, solo parent, etc.)',
            'Pay periods, deductions, government contributions',
            'Company rules on attendance, tardiness, and timekeeping',
            'Disciplinary policy and due process',
        ],
        'Workplace Safety & OSH Compliance (RA 11058)' => [
            'Emergency procedures and evacuation routes',
            'Drug-free workplace policy',
        ],
        'Data Privacy & Confidentiality (RA 10173)' => [
            'How data is stored, used, and protected',
            'Prohibited acts (sharing passwords, exposing client data, etc.)',
        ],
        'Job-Specific Training' => [
            'Tools, Systems, and Equipments (EzLife Roadshow)',
            'Product Portfolio Overview',
            'Department SOP and Workflows',
            'Performance evaluation process',
        ],
        'Sales & Marketing' => [
            'Tarkie',
            'Field Etiquette',
            'Sales Expectations (Quota and Incentive Scheme)',
            'Client Marketing',
        ],
        'Anti-Harassment, Anti-Bullying, and Ethics' => [
            'RA 7877 (Anti-Sexual Harassment Act)',
            'Anti-bullying and anti-discrimination',
            'Ethics hotline and reporting channels',
        ],
        'IT, Cybersecurity & Acceptable Use' => [
            'Email and system access rules',
            'Password policy',
            'Prohibited online behavior',
            'Reporting IT incidents',
        ],
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
                $this->seedDefaultFolders($company);
            }

            foreach ($this->topicsByModule as $moduleName => $topics) {
                $folder = Folder::forCompany($company->id)
                    ->where("name", $moduleName)
                    ->first();
            
                if (!$folder) {
                    $this->command->warn("Folder \"{$moduleName}\" not found for {$company->name}, skipping.");
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
        }
    }

    private function seedDefaultFolders(Company $company): void
    {
        foreach ($this->defaultFolders as $order => $folder) {
            Folder::create([
                "company_id" => $company->id,
                "employee_type" => $folder["employee_type"],
                "name" => $folder["name"],
                "order" => $order + 1
            ]);
        }
    }
}