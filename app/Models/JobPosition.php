<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobPosition extends Model
{
    protected $fillable = [
        "company_id",
        "employee_type",
        "name"
    ];

    protected function casts(): array
    {
        return [
            "employee_type" => "string"
        ];
    }

    public function scopeForCompany($query, int $companyId): void
    {
        $query->where("company_id", $companyId);
    }

    public function scopeForType($query, string $employeeType): void
    {
        $query->where("employee_type", $employeeType);
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
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
