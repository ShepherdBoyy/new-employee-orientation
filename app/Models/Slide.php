<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Slide extends Model
{
    protected $fillable = [
        "company_id",
        "type",
        "file_path",
        "order",
        "is_global"
    ];

    protected function casts(): array
    {
        return [
            "order" => "integer",
            "is_global" => "boolean",
            "type" => "string"
        ];
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function companies(): BelongsToMany
    {
        return $this->belongsToMany(Company::class, 'company_slides')
            ->withPivot("order")
            ->withTimestamps();
    }

    public function acknowledgements(): HasMany
    {
        return $this->hasMany(Acknowledgement::class);
    }

    public function scopeGlobal($query)
    {
        return $query->where("is_global", true);
    }

    public function scopeLibrary($query)
    {
        return $query->where("is_global", false)
            ->whereNull("company_id");
    }

    public function scopeForCompany($query, int $companyId)
    {
        return $query->where("company_id", $companyId);
    }

    public function isImage(): bool
    {
        return $this->type === "image";
    }

    public function isVideo(): bool
    {
        return $this->type === "video";
    }

    public function isGlobal(): bool
    {
        return $this->is_global === true;
    }

    public function isCompanySpecific(): bool
    {
        return !$this->is_global && $this->company_id !== null;
    }

    public function isLibrarySide(): bool
    {
        return !$this->is_global && $this->company_id === null;
    }

    public function isAcknowledgedBy(User $user): bool
    {
        return $this->acknowledgements()->where("user_id", $user->id)->exists();
    }
}