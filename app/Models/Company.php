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

    public function supportsType(string $employeeType): bool
    {
        return $this->employeeTypes()
                    ->where("employee_type", $employeeType)
                    ->exists();
    }

    public function foldersForEmployee(User $user): Collection
    {
        $targetedFolderIds = FolderTarget::forEmployee($user)
            ->orderBy("order")
            ->pluck("folder_id");
        
        return Folder::whereIn("id", $targetedFolderIds)
            ->get()
            ->sortBy(function ($folder) use ($targetedFolderIds) {
                return array_search($folder->id, $targetedFolderIds->toArray());
            })
            ->values();
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function employeeTypes(): HasMany
    {
        return $this->hasMany(CompanyEmployeeType::class);
    }

    public function jobPositions(): HasMany
    {
        return $this->hasMany(JobPosition::class);
    }

    public function folderTargets(): HasMany
    {
        return $this->hasMany(FolderTarget::class);
    }
}
