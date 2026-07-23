<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        "company_id",
        "name",
        "email",
        "password",
        "role",
        "job_position_id",
        "expires_at"
    ];

    protected $hidden = [
        "password",
        "remember_token"
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            "expires_at" => "datetime",
            "role" => "string",
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === "admin";
    }

    public function isEmployee(): bool
    {
        return $this->role === "employee";
    }

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    public function hasAcknowledgedOrientation(): bool
    {
        return $this->orientationAcknowledgement()->exists();
    }

    public function hasCompletedAllFolders(): bool
    {
        if (!$this->isEmployee()) {
             return false;
        }

        if (!$this->relationLoaded("company")) {
            $this->load("company");
        }

        $folders = $this->company->foldersForEmployee($this);

        if ($folders->isEmpty()) {
            return false;
        }

        $completedIds = $this->folderCompletions()
            ->pluck("folder_id")
            ->toArray();

        return $folders->every(fn(Folder $folder) => in_array($folder->id, $completedIds));
    }

    public function hasCompletedFolder(Folder $folder): bool
    {
        return $this->folderCompletions()
                    ->where("folder_id", $folder->id)
                    ->exists();
    }

    public function orientationProgress(): array
    {
        if (!$this->isEmployee()) {
            return [];
        }

        if (!$this->relationLoaded("company")) {
            $this->load("company");
        }

        $folders = $this->company->foldersForEmployee($this);

        $completedIds = $this->folderCompletions()
            ->pluck("folder_id")
            ->toArray();

        return $folders->map(function (Folder $folder) use ($completedIds) {
            return [
                "folder_id" => $folder->id,
                "folder_name" => $folder->name,
                "slide_count" => $folder->slideCount(),
                "completed" => in_array($folder->id, $completedIds)
            ];
        })->toArray();
    }

    public static function generateDefaultPassword(string $fullName): string
    {
        $parts = preg_split("/\s+/", trim($fullName));
        $lastName = end($parts);
        $lastName = Str::lower(Str::slug($lastName, ""));

        return "{$lastName}-neo@" . now()->year;
    }

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function jobPosition(): BelongsTo
    {
        return $this->belongsTo(JobPosition::class);
    }

    public function folderCompletions(): HasMany
    {
        return $this->hasMany(FolderCompletion::class);
    }

    public function orientationAcknowledgement(): HasOne
    {
        return $this->hasOne(OrientationAcknowledgement::class);
    }
}