<?php

namespace App\Support;

use App\Models\Company;
use App\Models\Folder;

class PresentationPanelData
{
    public static function build(Company $company): array
    {
        $companyWideFolders = Folder::forCompany($company->id)
            ->companyWide()
            ->ordered()
            ->withCount("keyTopics")
            ->get();

        $company->loadMissing("jobs:id,name,slug");

        $jobSpecificFolders = Folder::forCompany($company->id)
            ->whereNotNull("job_position_id")
            ->get(["id", "job_position_id", "name", "order"]);

        $firstJobSpecific = $jobSpecificFolders->first();

        $jobSpecificSummary = $company->jobs->isNotEmpty() ? [
            "total_positions" => $company->jobs->count(),
            "order" => $firstJobSpecific?->order ?? ($companyWideFolders->max("order") + 1 ?? 1),
            "name" => $firstJobSpecific?->name ?? "Job-Specific Training"
        ] : null;

        return [
            "companyWideFolders" => $companyWideFolders,
            "jobSpecificSummary" => $jobSpecificSummary
        ];
    }
}