<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        "company_id",
        "name",
        "email",
        "password",
        "role",
        "status",
        "employee_type",
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
            "status" => "string",
            "role" => "string",
            "employee_type" => "string"
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

    public function isOfficeBased(): bool
    {
        return $this->employee_type === "office";
    }

    public function isFieldBased(): bool
    {
        return $this->employee_type === "field";
    }

    public function isActive(): bool
    {
        return $this->status === "active";
    }

    public function isLocked(): bool
    {
        return $this->status === "locked";
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

    public function extensionRequests(): HasMany
    {
        return $this->hasMany(ExtensionRequest::class);
    }
}
