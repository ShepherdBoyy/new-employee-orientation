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
        "header_theme"
    ];

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

    public function foldersForEmployee(User $user): Collection
    {
        $companyWide = Folder::forCompany($user->company_id)
            ->companyWide()
            ->get();

        $jobSpecific = Folder::forCompany($user->company_id)
            ->forJobPosition($user->job_position_id)
            ->get();

        return $companyWide
            ->concat($jobSpecific)
            ->sortBy("order")
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
    
    public function document(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }
} 