<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Folder extends Model
{
    protected $fillable = [
        "company_id",
        "job_position_id",
        "name",
        "key_topics",
        "slug",
        "order"
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer",
            "key_topics" => "array"
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Folder $folder) {
            if (empty($folder->slug)) {
                $folder->slug = static::generateUniqueSlug($folder->name);
            }
        });

        static::updating(function (Folder $folder) {
            if ($folder->isDirty("name") && !$folder->isDirty("slug")) {
                $folder->slug = static::generateUniqueSlug($folder->name, $folder->id);
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

    public const DEFAULT_JOB_SPECIFIC_KEY_TOPICS = [
        'Job description and KPIs',
        'Tools, Systems, and Equipments (Tarkie Policy and EzLife Roadshow)',
        'Workflows and SOPs',
        'Performance evaluation process',
    ];

    public static function ensureJobSpecificFolder(int $companyId, int $jobPositionId): self
    {
        $existing = static::where("company_id", $companyId)
            ->where("job_position_id", $jobPositionId)
            ->first();

        if ($existing) {
            return $existing;
        }

        $lastOrder = static::forCompany($companyId)->companyWide()->max("order") ?? 0;

        return static::create([
            "company_id" => $companyId,
            "job_position_id" => $jobPositionId,
            "name" => "Job-Specific Training",
            "key_topics" => static::DEFAULT_JOB_SPECIFIC_KEY_TOPICS,
            "order" => $lastOrder + 1
        ]);
    }

    public function scopeOrdered($query): void
    {
        $query->orderBy("order");
    }

    public function scopeForCompany($query, int $companyId): void
    {
        $query->where("company_id", $companyId);
    }

    public function scopeCompanyWide($query): void
    {
        $query->whereNull("job_position_id");
    }

    public function scopeForJobPosition($query, int $jobPositionId): void
    {
        $query->where("job_position_id", $jobPositionId);
    }

    public function isJobSpecific(): bool
    {
        return $this->job_position_id !== null;
    }

    public function isCompletedBy(User $user): bool
    {
        return $this->completions()
                    ->where("user_id", $user->id)
                    ->exists();
    }

    public function slideCount(): int
    {
        return $this->slides()->count();
    }

    public function keyTopicsList(): array
    {
        return $this->key_topics ?? [];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function jobPosition(): BelongsTo
    {
        return $this->belongsTo(JobPosition::class);
    }

    public function slides(): HasMany
    {
        return $this->hasMany(Slide::class)->orderBy("order");
    }

    public function completions(): HasMany
    {
        return $this->hasMany(FolderCompletion::class);
    }
}