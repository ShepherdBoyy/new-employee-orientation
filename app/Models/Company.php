<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

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

    protected static function booted(): void
    {
        static::creating(function (Company $company) {
            if (empty($company->slug)) {
                $company->slug = static::generateUniqueSlug($company->name);
            }
        });

        static::updating(function (Company $company) {
            if ($company->isDirty("name") && !$company->isDirty("slug")) {
                $company->slug = static::generateUniqueSlug($company->name, $company->id);
            }
        });
    }

    protected static function generateUniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $slug = Str::slug($name);
        $original = $slug;
        $count = 1;

        while (
            static::where("slug", $slug)
                ->when($ignoreId, fn($q) => $q->where("id", "!=", $ignoreId))
                ->exists()
        ) {
            $slug = $original . "-" . $count++;
        }

        return $slug;
    }

    public function getRouteKeyName(): string
    {
        return "slug";
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
