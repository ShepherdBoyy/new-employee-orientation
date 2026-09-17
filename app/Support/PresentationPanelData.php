<?php

namespace App\Support;

use App\Models\Company;
use App\Models\Folder;

class PresentationPanelData
{
    public static function build(Company $company): array
    {
        $folders = Folder::forCompany($company->id)
            ->ordered()
            ->withCount("keyTopics")
            ->get();

        return [
            "folders" => $folders
        ];
    }
}