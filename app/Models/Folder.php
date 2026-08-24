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
        "employee_type",
        "name",
        "slug",
        "order"
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer",
            "employee_type" => "string"
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

    public static function defaultCompanyModules(): array
    {
        return [
            'Module 1 — Welcome & Company Overview',
            'Module 2 — Employment Terms & HR Policies (DOLE-Aligned)',
            'Module 3 — Workplace Safety & OSH Compliance (RA 11058)',
            'Module 4 — Data Privacy & Confidentiality (RA 10173)',
            'Module 6 — Product, Service, and Compliance Training',
            'Module 7 — Anti-Harassment, Anti-Bullying, and Ethics',
            'Module 8 — IT, Cybersecurity & Acceptable Use',
        ];
    }

    public static function seedDefaultsForCompany(Company $company): void
    {
        $order = 0;

        foreach (static::defaultCompanyModules() as $index => $name) {
            $order++;

            if ($index === 4) {
                static::create([
                    "company_id" => $company->id,
                    "employee_type" => "field",
                    "name" => "Module 5 - Job-Specific Training",
                    "order" => $order
                ]);

                static::create([
                    "company_id" => $company->id,
                    "employee_type" => "non_field",
                    "name" => "Module 5 - Job-Specific Training",
                    "order" => $order
                ]);

                $order++;
            }

            static::create([
                "company_id" => $company->id,
                "name" => $name,
                "order" => $order
            ]);
        }
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
        $query->whereNull("employee_type");
    }

    public function scopeForEmployeeType($query, ?string $employeeType): void
    {
        $query->where("employee_type", $employeeType);
    }

    public function isTypeSpecific(): bool
    {
        return $this->employee_type !== null;
    }

    public function isFieldTraining(): bool
    {
        return $this->employee_type === "field";
    }

    public function isNonFieldTraining(): bool
    {
        return $this->employee_type === "non_field";
    }


    public function isCompletedBy(User $user): bool
    {
        return $this->completions()
            ->where("user_id", $user->id)
            ->exists();
    }

    public function slideCount(): int
    {
        return Slide::where("folder_id", $this->id)->count();
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function keyTopics(): HasMany
    {
        return $this->hasMany(FolderKeyTopic::class)->orderBy("order");
    }

    public function completions(): HasMany
    {
        return $this->hasMany(FolderCompletion::class);
    }
}