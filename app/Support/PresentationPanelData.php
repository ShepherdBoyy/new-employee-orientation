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

        $moduleFivePair = Folder::forCompany($company->id)
            ->whereNotNull("employee_type")
            ->get(["id", "employee_type", "name", "slug", "order"]);
        
        $firstVariant = $moduleFivePair->first();

        $moduleFiveSummary = $firstVariant ? [
            "name" => $firstVariant->name,
            "order" => $firstVariant->order,
            "field_folder_slug" => $moduleFivePair->firstWhere("employee_type", "field")?->slug,
            "non_field_folder_slug" => $moduleFivePair->firstWhere("employee_type", "non_field")?->slug,
        ] : null;

        return [
            "companyWideFolders" => $companyWideFolders,
            "jobSpecificSummary" => $moduleFiveSummary
        ];
    }
}