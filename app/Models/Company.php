<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;

class Company extends Model
{
    protected $fillable = [
        "name",
        "slug",
        "logo_path",
        "status",
        "header_theme"
    ];

    protected function casts(): array
    {
        return ["status" => "string"];
    }

    public function foldersForEmployee(User $user): Collection
    {
        $companySpecific = FolderTarget::where("company_id", $user->company_id)
            ->whereNull("job_position_id")
            ->orderBy("order")
            ->pluck("folder_id");

        $global = FolderTarget::whereNull("company_id")
            ->whereNull("job_position_id")
            ->orderBy("order")
            ->pluck("folder_id");

        $jobSpecific = FolderTarget::where("company_id", $user->company_id)
            ->where("job_position_id", $user->job_position_id)
            ->whereNotNull("job_position_id")
            ->orderBy("order")
            ->pluck("folder_id");

        $orderedFolderIds = $companySpecific
            ->concat($global)
            ->concat($jobSpecific)
            ->unique()
            ->values();
        
        return Folder::whereIn("id", $orderedFolderIds)
            ->get()
            ->sortBy(function ($folder) use ($orderedFolderIds) {
                return $orderedFolderIds->search($folder->id);
            })
            ->values();
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function jobs(): BelongsToMany
    {
        return $this->belongsToMany(JobPosition::class);
    }

    public function folderTargets(): HasMany
    {
        return $this->hasMany(FolderTarget::class);
    }
}
