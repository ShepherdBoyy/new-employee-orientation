<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class JobPosition extends Model
{
    public $timestamps = false;

    protected $fillable = [
        "name",
        "slug"
    ];

    protected static function booted(): void
    {
        static::creating(function (JobPosition $jobPosition) {
            $jobPosition->slug = static::generateUniqueSlug($jobPosition->name);
        });

        static::updating(function (JobPosition $jobPosition) {
            if ($jobPosition->isDirty("name")) {
                $jobPosition->slug = static::generateUniqueSlug($jobPosition->name, $jobPosition->id);
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

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class);
    }

    public function document(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function folderTargets(): HasMany
    {
        return $this->hasMany(FolderTarget::class);
    }
}
